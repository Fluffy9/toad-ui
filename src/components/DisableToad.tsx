import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useGovernance } from '@/hooks/useGovernance';
import { Hash } from 'viem';
import { MemberGate } from './MemberGate';

interface Proposal {
    id: number;
    metadata: {
        title: string;
    };
    discovered: boolean;
    status: {
        active: boolean;
    };
}

interface DisableToadProps {
    onComplete?: () => void;
}

type Step = 'idle' | 'delegating' | 'settingPower' | 'toggling' | 'complete';

export function DisableToad({ onComplete }: DisableToadProps) {
    const { address } = useAccount();
    const { delegateVotes, setDisablePower, toggleDisablePower } = useGovernance();
    const [step, setStep] = useState<Step>('idle');
    const [txHash, setTxHash] = useState<Hash | undefined>();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [selectedProposals, setSelectedProposals] = useState<number[]>([]);
    const [isLoadingProposals, setIsLoadingProposals] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { data: receipt, isLoading } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch('/api/proposals');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    console.error('API response is not an array:', data);
                    throw new Error('API response is not an array');
                }
                setProposals(data);
            } catch (error) {
                console.error('Error fetching proposals:', error);
                setError('Failed to fetch proposals: ' + (error instanceof Error ? error.message : 'Unknown error'));
                setProposals([]); // Ensure proposals is always an array
            } finally {
                setIsLoadingProposals(false);
            }
        };

        fetchProposals();
    }, []);

    useEffect(() => {
        if (!receipt || isLoading) return;

        const handleNextStep = async () => {
            try {
                switch (step) {
                    case 'delegating':
                        setStep('settingPower');
                        const setPowerHash = await setDisablePower(selectedProposals);
                        setTxHash(setPowerHash);
                        break;
                    case 'settingPower':
                        setStep('toggling');
                        const toggleHash = await toggleDisablePower(selectedProposals, address!);
                        setTxHash(toggleHash);
                        break;
                    case 'toggling':
                        setStep('complete');
                        onComplete?.();
                        break;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setStep('idle');
            }
        };

        if (receipt.status === 'success') {
            handleNextStep();
        } else if (receipt.status === 'reverted') {
            setError('Transaction failed');
            setStep('idle');
        }
    }, [receipt, isLoading, step, onComplete, selectedProposals, address, setDisablePower, toggleDisablePower]);

    const handleDisable = async () => {
        if (!address) {
            setError('Please connect your wallet');
            return;
        }

        if (selectedProposals.length === 0) {
            setError('Please select at least one proposal');
            return;
        }

        try {
            setError(null);
            setStep('delegating');
            const delegateHash = await delegateVotes(address);
            setTxHash(delegateHash);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setStep('idle');
        }
    };

    const toggleProposal = (proposalId: number) => {
        setSelectedProposals(prev =>
            prev.includes(proposalId)
                ? prev.filter(id => id !== proposalId)
                : [...prev, proposalId]
        );
    };

    if (step === 'complete') {
        return null;
    }

    return (
        <MemberGate>
            <div className="space-y-4">
                {isLoadingProposals ? (
                    <div className="flex justify-center">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : (
                    <>
                        <div className="max-h-60 overflow-y-auto space-y-2">

                            {proposals.map((proposal) => {
                                const isEnabled = proposal.discovered && proposal.status.active;
                                return (
                                    <div
                                        key={proposal.id}
                                        className={`flex items-center p-3 rounded-lg border ${selectedProposals.includes(proposal.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : isEnabled
                                                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                : 'border-gray-100 bg-gray-50'
                                            } ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                        onClick={() => isEnabled && toggleProposal(proposal.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedProposals.includes(proposal.id)}
                                            onChange={() => isEnabled && toggleProposal(proposal.id)}
                                            disabled={!isEnabled}
                                            className={`mr-3 h-4 w-4 rounded ${isEnabled
                                                ? 'text-blue-600 border-gray-300 focus:ring-blue-500'
                                                : 'text-gray-300 border-gray-200'
                                                }`}
                                        />
                                        <label className="flex-1 cursor-pointer" onClick={(e) => e.preventDefault()}>
                                            <div className="font-medium text-gray-900">{proposal.metadata.title || 'Unknown'}</div>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${proposal.discovered
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {proposal.discovered ? 'Discovered' : 'Not Discovered'}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${proposal.status.active
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {proposal.status.active ? 'Active' : 'Inactive'}
                                                </span>
                                                {!isEnabled && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        Not Available
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedProposals.length > 0 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Proposals:</h3>
                                <ul className="space-y-1">
                                    {proposals
                                        .filter(p => selectedProposals.includes(p.id))
                                        .map(proposal => (
                                            <li key={proposal.id} className="text-sm text-blue-800">
                                                • {proposal.metadata.title}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <button
                            onClick={handleDisable}
                            className="w-full px-4 py-2 text-center text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
                            role="menuitem"
                        >
                            Disable TOAD
                        </button>
                    </>
                )}
            </div>
        </MemberGate>
    );
} 