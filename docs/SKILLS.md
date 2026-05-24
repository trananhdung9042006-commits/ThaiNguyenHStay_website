# 🛠️ ThaiNguyen Stay — Skills & Patterns

> Cookbook tổng hợp các code patterns tái sử dụng cho dự án.
> Copy-paste và adapt cho từng trường hợp cụ thể.

---

## 1. Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

---

## 2. Authentication Pattern

### Auth Context
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Protected Route
```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};
```

---

## 3. Data Fetching Patterns

### Service Layer Pattern
```typescript
// src/services/rooms.service.ts
import { supabase } from '../lib/supabase';
import type { Room } from '../types';

export const roomsService = {
  // Public: fetch active rooms
  async getAll(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  // Admin: fetch all rooms (including inactive)
  async getAllAdmin(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  // Create
  async create(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .insert(room)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Update
  async update(id: string, updates: Partial<Room>): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Delete
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
```

### Custom Hook Pattern
```typescript
// src/hooks/useRooms.ts
import { useState, useEffect, useCallback } from 'react';
import { roomsService } from '../services/rooms.service';
import type { Room } from '../types';

export const useRooms = (adminMode = false) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = adminMode
        ? await roomsService.getAllAdmin()
        : await roomsService.getAll();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setLoading(false);
    }
  }, [adminMode]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
};
```

### Site Data Context Pattern
```typescript
// src/contexts/SiteDataContext.tsx
import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from 'react';
import type { SiteData } from '../types';
// ... import services

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

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [settings, hero, rooms, amenities, location, attractions, contact] =
        await Promise.all([
          settingsService.getAll(),
          heroService.get(),
          roomsService.getAll(),
          amenitiesService.getAll(),
          locationService.get(),
          attractionsService.getAll(),
          contactService.getAll(),
        ]);

      setData({ settings, hero, rooms, amenities, location, attractions, contact });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <SiteDataContext.Provider value={{ data, loading, error, refetch: fetchAll }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) throw new Error('useSiteData must be used within SiteDataProvider');
  return context;
};
```

---

## 4. Image Upload Pattern

```typescript
// src/services/upload.service.ts
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

const BUCKET = 'images';
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadService = {
  async upload(file: File, folder: string): Promise<string> {
    // Validate
    if (!file.type.startsWith('image/')) {
      throw new Error('Chỉ chấp nhận file hình ảnh');
    }
    if (file.size > MAX_SIZE) {
      throw new Error('File quá lớn (tối đa 5MB)');
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${ext}`;

    // Upload
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) throw new Error(error.message);

    // Get public URL
    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async delete(url: string): Promise<void> {
    // Extract path from URL
    const path = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
    if (!path) return;

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(error.message);
  },
};
```

### ImageUploader Component
```tsx
// src/admin/components/ImageUploader.tsx
import { useState, useRef, type FC } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../../services/upload.service';

