import { render, screen, fireEvent } from '@testing-library/react';
import { Chat } from '../Chat';
import { Message } from 'ai';

// Mock the Markdown component
jest.mock('../Markdown', () => ({
    Markdown: ({ content }: { content: string }) => <div data-testid="markdown-content">{content}</div>,
}));

// Mock react-markdown
jest.mock('react-markdown', () => ({
    __esModule: true,
    default: ({ children }: { children: string }) => <div data-testid="react-markdown">{children}</div>,
}));

describe('Chat', () => {
    const mockMessages: Message[] = [
        {
            id: '1',
            role: 'assistant',
            content: 'Hello, how can I help you?',
        },
        {
            id: '2',
            role: 'user',
            content: 'What is TOAD?',
        },
    ];

    const mockProps = {
        messages: mockMessages,
        input: '',
        isLoading: false,
        onSubmit: jest.fn(),
        onInputChange: jest.fn(),
    };

    it('should render loading indicator when loading', () => {
        render(<Chat {...mockProps} isLoading={true} />);

        // Check for loading indicator
        const loadingIndicator = screen.getByTestId('loading-indicator');
        expect(loadingIndicator).toBeInTheDocument();

        // Check for loading dots
        const loadingDots = screen.getAllByRole('status');
        expect(loadingDots).toHaveLength(3);
    });

    it('should render messages correctly', () => {
        render(<Chat {...mockProps} />);

        // Check for assistant message
        const assistantMessages = screen.getAllByText('TOAD');
        const assistantMessage = assistantMessages[0];
        expect(assistantMessage).toBeInTheDocument();
        expect(screen.getByText('Hello, how can I help you?')).toBeInTheDocument();

        // Check for user message
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('What is TOAD?')).toBeInTheDocument();
    });

    it('should handle form submission', () => {
        render(<Chat {...mockProps} />);

        const form = screen.getByTestId('chat-form');
        fireEvent.submit(form);

        expect(mockProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('should handle input changes', () => {
        render(<Chat {...mockProps} />);

        const input = screen.getByPlaceholderText('Ask TOAD something...');
        fireEvent.change(input, { target: { value: 'New message' } });

        expect(mockProps.onInputChange).toHaveBeenCalledTimes(1);
    });

    it('should disable input when loading', () => {
        render(<Chat {...mockProps} isLoading={true} />);

        const input = screen.getByPlaceholderText('Ask TOAD something...');
        expect(input).toBeDisabled();
    });
}); 