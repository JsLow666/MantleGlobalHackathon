import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  autoHide?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      autoHide: notification.autoHide !== false,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};