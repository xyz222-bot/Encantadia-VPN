import { useContext } from 'react';
import { VPNContext } from '@/contexts/VPNContext';

export function useVPN() {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error('useVPN must be used within VPNProvider');
  }
  return context;
}