import { useAccount, useReadContract, useChainId, useWatchContractEvent } from 'wagmi';
import { supportedChains } from '@/config/chains';
import { contracts } from '../config/constants';
import TOAD_ABI from '../../public/abi/TOAD.json';
import ERC20Votes_ABI from '../../public/abi/ERC20Votes.json';
import React from 'react';


export function MemberGate({ children }: { children: React.ReactNode }) {
    const { address } = useAccount();
    const chainId = useChainId();
    const isSupported = supportedChains.some(chain => chain.id === chainId);

    const { data: isMember, isLoading, error, refetch } = useReadContract({
        address: contracts.toad,
        abi: TOAD_ABI.abi,
        functionName: 'isMember',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!contracts.toad
        }
    });

    // Watch for delegation events
    useWatchContractEvent({
        address: contracts.governance,
        abi: ERC20Votes_ABI.abi,
        eventName: 'DelegateChanged',
        onLogs: () => {
            // Wait 5 minutes before refreshing isMember check
            setTimeout(() => {
                refetch();
            }, 5 * 60 * 1000); // 5 minutes in milliseconds
        },
    });

    // Log contract read failures
    React.useEffect(() => {
        if (error && !error.message.includes('revert')) {
            console.error('Contract read failed:', error);
        }
    }, [error]);

    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please connect your wallet to access this content.
                </p>
            </div>
        );
    }

    if (!isSupported) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Please Switch to a Supported Chain</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Please switch to a supported network to access this content.
                </p>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supported networks:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-2">
                        {supportedChains.map(chain => (
                            <li key={chain.id}>{chain.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Checking your membership status...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Failed to check membership status. Please try again.
                </p>
            </div>
        );
    }

    if (!isMember) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-zinc-900">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            TOAD Membership Required
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            You need to be a TOAD member to access the chat interface
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                How to Become a Member
                            </h2>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                <li>Delegate your tokens to TOAD on your current network</li>
                                <li>Wait for the delegation transaction to be confirmed</li>
                                <li>Refresh the page to verify your membership status</li>
                            </ol>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Current Network
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Make sure you&apos;re delegating on the correct network. You can switch networks using the network selector in the navigation bar.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Need Help?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                If you need assistance with delegation or have any questions, please visit our Help Center or contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 