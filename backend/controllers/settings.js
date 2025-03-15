import { Settings } from '../models/Settings.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getSettings = catchAsync(async (req, res) => {
  const userId = req.user.id;

  let settings = await Settings.findOne({ userId });
  
  if (!settings) {
    // Create default settings if none exist
    settings = await Settings.create({ userId });
  }

  res.status(200).json({
    status: 'success',
    data: { settings }
  });
});

export const updateSettings = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;

  const settings = await Settings.findOneAndUpdate(
    { userId },
    { $set: updates },
    { 
      new: true, 
      runValidators: true,
      upsert: true 
    }
  );

  res.status(200).json({
    status: 'success',
    data: { settings }
  });
});

export const resetSettings = catchAsync(async (req, res) => {
  const userId = req.user.id;

  await Settings.findOneAndDelete({ userId });
  const settings = await Settings.create({ userId });

  res.status(200).json({
    status: 'success',
    data: { settings }
  });
}); 