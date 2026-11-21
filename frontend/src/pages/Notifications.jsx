import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Car,
  Star,
  Check,
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getMyNotifications();
      if (res.success) {
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'REQUEST_ACCEPTED':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'REQUEST_REJECTED':
      case 'RIDE_CANCELLED':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'NEW_RATING':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'REQUEST_RECEIVED':
      default:
        return <Car className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-xs text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread notification(s)` : 'All caught up!'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-500">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3">
          <Bell className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="text-base font-semibold text-gray-700">No notifications yet</h3>
          <p className="text-xs text-gray-400">
            You'll receive alerts here when peers request to join your rides or accept your bookings.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              className={`p-4 rounded-2xl border transition flex items-start space-x-4 cursor-pointer ${
                notif.isRead
                  ? 'bg-white border-gray-100 opacity-80'
                  : 'bg-indigo-50/50 border-indigo-100 shadow-sm'
              }`}
            >
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex-1 space-y-1">
                <p className={`text-sm ${notif.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
                  {notif.message}
                </p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  {!notif.isRead && (
                    <>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">Unread</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