interface ImageUploaderProps {
  currentUrl?: string;
  folder: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  currentUrl, folder, onUpload, onRemove
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      const url = await uploadService.upload(file, folder);
      onUpload(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
        transition-colors duration-200
        ${dragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-300 hover:border-emerald-400'}
        ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
    >
      {currentUrl ? (
        <div className="relative">
          <img src={currentUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <>
          <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">Kéo thả hoặc click để chọn ảnh</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Tối đa 5MB</p>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
};
```

---

## 5. UI Component Patterns

### Section Wrapper
```tsx
// src/components/ui/Section.tsx
import { type FC, type ReactNode } from 'react';

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

const Section: FC<SectionProps> = ({ id, className = '', children }) => (
  <section id={id} className={`py-20 lg:py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

export default Section;
```

### Section Header
```tsx
// src/components/ui/SectionHeader.tsx
import { motion } from 'framer-motion';
import { type FC } from 'react';

interface SectionHeaderProps {
  subtitle: string;
  title: string;
  description?: string;
  light?: boolean; // true for dark backgrounds
}

const SectionHeader: FC<SectionHeaderProps> = ({
  subtitle, title, description, light = false
}) => (
  <motion.div
    className="text-center mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <span className="text-amber-500 uppercase tracking-wider text-sm font-semibold">
      {subtitle}
    </span>
    <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-bold mt-3
      ${light ? 'text-white' : 'text-emerald-950'}`}>
      {title}
    </h2>
    {description && (
      <p className={`mt-4 text-lg max-w-2xl mx-auto
        ${light ? 'text-emerald-200' : 'text-stone-600'}`}>
        {description}
      </p>
    )}
  </motion.div>
);

export default SectionHeader;
```

### Button Variants
```tsx
// src/components/ui/Button.tsx
import { type FC, type ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:scale-105 shadow-lg',
  secondary: 'bg-emerald-600 text-white hover:bg-emerald-700',
  outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
  ghost: 'text-emerald-600 hover:bg-emerald-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button: FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, children, className = '', ...props
}) => (
  <button
    className={`rounded-full font-semibold transition-all duration-300
      ${variants[variant]} ${sizes[size]}
      ${loading ? 'opacity-70 cursor-not-allowed' : ''}
      ${className}`}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? 'Đang xử lý...' : children}
  </button>
);

export default Button;
```

### Glass Card
```tsx
// src/components/ui/GlassCard.tsx
import { motion } from 'framer-motion';
import { type FC, type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: FC<GlassCardProps> = ({ children, className = '', hover = true }) => (
  <motion.div
    className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6
      ${hover ? 'hover:border-amber-400/30' : ''} transition-all duration-300
      ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default GlassCard;
```

---

## 6. Animation Variants Library

```typescript
// src/lib/animations.ts

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export const defaultTransition = { duration: 0.6, ease: 'easeOut' };

// Usage:
// <motion.div
//   variants={fadeInUp}
//   initial="initial"
//   whileInView="animate"
//   viewport={{ once: true }}
//   transition={defaultTransition}
// >
```

---

## 7. Toast Notification Pattern

```tsx
// src/contexts/ToastContext.tsx
import { createContext, useContext, useState, useCallback, type FC, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    // Auto-remove after 4s
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium
              animate-slide-in-right flex items-center gap-2
              ${toast.type === 'success' ? 'bg-emerald-600' : ''}
              ${toast.type === 'error' ? 'bg-red-500' : ''}
              ${toast.type === 'warning' ? 'bg-amber-500' : ''}
              ${toast.type === 'info' ? 'bg-blue-500' : ''}`}
          >
            {toast.message}
            <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

// Usage in admin:
// const { addToast } = useToast();
// addToast('success', 'Đã lưu thành công!');
// addToast('error', 'Lỗi khi lưu dữ liệu');
```

---

## 8. Admin Form Pattern

```tsx
// Standard pattern for admin edit forms
import { useState, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import ImageUploader from '../components/ImageUploader';

const AdminEditPage = () => {
  const { addToast } = useToast();
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current data
  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await service.get();
        setData(result);
      } catch (err) {
        addToast('error', 'Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      await service.update(data);
      addToast('success', 'Đã lưu thành công!');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Lỗi khi lưu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tiêu đề trang</h1>
        <Button onClick={handleSave} loading={saving}>
          Lưu thay đổi
        </Button>
      </div>

      {/* Form fields */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <FormField label="Tiêu đề" value={data.title}
          onChange={(v) => setData(prev => ({ ...prev, title: v }))} />
        {/* ... more fields */}
      </div>
    </div>
  );
};
```

---

## 9. Chatbot AI Provider Abstraction

```typescript
// Flexible AI provider pattern — supports any OpenAI-compatible API
interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIProviderConfig {
  provider: 'openai' | 'gemini' | 'anthropic' | 'groq' | 'custom';
  apiKey: string;
  endpoint?: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

// Provider-specific endpoint mapping
const PROVIDER_ENDPOINTS: Record<string, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
};

// Provider-specific model options
const PROVIDER_MODELS: Record<string, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  gemini: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
  anthropic: ['claude-sonnet-4-20250514', 'claude-3.5-haiku'],
  groq: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
  custom: [], // User defines
};

async function callAI(
  messages: ChatCompletionMessage[],
  config: AIProviderConfig
): Promise<string> {
  const endpoint = config.endpoint || PROVIDER_ENDPOINTS[config.provider];
  if (!endpoint) throw new Error(`Unknown provider: ${config.provider}`);

  // Most providers support OpenAI-compatible format
  if (config.provider !== 'anthropic') {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Anthropic has different format
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: messages.find(m => m.role === 'system')?.content,
      messages: messages.filter(m => m.role !== 'system'),
    }),
  });

  const data = await response.json();
  return data.content[0].text;
}
```

---

## 10. Admin Data Table Pattern

```tsx
// src/admin/components/DataTable.tsx
import { useState, type FC } from 'react';
import { Pencil, Trash2, GripVertical, ToggleLeft, ToggleRight } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onToggle?: (id: string, active: boolean) => void;
  loading?: boolean;
  emptyMessage?: string;
}

function DataTable<T extends { id: string; is_active?: boolean }>({
  columns, data, onEdit, onDelete, onToggle, loading, emptyMessage = 'Chưa có dữ liệu'
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3 text-sm">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {onToggle && (
                    <button
                      onClick={() => onToggle(row.id, !row.is_active)}
                      className={row.is_active ? 'text-emerald-500' : 'text-gray-300'}
                    >
                      {row.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="text-blue-500 hover:text-blue-700">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
```

---

## 11. Responsive Breakpoint Reference

```tsx
// Mobile first — default styles are for mobile

// sm (640px) — Small tablets
className="sm:grid-cols-2"

// md (768px) — Tablets
className="md:grid-cols-2 md:text-lg"

// lg (1024px) — Desktop
className="lg:grid-cols-3 lg:py-24"

// xl (1280px) — Wide desktop
className="xl:grid-cols-4 xl:text-5xl"

// Common responsive grid patterns:
// Rooms:     grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
// Amenities: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
// Footer:    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
// Stats:     grid grid-cols-2 gap-4 (hidden on mobile)
```

---

## 12. Error Boundary

```tsx
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
            <p className="text-gray-500 mb-4">Vui lòng tải lại trang</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
            >
              Tải lại
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

*Cập nhật lần cuối: 2026-05-24*
*Version: 1.0.0*
