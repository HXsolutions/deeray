# Deeray E-Commerce Platform — Complete Architecture Plan

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript + Tailwind CSS + Shadcn/ui |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | Custom (credentials-only for /admin) — no customer accounts |
| **Payments** | Stripe + Cash on Delivery |
| **File Upload** | Uploadthing / local |
| **Email** | Resend |
| **Search** | Built-in PostgreSQL full-text search |
| **Admin Panel** | Next.js dashboard under `/admin` |
| **Deployment** | Vercel (+ Neon/Railway for DB) |

---

## 1. Database Schema (Prisma)

```prisma
// ==================== ADMIN ====================

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // hashed with bcrypt
  createdAt DateTime @default(now())
}

// ==================== PRODUCTS ====================

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  image       String?
  parentId    String?
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now())
}

model Product {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String
  brief         String?
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  brand         String?
  variants      ProductVariant[]
  images        ProductImage[]
  tags          Tag[]
  reviews       Review[]
  isFeatured    Boolean  @default(false)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ProductVariant {
  id           Int     @id @default(autoincrement())
  productId    String
  product      Product @relation(fields: [productId], references: [id])
  sku          String  @unique
  size         String?
  color        String?
  price        Decimal @db.Decimal(10, 2)
  comparePrice Decimal? @db.Decimal(10, 2)
  stock        Int     @default(0)
  isActive     Boolean @default(true)
  images       String[]
}

model ProductImage {
  id        Int     @id @default(autoincrement())
  productId String
  product   Product @relation(fields: [productId], references: [id])
  url       String
  alt       String?
  order     Int     @default(0)
}

model Tag {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  slug     String    @unique
  products Product[]
}

// ==================== INVENTORY ====================

model StockMovement {
  id        Int              @id @default(autoincrement())
  variantId Int
  variant   ProductVariant   @relation(fields: [variantId], references: [id])
  type      StockMovementType
  quantity  Int
  note      String?
  orderId   String?
  createdAt DateTime         @default(now())
}

enum StockMovementType { IN OUT ADJUSTMENT RETURN }

model LowStockAlert {
  id         Int       @id @default(autoincrement())
  variantId  Int
  variant    ProductVariant @relation(fields: [variantId], references: [id])
  threshold  Int       @default(5)
  notifiedAt DateTime?
  resolvedAt DateTime?
  createdAt  DateTime  @default(now())
}

// ==================== ORDERS (Guest Checkout) ====================

model Order {
  id              String        @id @default(cuid())
  orderNumber     String        @unique
  customerEmail   String
  customerName    String
  customerPhone   String?
  items           OrderItem[]
  shippingAddress Json          // full address stored as JSON
  subtotal        Decimal       @db.Decimal(10, 2)
  shippingCost    Decimal       @default(0) @db.Decimal(10, 2)
  tax             Decimal       @default(0) @db.Decimal(10, 2)
  discount        Decimal       @default(0) @db.Decimal(10, 2)
  total           Decimal       @db.Decimal(10, 2)
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentMethod   String?
  paymentId       String?
  trackingNumber  String?
  courierId       String?
  notes           String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum OrderStatus { PENDING CONFIRMED PROCESSING SHIPPED DELIVERED CANCELLED RETURNED REFUNDED }
enum PaymentStatus { UNPAID PAID REFUNDED PARTIALLY_REFUNDED FAILED }

model OrderItem {
  id         Int            @id @default(autoincrement())
  orderId    String
  order      Order          @relation(fields: [orderId], references: [id])
  productId  String
  product    Product        @relation(fields: [productId], references: [id])
  variantId  Int
  variant    ProductVariant @relation(fields: [variantId], references: [id])
  name       String
  sku        String
  price      Decimal        @db.Decimal(10, 2)
  quantity   Int
  image      String?
}

// =================== REVIEWS ====================

model Review {
  id         Int      @id @default(autoincrement())
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  customerName  String
  customerEmail String
  rating     Int
  title      String?
  comment    String?
  isApproved Boolean @default(false)
  createdAt  DateTime @default(now())
}

// =================== AGENTS / COURIERS ====================

model CourierAgent {
  id        String  @id @default(cuid())
  name      String
  company   String
  apiKey    String?
  endpoint  String?
  isActive  Boolean @default(true)
  orders    Order[]
  createdAt DateTime @default(now())
}

// =================== MARKETING ====================

model Coupon {
  id        String     @id @default(cuid())
  code      String     @unique
  type      CouponType
  value     Decimal    @db.Decimal(10, 2)
  minOrder  Decimal?   @db.Decimal(10, 2)
  maxUsage  Int?
  usedCount Int        @default(0)
  startsAt  DateTime
  expiresAt DateTime
  isActive  Boolean    @default(true)
  createdAt DateTime   @default(now())
}

enum CouponType { PERCENTAGE FIXED FREE_SHIPPING }

model BlogPost {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  excerpt   String?
  content   String   @db.Text
  image     String?
  author    String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 2. Project Structure

```
deeray/
├── src/
│   ├── app/
│   │   ├── (store)/                  # Store (guest, no auth needed)
│   │   │   ├── page.tsx              # Homepage (current design)
│   │   │   ├── collections/
│   │   │   │   └── [slug]/page.tsx   # Category page
│   │   │   ├── products/
│   │   │   │   └── [slug]/page.tsx   # Product detail
│   │   │   ├── cart/page.tsx         # Cart (cookie-based)
│   │   │   ├── checkout/
│   │   │   │   ├── page.tsx          # Checkout form
│   │   │   │   └── confirmation/page.tsx
│   │   │   ├── order-tracking/
│   │   │   │   └── [orderNumber]/page.tsx  # Guest tracking
│   │   │   ├── blog/
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── search/page.tsx
│   │   │
│   │   ├── admin/                    # Admin Panel (login required)
│   │   │   ├── login/page.tsx        # Admin login
│   │   │   ├── layout.tsx            # Protected layout
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── inventory/
│   │   │   │   ├── page.tsx
│   │   │   │   └── movements/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── coupons/page.tsx
│   │   │   ├── agents/page.tsx
│   │   │   ├── reviews/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   └── settings/page.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── admin/            # Admin login/logout
│   │       ├── products/
│   │       ├── categories/
│   │       ├── cart/                  # Guest cart (cookies)
│   │       ├── orders/
│   │       ├── checkout/
│   │       │   ├── place/route.ts
│   │       │   └── webhook/route.ts
│   │       ├── tracking/[number]/route.ts
│   │       ├── reviews/
│   │       ├── coupons/validate/route.ts
│   │       └── admin/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── store/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCarousel.tsx
│   │   │   └── CartDrawer.tsx
│   │   └── admin/
│   │       ├── DataTable.tsx
│   │       ├── StatsCard.tsx
│   │       └── StockBadge.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts                # Admin session (iron-session / JWT)
│   │   ├── cart.ts                # Guest cart helpers (cookies)
│   │   ├── utils.ts
│   │   └── validations.ts
│   │
│   └── types/
│       └── index.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── components.json
├── tailwind.config.ts
├── next.config.js
├── package.json
└── .env.local
```

---

## 3. Implementation Phases

### Phase 1 — Foundation
- [ ] Next.js + TypeScript + Tailwind setup
- [ ] Prisma schema + PostgreSQL
- [ ] Admin model + seed (one default admin)
- [ ] Admin login page + session (iron-session)
- [ ] Existing homepage migrated to Next.js
- [ ] Header/Footer as components

### Phase 2 — Store Frontend
- [ ] Product listing (categories, filters, search)
- [ ] Product detail (variants, image gallery)
- [ ] Guest cart (cookie-based, persisted)
- [ ] Checkout form (name, email, phone, address)
- [ ] Stripe + COD payment
- [ ] Order confirmation page
- [ ] Order tracking by order number + email

### Phase 3 — Admin Panel
- [ ] Dashboard (sales chart, recent orders, low stock)
- [ ] Product CRUD (with variants, images)
- [ ] Order management (view, update status)
- [ ] Category management
- [ ] Review moderation
- [ ] Blog CRUD

### Phase 4 — Inventory & Stock
- [ ] Stock tracking per variant
- [ ] Stock movement log
- [ ] Low-stock alerts
- [ ] Bulk stock CSV import/export

### Phase 5 — Courier Integrations
- [ ] Courier agent CRUD (TCS, Leopards, Trax, etc.)
- [ ] API config per agent
- [ ] Tracking number assignment
- [ ] Customer tracking page

### Phase 6 — Marketing & Polish
- [ ] Coupon/promo codes
- [ ] Blog/Journal
- [ ] Reviews & ratings
- [ ] SEO (metadata, sitemap)
- [ ] Analytics (GA4 + FB Pixel)
- [ ] Deployment

---

## 4. Key Design Decisions

| Feature | Approach |
|---------|----------|
| **Cart** | Guest cart stored in cookies (encrypted) — no login needed |
| **Orders** | Tracked via order number + email — no account needed |
| **Admin Auth** | Simple credentials login with iron-session (no NextAuth) |
| **Payments** | Stripe (card) + Cash on Delivery |
| **Search** | PostgreSQL full-text search (no extra service) |
| **Reviews** | Submitted with name + email, no account needed |

---

## 5. Admin Panel Sections

- **Dashboard** — revenue chart, recent orders, low stock alerts
- **Products** — list, create, edit with variants & images
- **Orders** — list with filters, detail view, status workflow
- **Inventory** — stock levels, movements log, CSV import/export
- **Categories** — tree structure management
- **Coupons** — code generator, usage stats
- **Agents** — courier API configuration
- **Reviews** — approve/reject customer reviews
- **Blog** — rich text editor, SEO fields
- **Settings** — store info, tax, shipping zones, email templates

---

## 6. Courier Agent Integration

Standardized adapter pattern:

```typescript
interface CourierAdapter {
  name: string
  createShipment(order): Promise<{ trackingId: string; labelUrl: string }>
  trackShipment(trackingId: string): Promise<TrackingEvent[]>
  cancelShipment(trackingId: string): Promise<boolean>
  getRate(from, to, weight): Promise<number>
}
```

Supported: TCS, Leopards, Trax, M&P, PostEx, Call Courier

---

## 7. Stock Management

- Real-time deduction on confirmed orders
- 15-min hold during checkout (released if unpaid)
- Color-coded badges: Green (In Stock), Yellow (Low), Red (Out)
- Full movement audit trail

---

## 8. Security

- Admin routes protected by middleware (session check)
- Input validation with Zod
- Password hashing with bcrypt
- Stripe webhook signature verification
- Rate limiting on API routes
- HTTPS on Vercel

---

## 9. Order of Work

```
Phase 1: Foundation + Admin Login
Phase 2: Store Frontend (Products, Cart, Checkout, Payment)
Phase 3: Admin Panel (Dashboard, Products, Orders, Categories)
Phase 4: Inventory & Stock Management
Phase 5: Courier Integrations
Phase 6: Marketing (Coupons, Blog, Reviews, SEO) + Deployment
```

---

## Ready to start?

Plan updated with guest-only checkout, admin-only login. Approve karein to main **Phase 1** start kar doon.
