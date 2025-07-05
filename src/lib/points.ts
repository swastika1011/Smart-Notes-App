import dbConnect from './db';
import User from '../models/User';

export const addPointsToUser = async (userId: string, points: number): Promise<void> => {
  await dbConnect();
  
  await User.findByIdAndUpdate(
    userId,
    { $inc: { points: points } },
    { new: true }
  );
};

export const POINTS = {
  NOTE_ACCEPTED: 10,
  NOTE_VIEWED: 2,
  NOTE_DOWNLOADED: 5,
}; 