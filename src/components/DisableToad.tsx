import { useState, useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useGovernance } from '@/hooks/useGovernance';
import { contracts } from '@/config/constants';
import { Hash } from 'viem';

interface DisableToadProps {
    tallyIds: number[];
    onComplete?: () => void;
}

type Step = 'idle' | 'delegating' | 'settingPower' | 'toggling' | 'complete';

export function DisableToad({ tallyIds, onComplete }: DisableToadProps) {
    const { address } = useAccount();
    const { delegateVotes, setDisablePower, toggleDisablePower } = useGovernance();
    const [step, setStep] = useState<Step>('idle');
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<Hash | undefined>();

    const { data: receipt, isLoading } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    useEffect(() => {
        if (!receipt || isLoading) return;

        const handleNextStep = async () => {
            try {
                switch (step) {
                    case 'delegating':
                        setStep('settingPower');
                        const setPowerHash = await setDisablePower(tallyIds);
                        setTxHash(setPowerHash);
                        break;
                    case 'settingPower':
                        setStep('toggling');
                        const toggleHash = await toggleDisablePower(tallyIds, address!);
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
    }, [receipt, isLoading, step, onComplete, tallyIds, address, setDisablePower, toggleDisablePower]);

    const handleDisable = async () => {
        if (!address) {
            setError('Please connect your wallet');
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

    const renderStepContent = () => {
        switch (step) {
            case 'delegating':
                return <div>Delegating votes back to your wallet...</div>;
            case 'settingPower':
                return <div>Setting disable power...</div>;
            case 'toggling':
                return <div>Disabling TOAD...</div>;
            case 'complete':
                return <div>TOAD has been disabled successfully!</div>;
            default:
                return null;
        }
    };

    return (
        <div>
            {error && <div className="error">{error}</div>}
            {txHash && <div className="tx-hash">Transaction: {txHash}</div>}
            {step === 'idle' ? (
                <button onClick={handleDisable}>Disable TOAD</button>
            ) : (
                renderStepContent()
            )}
        </div>
    );
} 