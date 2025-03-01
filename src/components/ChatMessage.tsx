import React from 'react';
import { User, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`py-6 ${isUser ? 'bg-dark-darker' : 'bg-dark-lighter'}`}>
      <div className="max-w-4xl mx-auto flex gap-4 px-4">
        <div className="mt-1 flex-shrink-0">
          {isUser ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
              <User size={18} className="text-primary" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30">
              <BrainCircuit size={18} className="text-secondary" />
            </div>
          )}
        </div>
        <div className="prose prose-invert flex-1">
          {isUser ? (
            <p className="text-gray-100">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group">
                      <div className="absolute -top-5 right-0 bg-dark-darker text-xs text-gray-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {match[1]}
                      </div>
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                        customStyle={{
                          borderRadius: '0.5rem',
                          marginTop: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={`${className} bg-dark-darker px-1 py-0.5 rounded text-gray-200`} {...props}>
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="text-gray-100">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 my-3">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 my-3">{children}</ol>;
                },
                li({ children }) {
                  return <li className="my-1">{children}</li>;
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-xl font-bold mt-5 mb-2">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;