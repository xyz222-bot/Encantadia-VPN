import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useVPN } from '@/hooks/useVPN';
import { mockServers, getServersByProtocol, getFreeServers } from '@/services/vpnData';
import ServerCard from '@/components/ui/ServerCard';
import { VPNServer } from '@/types/VPN';

type FilterType = 'ALL' | 'SSH' | 'V2RAY' | 'OVPN' | 'FREE';

export default function ServersScreen() {
  const { connect, currentServer, status } = useVPN();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  const getFilteredServers = (): VPNServer[] => {
    switch (selectedFilter) {
      case 'SSH':
      case 'V2RAY':
      case 'OVPN':
        return getServersByProtocol(selectedFilter);
      case 'FREE':
        return getFreeServers();
      default:
        return mockServers;
    }
  };

  const handleServerConnect = async (server: VPNServer) => {
    if (status === 'connecting' || status === 'disconnecting') {
      return;
    }

    if (server.premium) {
      const message = `${server.name} is a premium server. Upgrade to Pro for access to premium servers with faster speeds and lower latency.`;
      
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Premium Server', message, [{ text: 'OK' }]);
      }
      return;
    }

    try {
      await connect(server);
    } catch (error) {
      const errorMessage = `Failed to connect to ${server.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Connection Error', errorMessage, [{ text: 'OK' }]);
      }
    }
  };

  const filters: { key: FilterType; label: string; color: string }[] = [
    { key: 'ALL', label: 'All', color: Colors.textMuted },
    { key: 'FREE', label: 'Free', color: Colors.success },
    { key: 'SSH', label: 'SSH', color: Colors.info },
    { key: 'V2RAY', label: 'V2RAY', color: Colors.accent },
    { key: 'OVPN', label: 'OpenVPN', color: Colors.primary },
  ];

  const filteredServers = getFilteredServers();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>VPN Servers</Text>
        <Text style={styles.subtitle}>
          {filteredServers.length} servers available
        </Text>
      </View>

      {/* Filter Buttons */}
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
              styles.filterButton,
              selectedFilter === filter.key && styles.activeFilterButton,
              selectedFilter === filter.key && { borderColor: filter.color }
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.key && { color: filter.color }
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Server List */}
      <FlatList
        data={filteredServers}
        keyExtractor={(item) => item.id}
        style={styles.serverList}
        contentContainerStyle={styles.serverListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServerCard
            server={item}
            onPress={() => handleServerConnect(item)}
            isConnected={currentServer?.id === item.id && status === 'connected'}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons name="dns" size={64} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No servers found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your filter selection
            </Text>
          </View>
        )}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <MaterialIcons name="star" size={16} color={Colors.warning} />
          <Text style={styles.legendText}>Premium Server</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialIcons name="wifi" size={16} color={Colors.textSecondary} />
          <Text style={styles.legendText}>Ping (ms)</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialIcons name="trending-up" size={16} color={Colors.textSecondary} />
          <Text style={styles.legendText}>Server Load (%)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
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
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeFilterButton: {
    backgroundColor: Colors.card,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  serverList: {
    flex: 1,
  },
  serverListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});