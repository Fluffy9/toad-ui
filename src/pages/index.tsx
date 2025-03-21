import { useChat } from '@ai-sdk/react';
import { Navigation } from '@/components/Navigation';
import { Chat } from '@/components/Chat';
import { useApp } from '@/context/AppContext';
import { MemberGate } from '@/components/MemberGate';

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
      <MemberGate>
        <Chat
          messages={messages}
          input={input}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onInputChange={handleInputChange}
        />
      </MemberGate>
    </div>
  );
}