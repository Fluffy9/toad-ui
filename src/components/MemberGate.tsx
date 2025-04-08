import { useAccount, useReadContract } from 'wagmi';
import { useChainId } from 'wagmi';
import { optimism, polygon, arbitrum, sepolia } from 'wagmi/chains';
import TOAD_ABI from '../../public/abi/TOAD.json';
import ReactMarkdown from 'react-markdown';
import { contracts } from '../config/constants';
import React from 'react';

const welcomeMessage = `# Welcome to TOAD 🐸

TOAD is an AI-powered voting delegate system that helps you participate in governance more effectively. Our system analyzes proposals and votes on your behalf based on your preferences.

## Getting Started

1. Connect your wallet using one of the supported wallets below
2. Make sure you're on a supported network (Optimism, Polygon, Arbitrum, or Sepolia)
3. Delegate your voting power to yourself to start participating in governance

## Supported Networks

- Optimism
- Polygon
- Arbitrum
- Sepolia

## Need Help?

If you're having trouble connecting your wallet or need assistance with delegation, please check our documentation or reach out to our community.`;

export function MemberGate({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();

    const { data: isMember, isLoading, error } = useReadContract({
        address: contracts.toad,
        abi: TOAD_ABI.abi,
        functionName: 'isMember',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && !!contracts.toad
        }
    });

    // Log contract read failures
    React.useEffect(() => {
        if (error && !error.message.includes('revert')) {
            console.error('Contract read failed:', error);
        }
    }, [error]);

    const supportedNetworks = [optimism, polygon, arbitrum, sepolia];
    const isSupportedNetwork = supportedNetworks.some(chain => chain.id === chainId);

    // Check for required environment variables after all hooks
    if (!contracts.toad) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Configuration Error</h2>
                <p className="text-gray-600 dark:text-gray-400">
                    The application is not properly configured. Please check your environment variables.
                </p>
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <div className="max-w-2xl prose dark:prose-invert">
                    <ReactMarkdown>{welcomeMessage}</ReactMarkdown>
                </div>
            </div>
        );
    }

    if (!isSupportedNetwork) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Unsupported Network</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please switch to a supported network to access this content.
                </p>
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Supported networks:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 space-y-2">
                        <li>Optimism</li>
                        <li>Polygon</li>
                        <li>Arbitrum</li>
                        <li>Sepolia (Testnet)</li>
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