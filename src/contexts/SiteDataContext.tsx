import { createContext, useContext, useEffect, useState, useCallback, type FC, type ReactNode } from 'react';
import type { SiteData } from '../types';
import { settingsService } from '../services/settings.service';
import { heroService } from '../services/hero.service';
import { roomsService } from '../services/rooms.service';
import { amenitiesService } from '../services/amenities.service';
import { locationService } from '../services/location.service';
import { contactService } from '../services/contact.service';

interface SiteDataState {
  data: SiteData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataState | undefined>(undefined);

export const SiteDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [settings, hero, rooms, amenities, location, attractions, contact] =
        await Promise.all([
          settingsService.getAll(),
          heroService.get(),
          roomsService.getAll(),
          amenitiesService.getAll(),
          locationService.get(),
          locationService.getAttractions(),
          contactService.getAll(),
        ]);

      setData({ settings, hero, rooms, amenities, location, attractions, contact });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu';
      setError(msg);
      console.error('SiteData fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <SiteDataContext.Provider value={{ data, loading, error, refetch: fetchAll }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
};
