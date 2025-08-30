import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useVPN } from '@/hooks/useVPN';

export default function SettingsScreen() {
  const { config, updateConfig } = useVPN();
  const [sniModalVisible, setSniModalVisible] = useState(false);
  const [tempSniHostname, setTempSniHostname] = useState(config.sniHostname);

  const protocols = [
    { key: 'SSH', label: 'SSH Tunnel', desc: 'Secure Shell tunneling protocol' },
    { key: 'V2RAY', label: 'V2Ray/VMess', desc: 'Modern proxy protocol with advanced features' },
    { key: 'OVPN', label: 'OpenVPN', desc: 'Industry standard VPN protocol' }
  ] as const;

  const handleProtocolChange = (protocol: 'SSH' | 'V2RAY' | 'OVPN') => {
    updateConfig({ protocol });
  };

  const handleSniSave = () => {
    updateConfig({ sniHostname: tempSniHostname });
    setSniModalVisible(false);
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <MaterialIcons name={icon as any} size={24} color={Colors.primary} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={value ? Colors.text : Colors.textMuted}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>VPN Settings</Text>
          <Text style={styles.subtitle}>Configure your security preferences</Text>
        </View>

        {/* Protocol Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VPN Protocol</Text>
          <Text style={styles.sectionDesc}>
            Choose the tunneling protocol for your connections
          </Text>
          
          {protocols.map((protocol) => (
            <TouchableOpacity
              key={protocol.key}
              style={[
                styles.protocolItem,
                config.protocol === protocol.key && styles.selectedProtocol
              ]}
              onPress={() => handleProtocolChange(protocol.key)}
            >
              <View style={styles.protocolContent}>
                <Text style={[
                  styles.protocolTitle,
                  config.protocol === protocol.key && styles.selectedProtocolText
                ]}>
                  {protocol.label}
                </Text>
                <Text style={styles.protocolDesc}>{protocol.desc}</Text>
              </View>
              {config.protocol === protocol.key && (
                <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Features</Text>
          <Text style={styles.sectionDesc}>
            Advanced protection and privacy controls
          </Text>

          {renderSettingItem(
            'block',
            'Kill Switch',
            'Automatically block internet if VPN disconnects',
            config.killSwitch,
            (value) => updateConfig({ killSwitch: value })
          )}

          {renderSettingItem(
            'dns',
            'DNS Leak Protection',
            'Prevent DNS queries from bypassing VPN tunnel',
            config.dnsLeakProtection,
            (value) => updateConfig({ dnsLeakProtection: value })
          )}

          {renderSettingItem(
            'refresh',
            'Auto Reconnect',
            'Automatically reconnect if connection drops',
            config.autoReconnect,
            (value) => updateConfig({ autoReconnect: value })
          )}
        </View>

        {/* SNI Tunneling */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SNI Tunneling</Text>
          <Text style={styles.sectionDesc}>
            Bypass network restrictions using custom SNI hostnames
          </Text>

          <TouchableOpacity
            style={styles.sniItem}
            onPress={() => setSniModalVisible(true)}
          >
            <MaterialIcons name="cloud" size={24} color={Colors.accent} />
            <View style={styles.sniContent}>
              <Text style={styles.sniTitle}>SNI Hostname</Text>
              <Text style={styles.sniValue}>{config.sniHostname}</Text>
            </View>
            <MaterialIcons name="edit" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.sniInfo}>
            <MaterialIcons name="info" size={16} color={Colors.info} />
            <Text style={styles.sniInfoText}>
              Popular SNI hosts: cloudflare.com, google.com, facebook.com, microsoft.com
            </Text>
          </View>
        </View>

        {/* DNS Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DNS Configuration</Text>
          <Text style={styles.sectionDesc}>
            Custom DNS servers for enhanced privacy
          </Text>

          <View style={styles.dnsGrid}>
            <View style={styles.dnsItem}>
              <Text style={styles.dnsLabel}>Primary DNS</Text>
              <Text style={styles.dnsValue}>{config.customDNS[0]}</Text>
            </View>
            <View style={styles.dnsItem}>
              <Text style={styles.dnsLabel}>Secondary DNS</Text>
              <Text style={styles.dnsValue}>{config.customDNS[1]}</Text>
            </View>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Info</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <MaterialIcons name="security" size={20} color={Colors.success} />
              <Text style={styles.infoLabel}>Encryption</Text>
              <Text style={styles.infoValue}>AES-256</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialIcons name="verified" size={20} color={Colors.primary} />
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* SNI Hostname Modal */}
      {Platform.OS === 'web' ? (
        sniModalVisible && (
          <Modal visible={sniModalVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>SNI Hostname</Text>
                <Text style={styles.modalDesc}>
                  Enter a hostname to use for SNI tunneling. This helps bypass network restrictions.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempSniHostname}
                  onChangeText={setTempSniHostname}
                  placeholder="e.g., cloudflare.com"
                  placeholderTextColor={Colors.textMuted}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setSniModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSniSave}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )
      ) : (
        sniModalVisible && (
          <Modal visible={sniModalVisible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>SNI Hostname</Text>
                <Text style={styles.modalDesc}>
                  Enter a hostname to use for SNI tunneling. This helps bypass network restrictions.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={tempSniHostname}
                  onChangeText={setTempSniHostname}
                  placeholder="e.g., cloudflare.com"
                  placeholderTextColor={Colors.textMuted}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setSniModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSniSave}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )
      )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedProtocol: {
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
  },
  protocolContent: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  selectedProtocolText: {
    color: Colors.primary,
  },
  protocolDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sniContent: {
    flex: 1,
    marginLeft: 12,
  },
  sniTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  sniValue: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '500',
  },
  sniInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  sniInfoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  dnsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  dnsItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dnsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dnsValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  infoItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  saveButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
});