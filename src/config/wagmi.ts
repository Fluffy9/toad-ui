import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { apiKeys } from './constants';
import { QueryClient } from '@tanstack/react-query';
import { supportedChains } from './chains';
import { Chain } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'TOAD',
    projectId: apiKeys.walletConnect,
    chains: supportedChains as unknown as readonly [Chain, ...Chain[]],
});

export const queryClient = new QueryClient(); 