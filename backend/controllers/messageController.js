import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import fetch from 'node-fetch';

const OLLAMA_API_URL = 'http://localhost:11434/api';

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

    // Update conversation's lastActivity
    await Conversation.findByIdAndUpdate(conversationId, { lastActivity: Date.now() });

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

// Stream AI response
export const streamAIResponse = async (req, res) => {
  try {
    const { content } = req.body;
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

    // Get last 10 messages for context
    const lastMessages = await Message.find({ conversation: conversationId })
      .sort({ timestamp: -1 })
      .limit(10);

    // Format messages for Ollama
    const context = lastMessages.reverse().map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Save user message
    const userMessage = await Message.create({
      content,
      role: 'user',
      conversation: conversationId
    });

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Create AI message placeholder
    const aiMessage = await Message.create({
      content: '',
      role: 'assistant',
      conversation: conversationId
    });

    let fullResponse = '';

    // Stream response from Ollama
    const ollamaResponse = await fetch(`${OLLAMA_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        messages: [
          {
            role: 'system',
            content: `You are ThinkForge, an advanced AI assistant focused on ${conversation.topic || 'general assistance'}. Be helpful, concise, and accurate.`
          },
          ...context,
          { role: 'user', content }
        ],
        stream: true
      })
    });

    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          const data = JSON.parse(line);
          if (data.message?.content) {
            fullResponse += data.message.content;
            res.write(`data: ${JSON.stringify({ content: data.message.content })}\n\n`);
          }
        }
      }

      // Update AI message with full response
      await Message.findByIdAndUpdate(aiMessage._id, { content: fullResponse });
      
      // Update conversation's lastActivity
      await Conversation.findByIdAndUpdate(conversationId, { lastActivity: Date.now() });

      res.write(`data: ${JSON.stringify({ done: true, messageId: aiMessage._id })}\n\n`);
    } catch (error) {
      console.error('Streaming error:', error);
      res.write(`data: ${JSON.stringify({ error: 'Streaming error occurred' })}\n\n`);
    } finally {
      res.end();
    }
  } catch (error) {
    console.error('Error in streamAIResponse:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI response',
      error: error.message
    });
  }
};