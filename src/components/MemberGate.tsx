import { useAccount, useContractRead } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseAbi } from 'viem';

const abi = parseAbi([
    'function isMember(address) view returns (bool)'
]);

if (!process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS) {
    throw new Error('NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS environment variable is not set');
}

const TOAD_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS as `0x${string}`;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@toad.com';

export function MemberGate({ children }: { children: React.ReactNode }) {
    const { isConnected, address } = useAccount();
    const { data: isMember, isLoading } = useContractRead({
        address: TOAD_CONTRACT_ADDRESS,
        abi,
        functionName: 'isMember',
        args: [address],
        query: {
            enabled: !!address
        }
    });

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Welcome to TOAD
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Connect your wallet to access the TOAD chat interface
                        </p>
                    </div>

                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Getting Started
                            </h2>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                                <li>Connect your wallet using the button in the menu at the top right</li>
                                <li>Ensure you're on a supported network (Optimism, Polygon, or Arbitrum)</li>
                                <li>If you're not a TOAD member, you'll be prompted to delegate to TOAD</li>
                            </ol>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Supported Networks
                            </h2>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                <li>• Optimism</li>
                                <li>• Polygon</li>
                                <li>• Arbitrum</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                Need Help?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                If you encounter any issues or need assistance, please email us at{' '}
                                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                    {SUPPORT_EMAIL}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                Make sure you're delegating on the correct network. You can switch networks using the network selector in the navigation bar.
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