import { VPNServer, ConnectionLog, VPNConfig } from '@/types/VPN';

export const mockServers: VPNServer[] = [
  // SSH Servers
  {
    id: 'ssh-sg-1',
    name: 'Singapore Fast',
    country: 'Singapore',
    city: 'Singapore',
    flag: '🇸🇬',
    protocol: 'SSH',
    ping: 12,
    load: 45,
    premium: false,
    host: 'sg1-ssh.encantadia.net',
    port: 22,
    username: 'free_user',
    password: 'enc_2024'
  },
  {
    id: 'ssh-us-1',
    name: 'USA East',
    country: 'United States',
    city: 'New York',
    flag: '🇺🇸',
    protocol: 'SSH',
    ping: 85,
    load: 62,
    premium: false,
    host: 'us-east-ssh.encantadia.net',
    port: 22,
    username: 'free_user',
    password: 'enc_2024'
  },
  {
    id: 'ssh-jp-1',
    name: 'Japan Premium',
    country: 'Japan',
    city: 'Tokyo',
    flag: '🇯🇵',
    protocol: 'SSH',
    ping: 28,
    load: 23,
    premium: true,
    host: 'jp1-ssh.encantadia.net',
    port: 22
  },
  
  // V2RAY Servers
  {
    id: 'v2ray-nl-1',
    name: 'Netherlands V2',
    country: 'Netherlands',
    city: 'Amsterdam',
    flag: '🇳🇱',
    protocol: 'V2RAY',
    ping: 45,
    load: 38,
    premium: false,
    host: 'nl1-v2ray.encantadia.net',
    port: 443,
    config: 'vmess://eyJ2IjoiMiIsInBzIjoiRW5jYW50YWRpYSBGcmVlIiwiYWRkIjoibmwxLXYycmF5LmVuY2FudGFkaWEubmV0IiwicG9ydCI6IjQ0MyIsImlkIjoiYWJjZGVmZ2gtaWprbC1tbm9wLXFyc3QtdXZ3eHl6MTIzNCIsImFpZCI6IjAiLCJzY3kiOiJhdXRvIiwibmV0Ijoid3MiLCJ0eXBlIjoibm9uZSIsImhvc3QiOiIiLCJwYXRoIjoiL2VuY2FudGFkaWEiLCJ0bHMiOiJ0bHMiLCJzbmkiOiIifQ=='
  },
  {
    id: 'v2ray-de-1',
    name: 'Germany Secure',
    country: 'Germany',
    city: 'Frankfurt',
    flag: '🇩🇪',
    protocol: 'V2RAY',
    ping: 52,
    load: 41,
    premium: false,
    host: 'de1-v2ray.encantadia.net',
    port: 443,
    config: 'vmess://eyJ2IjoiMiIsInBzIjoiRW5jYW50YWRpYSBHZXJtYW55IiwiYWRkIjoiZGUxLXYycmF5LmVuY2FudGFkaWEubmV0IiwicG9ydCI6IjQ0MyIsImlkIjoiZGVmZzEyMzQtNTY3OC05YWJjLWRlZmctaGlqa2xtbm9wcSIsImFpZCI6IjAiLCJzY3kiOiJhdXRvIiwibmV0Ijoid3MiLCJ0eXBlIjoibm9uZSIsImhvc3QiOiIiLCJwYXRoIjoiL2VuY2FudGFkaWEiLCJ0bHMiOiJ0bHMiLCJzbmkiOiIifQ=='
  },
  
  // OpenVPN Servers
  {
    id: 'ovpn-ca-1',
    name: 'Canada OpenVPN',
    country: 'Canada',
    city: 'Toronto',
    flag: '🇨🇦',
    protocol: 'OVPN',
    ping: 78,
    load: 55,
    premium: false,
    host: 'ca1-ovpn.encantadia.net',
    port: 1194,
    config: 'ca-toronto-free.ovpn'
  },
  {
    id: 'ovpn-uk-1',
    name: 'UK London',
    country: 'United Kingdom',
    city: 'London',
    flag: '🇬🇧',
    protocol: 'OVPN',
    ping: 65,
    load: 48,
    premium: false,
    host: 'uk1-ovpn.encantadia.net',
    port: 1194,
    config: 'uk-london-free.ovpn'
  },
  {
    id: 'ovpn-fr-1',
    name: 'France Premium',
    country: 'France',
    city: 'Paris',
    flag: '🇫🇷',
    protocol: 'OVPN',
    ping: 58,
    load: 32,
    premium: true,
    host: 'fr1-ovpn.encantadia.net',
    port: 1194
  }
];

export const defaultVPNConfig: VPNConfig = {
  protocol: 'SSH',
  killSwitch: true,
  dnsLeakProtection: true,
  autoReconnect: true,
  sniHostname: 'cloudflare.com',
  customDNS: ['1.1.1.1', '8.8.8.8']
};

export const generateConnectionLog = (
  type: 'connect' | 'disconnect' | 'error' | 'info',
  message: string,
  server?: string,
  protocol?: string
): ConnectionLog => ({
  id: Date.now().toString(),
  timestamp: new Date(),
  type,
  message,
  server,
  protocol
});

export const getServersByProtocol = (protocol?: 'SSH' | 'V2RAY' | 'OVPN'): VPNServer[] => {
  if (!protocol) return mockServers;
  return mockServers.filter(server => server.protocol === protocol);
};

export const getFreeServers = (): VPNServer[] => {
  return mockServers.filter(server => !server.premium);
};

export const getPremiumServers = (): VPNServer[] => {
  return mockServers.filter(server => server.premium);
};