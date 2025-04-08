import { Message } from 'ai';
import { Markdown } from './Markdown';

interface ChatProps {
    messages: Message[];
    input: string;
    isLoading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Chat({ messages, input, isLoading, onSubmit, onInputChange }: ChatProps) {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="flex-1 space-y-4 p-4 pb-24">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex flex-col ${message.role === 'assistant' ? 'items-start' : 'items-end'
                            }`}
                    >
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {message.role === 'assistant' ? 'TOAD' : 'You'}
                        </div>
                        <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'assistant'
                                ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200'
                                : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            <Markdown content={message.content} id={message.id} />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex flex-col items-start">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            TOAD
                        </div>
                        <div className="bg-gray-200 rounded-lg px-4 py-2" data-testid="loading-indicator">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" role="status" aria-label="Loading dot 1" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" role="status" aria-label="Loading dot 2" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" role="status" aria-label="Loading dot 3" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 p-4">
                <form onSubmit={onSubmit} className="max-w-2xl mx-auto" data-testid="chat-form">
                    <input
                        className="w-full p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                        value={input}
                        placeholder="Ask TOAD something..."
                        onChange={onInputChange}
                        disabled={isLoading}
                    />
                </form>
            </div>
        </div>
    );
} 