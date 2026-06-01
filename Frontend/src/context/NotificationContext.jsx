import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff-notifications') || '[]'); }
    catch { return []; }
  });

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('ff-notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Add a new notification (avoids duplicates by key)
  const addNotification = useCallback((notif) => {
    setNotifications(prev => {
      // Don't add duplicate — same key within last 24 hours
      const alreadyExists = prev.some(n => n.key === notif.key);
      if (alreadyExists) return prev;
      const newNotif = {
        id:      Date.now() + Math.random(),
        key:     notif.key,       // unique key to prevent duplicates
        type:    notif.type,      // 'due_today' | 'overdue' | 'completed'
        title:   notif.title,
        message: notif.message,
        read:    false,
        time:    new Date().toISOString(),
      };
      return [newNotif, ...prev].slice(0, 50); // keep max 50
    });
  }, []);

  // Mark one as read
  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  // Mark all as read
  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete one
  const deleteNotif = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all
  const clearAll = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount,
      addNotification, markRead, markAllRead, deleteNotif, clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);