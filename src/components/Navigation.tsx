import React, { useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import ERC20Votes_ABI from '../../public/abi/ERC20Votes.json';
import { apiKeys, contracts, urls,  } from '@/config/constants';


export function Navigation() {
    if (!contracts.governance) {
        throw new Error('Required environment variables are not set');
    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { address } = useAccount();
    const { writeContract } = useWriteContract();
    const { data: currentDelegate } = useReadContract({
        address: contracts.governance,
        abi: ERC20Votes_ABI.abi,
        functionName: 'delegates',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    const handleDelegate = () => {
        if (address) {
            writeContract({
                address: contracts.governance,
                abi: ERC20Votes_ABI.abi,
                functionName: 'delegate',
                args: [address],
            });
        }
    };

    const renderDelegateButton = () => {
        if (!address || currentDelegate === address) return null;

        return (
            <button
                onClick={handleDelegate}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800"
                role="menuitem"
            >
                Delegate to TOAD
            </button>
        );
    };

    return (
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
                {isDropdownOpen && (
                    <div className="hidden sm:block absolute top-full left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {renderDelegateButton()}
                            <a
                                href={apiKeys.tally}
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
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center space-x-4">
                <ConnectButton />
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                    <div className="px-4 py-3 space-y-3">
                        {renderDelegateButton()}
                        <a
                            href={urls.tally}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                        >
                            View on Tally
                        </a>
                        <a
                            href={urls.discourse}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md"
                        >
                            Forum
                        </a>
                        <div>
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
} 