import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import { contracts, urls } from '@/config/constants';
import { useGovernance } from '@/hooks/useGovernance';
import { DisableToad } from './DisableToad';

interface NavigationProps {
    onDelegateVotes?: (address: string) => void;
}

const ConnectButtonSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-zinc-800" />
    </div>
);

export const Navigation = ({ onDelegateVotes }: NavigationProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showDisableToad, setShowDisableToad] = useState(false);
    const [isConnectButtonLoading, setIsConnectButtonLoading] = useState(true);
    const { address, isConnected, status } = useAccount();
    const { delegateVotes } = useGovernance();

    // Update loading state based on connection status
    React.useEffect(() => {
        if (status === 'connecting' || status === 'reconnecting') {
            setIsConnectButtonLoading(true);
        } else {
            setIsConnectButtonLoading(false);
        }
    }, [status]);

    // Check membership status
    const { data: isMember } = useReadContract({
        address: contracts.toad as `0x${string}`,
        abi: [
            {
                inputs: [{ name: 'account', type: 'address' }],
                name: 'isMember',
                outputs: [{ name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'isMember',
        args: [address as `0x${string}`],
    });

    const handleDelegateVotes = async (delegateAddress: string) => {
        if (onDelegateVotes) {
            onDelegateVotes(delegateAddress);
        }
        try {
            await delegateVotes(delegateAddress);
        } catch (error) {
            console.error('Error delegating votes:', error);
        }
    };

    const renderDelegateButton = () => {
        if (!isConnected) return null;
        if (!isMember) {
            return (
                <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    role="menuitem"
                    onClick={() => handleDelegateVotes(contracts.toad)}
                >
                    Delegate to Toad
                </button>
            );
        }
        return null;
    };

    const renderUndelegateButton = () => {
        if (!isConnected || !isMember || !address) return null;
        return (
            <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                role="menuitem"
                onClick={() => handleDelegateVotes(address)}
            >
                Remove Membership (Undelegate)
            </button>
        );
    };

    const renderDisableToadButton = () => {
        if (!isConnected || !isMember) return null;
        return (
            <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                role="menuitem"
                onClick={() => setShowDisableToad(true)}
            >
                Disable TOAD
            </button>
        );
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                {/* Logo Section with Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            🐸
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">TOAD</span>
                        <svg
                            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Desktop Dropdown Menu */}
                    <div
                        className={`hidden sm:block absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 ${isDropdownOpen ? '' : 'hidden'
                            }`}
                    >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {renderDelegateButton()}
                            {renderUndelegateButton()}
                            {renderDisableToadButton()}
                            <a
                                href={urls.tally}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                role="menuitem"
                            >
                                View on Tally
                            </a>
                            <a
                                href={urls.discourse}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                role="menuitem"
                            >
                                Forum
                            </a>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Toggle mobile menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Mobile Menu */}
                <div
                    className={`sm:hidden fixed inset-0 z-40 bg-white dark:bg-zinc-900 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        } transition-transform duration-200 ease-in-out`}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                    🐸
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    TOAD
                                </span>
                            </div>
                            <button
                                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex-1 p-4 space-y-4">
                            {renderDelegateButton()}
                            {renderUndelegateButton()}
                            {renderDisableToadButton()}
                            <a
                                href={urls.tally}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                role="menuitem"
                            >
                                View on Tally
                            </a>
                            <a
                                href={urls.discourse}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                role="menuitem"
                            >
                                Forum
                            </a>
                        </div>
                    </div>
                </div>

                {/* Connect Button */}
                <div className="hidden sm:flex items-center space-x-4">
                    {isConnectButtonLoading ? (
                        <ConnectButtonSkeleton />
                    ) : (
                        <ConnectButton />
                    )}
                </div>
            </nav>

            {/* DisableToad Modal */}
            {showDisableToad && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-md w-full mx-4">
                        <DisableToad
                            onComplete={() => {
                                setShowDisableToad(false);
                                // Add any additional completion logic here
                            }}
                        />
                        <button
                            className="mt-4 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                            onClick={() => setShowDisableToad(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}; 