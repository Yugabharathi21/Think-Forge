import mongoose from 'mongoose';

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
  systemPrompt: {
    type: String,
    default: 'You are a helpful coding assistant powered by deepseek-coder.'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  metadata: {
    model: {
      type: String,
      default: 'deepseek-coder:6.7b'
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    messageCount: {
      type: Number,
      default: 0
    },
    lastMessageAt: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ user: 1, status: 1, lastActivity: -1 });
conversationSchema.index({ title: 'text' });

// Update metadata when conversation is modified
conversationSchema.pre('save', async function(next) {
  if (this.isModified('metadata.messageCount')) {
    this.lastActivity = new Date();
    this.metadata.lastMessageAt = new Date();
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