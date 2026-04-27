import Notification from '../models/Notification.model.js';
import { getIO } from '../config/socket.js';

export const createNotification = async (recipientId, type, title, message, extras = {}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      jobId: extras.jobId,
      applicationId: extras.applicationId
    });

    const io = getIO();
    if (io) {
      io.emit('newNotification', {
        recipientId: recipientId.toString(),
        notification
      });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
