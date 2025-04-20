import { useChainId } from 'wagmi';
import { supportedChains } from '@/config/chains';

export function ChainSelector() {
    const chainId = useChainId();
    const isSupported = supportedChains.some(chain => chain.id === chainId);
    const currentChain = supportedChains.find(chain => chain.id === chainId) || supportedChains[0];

    if (!currentChain) {
        return <div>No supported chains configured</div>;
    }

    return (
        <div>
            {isSupported ? (
                <div>
                    <span>Connected to {currentChain.name}</span>
                </div>
            ) : (
                <div>
                    <span>Unsupported chain. Please switch to one of:</span>
                    <ul>
                        {supportedChains.map((chain) => (
                            <li key={chain.id}>{chain.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
} 