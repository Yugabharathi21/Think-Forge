import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: join(__dirname, '../../.env') });

// MongoDB connection options
const mongooseOptions = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

// Configuration for sample data
const CONFIG = {
  USERS: 10,
  CONVERSATIONS_PER_USER: {
    MIN: 3,
    MAX: 8
  },
  MESSAGES_PER_CONVERSATION: {
    MIN: 5,
    MAX: 15
  }
};

// Sample system prompts for different conversation types
const SYSTEM_PROMPTS = {
  general: 'You are a helpful AI assistant.',
  programming: 'You are an expert software developer specializing in modern web technologies.',
  writing: 'You are a professional writing assistant with expertise in various writing styles.',
  math: 'You are a mathematics tutor skilled in explaining complex concepts simply.',
  science: 'You are a science educator with deep knowledge across multiple scientific disciplines.'
};

// Sample conversation categories
const CONVERSATION_CATEGORIES = [
  'general',
  'programming',
  'writing',
  'math',
  'science'
];

// Sample programming languages and frameworks for tags
const TECH_TAGS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'MongoDB',
  'Express',
  'Vue.js',
  'Angular',
  'Next.js',
  'Docker',
  'AWS',
  'Git'
];

async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function createUsers() {
  try {
    const users = [];
    
    // Create admin user
    const adminPassword = await bcrypt.hash('Admin123!@#', 10);
    users.push({
      username: 'admin',
      email: 'admin@thinkforge.dev',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
      status: 'active',
      preferences: {
        theme: 'dark',
        notifications: { email: true, push: true },
        language: 'en'
      }
    });

    // Create regular users
    for (let i = 0; i < CONFIG.USERS; i++) {
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const password = await bcrypt.hash('User123!@#', 10);
      
      // Generate a username with only letters, numbers, and underscores
      const username = `${firstName}_${lastName}${faker.number.int({ min: 1, max: 99 })}`;
      
      users.push({
        username: username.replace(/[^a-z0-9_]/g, '_'),
        email: faker.internet.email({ firstName, lastName, provider: 'thinkforge.dev' }).toLowerCase(),
        password: password,
        role: 'user',
        isVerified: faker.datatype.boolean(0.9), // 90% verified
        status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']), // 75% active
        preferences: {
          theme: faker.helpers.arrayElement(['dark', 'light']),
          notifications: {
            email: faker.datatype.boolean(),
            push: faker.datatype.boolean()
          },
          language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de'])
        }
      });
    }

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${users.length} users successfully`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

async function createConversations(users) {
  try {
    const conversations = [];
    
    for (const user of users) {
      const numConversations = faker.number.int({
        min: CONFIG.CONVERSATIONS_PER_USER.MIN,
        max: CONFIG.CONVERSATIONS_PER_USER.MAX
      });

      for (let i = 0; i < numConversations; i++) {
        const category = faker.helpers.arrayElement(CONVERSATION_CATEGORIES);
        const tags = [];
        
        // Add category-specific tags
        if (category === 'programming') {
          const numTechTags = faker.number.int({ min: 1, max: 3 });
          for (let j = 0; j < numTechTags; j++) {
            const tag = faker.helpers.arrayElement(TECH_TAGS);
            if (!tags.includes(tag)) tags.push(tag);
          }
        }
        
        // Add general tags
        tags.push(category);
        if (faker.datatype.boolean(0.3)) tags.push('important');
        if (faker.datatype.boolean(0.2)) tags.push('archived');

        conversations.push({
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          user: user._id,
          status: faker.helpers.arrayElement(['active', 'active', 'archived', 'deleted']),
          metadata: {
            model: faker.helpers.arrayElement(['gpt-3.5-turbo', 'gpt-4']),
            totalTokens: faker.number.int({ min: 100, max: 5000 }),
            category: category,
            tags: tags,
            language: user.preferences.language,
            lastActivity: faker.date.recent({ days: 30 })
          },
          settings: {
            temperature: faker.number.float({ min: 0, max: 2, precision: 0.1 }),
            maxTokens: faker.number.int({ min: 1000, max: 4000 }),
            systemPrompt: SYSTEM_PROMPTS[category]
          }
        });
      }
    }

    const createdConversations = await Conversation.create(conversations);
    console.log(`✅ Created ${conversations.length} conversations successfully`);
    return createdConversations;
  } catch (error) {
    console.error('❌ Error creating conversations:', error);
    throw error;
  }
}

async function createMessages(conversations) {
  try {
    const messages = [];
    const userQueries = [
      'Can you help me understand this concept?',
      'I need help with a programming problem.',
      'Could you explain this in simpler terms?',
      'What are the best practices for this?',
      'How does this work exactly?',
      'Can you give me an example?',
      'I\'m stuck with this issue.',
      'What\'s the difference between these approaches?',
      'Could you review this code?',
      'How can I improve this?'
    ];

    for (const conversation of conversations) {
      const numMessages = faker.number.int({
        min: CONFIG.MESSAGES_PER_CONVERSATION.MIN,
        max: CONFIG.MESSAGES_PER_CONVERSATION.MAX
      });

      let currentTokenCount = 0;

      for (let i = 0; i < numMessages; i++) {
        const isUserMessage = i % 2 === 0;
        const messageTokens = faker.number.int({ min: 10, max: 100 });
        currentTokenCount += messageTokens;

        const baseMessage = {
          conversation: conversation._id,
          metadata: {
            tokens: {
              total: messageTokens,
              completion: isUserMessage ? 0 : messageTokens,
              prompt: isUserMessage ? messageTokens : 0
            }
          }
        };

        if (isUserMessage) {
          messages.push({
            ...baseMessage,
            content: faker.helpers.arrayElement(userQueries),
            role: 'user'
          });
        } else {
          messages.push({
            ...baseMessage,
            content: faker.lorem.paragraph({ min: 3, max: 8 }),
            role: 'assistant',
            metadata: {
              ...baseMessage.metadata,
              model: conversation.metadata.model,
              finishReason: 'stop',
              processingTime: faker.number.float({ min: 0.5, max: 3.0, precision: 0.1 })
            }
          });
        }
      }

      // Update conversation with total tokens
      await Conversation.findByIdAndUpdate(conversation._id, {
        'metadata.totalTokens': currentTokenCount
      });
    }

    await Message.create(messages);
    console.log(`✅ Created ${messages.length} messages successfully`);
  } catch (error) {
    console.error('❌ Error creating messages:', error);
    throw error;
  }
}

async function validateDatabase() {
  try {
    // Get collection counts
    const userCount = await User.countDocuments();
    const conversationCount = await Conversation.countDocuments();
    const messageCount = await Message.countDocuments();
    
    console.log('\nDatabase Statistics:');
    console.log('------------------------');
    console.log('Users:', userCount);
    console.log('Conversations:', conversationCount);
    console.log('Messages:', messageCount);
    
    // Get some sample data
    const randomUser = await User.findOne({ role: 'user' });
    const userConversations = await Conversation.find({ user: randomUser._id });
    const randomConversation = userConversations[0];
    const conversationMessages = await Message.find({ conversation: randomConversation._id });
    
    console.log('\nSample Data Validation:');
    console.log('------------------------');
    console.log('Random User:', {
      username: randomUser.username,
      email: randomUser.email,
      role: randomUser.role,
      status: randomUser.status
    });
    console.log('Their Conversations:', userConversations.length);
    console.log('Sample Conversation:', {
      title: randomConversation.title,
      status: randomConversation.status,
      messages: conversationMessages.length
    });
    
    // Validate indexes
    const userIndexes = await mongoose.connection.collection('users').indexes();
    const conversationIndexes = await mongoose.connection.collection('conversations').indexes();
    const messageIndexes = await mongoose.connection.collection('messages').indexes();
    
    console.log('\nIndex Validation:');
    console.log('------------------------');
    console.log('User Indexes:', userIndexes.length);
    console.log('Conversation Indexes:', conversationIndexes.length);
    console.log('Message Indexes:', messageIndexes.length);
    
    console.log('\n✅ Database validation completed successfully');
  } catch (error) {
    console.error('❌ Error validating database:', error);
    throw error;
  }
}

async function createDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    console.log('\n🔄 Clearing existing data...');
    await clearDatabase();

    // Create users
    console.log('\n🔄 Creating users...');
    const users = await createUsers();

    // Create conversations
    console.log('\n🔄 Creating conversations...');
    const conversations = await createConversations(users);

    // Create messages
    console.log('\n🔄 Creating messages...');
    await createMessages(conversations);

    // Validate database
    console.log('\n🔄 Validating database...');
    await validateDatabase();

    console.log('\n✅ Database creation completed successfully');
    
    // Print login credentials
    console.log('\n🔑 Login Credentials:');
    console.log('------------------------');
    console.log('Admin User:');
    console.log('Email: admin@thinkforge.dev');
    console.log('Password: Admin123!@#');
    console.log('\nRegular Users:');
    console.log('Password for all users: User123!@#');
    
  } catch (error) {
    console.error('\n❌ Database creation failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the database creation
createDatabase(); 