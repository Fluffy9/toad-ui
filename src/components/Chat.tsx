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
        <div className="flex flex-col h-[calc(100vh-4rem)] p-4">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'
                            }`}
                    >
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
                    <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={onSubmit} className="flex space-x-4">
                <div className="max-w-2xl mx-auto">
                    <input
                    className="w-full p-4 mb-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    value={input}
                    placeholder="Ask TOAD something..."
                    onChange={onInputChange}
                    disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
} 