import { useChat } from '@ai-sdk/react';
import { Navigation } from '@/components/Navigation';
import { Chat } from '@/components/Chat';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { isLoading, setIsLoading, error, setError, clearError } = useApp();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',  // Explicitly set the API endpoint
    onResponse: (response) => {
      console.log('Response received:', response);
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        setError(`API Error: ${response.status} ${response.statusText}`);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setError(error.message || 'An unknown error occurred');
      setIsLoading(false);
    },
    onFinish: () => {
      console.log('Chat finished');
      setIsLoading(false);
      clearError();
    }
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);
    try {
      handleSubmit(e);
    } catch (error) {
      console.error('Submit error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto stretch mt-20 pb-24 px-4">
      <Navigation />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <Chat
        messages={messages}
        input={input}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onInputChange={handleInputChange}
      />
      {/* <div className="flex flex-col w-full max-w-2xl mx-auto stretch mt-20 pb-24 px-4">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 
                ${m.role === 'user'
                  ? 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200'
                  : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-gray-200'
                }
              `}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {m.role === 'user' ? 'You' : 'TOAD'}
              </div>
              <div className="whitespace-pre-wrap">
                <Markdown content={m.content} id={m.id} />
              </div>
            </div>
          </div>
        ))}

        <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 px-4">
          <div className="max-w-2xl mx-auto">
            <input
              className="w-full p-4 mb-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={input}
              placeholder="Ask TOAD something..."
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div> */}
    </div>

  );
}