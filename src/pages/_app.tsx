import "@/styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClientProvider } from '@tanstack/react-query';
import { config, queryClient } from '../config/wagmi';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { AppProvider } from '@/context/AppContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
