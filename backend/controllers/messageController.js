import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Get all messages for a conversation
export const getMessages = async (req, res) => {
  try {
    // Check if conversation exists and belongs to user
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching messages',
      error: error.message
    });
  }
};

// Create a new message
export const createMessage = async (req, res) => {
  try {
    const { content, role } = req.body;
    const conversationId = req.params.conversationId;

    // Check if conversation exists and belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Create message
    const message = await Message.create({
      content,
      role,
      conversation: conversationId
    });

    // Update conversation's updatedAt
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating message',
      error: error.message
    });
  }
};

// Generate AI response
export const generateAIResponse = async (req, res) => {
  try {
    const { userMessage } = req.body;
    const conversationId = req.params.conversationId;

    // Check if conversation exists and belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Save user message
    const userMessageDoc = await Message.create({
      content: userMessage,
      role: 'user',
      conversation: conversationId
    });

    // Mock AI response (this would be replaced with actual AI integration)
    let aiResponseContent = "I understand you're asking about something. As ThinkForge, I'm designed to provide thoughtful responses. This is a placeholder response.";
    
    // Simple keyword-based responses for demo purposes
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      aiResponseContent = "Hello! I'm ThinkForge, your advanced AI assistant. How can I help you today?";
    } else if (userMessage.toLowerCase().includes('help')) {
      aiResponseContent = "I'm here to assist you! As ThinkForge, I can help with a wide range of tasks including answering questions, generating creative content, explaining complex topics, and much more. What specific help do you need?";
    }

    // Save AI response
    const aiMessage = await Message.create({
      content: aiResponseContent,
      role: 'assistant',
      conversation: conversationId
    });

    // Update conversation's updatedAt
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: Date.now() });

    res.status(201).json({
      success: true,
      data: {
        userMessage: userMessageDoc,
        aiResponse: aiMessage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating AI response',
      error: error.message
    });
  }
};