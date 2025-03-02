import express from 'express';
import Conversation from '../models/Conversation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all conversations for the current user
router.get('/', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user.userId })
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single conversation
router.get('/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new conversation
router.post('/', auth, async (req, res) => {
  try {
    const conversation = new Conversation({
      title: req.body.title || 'New Conversation',
      user: req.user.userId,
      messages: [],
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a message to a conversation
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Add user message
    conversation.messages.push({
      content: req.body.content,
      role: 'user',
    });

    // Add AI response (you would typically call your AI service here)
    conversation.messages.push({
      content: 'This is a mock AI response. Replace with actual AI integration.',
      role: 'assistant',
    });

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a conversation
router.delete('/:id', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;