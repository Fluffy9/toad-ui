import { optimism, polygon, arbitrum } from 'wagmi/chains';
import { useChainId, useSwitchChain } from 'wagmi';
import { useState } from 'react';

const chainLogos = {
    [optimism.id]: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF0420" />
            <path d="M2 17L12 22L22 17" stroke="#FF0420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#FF0420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    [polygon.id]: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8247E5" />
            <path d="M2 17L12 22L22 17" stroke="#8247E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#8247E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    [arbitrum.id]: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#28A0F0" />
            <path d="M2 17L12 22L22 17" stroke="#28A0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#28A0F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
};

const supportedChains = [optimism, polygon, arbitrum];

export function ChainSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const chainId = useChainId();
    const { switchChain } = useSwitchChain();
    const isSupported = supportedChains.some(chain => chain.id === chainId);
    const currentChain = supportedChains.find(chain => chain.id === chainId) || optimism;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
                {isSupported ? chainLogos[currentChain.id] : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF0000" />
                        <path d="M2 17L12 22L22 17" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {isSupported ? currentChain.name : 'Unsupported Network'}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-900 ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {supportedChains.map((chain) => (
                            <button
                                key={chain.id}
                                onClick={() => {
                                    switchChain({ chainId: chain.id });
                                    setIsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center space-x-2"
                                role="menuitem"
                            >
                                {chainLogos[chain.id]}
                                <span>{chain.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 