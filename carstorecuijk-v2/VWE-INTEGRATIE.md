# VWE Integratie Plan voor Carstore Cuijk

## Overzicht
Koppeling tussen Carstore Cuijk website en VWE API voor automatische occasions import.

## Wat is VWE?
- **Vehicle Web Exchange** - Marktleider in Nederland voor autodata
- Biedt REST API voor voertuiggegevens
- Mogelijkheid om occasions te importeren/exporteren
- Real-time koppeling met RDW (kenteken gegevens)

## Benodigde API Credentials
Je hebt nodig van VWE:
1. **API Key** - Voor authenticatie
2. **Client ID** - Voor je kapperszaak account
3. **Endpoint URL** - Meestal: `https://api.vwe.nl/v1/` of `https://api.vwe.com/v2/`

## Stap 1: VWE API Configuratie

### 1.1 Aanmelden bij VWE
- Ga naar https://www.vwe.nl
- Vraag een "Developer" of "API" account aan
- Geef aan dat je een website koppeling wilt

### 1.2 API Keys verkrijgen
In het VWE Developers menu:
- Genereer een nieuwe API Key
- Noteer: API Key, Client ID, Secret
- Stel permissies in: "Occasions lezen", "Occasions schrijven"

## Stap 2: Carstore Website Uitbreiden

### 2.1 Data Model Uitbreiden
```typescript
// types/vwe.ts
interface VWEAuto {
  kenteken: string;
  merk: string;
  model: string;
  variant?: string;
  bouwjaar: number;
  prijs: number;
  kilometerstand: number;
  brandstof: string;
  transmissie: string;
  carrosserie: string;
  vweId: string; // Uniek VWE ID
  fotoUrls: string[];
  beschrijving: string;
  options: string[];
  apk: string;
  status: 'beschikbaar' | 'verkocht' | 'gereserveerd';
}
```

