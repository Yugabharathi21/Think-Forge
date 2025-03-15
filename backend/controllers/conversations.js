import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createConversation = catchAsync(async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;

  const conversation = await Conversation.create({
    title: title || 'New Chat',
    userId,
    lastMessage: ''
  });

  res.status(201).json({
    status: 'success',
    data: { conversation }
  });
});

export const getConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const conversations = await Conversation.find({ userId })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: 'success',
    data: { conversations }
  });
});

export const getConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const conversation = await Conversation.findOne({ _id: id, userId });
  
  if (!conversation) {
    return res.status(404).json({
      status: 'error',
      message: 'Conversation not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { conversation }
  });
});

export const updateConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.id;

  const conversation = await Conversation.findOneAndUpdate(
    { _id: id, userId },
    { title },
    { new: true, runValidators: true }
  );

  if (!conversation) {
    return res.status(404).json({
      status: 'error',
      message: 'Conversation not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { conversation }
  });
});

export const deleteConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Delete all messages in the conversation
  await Message.deleteMany({ conversationId: id });

  // Delete the conversation
  const conversation = await Conversation.findOneAndDelete({ _id: id, userId });

  if (!conversation) {
    return res.status(404).json({
      status: 'error',
      message: 'Conversation not found'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Conversation deleted successfully'
  });
});

export const deleteAllConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;

  // Get all conversation IDs for the user
  const conversations = await Conversation.find({ userId }).select('_id');
  const conversationIds = conversations.map(conv => conv._id);

  // Delete all messages in all conversations
  await Message.deleteMany({ conversationId: { $in: conversationIds } });

  // Delete all conversations
  await Conversation.deleteMany({ userId });

  res.status(200).json({
    status: 'success',
    message: 'All conversations deleted successfully'
  });
}); 