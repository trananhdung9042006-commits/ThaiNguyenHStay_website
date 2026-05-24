# 📐 ThaiNguyen Stay — Development Rules

> Bộ quy tắc phát triển bắt buộc cho toàn bộ dự án.
> Mọi code mới phải tuân thủ các quy tắc này.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 19.x |
| **Build** | Vite | 7.x |
| **Styling** | TailwindCSS | 4.x |
| **Animation** | Framer Motion | 12.x |
| **Icons** | lucide-react | latest |
| **Routing** | react-router-dom | 7.x |
| **Backend** | Supabase | — |
| **Database** | PostgreSQL (via Supabase) | — |
| **Auth** | Supabase Auth | — |
| **Storage** | Supabase Storage | — |
| **Edge Functions** | Supabase Edge Functions (Deno) | — |

---

## 1. Project Structure

```
ThaiNguyenHStay_website/
│
├── docs/                            # Tài liệu dự án
│   ├── SITE_DNA.md                  # Brand identity & design system
│   ├── DEVELOPMENT_RULES.md         # Quy tắc phát triển (file này)
│   ├── SITE_STRUCTURE.md            # Kiến trúc & database schema
│   └── SKILLS.md                    # Code patterns & snippets
│
├── public/                          # Static assets
│   ├── images/                      # Ảnh tĩnh
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                     # Entry point, Router setup
│   ├── App.tsx                      # Root component
│   ├── index.css                    # Global styles & Tailwind imports
│   │
│   ├── types/                       # TypeScript type definitions
│   │   ├── index.ts                 # All shared types & interfaces
│   │   └── database.types.ts        # Supabase generated types
│   │
│   ├── lib/                         # Core utilities
│   │   ├── supabase.ts              # Supabase client singleton
│   │   ├── constants.ts             # App-wide constants
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── services/                    # Data access layer (Supabase calls)
│   │   ├── settings.service.ts      # Site settings queries
│   │   ├── rooms.service.ts         # Rooms CRUD
│   │   ├── amenities.service.ts     # Amenities CRUD
│   │   ├── location.service.ts      # Location queries
│   │   ├── contact.service.ts       # Contact info queries
│   │   ├── chatbot.service.ts       # Chatbot logic
│   │   └── upload.service.ts        # File upload
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useSiteData.ts           # Fetch all public site data
│   │   ├── useAuth.ts               # Authentication hook
│   │   └── useToast.ts              # Toast notifications
│   │
│   ├── contexts/                    # React Contexts
│   │   ├── SiteDataContext.tsx       # Public site data provider
│   │   ├── AuthContext.tsx           # Auth state provider
│   │   └── ToastContext.tsx          # Toast notification provider
│   │
│   ├── components/                  # Shared & public components
│   │   ├── ui/                      # Base UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Toast.tsx
│   │   ├── Navbar.tsx               # Public navbar
│   │   ├── Hero.tsx                 # Hero section
│   │   ├── Rooms.tsx                # Room listings
│   │   ├── Amenities.tsx            # Amenities grid
│   │   ├── Location.tsx             # Location & map
│   │   ├── Contact.tsx              # Contact & booking
│   │   ├── Footer.tsx               # Site footer
│   │   └── ChatWidget.tsx           # Chatbot floating widget
│   │
│   ├── pages/                       # Page-level components
│   │   └── HomePage.tsx             # Public homepage
│   │
│   └── admin/                       # Admin module (isolated)
│       ├── components/              # Admin-specific components
│       │   ├── AdminSidebar.tsx
│       │   ├── AdminHeader.tsx
│       │   ├── ImageUploader.tsx
│       │   ├── DataTable.tsx
│       │   └── FormField.tsx
│       ├── pages/                   # Admin pages
│       │   ├── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── HeroSettingsPage.tsx
│       │   ├── RoomsPage.tsx
│       │   ├── AmenitiesPage.tsx
│       │   ├── LocationPage.tsx
│       │   ├── ContactPage.tsx
│       │   ├── GeneralPage.tsx
│       │   └── ChatbotPage.tsx
│       ├── hooks/                   # Admin-specific hooks
│       │   ├── useAdminData.ts
│       │   └── useImageUpload.ts
│       └── AdminLayout.tsx          # Admin shell (sidebar + header + outlet)
│
├── supabase/                        # Supabase configuration
│   ├── migrations/                  # SQL migrations
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                     # Seed data
│   └── functions/                   # Edge Functions
│       └── chat/                    # Chatbot Edge Function
│           └── index.ts
│
├── .env.local                       # Environment variables (GIT IGNORED)
├── .env.example                     # Env template (committed)
├── .gitignore
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── eslint.config.js
```

