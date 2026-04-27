import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  useGetNotifications, 
  useGetUnreadCount, 
  useMarkAsRead, 
  useMarkAllRead 
} from '../../hooks/useNotifications';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import useToastStore from '../../store/toastStore';
import { useQueryClient } from '@tanstack/react-query';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const { data: notifications } = useGetNotifications();
  const { data: unreadCount } = useGetUnreadCount();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllRead } = useMarkAllRead();

  useNotificationSocket((notification) => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    addToast(`New notification: ${notification.title}`, 'info');
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    
    // Navigate based on type
    if (notification.type === 'ai_scored' || notification.type === 'status_changed') {
      navigate('/candidate/dashboard');
    } else if (notification.type === 'application_received' && notification.jobId) {
      navigate(`/employer/jobs/${notification.jobId}/applicants`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-blue-500/10 text-blue-400">📋</div>;
      case 'status_changed':
        return <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-amber-500/10 text-amber-400">🔄</div>;
      case 'ai_scored':
        return <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-purple-muted text-purple-light">⚡</div>;
      default:
        return <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-bg-surface text-text-muted">🔔</div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-text-muted hover:text-text-primary p-2 focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-purple text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-bg-card border border-border-soft rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-border-soft flex items-center justify-between">
            <h3 className="text-text-primary font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => markAllRead()}
                className="text-purple-light text-xs hover:underline focus:outline-none"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <div className="py-6 text-center text-text-hint text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 flex gap-3 cursor-pointer border-b border-border-soft last:border-0 hover:bg-bg-surface transition-colors ${
                    !notification.isRead ? 'border-l-2 border-l-purple bg-purple-muted/20' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-text-primary text-xs font-medium mb-1">{notification.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-text-hint text-[10px] mt-2 block">
                      {formatDistanceToNow(new Date(notification.createdAt))} ago
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
