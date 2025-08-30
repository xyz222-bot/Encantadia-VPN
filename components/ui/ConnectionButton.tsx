import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';
import { ConnectionStatus } from '@/types/VPN';

interface ConnectionButtonProps {
  status: ConnectionStatus;
  onPress: () => void;
}

export default function ConnectionButton({ status, onPress }: ConnectionButtonProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (status === 'connecting' || status === 'disconnecting') {
      rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
      scale.value = withRepeat(withSpring(1.1), -1, true);
    } else {
      rotation.value = withTiming(0);
      scale.value = withSpring(1);
    }

    if (status === 'connected') {
      glowOpacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    } else {
      glowOpacity.value = withTiming(0);
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowOpacity.value, [0, 1], [0.3, 0.8]),
  }));

  const getButtonConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: Colors.success,
          icon: 'shield' as const,
          text: 'CONNECTED',
          subtext: 'Tap to disconnect'
        };
      case 'connecting':
        return {
          color: Colors.warning,
          icon: 'sync' as const,
          text: 'CONNECTING',
          subtext: 'Establishing secure tunnel...'
        };
      case 'disconnecting':
        return {
          color: Colors.warning,
          icon: 'sync' as const,
          text: 'DISCONNECTING',
          subtext: 'Closing connection...'
        };
      default:
        return {
          color: Colors.textMuted,
          icon: 'shield-outline' as const,
          text: 'DISCONNECTED',
          subtext: 'Tap to connect'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={status === 'connecting' || status === 'disconnecting'}
        activeOpacity={0.8}
      >
        {status === 'connected' && (
          <Animated.View style={[styles.glow, glowStyle, { backgroundColor: config.color }]} />
        )}
        
        <Animated.View style={[styles.innerButton, animatedStyle]}>
          <MaterialIcons name={config.icon} size={64} color={config.color} />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.statusText, { color: config.color }]}>
            {config.text}
          </Text>
          <Text style={styles.subtitleText}>
            {config.subtext}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
    blur: 20,
  },
  innerButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  textContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});