---

## 2. Naming Conventions

### Files & Directories
| Loại | Convention | Ví dụ |
|------|-----------|-------|
| React Components | PascalCase | `RoomCard.tsx`, `AdminSidebar.tsx` |
| Hooks | camelCase, prefix `use` | `useRooms.ts`, `useAuth.ts` |
| Services | camelCase, suffix `.service` | `rooms.service.ts` |
| Types | camelCase | `index.ts`, `database.types.ts` |
| Utilities | camelCase | `formatPrice.ts`, `utils.ts` |
| Constants | camelCase | `constants.ts` |
| CSS | camelCase | `index.css` |
| SQL migrations | `NNN_description` | `001_initial_schema.sql` |
| Directories | camelCase | `components/`, `hooks/` |

### Code Identifiers
| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Components | PascalCase | `RoomCard`, `AdminSidebar` |
| Hooks | camelCase + `use` | `useRooms()`, `useAuth()` |
| Functions | camelCase | `fetchRooms()`, `formatPrice()` |
| Variables | camelCase | `roomList`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `Room`, `ChatMessage`, `AdminUser` |
| Enums | PascalCase | `UserRole`, `ChatProvider` |
| DB tables | snake_case | `chat_sessions`, `knowledge_base` |
| DB columns | snake_case | `created_at`, `is_active` |
| URL paths | kebab-case | `/admin/hero-settings` |

---

## 3. TypeScript Rules

```typescript
// ✅ DO: Typed props interface
interface RoomCardProps {
  room: Room;
  onBook?: (roomId: string) => void;
}

// ✅ DO: Const assertions
const PROVIDERS = ['openai', 'gemini', 'anthropic', 'custom'] as const;
type Provider = typeof PROVIDERS[number];

// ✅ DO: Generic hooks
const useSupabaseQuery = <T>(query: () => Promise<T>) => { ... };

// ❌ DON'T: Use `any`
const data: any = response; // FORBIDDEN

// ❌ DON'T: Untyped props
const Card = (props) => { ... }; // FORBIDDEN

// ✅ DO: Use `unknown` when type is uncertain
const parseResponse = (data: unknown): Room => { ... };
```

### Rules
- `strict: true` in tsconfig — no exceptions
- No `any` — use `unknown` or proper types
- All component props MUST have typed interface
- Export shared types from `src/types/index.ts`
- Use Supabase generated types for DB queries
- Prefer type inference for obvious types (no `const x: string = "hello"`)

---

## 4. React Component Rules

```tsx
// ✅ Standard component pattern
import { type FC } from 'react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

const MyComponent: FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default MyComponent;
```

### Rules
- **Functional components only** — no class components
- **One component per file** — file name = component name
- **Arrow function with FC type** or plain arrow function with explicit return type
- **Props destructuring** in function parameters
- **Key prop**: Always use database ID in lists, NEVER array index
- **Memoize** expensive components: `React.memo()`
- **Lazy load** admin routes: `React.lazy(() => import(...))`
- **Error boundaries** around major sections

---

## 5. State Management

| Scope | Solution | Khi nào dùng |
|-------|----------|-------------|
| **Local** | `useState` | Component-specific UI state |
| **Complex local** | `useReducer` | Form state, multi-field updates |
| **Global** | React Context | Site data, auth, toast |
| **Server** | Supabase Client | Database queries |
| **Realtime** | Supabase Realtime | Live content updates (optional) |

### Rules
- **NO Redux, Zustand, Jotai** — Context + hooks đủ cho project này
- Context chỉ cho data thực sự global (auth, site settings)
- Avoid prop drilling > 2 levels → use Context

---

## 6. Supabase Integration Rules

### Client Setup
```typescript
// src/lib/supabase.ts — SINGLE instance
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Rules
- **Single client instance** — import from `src/lib/supabase.ts`
- **Row Level Security (RLS)** on ALL tables — no exceptions
- **Never expose** `service_role` key in frontend
- **Supabase Auth** for admin login — email/password
- **Supabase Storage** for images — bucket `images` (public)
- **Edge Functions** for chatbot AI API calls (keeps API keys server-side)
- **Environment variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- All DB calls go through `src/services/` — never call Supabase directly from components

### Data Flow
```
Component → Hook → Service → Supabase Client → PostgreSQL
              ↕
           Context (cache)
