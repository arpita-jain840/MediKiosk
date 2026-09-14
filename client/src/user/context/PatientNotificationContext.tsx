import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getApiUrl } from "../../config/api";

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
  latestNotification: PatientNotification | null;
  dismissLatestNotification: () => void;
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
  const [latestNotification, setLatestNotification] = useState<PatientNotification | null>(null);

  useEffect(() => {
    if (!patientId) {
      setNotifications([]);
      setLatestNotification(null);
      return;
    }

    let isMounted = true;

    const pollNotifications = async () => {
      try {
        const targetId = patientId || 'dd282916-ac7a-4ca8-a6c0-e63ffc62066f';
        const response = await fetch(getApiUrl(`/api/patient/notifications/${targetId}`));
        if (!response.ok) return;

        const payload: { success: boolean; notifications: PatientNotification[] } = await response.json();
        if (!isMounted || !payload.success || !payload.notifications?.length) return;

        setNotifications((current) => {
          const existingIds = new Set(current.map((notification) => notification.id));
          const incoming = payload.notifications.filter((notification) => !existingIds.has(notification.id));
          if (incoming.length) {
            setLatestNotification(incoming[0]);
            return [...incoming, ...current];
          }
          return current;
        });
      } catch (error) {
        console.warn("[PatientNotifications] Poll failed:", error);
      }
    };

    void pollNotifications();
    const intervalId = window.setInterval(pollNotifications, 3500);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [patientId]);

  const value = useMemo<PatientNotificationContextValue>(() => ({
    notifications,
    latestNotification,
    dismissLatestNotification: () => setLatestNotification(null),
    markAsRead: (notificationId) => {
      setNotifications((current) => current.map((notification) => (
        notification.id === notificationId ? { ...notification, read: true } : notification
      )));
    },
    markAllAsRead: () => {
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    },
  }), [notifications, latestNotification]);

  return (
    <PatientNotificationContext.Provider value={value}>
      {children}
    </PatientNotificationContext.Provider>
  );
};

export const usePatientNotifications = () => useContext(PatientNotificationContext);
