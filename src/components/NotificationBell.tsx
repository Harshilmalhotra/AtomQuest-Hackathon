"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, BellOff, Volume2 } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const previousNotificationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = ctx.currentTime;
      
      // Tone 1: G5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(783.99, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Tone 2: C6 (delayed)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1046.50, now + 0.12);
      gain2.gain.setValueAtTime(0, now + 0.12);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.5);
    } catch (error) {
      console.warn("Audio chime failed to play", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data: NotificationItem[] = await res.json();
        setNotifications(data);

        // Check for new unread notifications to trigger chime and browser alert
        const unreadNew = data.filter(n => !n.read && !previousNotificationsRef.current.includes(n.id));
        
        if (unreadNew.length > 0) {
          playChime();
          
          if (Notification.permission === "granted") {
            unreadNew.forEach(n => {
              new Notification(n.title, {
                body: n.message,
                icon: "/favicon.ico", // Fallback, nextjs default
              });
            });
          }
        }

        // Keep track of all fetched notification IDs to compare next time
        previousNotificationsRef.current = data.map(n => n.id);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll for notifications every 10 seconds for a real-time experience
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    
    const res = await Notification.requestPermission();
    setPermission(res);
    if (res === "granted") {
      playChime();
      new Notification("Notifications Enabled", {
        body: "You will now receive desktop notifications for goal updates.",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "PATCH" });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm shrink-0"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-destructive text-white font-mono font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-950 flex items-center gap-1.5">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {unreadCount} New
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary font-bold hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Permission Prompt */}
          {permission !== "granted" && (
            <div className="p-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between text-xs text-amber-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Turn on desktop chime notifications?</span>
              </div>
              <button
                onClick={requestNotificationPermission}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
              >
                Enable
              </button>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-950 flex justify-between items-start">
                    <span>{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <BellOff className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
