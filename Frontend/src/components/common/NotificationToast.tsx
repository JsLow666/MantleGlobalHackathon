import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications, Notification } from '../../contexts/NotificationContext';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification: Notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-md border shadow-lg transition-all duration-300 animate-in slide-in-from-right-2 ${getStyles(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;