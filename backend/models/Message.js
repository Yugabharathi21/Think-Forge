import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  metadata: {
    model: String,
    processingTime: Number,
    tokens: {
      total: Number,
      prompt: Number,
      completion: Number
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ conversation: 1, timestamp: 1 });
messageSchema.index({ user: 1, conversation: 1 });
messageSchema.index({ content: 'text' });

const Message = mongoose.model('Message', messageSchema);

export default Message;