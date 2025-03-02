import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// Load environment variables
dotenv.config({ path: '../../.env' });

// MongoDB connection options
const mongooseOptions = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
};

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

async function createSampleUsers() {
  try {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        status: 'active',
        preferences: {
          theme: 'dark',
          notifications: {
            email: true,
            push: true
          },
          language: 'en'
        }
      },
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        status: 'active',
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true
          },
          language: 'en'
        }
      }
    ];

    const createdUsers = await User.create(users);
    console.log('✅ Sample users created successfully');
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating sample users:', error);
    throw error;
  }
}

async function createSampleConversations(users) {
  try {
    const conversations = [];
    
    for (const user of users) {
      const userConversations = [
        {
          title: 'Getting Started with AI',
          user: user._id,
          status: 'active',
          metadata: {
            model: 'gpt-3.5-turbo',
            totalTokens: 150,
            category: 'general',
            tags: ['introduction', 'ai'],
            language: 'en',
            lastActivity: new Date()
          },
          settings: {
            temperature: 0.7,
            maxTokens: 2000,
            systemPrompt: 'You are a helpful AI assistant.'
          }
        },
        {
          title: 'Code Review Discussion',
          user: user._id,
          status: 'active',
          metadata: {
            model: 'gpt-3.5-turbo',
            totalTokens: 300,
            category: 'programming',
            tags: ['code', 'review'],
            language: 'en',
            lastActivity: new Date()
          },
          settings: {
            temperature: 0.5,
            maxTokens: 2500,
            systemPrompt: 'You are a code review expert.'
          }
        }
      ];
      
      conversations.push(...userConversations);
    }

    const createdConversations = await Conversation.create(conversations);
    console.log('✅ Sample conversations created successfully');
    return createdConversations;
  } catch (error) {
    console.error('❌ Error creating sample conversations:', error);
    throw error;
  }
}

async function createSampleMessages(conversations) {
  try {
    const messages = [];
    
    for (const conversation of conversations) {
      const conversationMessages = [
        {
          content: 'Hello! How can you help me today?',
          role: 'user',
          conversation: conversation._id,
          metadata: {
            tokens: {
              total: 10,
              completion: 0,
              prompt: 10
            }
          }
        },
        {
          content: 'Hello! I\'m your AI assistant. I can help you with various tasks including answering questions, writing code, and explaining complex topics. What would you like to know?',
          role: 'assistant',
          conversation: conversation._id,
          metadata: {
            tokens: {
              total: 35,
              completion: 35,
              prompt: 0
            },
            model: 'gpt-3.5-turbo',
            finishReason: 'stop',
            processingTime: 0.8
          }
        }
      ];
      
      messages.push(...conversationMessages);
    }

    await Message.create(messages);
    console.log('✅ Sample messages created successfully');
  } catch (error) {
    console.error('❌ Error creating sample messages:', error);
    throw error;
  }
}

async function validateDatabaseStructure() {
  try {
    // Validate User collection
    const userIndexes = await User.collection.indexes();
    console.log('User indexes:', userIndexes);
    
    // Validate Conversation collection
    const conversationIndexes = await Conversation.collection.indexes();
    console.log('Conversation indexes:', conversationIndexes);
    
    // Validate Message collection
    const messageIndexes = await Message.collection.indexes();
    console.log('Message indexes:', messageIndexes);
    
    // Get collection statistics
    const userStats = await User.collection.stats();
    const conversationStats = await Conversation.collection.stats();
    const messageStats = await Message.collection.stats();
    
    console.log('\nDatabase Statistics:');
    console.log('Users:', userStats.count);
    console.log('Conversations:', conversationStats.count);
    console.log('Messages:', messageStats.count);
    
    console.log('\n✅ Database structure validated successfully');
  } catch (error) {
    console.error('❌ Error validating database structure:', error);
    throw error;
  }
}

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    console.log('\n🔄 Clearing existing data...');
    await clearDatabase();

    // Create sample data
    console.log('\n🔄 Creating sample users...');
    const users = await createSampleUsers();

    console.log('\n🔄 Creating sample conversations...');
    const conversations = await createSampleConversations(users);

    console.log('\n🔄 Creating sample messages...');
    await createSampleMessages(conversations);

    // Validate database structure
    console.log('\n🔄 Validating database structure...');
    await validateDatabaseStructure();

    console.log('\n✅ Database initialization completed successfully');
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run the initialization
initializeDatabase(); 