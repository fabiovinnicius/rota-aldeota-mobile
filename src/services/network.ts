export interface NetworkStatusListener {
  (isOnline: boolean): void;
}

export class NetworkService {
  private static isOnlineState = true;
  private static listeners: Set<NetworkStatusListener> = new Set();

  static isOnline(): boolean {
    return this.isOnlineState;
  }

  static setOnlineState(online: boolean): void {
    this.isOnlineState = online;
    this.listeners.forEach((listener) => listener(online));
  }

  static toggleNetwork(): boolean {
    this.setOnlineState(!this.isOnlineState);
    return this.isOnlineState;
  }

  static subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    listener(this.isOnlineState);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
