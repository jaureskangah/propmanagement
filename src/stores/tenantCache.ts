import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantCacheState {
  tenantId: string | null;
  tenantData: any | null;
  lastFetch: number | null;
  setTenantId: (id: string) => void;
  setTenantData: (data: any) => void;
  clearCache: () => void;
  isDataFresh: () => boolean;
}

export const useTenantCache = create<TenantCacheState>()(
  persist(
    (set, get) => ({
      tenantId: null,
      tenantData: null,
      lastFetch: null,
      
      setTenantId: (id: string) => {
        set({ tenantId: id });
      },
      
      setTenantData: (data: any) => {
        set({ 
          tenantData: data, 
          lastFetch: Date.now() 
        });
      },
      
      clearCache: () => {
        set({ 
          tenantId: null, 
          tenantData: null, 
          lastFetch: null 
        });
      },
      
      isDataFresh: () => {
        const { lastFetch } = get();
        if (!lastFetch) return false;
        // Data is fresh for 5 minutes
        return Date.now() - lastFetch < 5 * 60 * 1000;
      }
    }),
    {
      name: 'tenant-cache',
      partialize: (state) => ({
        tenantId: state.tenantId,
        tenantData: state.tenantData,
        lastFetch: state.lastFetch
      })
    }
  )
);