export interface VPNServer {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  protocol: 'SSH' | 'V2RAY' | 'OVPN';
  ping: number;
  load: number;
  premium: boolean;
  host: string;
  port: number;
  username?: string;
  password?: string;
  config?: string;
}

export interface ConnectionLog {
  id: string;
  timestamp: Date;
  type: 'connect' | 'disconnect' | 'error' | 'info';
  message: string;
  server?: string;
  protocol?: string;
}

export interface VPNConfig {
  protocol: 'SSH' | 'V2RAY' | 'OVPN';
  killSwitch: boolean;
  dnsLeakProtection: boolean;
  autoReconnect: boolean;
  sniHostname: string;
  customDNS: string[];
}

export interface ConnectionStats {
  uploadSpeed: number;
  downloadSpeed: number;
  totalUploaded: number;
  totalDownloaded: number;
  connectionTime: number;
  currentIP: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'disconnecting';