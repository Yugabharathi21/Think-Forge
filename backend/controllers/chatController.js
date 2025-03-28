import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { OllamaService } from '../services/ollamaService.js';

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const conversation = new Conversation({
      title: req.body.title || 'New Conversation',
      user: req.user._id,
    });
    await conversation.save();
    res.status(201).json({ success: true, data: conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ 
      user: req.user._id,
      status: { $ne: 'deleted' }
    }).sort({ lastActivity: -1 });
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get messages from a conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
      conversation: req.params.conversationId,
      user: req.user._id
    }).sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send a message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;

    // Validate conversation exists and belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
      status: 'active'
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found or not accessible'
      });
    }

    // Check if Ollama model is available
    const isModelAvailable = await OllamaService.checkModelStatus();
    if (!isModelAvailable) {
      throw new Error('Ollama model is not available. Please ensure the model is running.');
    }

    console.log('Saving user message...');
    // Save user message
    const userMessage = new Message({
      content,
      role: 'user',
      user: req.user._id,
      conversation: conversationId,
      metadata: {
        model: conversation.metadata.model
      }
    });
    await userMessage.save();

    console.log('Getting conversation history...');
    // Get conversation history
    const conversationHistory = await Message.find({ conversation: conversationId })
      .sort({ timestamp: 1 })
      .limit(10); // Get last 10 messages for context

    // Format messages for Ollama
    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message
    messages.unshift({
      role: 'system',
      content: conversation.systemPrompt
    });

    console.log('Getting AI response...');
    // Get AI response from Ollama
    const startTime = Date.now();
    const aiResponse = await OllamaService.generateResponse(messages);
    const processingTime = Date.now() - startTime;

    console.log('Saving AI response...');
    // Save AI response
    const aiMessage = new Message({
      content: aiResponse.content,
      role: 'assistant',
      user: req.user._id,
      conversation: conversationId,
      metadata: {
        model: conversation.metadata.model,
        processingTime,
        tokens: aiResponse.tokens
      }
    });
    await aiMessage.save();

    // Update conversation metadata
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: {
        lastActivity: new Date(),
        'metadata.lastMessageAt': new Date()
      },
      $inc: {
        'metadata.messageCount': 2,
        'metadata.totalTokens': (aiResponse.tokens?.total || 0)
      }
    });

    console.log('Sending response...');
    res.json({
      success: true,
      data: {
        userMessage,
        aiMessage,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process message'
    });
  }
};

// Archive a conversation
export const archiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { 
        _id: req.params.conversationId, 
        user: req.user._id,
        status: 'active'
      },
      { 
        $set: {
          status: 'archived',
          isArchived: true
        }
      },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found or already archived',
      });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    console.error('Archive conversation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}; 