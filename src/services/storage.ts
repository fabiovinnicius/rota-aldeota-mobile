import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultRouteData from '../data/rota_aldeota_LEIT.json';
import { RouteData, RoutePoint, ReadingRecord, VisitStatus } from '../domain/types';

const STORAGE_KEY = '@leit_app_route_v1';

export class StorageService {
  static async getRouteData(): Promise<RouteData> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
      const initialData: RouteData = defaultRouteData as RouteData;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    } catch {
      return defaultRouteData as RouteData;
    }
  }

  static async saveRouteData(routeData: RouteData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(routeData));
  }

  static async registerReading(record: ReadingRecord): Promise<RouteData> {
    const route = await this.getRouteData();
    const updatedPoints = route.points.map((point: RoutePoint) => {
      if (point.id === record.pointId) {
        return {
          ...point,
          currentReading: record.currentReading,
          latitude: record.latitude,
          longitude: record.longitude,
          capturedAt: record.capturedAt,
          photo: record.photo,
          status: record.syncStatus,
          syncErrorMessage: undefined,
        };
      }
      return point;
    });

    const updatedRoute: RouteData = {
      ...route,
      points: updatedPoints,
    };

    await this.saveRouteData(updatedRoute);
    return updatedRoute;
  }

  static async syncPoint(pointId: number, simulateError = false): Promise<RouteData> {
    const route = await this.getRouteData();
    const updatedPoints = route.points.map((point: RoutePoint) => {
      if (point.id === pointId) {
        if (simulateError) {
          return {
            ...point,
            status: 'error' as VisitStatus,
            syncErrorMessage: 'Falha na conexão com o servidor LEIT.',
          };
        }
        return {
          ...point,
          status: 'synced' as VisitStatus,
          syncErrorMessage: undefined,
        };
      }
      return point;
    });

    const updatedRoute: RouteData = {
      ...route,
      points: updatedPoints,
    };

    await this.saveRouteData(updatedRoute);
    return updatedRoute;
  }

  static async updatePointStatus(pointId: number, status: VisitStatus): Promise<RouteData> {
    const route = await this.getRouteData();
    const updatedPoints = route.points.map((point: RoutePoint) => {
      if (point.id === pointId) {
        return { ...point, status };
      }
      return point;
    });

    const updatedRoute: RouteData = {
      ...route,
      points: updatedPoints,
    };

    await this.saveRouteData(updatedRoute);
    return updatedRoute;
  }

  static async resetRouteData(): Promise<RouteData> {
    const initialData: RouteData = defaultRouteData as RouteData;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
}
