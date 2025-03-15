import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [10000, 'Message cannot exceed 10000 characters']
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  metadata: {
    tokens: {
      total: Number,
      completion: Number,
      prompt: Number
    },
    model: String,
    finishReason: String,
    processingTime: Number
  }
}, {
  timestamps: true
});

const conversationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    index: true
  },
  messages: [messageSchema],
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  metadata: {
    model: {
      type: String,
      default: 'gpt-3.5-turbo'
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    category: String,
    tags: [String],
    language: String,
    lastActivity: Date
  },
  settings: {
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 2
    },
    maxTokens: {
      type: Number,
      default: 2000,
      min: 1,
      max: 4000
    },
    systemPrompt: {
      type: String,
      default: 'You are a helpful terminal-based AI assistant.'
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  isArchived: {
    type: Boolean,
  }
}, {
  timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ user: 1, status: 1, createdAt: -1 });
conversationSchema.index({ 'metadata.tags': 1 });
conversationSchema.index({ title: 'text' });

// Update lastActivity on new messages
conversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.metadata.lastActivity = new Date();
    
    // Update total tokens
    if (this.messages.length > 0) {
      const lastMessage = this.messages[this.messages.length - 1];
      if (lastMessage.metadata && lastMessage.metadata.tokens) {
        this.metadata.totalTokens += lastMessage.metadata.tokens.total || 0;
      }
    }
  }
  next();
});

// Method to add a message
conversationSchema.methods.addMessage = async function(messageData) {
  this.messages.push(messageData);
  return this.save();
};

// Method to update conversation title
conversationSchema.methods.updateTitle = async function(newTitle) {
  this.title = newTitle;
  return this.save();
};

// Method to archive conversation
conversationSchema.methods.archive = async function() {
  this.status = 'archived';
  return this.save();
};

// Method to restore conversation
conversationSchema.methods.restore = async function() {
  this.status = 'active';
  return this.save();
};

// Method to soft delete conversation
conversationSchema.methods.softDelete = async function() {
  this.status = 'deleted';
  return this.save();
};

// Static method to get user's active conversations
conversationSchema.statics.getActiveConversations = function(userId) {
  return this.find({
    user: userId,
    status: 'active'
  })
  .sort({ 'metadata.lastActivity': -1 })
  .select('-messages');
};

// Static method to search conversations
conversationSchema.statics.searchConversations = function(userId, searchTerm) {
  return this.find({
    user: userId,
    $text: { $search: searchTerm },
    status: { $ne: 'deleted' }
  })
  .sort({ score: { $meta: 'textScore' } })
  .select('-messages');
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;