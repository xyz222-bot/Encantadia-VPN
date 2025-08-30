import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useVPN } from '@/hooks/useVPN';
import ConnectionButton from '@/components/ui/ConnectionButton';
import StatsCard from '@/components/ui/StatsCard';

export default function HomeScreen() {
  const { status, currentServer, stats, disconnect } = useVPN();

  const handleConnectionPress = () => {
    if (status === 'connected' && currentServer) {
      disconnect();
    } else if (status === 'disconnected') {
      // Show platform-appropriate message
      if (Platform.OS === 'web') {
        alert('Please select a server from the Servers tab to connect.');
      } else {
        Alert.alert(
          'Select Server',
          'Please choose a server from the Servers tab to establish connection.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const getSecurityStatus = () => {
    switch (status) {
      case 'connected':
        return {
          icon: 'verified-user' as const,
          text: 'Your connection is secure',
          color: Colors.success
        };
      case 'connecting':
        return {
          icon: 'sync' as const,
          text: 'Establishing secure connection...',
          color: Colors.warning
        };
      case 'disconnecting':
        return {
          icon: 'sync' as const,
          text: 'Disconnecting...',
          color: Colors.warning
        };
      default:
        return {
          icon: 'warning' as const,
          text: 'Your connection is not protected',
          color: Colors.error
        };
    }
  };

  const securityStatus = getSecurityStatus();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Encantadia VPN</Text>
          <Text style={styles.subtitle}>Military-Grade Security</Text>
        </View>

        {/* Security Status */}
        <View style={styles.securityCard}>
          <MaterialIcons 
            name={securityStatus.icon} 
            size={24} 
            color={securityStatus.color} 
          />
          <Text style={[styles.securityText, { color: securityStatus.color }]}>
            {securityStatus.text}
          </Text>
        </View>

        {/* Current Server Info */}
        {currentServer && status === 'connected' && (
          <View style={styles.serverCard}>
            <View style={styles.serverHeader}>
              <Text style={styles.serverFlag}>{currentServer.flag}</Text>
              <View style={styles.serverInfo}>
                <Text style={styles.serverName}>{currentServer.name}</Text>
                <Text style={styles.serverLocation}>
                  {currentServer.city}, {currentServer.country}
                </Text>
              </View>
              <View style={[styles.protocolBadge, { backgroundColor: Colors.primary }]}>
                <Text style={styles.protocolText}>{currentServer.protocol}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Connection Button */}
        <ConnectionButton 
          status={status} 
          onPress={handleConnectionPress}
        />

        {/* Features */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureItem}>
            <MaterialIcons name="security" size={32} color={Colors.primary} />
            <Text style={styles.featureTitle}>Military Encryption</Text>
            <Text style={styles.featureDesc}>AES-256 encryption</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="block" size={32} color={Colors.success} />
            <Text style={styles.featureTitle}>Kill Switch</Text>
            <Text style={styles.featureDesc}>Auto protection</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="dns" size={32} color={Colors.info} />
            <Text style={styles.featureTitle}>DNS Protection</Text>
            <Text style={styles.featureDesc}>Leak prevention</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="cloud" size={32} color={Colors.accent} />
            <Text style={styles.featureTitle}>SNI Tunneling</Text>
            <Text style={styles.featureDesc}>Bypass firewalls</Text>
          </View>
        </View>

        {/* Connection Stats */}
        {status === 'connected' && <StatsCard stats={stats} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  securityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  securityText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  serverCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  serverLocation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  protocolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  protocolText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  featureItem: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    margin: '1%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
});