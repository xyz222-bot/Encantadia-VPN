import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ConnectionStats } from '@/types/VPN';

interface StatsCardProps {
  stats: ConnectionStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (kbps: number): string => {
    if (kbps < 1024) {
      return `${kbps.toFixed(1)} KB/s`;
    }
    return `${(kbps / 1024).toFixed(1)} MB/s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Statistics</Text>
      
      <View style={styles.grid}>
        <View style={styles.statItem}>
          <MaterialIcons name="download" size={20} color={Colors.success} />
          <Text style={styles.statLabel}>Download</Text>
          <Text style={styles.statValue}>{formatSpeed(stats.downloadSpeed)}</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialIcons name="upload" size={20} color={Colors.info} />
          <Text style={styles.statLabel}>Upload</Text>
          <Text style={styles.statValue}>{formatSpeed(stats.uploadSpeed)}</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialIcons name="access-time" size={20} color={Colors.accent} />
          <Text style={styles.statLabel}>Connected</Text>
          <Text style={styles.statValue}>{formatTime(stats.connectionTime)}</Text>
        </View>

        <View style={styles.statItem}>
          <MaterialIcons name="language" size={20} color={Colors.warning} />
          <Text style={styles.statLabel}>Your IP</Text>
          <Text style={styles.statValue}>{stats.currentIP}</Text>
        </View>
      </View>

      <View style={styles.dataUsage}>
        <View style={styles.usageItem}>
          <Text style={styles.usageLabel}>Total Downloaded</Text>
          <Text style={styles.usageValue}>{formatBytes(stats.totalDownloaded * 1024 * 1024)}</Text>
        </View>
        <View style={styles.usageItem}>
          <Text style={styles.usageLabel}>Total Uploaded</Text>
          <Text style={styles.usageValue}>{formatBytes(stats.totalUploaded * 1024 * 1024)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  dataUsage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  usageItem: {
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  usageValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
});