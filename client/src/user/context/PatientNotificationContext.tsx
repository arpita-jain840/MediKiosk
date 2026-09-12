import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface PatientNotification {
  id: string;
  type: "remark" | "prescription" | string;
  title: string;
  message: string;
  doctor_name?: string;
  pdf_url?: string;
  created_at: string;
  read: boolean;
}

interface PatientNotificationContextValue {
  notifications: PatientNotification[];
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
}

const PatientNotificationContext = createContext<PatientNotificationContextValue | null>(null);

interface PatientNotificationProviderProps {
  patientId?: string | null;
  children: React.ReactNode;
}

export const PatientNotificationProvider: React.FC<PatientNotificationProviderProps> = ({ patientId, children }) => {
  const [notifications, setNotifications] = useState<PatientNotification[]>([]);

  useEffect(() => {
    if (!patientId) {
      setNotifications([]);
      return;
    }

    let isMounted = true;

    const pollNotifications = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient/notifications/dd282916-ac7a-4ca8-a6c0-e63ffc62066f`);
        if (!response.ok) return;

        const payload: { success: boolean; notifications: PatientNotification[] } = await response.json();
        if (!isMounted || !payload.success || !payload.notifications?.length) return;

        setNotifications((current) => {
          const existingIds = new Set(current.map((notification) => notification.id));
          const incoming = payload.notifications.filter((notification) => !existingIds.has(notification.id));
          return incoming.length ? [...incoming, ...current] : current;
        });
      } catch (error) {
        console.warn("[PatientNotifications] Poll failed:", error);
      }
    };

    void pollNotifications();
    const intervalId = window.setInterval(pollNotifications, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [patientId]);

  const value = useMemo<PatientNotificationContextValue>(() => ({
    notifications,
    markAsRead: (notificationId) => {
      setNotifications((current) => current.map((notification) => (
        notification.id === notificationId ? { ...notification, read: true } : notification
      )));
    },
    markAllAsRead: () => {
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    },
  }), [notifications]);

  return (
    <PatientNotificationContext.Provider value={value}>
      {children}
    </PatientNotificationContext.Provider>
  );
};

export const usePatientNotifications = () => useContext(PatientNotificationContext);
