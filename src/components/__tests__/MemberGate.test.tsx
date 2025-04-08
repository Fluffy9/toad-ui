import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemberGate } from '../MemberGate';

// Mock environment variables
process.env.NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME = 'test';
process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS = '0x0987654321098765432109876543210987654321';
process.env.TALLY_API_KEY = 'https://www.tally.xyz/gov/test';
process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL = 'https://forum.example.com';
process.env.CHAIN_ID = '1';
process.env.RPC_PROVIDER_URL = 'https://mainnet.infura.io/v3/test';
process.env.WALLET_PRIVATE_KEY = '0x1234567890123456789012345678901234567890123456789012345678901234';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.DISCOURSE_BASE_URL = 'https://forum.example.com';

// Mock the constants file
jest.mock('@/config/constants', () => ({
    urls: {
        tally: 'https://www.tally.xyz/gov/test-org',
        discourse: 'https://forum.example.com',
    },
    contracts: {
        toad: '0x0987654321098765432109876543210987654321',
    },
    config: {
        organizationName: 'test',
        organizationDescription: 'Test Organization',
        chainId: '1',
        rpcProviderUrl: 'https://mainnet.infura.io/v3/test',
        walletPrivateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
    },
    apiKeys: {
        tally: 'https://www.tally.xyz/gov/test',
        openai: 'test-openai-key',
        discourse: 'test-discourse-key',
        walletConnect: 'test-wallet-connect-id',
    },
}));

jest.mock('@rainbow-me/rainbowkit', () => ({
    ConnectButton: () => <div>ConnectButton</div>,
}));

jest.mock('wagmi', () => ({
    useAccount: () => ({
        address: '0x123',
        isConnected: true,
    }),
    useWriteContract: () => ({
        writeContract: jest.fn(),
    }),
    useReadContract: () => ({
        data: '0x456',
    }),
    useChainId: () => 1,
}));

jest.mock('wagmi/chains', () => ({
    optimism: { id: 10 },
    polygon: { id: 137 },
    arbitrum: { id: 42161 },
    sepolia: { id: 11155111 },
}));

// Mock Chat component
jest.mock('../Chat', () => ({
    Chat: () => <div>Chat Component</div>,
}));

jest.mock('react-markdown', () => {
    return function MockMarkdown({ children }: { children: string }) {
        return <div data-testid="mock-markdown">{children}</div>;
    };
});

describe('MemberGate', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Unconnected State', () => {
        it('should show welcome info when user is not connected', () => {
            // Mock useAccount to return unconnected state
            jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
                isConnected: false,
                address: undefined,
            }));

            render(<MemberGate><div>Test Content</div></MemberGate>);

            // Check for welcome elements
            expect(screen.getByText(/welcome to toad/i)).toBeInTheDocument();
            expect(screen.getByText(/ai-powered voting delegate system/i)).toBeInTheDocument();
            expect(screen.getByText(/connect your wallet using one of the supported wallets below/i)).toBeInTheDocument();
            expect(screen.getByText(/make sure you're on a supported network/i)).toBeInTheDocument();
            expect(screen.getByText(/delegate your voting power to yourself/i)).toBeInTheDocument();

            // Ensure membership section is not shown
            expect(screen.queryByText(/toad membership required/i)).not.toBeInTheDocument();
            // Ensure chat interface is not shown
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });
    });

    describe('Non-Member State', () => {
        it('should show membership required section when user is connected but not a member', () => {
            // Mock useAccount to return connected state
            jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
                isConnected: true,
                address: '0x123',
            }));

            // Mock useChainId to return a supported network
            jest.spyOn(require('wagmi'), 'useChainId').mockImplementation(() => 10); // Optimism chain ID

            // Mock useReadContract to return false for membership
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: false,
                isLoading: false,
                error: null,
            }));

            render(<MemberGate><div>Test Content</div></MemberGate>);

            // Check for membership required elements
            expect(screen.getByText(/toad membership required/i)).toBeInTheDocument();
            expect(screen.getByText(/you need to be a toad member to access the chat interface/i)).toBeInTheDocument();
            expect(screen.getByText(/how to become a member/i)).toBeInTheDocument();
            expect(screen.getByText(/delegate your tokens to toad on your current network/i)).toBeInTheDocument();
            expect(screen.getByText(/wait for the delegation transaction to be confirmed/i)).toBeInTheDocument();
            expect(screen.getByText(/refresh the page to verify your membership status/i)).toBeInTheDocument();

            // Ensure welcome info is not shown
            expect(screen.queryByText(/welcome to toad/i)).not.toBeInTheDocument();
            // Ensure chat interface is not shown
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });

        it('should show error message when contract read reverts', () => {
            // Mock useAccount to return connected state
            jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
                isConnected: true,
                address: '0x123',
            }));

            // Mock useChainId to return a supported network
            jest.spyOn(require('wagmi'), 'useChainId').mockImplementation(() => 10); // Optimism chain ID

            // Mock useReadContract to simulate a revert
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: null,
                isLoading: false,
                error: new Error('Contract reverted'),
            }));

            render(<MemberGate><div>Test Content</div></MemberGate>);

            // Check for error message
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(/failed to check membership status/i)).toBeInTheDocument();

            // Ensure other sections are not shown
            expect(screen.queryByText(/welcome to toad/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/toad membership required/i)).not.toBeInTheDocument();
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });
    });

    describe('Member State', () => {
        it('should show chat interface when user is a member', () => {
            // Mock useAccount to return connected state
            jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
                isConnected: true,
                address: '0x123',
            }));

            // Mock useChainId to return a supported network
            jest.spyOn(require('wagmi'), 'useChainId').mockImplementation(() => 10); // Optimism chain ID

            // Mock useReadContract to return true for membership
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: true,
                isLoading: false,
                error: null,
            }));

            render(<MemberGate><div>Test Content</div></MemberGate>);

            // Check for chat interface elements
            expect(screen.getByText('Test Content')).toBeInTheDocument();

            // Ensure welcome info is not shown
            expect(screen.queryByText(/welcome to toad/i)).not.toBeInTheDocument();
            // Ensure membership section is not shown
            expect(screen.queryByText(/toad membership required/i)).not.toBeInTheDocument();
        });
    });

    describe('Error State', () => {
        it('should show error message when contract read fails', () => {
            // Mock useAccount to return connected state
            jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
                isConnected: true,
                address: '0x123',
            }));

            // Mock useChainId to return a supported network
            jest.spyOn(require('wagmi'), 'useChainId').mockImplementation(() => 10); // Optimism chain ID

            // Mock useReadContract to return an error
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: null,
                isLoading: false,
                error: new Error('Failed to read contract'),
            }));

            render(<MemberGate><div>Test Content</div></MemberGate>);

            // Check for error message
            expect(screen.getByText('Error')).toBeInTheDocument();
            expect(screen.getByText(/failed to check membership status/i)).toBeInTheDocument();

            // Ensure other sections are not shown
            expect(screen.queryByText(/welcome to toad/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/toad membership required/i)).not.toBeInTheDocument();
            expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
        });
    });
}); 