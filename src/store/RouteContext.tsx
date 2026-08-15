import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { RouteData, RoutePoint, ReadingRecord } from '../domain/types';
import { StorageService } from '../services/storage';
import { NetworkService } from '../services/network';

interface RouteContextData {
  route: RouteData | null;
  loading: boolean;
  isOnline: boolean;
  syncing: boolean;
  toggleNetwork: () => void;
  registerReading: (record: ReadingRecord) => Promise<void>;
  syncPoint: (pointId: number) => Promise<void>;
  syncAllPending: () => Promise<void>;
  resetRoute: () => Promise<void>;
  refreshRoute: () => Promise<void>;
}

const RouteContext = createContext<RouteContextData>({} as RouteContextData);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(NetworkService.isOnline());
  const [syncing, setSyncing] = useState<boolean>(false);

  const loadRoute = async () => {
    setLoading(true);
    const data = await StorageService.getRouteData();
    setRoute(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRoute();
    const unsubscribe = NetworkService.subscribe((online) => {
      setIsOnline(online);
    });
    return () => unsubscribe();
  }, []);

  const toggleNetwork = () => {
    NetworkService.toggleNetwork();
  };

  const registerReading = async (record: ReadingRecord) => {
    const updated = await StorageService.registerReading(record);
    setRoute(updated);
  };

  const syncPoint = async (pointId: number) => {
    await StorageService.updatePointStatus(pointId, 'syncing');
    const tempRoute = await StorageService.getRouteData();
    setRoute(tempRoute);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const updated = await StorageService.syncPoint(pointId);
    setRoute(updated);
  };

  const syncAllPending = async () => {
    if (!route || syncing) return;
    const pendingPoints = route.points.filter(
      (p) => p.status === 'pending' || p.status === 'error'
    );
    if (pendingPoints.length === 0) return;

    setSyncing(true);

    for (const point of pendingPoints) {
      await StorageService.updatePointStatus(point.id, 'syncing');
      const temp = await StorageService.getRouteData();
      setRoute(temp);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const updated = await StorageService.syncPoint(point.id);
      setRoute(updated);
    }

    setSyncing(false);
  };

  const resetRoute = async () => {
    setLoading(true);
    const reset = await StorageService.resetRouteData();
    setRoute(reset);
    setLoading(false);
  };

  return (
    <RouteContext.Provider
      value={{
        route,
        loading,
        isOnline,
        syncing,
        toggleNetwork,
        registerReading,
        syncPoint,
        syncAllPending,
        resetRoute,
        refreshRoute: loadRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => useContext(RouteContext);
