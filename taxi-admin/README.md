# TaxiBoek - Boekhoudsysteem voor Taxi Chauffeurs

Een complete SaaS oplossing voor taxi chauffeurs in Nederland om hun boekhouding te automatiseren.

## 🚀 Features

- ✅ **Automatische rit-import** van Uber en Bolt
- ✅ **Handmatige ritten** invoeren (cash & card)
- ✅ **Kostenbeheer** met bonnetjes
- ✅ **AI bonnetjes-verwerking** (OpenAI)
- ✅ **BTW rapportage** (per kwartaal)
- ✅ **Jaaroverzicht** voor belastingaangifte
- ✅ **Stripe abonnementen** (Free, Basic, Pro)
- ✅ **Mobiele app** (React Native)

## 🛠️ Tech Stack

**Backend:**
- Node.js + NestJS
- PostgreSQL + Prisma ORM
- Redis + BullMQ (queues)
- Stripe (betalingen)
- OpenAI (receipt OCR)

**Frontend:**
- Next.js 14
- Tailwind CSS
- React Query
- Zustand (state management)

**Mobile:**
- React Native + Expo

## 📦 Installatie

### 1. Clone repository
```bash
git clone <repository-url>
cd taxi-admin
```

### 2. Environment variables
```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your values
```

### 3. Met Docker (Aanbevolen)
```bash
docker-compose up -d
```

### 4. Handmatige installatie

**Database starten:**
```bash
docker-compose up postgres redis -d
```

**Backend:**
```bash
cd apps/api
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

**Mobile:**
```bash
cd apps/mobile
npm install
npx expo start
```

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/taxiboek
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=sk-...
```

## 📱 Default Users

Na seeding:
- **Admin:** admin@taxiboek.nl / admin123
- **Demo:** demo@taxiboek.nl / demo123

## 🧪 Testen

```bash
# Backend tests
cd apps/api
npm test

# E2E tests
npm run test:e2e
```

## 📄 API Documentatie

Wanneer de API draait:
- Swagger UI: http://localhost:3000/api/v1/docs

## 🚢 Deployment

### AWS (Elastic Beanstalk)
```bash
eb init -p docker taxiboek
eb create taxiboek-prod
```

### Vercel (Frontend)
```bash
cd apps/web
vercel --prod
```

## 📝 Licentie

MIT
