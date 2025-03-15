import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { aiService } from '../services/ai.service.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  // Create user message
  const userMessage = await Message.create({
    conversationId,
    userId,
    content,
    role: 'user'
  });

  // Get conversation history
  const conversation = await Conversation.findById(conversationId);
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(10)
    .sort({ createdAt: 1 });

  // Generate AI response
  const aiResponse = await aiService.generateResponse(messages.map(msg => ({
    role: msg.role,
    content: msg.content
  })));

  // Create AI message
  const aiMessage = await Message.create({
    conversationId,
    content: aiResponse.choices[0].message.content,
    role: 'assistant'
  });

  // Update conversation
  conversation.lastMessage = aiMessage.content;
  conversation.updatedAt = new Date();
  await conversation.save();

  res.status(201).json({
    status: 'success',
    data: {
      userMessage,
      aiMessage
    }
  });
});

export const streamMessage = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Create user message
  const userMessage = await Message.create({
    conversationId,
    userId,
    content,
    role: 'user'
  });

  // Get conversation history
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(10)
    .sort({ createdAt: 1 });

  let aiMessageContent = '';

  // Stream AI response
  await aiService.generateStreamResponse(
    messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    (chunk) => {
      aiMessageContent += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
  );

  // Create AI message in database
  const aiMessage = await Message.create({
    conversationId,
    content: aiMessageContent,
    role: 'assistant'
  });

  // Update conversation
  const conversation = await Conversation.findById(conversationId);
  conversation.lastMessage = aiMessageContent;
  conversation.updatedAt = new Date();
  await conversation.save();

  res.write('data: [DONE]\n\n');
  res.end();
});

export const getMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 });

  res.status(200).json({
    status: 'success',
    data: {
      messages
    }
  });
}); 