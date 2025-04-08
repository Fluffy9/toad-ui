import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Navigation } from '../Navigation';

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
}));

describe('Navigation', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Desktop Menu', () => {
        it('should have a "View on Tally" link that points to Tally website', () => {
            render(<Navigation />);

            // Click the dropdown button to open the menu
            const dropdownButton = screen.getByRole('button', { name: /toad/i });
            fireEvent.click(dropdownButton);

            // Find the Tally link within the desktop menu
            const desktopMenu = screen.getByRole('menu');
            const tallyLink = within(desktopMenu).getByRole('menuitem', { name: /view on tally/i });
            expect(tallyLink).toBeInTheDocument();
            expect(tallyLink).toHaveAttribute('href', 'https://www.tally.xyz/gov/test-org');
        });

        it('should have a "Forum" link that points to Discourse', () => {
            render(<Navigation />);

            // Click the dropdown button to open the menu
            const dropdownButton = screen.getByRole('button', { name: /toad/i });
            fireEvent.click(dropdownButton);

            // Find the Forum link within the desktop menu
            const desktopMenu = screen.getByRole('menu');
            const forumLink = within(desktopMenu).getByRole('menuitem', { name: /forum/i });
            expect(forumLink).toBeInTheDocument();
            expect(forumLink).toHaveAttribute('href', 'https://forum.example.com');
        });

        describe('Membership Status', () => {
            it('should not show delegate button when user is a member', () => {
                // Mock contract returning true for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: true,
                }));

                render(<Navigation />);

                // Click the dropdown button to open the menu
                const dropdownButton = screen.getByRole('button', { name: /toad/i });
                fireEvent.click(dropdownButton);

                const delegateButton = screen.queryByRole('menuitem', { name: /delegate to toad/i });
                expect(delegateButton).not.toBeInTheDocument();
            });

            it('should show "Remove Membership (Undelegate)" button when user is a member', () => {
                // Mock contract returning true for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: true,
                }));

                render(<Navigation />);

                // Click the dropdown button to open the menu
                const dropdownButton = screen.getByRole('button', { name: /toad/i });
                fireEvent.click(dropdownButton);

                // Find the desktop menu and check for the undelegate button
                const desktopMenu = screen.getByRole('menu');
                const undelegateButton = within(desktopMenu).getByRole('menuitem', { name: /remove membership/i });
                expect(undelegateButton).toBeInTheDocument();
            });

            it('should show "Delegate to Toad" button when user is not a member', () => {
                // Mock contract returning false for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: false,
                }));

                render(<Navigation />);

                // Click the dropdown button to open the menu
                const dropdownButton = screen.getByRole('button', { name: /toad/i });
                fireEvent.click(dropdownButton);

                // Find the delegate button within the desktop menu
                const desktopMenu = screen.getByRole('menu');
                const delegateButton = within(desktopMenu).getByRole('menuitem', { name: /delegate to toad/i });
                expect(delegateButton).toBeInTheDocument();
            });

            it('should not show "Remove Membership (Undelegate)" button when user is not a member', () => {
                // Mock contract returning false for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: false,
                }));

                render(<Navigation />);

                // Click the dropdown button to open the menu
                const dropdownButton = screen.getByRole('button', { name: /toad/i });
                fireEvent.click(dropdownButton);

                // Find the desktop menu and check for the undelegate button
                const desktopMenu = screen.getByRole('menu');
                const undelegateButton = within(desktopMenu).queryByRole('menuitem', { name: /remove membership/i });
                expect(undelegateButton).not.toBeInTheDocument();
            });
        });

        it('should call onDelegateVotes with Toad address when "Delegate to Toad" is clicked', async () => {
            // Mock contract returning false for membership check
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: false,
            }));

            const onDelegateVotes = jest.fn();
            render(<Navigation onDelegateVotes={onDelegateVotes} />);

            // Click the dropdown button to open the menu
            const dropdownButton = screen.getByRole('button', { name: /toad/i });
            fireEvent.click(dropdownButton);

            // Find the delegate button within the desktop menu
            const desktopMenu = screen.getByRole('menu');
            const delegateButton = within(desktopMenu).getByRole('menuitem', { name: /delegate to toad/i });
            fireEvent.click(delegateButton);

            expect(onDelegateVotes).toHaveBeenCalledWith('0x0987654321098765432109876543210987654321');
        });

        it('should call onDelegateVotes with user address when "Remove Membership (Undelegate)" is clicked', async () => {
            // Mock contract returning true for membership check
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: true,
            }));

            const onDelegateVotes = jest.fn();
            render(<Navigation onDelegateVotes={onDelegateVotes} />);

            // Click the dropdown button to open the menu
            const dropdownButton = screen.getByRole('button', { name: /toad/i });
            fireEvent.click(dropdownButton);

            // Find the undelegate button within the desktop menu
            const desktopMenu = screen.getByRole('menu');
            const undelegateButton = within(desktopMenu).getByRole('menuitem', { name: /remove membership/i });
            fireEvent.click(undelegateButton);

            expect(onDelegateVotes).toHaveBeenCalledWith('0x123');
        });
    });

    describe('Mobile Menu', () => {
        it('should have a "View on Tally" link that points to Tally website', () => {
            render(<Navigation />);

            // Click the mobile menu button to open the menu
            const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
            fireEvent.click(mobileMenuButton);

            // Find the mobile menu container
            const mobileMenu = screen.getByRole('menu');
            const tallyLink = within(mobileMenu).getByRole('menuitem', { name: /view on tally/i });
            expect(tallyLink).toBeInTheDocument();
            expect(tallyLink).toHaveAttribute('href', 'https://www.tally.xyz/gov/test-org');
        });

        it('should have a "Forum" link that points to Discourse', () => {
            render(<Navigation />);

            // Click the mobile menu button to open the menu
            const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
            fireEvent.click(mobileMenuButton);

            // Find the mobile menu container
            const mobileMenu = screen.getByRole('menu');
            const forumLink = within(mobileMenu).getByRole('menuitem', { name: /forum/i });
            expect(forumLink).toBeInTheDocument();
            expect(forumLink).toHaveAttribute('href', 'https://forum.example.com');
        });

        describe('Membership Status', () => {
            it('should not show delegate button when user is a member', () => {
                // Mock contract returning true for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: true,
                }));

                render(<Navigation />);

                // Click the mobile menu button to open the menu
                const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
                fireEvent.click(mobileMenuButton);

                // Find the delegate button within the mobile menu
                const mobileMenu = screen.getByRole('menu');
                const delegateButton = within(mobileMenu).queryByRole('menuitem', { name: /delegate to toad/i });
                expect(delegateButton).not.toBeInTheDocument();
            });

            it('should show "Remove Membership (Undelegate)" button when user is a member', () => {
                // Mock contract returning true for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: true,
                }));

                render(<Navigation />);

                // Click the mobile menu button to open the menu
                const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
                fireEvent.click(mobileMenuButton);

                // Find the mobile menu and check for the undelegate button
                const mobileMenu = screen.getByRole('menu');
                const undelegateButton = within(mobileMenu).getByRole('menuitem', { name: /remove membership/i });
                expect(undelegateButton).toBeInTheDocument();
            });

            it('should show "Delegate to Toad" button when user is not a member', () => {
                // Mock contract returning false for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: false,
                }));

                render(<Navigation />);

                // Click the mobile menu button to open the menu
                const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
                fireEvent.click(mobileMenuButton);

                // Find the delegate button within the mobile menu
                const mobileMenu = screen.getByRole('menu');
                const delegateButton = within(mobileMenu).getByRole('menuitem', { name: /delegate to toad/i });
                expect(delegateButton).toBeInTheDocument();
            });

            it('should not show "Remove Membership (Undelegate)" button when user is not a member', () => {
                // Mock contract returning false for membership check
                jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                    data: false,
                }));

                render(<Navigation />);

                // Click the mobile menu button to open the menu
                const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
                fireEvent.click(mobileMenuButton);

                // Find the mobile menu and check for the undelegate button
                const mobileMenu = screen.getByRole('menu');
                const undelegateButton = within(mobileMenu).queryByRole('menuitem', { name: /remove membership/i });
                expect(undelegateButton).not.toBeInTheDocument();
            });
        });

        it('should call onDelegateVotes with Toad address when "Delegate to Toad" is clicked', async () => {
            // Mock contract returning false for membership check
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: false,
            }));

            const onDelegateVotes = jest.fn();
            render(<Navigation onDelegateVotes={onDelegateVotes} />);

            // Click the mobile menu button to open the menu
            const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
            fireEvent.click(mobileMenuButton);

            // Find the delegate button within the mobile menu
            const mobileMenu = screen.getByRole('menu');
            const delegateButton = within(mobileMenu).getByRole('menuitem', { name: /delegate to toad/i });
            fireEvent.click(delegateButton);

            expect(onDelegateVotes).toHaveBeenCalledWith('0x0987654321098765432109876543210987654321');
        });

        it('should call onDelegateVotes with user address when "Remove Membership (Undelegate)" is clicked', async () => {
            // Mock contract returning true for membership check
            jest.spyOn(require('wagmi'), 'useReadContract').mockImplementation(() => ({
                data: true,
            }));

            const onDelegateVotes = jest.fn();
            render(<Navigation onDelegateVotes={onDelegateVotes} />);

            // Click the mobile menu button to open the menu
            const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
            fireEvent.click(mobileMenuButton);

            // Find the undelegate button within the mobile menu
            const mobileMenu = screen.getByRole('menu');
            const undelegateButton = within(mobileMenu).getByRole('menuitem', { name: /remove membership/i });
            fireEvent.click(undelegateButton);

            expect(onDelegateVotes).toHaveBeenCalledWith('0x123');
        });
    });
}); 