```

---

## 7. Styling Rules

### TailwindCSS Only
- **NO inline styles** except dynamic values (`style={{ backgroundImage: url(...) }}`)
- **NO custom CSS classes** unless absolutely necessary
- **NO CSS-in-JS** libraries
- Follow Site DNA color palette strictly

### Standard Patterns
```tsx
// Section
<section className="py-20 lg:py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Card (light bg)
<div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:-translate-y-2 transition-all duration-300">

// Glass card (dark bg)
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-400/30 transition-all duration-300">

// Primary button
<button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full px-8 py-3 font-semibold hover:scale-105 transition-transform shadow-lg">
```

### Responsive Design
- **Mobile-first** approach
- Test all breakpoints: `sm`, `md`, `lg`, `xl`
- Navigation: hamburger on mobile, full on `lg`+
- Grids: 1 col → 2 cols → 3-4 cols

---

## 8. Animation Rules

- **Framer Motion only** for JS animations
- **CSS transitions** for hover effects (`transition-all duration-300`)
- **Duration**: 0.3s-0.6s max
- **Scroll animations**: `whileInView` with `viewport={{ once: true }}`
- **Stagger**: 0.1s between children
- **Accessibility**: Respect `prefers-reduced-motion`
- **Admin panel**: Minimal animations (clean, functional)

---

## 9. Security Rules

| Rule | Implementation |
|------|----------------|
| Admin routes protected | Supabase Auth + RLS policies |
| API keys server-side | Edge Functions for AI API calls |
| File upload validation | Type check (image/*), max 5MB |
| Input sanitization | Validate before save, escape before render |
| Environment variables | `.env.local` — NEVER commit |
| CORS | Supabase handles automatically |
| RLS on all tables | No public write except chat_sessions |

---

## 10. Error Handling

```tsx
// ✅ Standard error handling pattern
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('rooms').select('*');
    if (error) throw error;
    setRooms(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    console.error('Error fetching rooms:', err);
  } finally {
    setLoading(false);
  }
};
```

### Rules
- `try-catch` around ALL async operations
- User-friendly error messages in **Vietnamese**
- Toast notifications for admin CRUD results
- Fallback UI for failed data loads
- Loading states (skeleton/spinner) for all async renders
- `console.error` in development only

---

## 11. Git Rules

### Branch Strategy
```
main          ← Production-ready code
├── develop   ← Integration branch
├── feature/* ← New features (feature/admin-panel, feature/chatbot)
├── fix/*     ← Bug fixes (fix/hero-text, fix/room-price)
└── docs/*    ← Documentation (docs/site-dna)
```

### Commit Convention
```
feat: add room management CRUD
fix: correct hero text encoding issue
docs: add site DNA documentation
refactor: extract SectionHeader component
style: update button hover animation
chore: add supabase dependencies
```

### Rules
- **Conventional Commits** in English
- **No direct commits to `main`**
- Commit messages: `type: short description`
- Types: `feat`, `fix`, `docs`, `refactor`, `style`, `chore`, `test`
- Keep commits focused — one logical change per commit

---

## 12. Performance Rules

| Rule | Implementation |
|------|----------------|
| Code splitting | `React.lazy()` for admin routes |
| Image optimization | WebP preferred, lazy loading (`loading="lazy"`) |
| Bundle size | Monitor with `vite-bundle-analyzer` |
| Memoization | `React.memo`, `useMemo`, `useCallback` where needed |
| Debounce | 300ms for search inputs |
| Cache | Context caches public data, avoid redundant fetches |

---

## 13. Accessibility Rules

- All `<img>` tags MUST have `alt` text
- All `<button>` elements MUST have accessible labels
- Keyboard navigation support (Tab, Enter, Escape)
- Color contrast meets WCAG AA standard
- Focus indicators on all interactive elements
- `aria-label` on icon-only buttons
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`

---

## 14. Environment Variables

### `.env.example` (committed to git)
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### `.env.local` (NEVER committed)
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 15. Code Review Checklist

Before any PR merge, verify:
- [ ] TypeScript: no `any`, all props typed
- [ ] Follows naming conventions
- [ ] Responsive: tested all breakpoints
- [ ] Accessible: alt text, aria labels, keyboard nav
- [ ] Error handling: try-catch, loading states, fallback UI
- [ ] Styling: uses Tailwind only, follows Site DNA colors
- [ ] Security: no secrets in code, RLS policies in place
- [ ] Performance: lazy loading, memoization where needed
- [ ] Commits: conventional commit format

---

*Cập nhật lần cuối: 2026-05-24*
*Version: 1.0.0*
