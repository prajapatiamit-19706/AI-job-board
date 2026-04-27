import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

export const useNotificationSocket = (onNewNotification) => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Socket connected for notifications');
    });

    socket.on('newNotification', (event) => {
      if (event.recipientId === user._id) {
        onNewNotification(event.notification);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, onNewNotification]);
};
