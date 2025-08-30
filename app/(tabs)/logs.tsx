import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useVPN } from '@/hooks/useVPN';
import { ConnectionLog } from '@/types/VPN';

type LogFilter = 'ALL' | 'connect' | 'disconnect' | 'error' | 'info';

export default function LogsScreen() {
  const { connectionLogs, clearLogs } = useVPN();
  const [selectedFilter, setSelectedFilter] = useState<LogFilter>('ALL');

  const getFilteredLogs = (): ConnectionLog[] => {
    if (selectedFilter === 'ALL') {
      return connectionLogs;
    }
    return connectionLogs.filter(log => log.type === selectedFilter);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'connect': return 'check-circle';
      case 'disconnect': return 'cancel';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'circle';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'connect': return Colors.success;
      case 'disconnect': return Colors.warning;
      case 'error': return Colors.error;
      case 'info': return Colors.info;
      default: return Colors.textMuted;
    }
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const filters: { key: LogFilter; label: string; count: number }[] = [
    { 
      key: 'ALL', 
      label: 'All', 
      count: connectionLogs.length 
    },
    { 
      key: 'connect', 
      label: 'Connect', 
      count: connectionLogs.filter(l => l.type === 'connect').length 
    },
    { 
      key: 'disconnect', 
      label: 'Disconnect', 
      count: connectionLogs.filter(l => l.type === 'disconnect').length 
    },
    { 
      key: 'error', 
      label: 'Errors', 
      count: connectionLogs.filter(l => l.type === 'error').length 
    },
    { 
      key: 'info', 
      label: 'Info', 
      count: connectionLogs.filter(l => l.type === 'info').length 
    },
  ];

  const filteredLogs = getFilteredLogs();

  const renderLogItem = ({ item }: { item: ConnectionLog }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <MaterialIcons 
          name={getLogIcon(item.type)} 
          size={20} 
          color={getLogColor(item.type)} 
        />
        <Text style={[styles.logType, { color: getLogColor(item.type) }]}>
          {item.type.toUpperCase()}
        </Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
      
      <Text style={styles.logMessage}>{item.message}</Text>
      
      {(item.server || item.protocol) && (
        <View style={styles.logMeta}>
          {item.server && (
            <Text style={styles.metaText}>Server: {item.server}</Text>
          )}
          {item.protocol && (
            <Text style={styles.metaText}>Protocol: {item.protocol}</Text>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Connection Logs</Text>
          <Text style={styles.subtitle}>
            {filteredLogs.length} entries
          </Text>
        </View>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearLogs}
        >
          <MaterialIcons name="clear-all" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              selectedFilter === filter.key && styles.activeFilterTab
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.key && styles.activeFilterLabel
              ]}
            >
              {filter.label}
            </Text>
            {filter.count > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{filter.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Logs List */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        style={styles.logsList}
        contentContainerStyle={styles.logsContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderLogItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="article" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No logs found</Text>
            <Text style={styles.emptySubtext}>
              Connection activities will appear here
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  clearButton: {
    padding: 8,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  activeFilterTab: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeFilterLabel: {
    color: Colors.primary,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.text,
  },
  logsList: {
    flex: 1,
  },
  logsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logType: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  logMessage: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  logMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});