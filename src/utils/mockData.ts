import { Conversation, Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper function to create a message
export const createMessage = (content: string, role: 'user' | 'assistant' | 'system'): Message => ({
  id: uuidv4(),
  content,
  role,
  timestamp: new Date(),
});

// Helper function to create a conversation
export const createConversation = (title: string, messages: Message[] = []): Conversation => ({
  id: uuidv4(),
  title,
  messages,
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Sample conversations
export const sampleConversations: Conversation[] = [
  createConversation('Introduction to React', [
    createMessage('What is React and why should I use it?', 'user'),
    createMessage(
      'React is a JavaScript library for building user interfaces, particularly single-page applications. It\'s used for handling the view layer in web and mobile apps.\n\nHere\'s why you might want to use React:\n\n1. **Component-Based Architecture**: React allows you to build encapsulated components that manage their own state, then compose them to make complex UIs.\n\n2. **Virtual DOM**: React creates an in-memory data structure cache, computes the resulting differences, and then updates the browser\'s displayed DOM efficiently.\n\n3. **Declarative Views**: React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.\n\n4. **Learn Once, Write Anywhere**: You can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using React Native.\n\n5. **Strong Community Support**: React has a large community and ecosystem, with plenty of libraries, tools, and extensions available.',
      'assistant'
    ),
  ]),
  createConversation('JavaScript Help', [
    createMessage('How do I use async/await in JavaScript?', 'user'),
    createMessage(
      'Async/await is a way to handle asynchronous operations in JavaScript. It\'s built on top of Promises and makes asynchronous code look more like synchronous code.\n\n```javascript\n// Basic syntax\nasync function myFunction() {\n  try {\n    const result = await someAsyncOperation();\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}\n```\n\nHere\'s a more practical example:\n\n```javascript\nasync function fetchUserData(userId) {\n  try {\n    const response = await fetch(`https://api.example.com/users/${userId}`);\n    \n    if (!response.ok) {\n      throw new Error(`HTTP error! status: ${response.status}`);\n    }\n    \n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("There was a problem fetching the user data:", error);\n  }\n}\n\n// Using the function\nfetchUserData(123).then(data => {\n  console.log(data);\n});\n```\n\nKey points about async/await:\n\n1. The `async` keyword is used to declare an async function\n2. The `await` keyword can only be used inside an async function\n3. `await` makes JavaScript wait until the Promise settles and returns its result\n4. Error handling is done using try/catch blocks\n5. Async functions always return a Promise',
      'assistant'
    ),
  ]),
  createConversation('CSS Flexbox Tutorial', []),
];