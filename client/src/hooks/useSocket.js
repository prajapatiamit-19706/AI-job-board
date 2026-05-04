import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};

export const useAIScoreSocket = (onScoreReady) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('aiScoreReady', onScoreReady);
    return () => {
      socket.off('aiScoreReady', onScoreReady);
    };
  }, [socket, onScoreReady]);
};

export const useInterviewQuestionsSocket = (onQuestionsReady) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('interviewQuestionsReady', onQuestionsReady);
    return () => {
      socket.off('interviewQuestionsReady', onQuestionsReady);
    };
  }, [socket, onQuestionsReady]);
};
export const useApplicationStatusSocket = (onStatusUpdated) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('applicationStatusUpdated', onStatusUpdated);
    return () => {
      socket.off('applicationStatusUpdated', onStatusUpdated);
    };
  }, [socket, onStatusUpdated]);
};