### 2.2 API Integratie Layer
```typescript
// lib/vwe-api.ts
export class VWEClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  // Haal alle occasions op van VWE
  async getOccasions(): Promise<VWEAuto[]> {
    const response = await fetch(`${this.baseUrl}/occasions`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
  
  // Publiceer nieuwe occasion naar VWE
  async publishOccasion(auto: VWEAuto): Promise<void> {
    await fetch(`${this.baseUrl}/occasions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(auto)
    });
  }
  
  // Haal details op via kenteken (RDW koppeling)
  async getVehicleByLicensePlate(kenteken: string): Promise<VWEAuto> {
    const response = await fetch(`${this.baseUrl}/vehicle/${kenteken}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }
}
```

### 2.3 Sync Systeem
```typescript
// lib/sync.ts
export async function syncVWEToWebsite() {
  const vwe = new VWEClient(process.env.VWE_API_KEY!, process.env.VWE_BASE_URL!);
  
  // 1. Haal alle occasions van VWE
  const vweOccasions = await vwe.getOccasions();
  
  // 2. Converteer naar website format
  const websiteOccasions = vweOccasions.map(convertVWEToWebsite);
  
  // 3. Update database / JSON bestand
  await updateCarsData(websiteOccasions);
  
  // 4. Rebuild website
  await rebuildWebsite();
}

function convertVWEToWebsite(vweAuto: VWEAuto): Car {
  return {
    id: vweAuto.vweId || generateId(),
    merk: vweAuto.merk,
    model: vweAuto.model,
    variant: vweAuto.variant || '',
    bouwjaar: vweAuto.bouwjaar,
    prijs: vweAuto.prijs,
    kilometerstand: vweAuto.kilometerstand,
    brandstof: vweAuto.brandstof,
    transmissie: vweAuto.transmissie,
    carrosserie: vweAuto.carrosserie,
    afbeeldingen: vweAuto.fotoUrls || ['/cars/placeholder.svg'],
    status: vweAuto.status || 'beschikbaar',
    apk: vweAuto.apk,
    features: vweAuto.options || [],
    beschrijving: vweAuto.beschrijving || '',
    kenteken: vweAuto.kenteken
  };
}
```

## Stap 3: Automatisering

### 3.1 Webhook (Real-time)
VWE kan webhooks sturen wanneer er een occasion wordt toegevoegd/gewijzigd:

```typescript
// app/api/vwe/webhook/route.ts
export async function POST(request: Request) {
  const payload = await request.json();
  
  // Verifiëer VWE signature
  const signature = request.headers.get('x-vwe-signature');
  if (!verifySignature(payload, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Verwerk de wijziging
  switch (payload.event) {
    case 'occasion.created':
      await addOccasion(payload.data);
      break;
    case 'occasion.updated':
      await updateOccasion(payload.data);
      break;
    case 'occasion.deleted':
      await deleteOccasion(payload.data.id);
      break;
  }
  
  // Rebuild website
  await rebuildWebsite();
  
  return Response.json({ success: true });
}
```

### 3.2 Periodieke Sync (Fallback)
Als webhooks niet beschikbaar zijn:

```bash
# Cron job elke 5 minuten
*/5 * * * * cd /home/battletron/.openclaw/workspace/carstorecuijk-v2 && npm run sync:vwe
```

```json
// package.json
{
  "scripts": {
    "sync:vwe": "node scripts/sync-vwe.js",
    "build": "next build",
    "deploy": "npm run sync:vwe && npm run build"
  }
}
```

## Stap 4: Admin Panel (Optioneel)

Een eenvoudig admin panel om imports te beheren:

```typescript
// app/admin/page.tsx
export default function AdminPage() {
  return (
    <div className="p-8">
      <h1>VWE Admin</h1>
      
      {/* Handmatige sync knop */}
      <button onClick={syncNow}>
        Sync nu met VWE
      </button>
      
      {/* Laatste sync status */}
      <div>
        Laatste sync: {lastSyncTime}
        Aantal occasions: {occasionCount}
      </div>
      
      {/* Import log */}
      <div>
        <h2>Recente Imports</h2>
        {recentImports.map(auto => (
          <div key={auto.id}>
            {auto.merk} {auto.model} - {auto.prijs}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Stap 5: Fotos Koppelen

VWE biedt vaak foto hosting. Twee opties:

### Optie A: VWE Foto's direct gebruiken
```typescript
// Gebruik VWE foto URLs direct
afbeeldingen: vweAuto.fotoUrls.map(url => 
  url.replace('vwe-cdn.com', 'cdn.carstorecuijk.nl')
);
```

### Optie B: Foto's downloaden
```typescript
// Download foto's naar eigen server
async function downloadPhotos(urls: string[], kenteken: string) {
  const localUrls = [];
  for (const url of urls) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const filename = `${kenteken}-${Date.now()}.jpg`;
    await saveFile(`public/cars/${filename}`, buffer);
    localUrls.push(`/cars/${filename}`);
  }
  return localUrls;
}
```

## Technische Vereisten

### Environment Variables
```bash
# .env.local
VWE_API_KEY=your_api_key_here
VWE_CLIENT_ID=your_client_id
VWE_BASE_URL=https://api.vwe.nl/v1
VWE_WEBHOOK_SECRET=your_webhook_secret
```

### Dependencies
```bash
npm install node-cron node-fetch
```

## Implementatie Stappen

1. **VWE Account aanvragen** (jij)
   - Vraag API toegang aan bij VWE
   - Ontvang API key en documentatie

2. **API Configuratie** (ik)
   - VWE client implementeren
   - Webhook endpoint maken
   - Sync script schrijven

3. **Data Mapping** (samen)
   - Bepalen welke VWE velden → website
   - Prijzen en opties afstemmen

4. **Testen** (samen)
   - Test import met 1 occasion
   - Webhook testen
   - Foto's controleren

5. **Live Gang** (jij)
   - VWE dienst opzeggen bij huidige provider
   - Eigen koppeling activeren

## Schatting
- **API Implementatie**: 2-3 uur
- **Sync systeem**: 1-2 uur  
- **Webhook + Admin**: 1-2 uur
- **Testen & debug**: 1 uur

**Totaal**: ~5-8 uur werk

## ✅ Implementatie Status

De basis implementatie is KLAAR! Wat er al is:

- ✅ `src/lib/vwe-client.ts` - API client
- ✅ `src/lib/vwe-config.ts` - Configuratie
- ✅ `scripts/sync-vwe.ts` - Sync script
- ✅ `src/app/api/vwe/webhook/route.ts` - Webhook endpoint
- ✅ `src/app/api/vwe/sync/route.ts` - Sync API
- ✅ `src/app/api/vwe/status/route.ts` - Status API
- ✅ `src/app/admin/vwe/page.tsx` - Admin panel

## 🚀 Volgende Stap

1. **Vraag VWE API credentials aan** bij VWE Developers menu
2. **Vul je .env.local in** met de ontvangen keys
3. **Test de connectie** via `/admin/vwe`
4. **Start eerste sync** en controleer de resultaten

## 📞 Ondersteuning

Loop je vast met de VWE koppeling? Ik help je graag verder zodra je de API credentials hebt!

Wil je dat ik begin met de implementatie zodra je de VWE API credentials hebt?