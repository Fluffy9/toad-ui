import "@/styles/globals.css";
import { AppProps } from 'next/app';
import { AppProvider } from '@/context/AppContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
