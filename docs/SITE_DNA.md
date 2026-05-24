# 🧬 ThaiNguyen Stay — Site DNA

> Tài liệu định nghĩa bản sắc thương hiệu và hệ thống thiết kế cho toàn bộ dự án.
> Mọi quyết định thiết kế & phát triển phải tuân thủ tài liệu này.

---

## 1. Brand Identity

### Tên thương hiệu
- **Tên chính**: ThaiNguyen Stay
- **Logo text**: `H` (icon letter, gradient background) + `ThaiNguyen` (bold) + `Stay` (accent color)
- **Tagline**: "Homestay Đẳng Cấp Thái Nguyên"

### Tầm nhìn
Trở thành homestay hàng đầu tại Thái Nguyên, kết hợp giữa thiên nhiên yên bình và tiện nghi hiện đại.

### Giá trị cốt lõi
| Giá trị | Mô tả | Thể hiện qua |
|---------|--------|---------------|
| **Comfort** (Tiện nghi) | Không gian ấm cúng, đầy đủ tiện nghi | Phòng ốc, tiện ích |
| **Nature** (Thiên nhiên) | Gắn kết với thiên nhiên Thái Nguyên | Màu emerald, hình ảnh |
| **Tradition** (Truyền thống) | Giữ gìn nét đẹp văn hóa địa phương | Typography serif, nội dung |
| **Modern** (Hiện đại) | Công nghệ & dịch vụ hiện đại | UI/UX, chatbot, đặt phòng online |
| **Hospitality** (Tận tâm) | Dịch vụ chăm sóc tận tình | 24/7 support, chatbot |

### Đối tượng mục tiêu
- Du khách nội địa (gia đình, cặp đôi, nhóm bạn)
- Khách công tác tại Thái Nguyên
- Du khách quốc tế khám phá vùng núi phía Bắc
- Độ tuổi: 25-55

### Giọng điệu (Tone of Voice)
- **Ấm áp & chuyên nghiệp**: Không quá trang trọng, không quá thân mật
- **Gợi cảm xúc**: Dùng từ ngữ tạo hình ảnh (yên bình, đẳng cấp, trải nghiệm)
- **Ngắn gọn & rõ ràng**: Heading 2-4 từ, mô tả 1-2 câu
- **Ngôn ngữ chính**: Tiếng Việt

---

## 2. Color Palette

### Primary — Emerald (Thiên nhiên, yên bình)
| Token | Tailwind | Hex | Sử dụng |
|-------|----------|-----|---------|
| `emerald-950` | `bg-emerald-950` | `#022c22` | Background chính (dark sections), navbar, footer |
| `emerald-900` | `bg-emerald-900` | `#064e3b` | Background dark secondary |
| `emerald-800` | `bg-emerald-800` | `#065f46` | Hover states on dark bg |
| `emerald-600` | `bg-emerald-600` | `#059669` | CTA buttons, links |
| `emerald-400` | `text-emerald-400` | `#34d399` | Text accent on dark bg |
| `emerald-200` | `text-emerald-200` | `#a7f3d0` | Subtitle text on dark bg |

### Accent — Amber (Ấm áp, sang trọng)
| Token | Tailwind | Hex | Sử dụng |
|-------|----------|-----|---------|
| `amber-600` | `bg-amber-600` | `#d97706` | Primary accent, price badges |
| `amber-500` | `bg-amber-500` | `#f59e0b` | CTA highlight, scrollbar, hover |
| `amber-400` | `text-amber-400` | `#fbbf24` | Text accent, border hover, icons |

### Neutral — Stone (Nền sáng, tinh tế)
| Token | Tailwind | Hex | Sử dụng |
|-------|----------|-----|---------|
| `stone-100` | `bg-stone-100` | `#f5f5f4` | Light section backgrounds |
| `stone-200` | `bg-stone-200` | `#e7e5e3` | Gradient ends |
| `stone-600` | `text-stone-600` | `#57534e` | Body text on light bg |

### Semantic Colors
| Mục đích | Color | Class |
|----------|-------|-------|
| Success | Green | `text-green-500` |
| Error | Red | `text-red-500` |
| Warning | Amber | `text-amber-500` |
| Info | Blue | `text-blue-500` |

### Gradient Patterns
```css
/* Hero overlay */
bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-950/40

/* CTA button */
bg-gradient-to-r from-amber-500 to-amber-600

/* Icon container */
bg-gradient-to-br from-amber-400 to-amber-600

/* Light section bg */
bg-gradient-to-b from-stone-100 to-stone-200
```

---

## 3. Typography

