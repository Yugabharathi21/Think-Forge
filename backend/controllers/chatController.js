import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ lastActivity: -1 });
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get messages from a conversation
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .sort({ timestamp: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Send a message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.conversationId;

    // Save user message
    const userMessage = new Message({
      content,
      role: 'user',
      user: req.user._id,
      conversation: conversationId,
    });
    await userMessage.save();

    // Get conversation history
    const conversationHistory = await Message.find({ conversation: conversationId })
      .sort({ timestamp: 1 })
      .limit(10); // Get last 10 messages for context

    // Format messages for OpenAI
    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message
    const conversation = await Conversation.findById(conversationId);
    messages.unshift({
      role: 'system',
      content: conversation.systemPrompt,
    });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Save AI response
    const aiMessage = new Message({
      content: completion.choices[0].message.content,
      role: 'assistant',
      user: req.user._id,
      conversation: conversationId,
    });
    await aiMessage.save();

    // Update conversation lastActivity
    await Conversation.findByIdAndUpdate(conversationId, {
      lastActivity: new Date(),
    });

    res.json({
      success: true,
      data: {
        userMessage,
        aiMessage,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Archive a conversation
export const archiveConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId, user: req.user._id },
      { isArchived: true },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found',
      });
    }

    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}; 