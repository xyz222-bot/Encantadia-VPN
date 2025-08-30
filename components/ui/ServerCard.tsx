import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { VPNServer } from '@/types/VPN';

interface ServerCardProps {
  server: VPNServer;
  onPress: () => void;
  isConnected?: boolean;
}

export default function ServerCard({ server, onPress, isConnected = false }: ServerCardProps) {
  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'SSH': return Colors.info;
      case 'V2RAY': return Colors.accent;
      case 'OVPN': return Colors.success;
      default: return Colors.textMuted;
    }
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return Colors.success;
    if (load < 70) return Colors.warning;
    return Colors.error;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isConnected && styles.connectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <Text style={styles.flag}>{server.flag}</Text>
        <View style={styles.serverInfo}>
          <Text style={styles.serverName} numberOfLines={1}>
            {server.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {server.city}, {server.country}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.statsRow}>
          <View style={[styles.protocolBadge, { backgroundColor: getProtocolColor(server.protocol) }]}>
            <Text style={styles.protocolText}>{server.protocol}</Text>
          </View>
          {server.premium && (
            <MaterialIcons name="star" size={16} color={Colors.warning} style={styles.premiumIcon} />
          )}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <MaterialIcons name="wifi" size={14} color={Colors.textSecondary} />
            <Text style={styles.metricText}>{server.ping}ms</Text>
          </View>
          <View style={styles.metric}>
            <MaterialIcons name="trending-up" size={14} color={getLoadColor(server.load)} />
            <Text style={[styles.metricText, { color: getLoadColor(server.load) }]}>
              {server.load}%
            </Text>
          </View>
        </View>
      </View>

      {isConnected && (
        <View style={styles.connectedIndicator}>
          <MaterialIcons name="check-circle" size={20} color={Colors.success} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  connectedContainer: {
    borderColor: Colors.success,
    backgroundColor: Colors.surface,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  protocolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  protocolText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text,
  },
  premiumIcon: {
    marginLeft: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metricText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  connectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});