### Font Stack
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
```

| Loại | Font | Weights | Sử dụng |
|------|------|---------|---------|
| **Heading** | Playfair Display | 400, 500, 600, **700** | h1-h6, brand name, section titles |
| **Body** | Inter | 300, 400, **500**, 600, 700 | Paragraphs, labels, buttons, UI text |

### Type Scale
| Element | Size (mobile) | Size (desktop) | Weight | Font |
|---------|---------------|----------------|--------|------|
| h1 (Hero) | `text-4xl` | `text-6xl / text-7xl` | 700 | Playfair Display |
| h2 (Section) | `text-3xl` | `text-4xl / text-5xl` | 700 | Playfair Display |
| h3 (Card) | `text-xl` | `text-2xl` | 600-700 | Playfair Display |
| Subtitle | `text-sm` | `text-sm` | 600 | Inter, uppercase, tracking-wider |
| Body | `text-base` | `text-lg` | 400 | Inter |
| Small | `text-sm` | `text-sm` | 400-500 | Inter |
| Caption | `text-xs` | `text-xs` | 500 | Inter |

---

## 4. Design Patterns

### 4.1 Glassmorphism (Dark backgrounds)
```
bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl
hover:border-amber-400/30 transition-all duration-300
```

### 4.2 Card Style (Light backgrounds)
```
bg-white rounded-3xl shadow-lg overflow-hidden
hover:-translate-y-2 transition-all duration-300
```

### 4.3 Section Layout
```
section: py-20 lg:py-24
container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
header spacing: mb-16, text-center
```

### 4.4 Section Header Pattern
```
[subtitle]  → text-amber-500 uppercase tracking-wider text-sm font-semibold
[title]     → text-4xl lg:text-5xl font-bold mt-3 (emerald-950 or white)
[desc]      → mt-4 max-w-2xl mx-auto text-stone-600 or text-emerald-200
```

### 4.5 Button Styles
| Variant | Classes |
|---------|---------|
| Primary (Amber) | `bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full px-8 py-3 font-semibold hover:scale-105 shadow-lg` |
| Primary (Emerald) | `bg-emerald-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-emerald-700` |
| Outlined (White) | `border-2 border-white/30 text-white rounded-full px-8 py-3 hover:bg-white/10` |
| Outlined (Emerald) | `border-2 border-emerald-600 text-emerald-600 rounded-full px-8 py-3 hover:bg-emerald-50` |

### 4.6 Icon Containers
```
/* Gradient icon box */
bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl p-4 shadow-lg

/* Icon size */
w-6 h-6 (small) | w-8 h-8 (medium) | w-12 h-12 (large)
```

### 4.7 Decorative Elements
- **Blur circles**: `absolute rounded-full blur-3xl opacity-20 bg-amber-500` (positioned off-center)
- **SVG patterns**: Cross pattern overlay at 5% opacity on dark backgrounds
- **Gradient overlays**: On hero images, gradient from emerald-950 with varying opacity

---

## 5. Animation Standards

### Framer Motion Variants
```typescript
// Fade in from bottom
fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// Stagger children
staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

// Scale in
scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}
```

### Animation Rules
- **Duration**: 0.3s - 0.6s (never > 1s)
- **Scroll trigger**: `whileInView` with `viewport={{ once: true }}`
- **Hover**: `scale-105` or `scale-110` on images, `-translate-y-1` or `-translate-y-2` on cards
- **Transitions**: `transition-all duration-300` for CSS transitions
- **Accessibility**: Respect `prefers-reduced-motion`

---

## 6. Layout Grid

### Breakpoints
| Breakpoint | Min width | Typical layout |
|------------|-----------|----------------|
| Default | 0px | 1 column, stacked |
| `sm` | 640px | Minor adjustments |
| `md` | 768px | 2 columns |
| `lg` | 1024px | 3-4 columns, desktop nav |
| `xl` | 1280px | Max content width |

### Grid Patterns
| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Rooms | 1 col | 2 cols | 3 cols |
| Amenities | 1 col | 2 cols | 4 cols |
| Attractions | 1 col | 2 cols | 2 cols |
| Footer | 1 col | 2 cols | 4 cols |
| Stats | hidden | 2x2 grid | 2x2 grid |

---

## 7. Image Standards

### Specifications
| Loại | Định dạng | Kích thước tối thiểu | Tỷ lệ | Max file size |
|------|-----------|---------------------|--------|---------------|
| Hero background | JPG/WebP | 1920x1080 | 16:9 | 500KB |
| Room photo | JPG/WebP | 800x600 | 4:3 | 300KB |
| Logo | SVG/PNG | 200x200 | 1:1 | 100KB |
| QR Code | PNG | 400x400 | 1:1 | 500KB |
| General upload | JPG/PNG/WebP | 400px min width | Free | 5MB |

### Image Treatment
- **Hero**: Full-width background with gradient overlay
- **Room cards**: `object-cover` with hover zoom (`group-hover:scale-110`)
- **Icons**: lucide-react SVG icons, không dùng image icons

---

## 8. Content Guidelines

### Formatting
| Element | Quy tắc | Ví dụ |
|---------|---------|-------|
| Giá tiền | Dấu chấm phân cách nghìn + `đ` | `800.000đ` |
| Số điện thoại | `0xxx.xxx.xxx` | `0912.345.678` |
| Diện tích | Số + `m²` | `35m²` |
| Khoảng cách | Số + `km` | `15km` |
| Thời gian | Số + `phút/giờ` | `25 phút` |

### Writing Style
- **Headings**: Ngắn gọn, có sức gợi (2-4 từ)
  - ✅ "Trải nghiệm Đẳng Cấp"
  - ❌ "Chào mừng bạn đến với homestay của chúng tôi tại Thái Nguyên"
- **Descriptions**: 1-2 câu, gợi cảm xúc
- **CTAs**: Hành động rõ ràng
  - ✅ "Đặt phòng ngay", "Xem phòng", "Liên hệ ngay"
  - ❌ "Click vào đây", "Xem thêm"

---

## 9. Component Library Reference

### Navigation
- Fixed top, `bg-emerald-950/90 backdrop-blur-md`
- Logo left, nav links center, CTA right
- Mobile: hamburger menu with AnimatePresence overlay

### Dark Sections (Hero, Amenities, Contact, Footer)
- Background: `emerald-950` hoặc gradient
- Text: white/emerald-200/emerald-400
- Accents: amber-400/amber-500
- Cards: glassmorphism

### Light Sections (Rooms, Location)
- Background: `stone-100` gradient
- Text: emerald-950/stone-600
- Cards: white with shadow
- Accents: emerald-600/amber-500

---

*Cập nhật lần cuối: 2026-05-24*
*Version: 1.0.0*
