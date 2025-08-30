import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { ConnectionStatus, VPNServer, ConnectionLog, VPNConfig, ConnectionStats } from '@/types/VPN';
import { defaultVPNConfig, generateConnectionLog } from '@/services/vpnData';

interface VPNContextType {
  // Connection state
  status: ConnectionStatus;
  currentServer: VPNServer | null;
  connectionLogs: ConnectionLog[];
  stats: ConnectionStats;
  
  // Configuration
  config: VPNConfig;
  
  // Actions
  connect: (server: VPNServer) => Promise<void>;
  disconnect: () => Promise<void>;
  updateConfig: (newConfig: Partial<VPNConfig>) => void;
  clearLogs: () => void;
  addLog: (log: ConnectionLog) => void;
}

export const VPNContext = createContext<VPNContextType | undefined>(undefined);

export function VPNProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [currentServer, setCurrentServer] = useState<VPNServer | null>(null);
  const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);
  const [config, setConfig] = useState<VPNConfig>(defaultVPNConfig);
  const [stats, setStats] = useState<ConnectionStats>({
    uploadSpeed: 0,
    downloadSpeed: 0,
    totalUploaded: 0,
    totalDownloaded: 0,
    connectionTime: 0,
    currentIP: '0.0.0.0'
  });

  // Mock connection simulation
  const connect = async (server: VPNServer): Promise<void> => {
    try {
      setStatus('connecting');
      addLog(generateConnectionLog('info', `Connecting to ${server.name} (${server.protocol})...`, server.name, server.protocol));
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentServer(server);
      setStatus('connected');
      
      // Update stats with mock values
      setStats({
        uploadSpeed: Math.random() * 50,
        downloadSpeed: Math.random() * 100,
        totalUploaded: 0,
        totalDownloaded: 0,
        connectionTime: 0,
        currentIP: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      });
      
      addLog(generateConnectionLog('connect', `Successfully connected to ${server.name}`, server.name, server.protocol));
      addLog(generateConnectionLog('info', `Using ${server.protocol} protocol with military-grade encryption`));
      addLog(generateConnectionLog('info', `DNS leak protection: ${config.dnsLeakProtection ? 'ENABLED' : 'DISABLED'}`));
      addLog(generateConnectionLog('info', `Kill switch: ${config.killSwitch ? 'ENABLED' : 'DISABLED'}`));
      
    } catch (error) {
      setStatus('disconnected');
      addLog(generateConnectionLog('error', `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  };

  const disconnect = async (): Promise<void> => {
    setStatus('disconnecting');
    addLog(generateConnectionLog('info', 'Disconnecting from VPN...'));
    
    // Simulate disconnection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStatus('disconnected');
    setCurrentServer(null);
    setStats({
      uploadSpeed: 0,
      downloadSpeed: 0,
      totalUploaded: stats.totalUploaded,
      totalDownloaded: stats.totalDownloaded,
      connectionTime: stats.connectionTime,
      currentIP: '0.0.0.0'
    });
    
    addLog(generateConnectionLog('disconnect', 'Successfully disconnected from VPN'));
  };

  const updateConfig = (newConfig: Partial<VPNConfig>): void => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    addLog(generateConnectionLog('info', 'VPN configuration updated'));
  };

  const clearLogs = (): void => {
    setConnectionLogs([]);
  };

  const addLog = (log: ConnectionLog): void => {
    setConnectionLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  // Update connection time and stats while connected
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          connectionTime: prev.connectionTime + 1,
          uploadSpeed: Math.random() * 50 + 10,
          downloadSpeed: Math.random() * 100 + 20,
          totalUploaded: prev.totalUploaded + (Math.random() * 0.1),
          totalDownloaded: prev.totalDownloaded + (Math.random() * 0.2)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  // Initialize with welcome log
  useEffect(() => {
    addLog(generateConnectionLog('info', 'Encantadia VPN initialized'));
    addLog(generateConnectionLog('info', 'Military-grade encryption ready'));
  }, []);

  const value: VPNContextType = {
    status,
    currentServer,
    connectionLogs,
    stats,
    config,
    connect,
    disconnect,
    updateConfig,
    clearLogs,
    addLog
  };

  return <VPNContext.Provider value={value}>{children}</VPNContext.Provider>;
}