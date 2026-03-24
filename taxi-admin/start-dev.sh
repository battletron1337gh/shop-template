#!/bin/bash

# 🚕 TaxiBoek Test Script
# Dit script start alles voor lokaal testen ZONDER API keys

echo "🚀 TaxiBoek - Development Test Setup"
echo "====================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is niet actief. Start Docker eerst!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Stap 1: Database & Redis starten...${NC}"
docker-compose up -d postgres redis

# Wait for PostgreSQL
echo -e "${YELLOW}⏳ Wachten op PostgreSQL...${NC}"
sleep 5

# Check if DB is ready
until docker exec taxiboek-postgres pg_isready -U taxiboek > /dev/null 2>&1; do
    echo -e "${YELLOW}⏳ Database nog niet klaar, wachten...${NC}"
    sleep 2
done

echo -e "${GREEN}✅ Database is klaar!${NC}"

echo ""
echo -e "${YELLOW}📦 Stap 2: Backend dependencies installeren...${NC}"
cd apps/api
npm install

echo ""
echo -e "${YELLOW}📦 Stap 3: Database migreren...${NC}"
npx prisma migrate dev --name init

echo ""
echo -e "${YELLOW}📦 Stap 4: Test data laden...${NC}"
npx prisma db seed

echo ""
echo -e "${GREEN}✅ Setup compleet!${NC}"
echo ""
echo -e "${YELLOW}🚀 Start de backend:${NC}"
echo "   cd apps/api && npm run start:dev"
echo ""
echo -e "${YELLOW}🎨 Start de frontend (in nieuwe terminal):${NC}"
echo "   cd apps/web && npm install && npm run dev"
echo ""
echo -e "${GREEN}📱 Test accounts:${NC}"
echo "   Admin:  admin@taxiboek.nl / admin123"
echo "   Demo:   demo@taxiboek.nl / demo123"
echo ""
echo -e "${GREEN}🔗 URLs:${NC}"
echo "   API:    http://localhost:3000/api/v1"
echo "   Web:    http://localhost:3001"
echo "   API Docs: http://localhost:3000/api/v1/docs"
echo ""
echo -e "${YELLOW}⚠️  Let op: API keys zijn uitgeschakeld voor test${NC}"
echo -e "${YELLOW}    - Stripe werkt met mock subscriptions (gratis Pro)${NC}"
echo -e "${YELLOW}    - OpenAI geeft mock data voor bonnetjes${NC}"
echo -e "${YELLOW}    - Uber/Bolt zijn gemockt${NC}"
