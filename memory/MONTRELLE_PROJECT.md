# Montrelle Project Memory

**Datum:** 31 maart 2026  
**Status:** ✅ Compleet - Klaar voor Shopify import

---

## 📁 Project Bestanden

### Thema Bestanden
**Locatie:** `/home/battletron/.openclaw/workspace/dropship-store/dropship-theme/`

| Bestand | Doel |
|---------|------|
| `montrelle-theme.zip` | Shopify theme upload bestand (31KB) |
| `sections/hero.liquid` | Hero met video support |
| `sections/featured-collection.liquid` | Product grid met hover effects |
| `sections/universe.liquid` | About/brand story sectie |
| `sections/features.liquid` | Trust badges (shipping, payment, returns) |
| `sections/header.liquid` | Moderne header met blur effect |
| `sections/footer.liquid` | Donkere footer |
| `assets/noir-theme.css` | Complete styling |
| `templates/product.liquid` | Product detail pagina |
| `templates/collection.liquid` | Collectie pagina |

### Product Data
**Locatie:** `/home/battletron/.openclaw/workspace/dropship-store/dropship-theme/data/`

| Bestand | Doel |
|---------|------|
| `maison-fierce-products.csv` | 9 producten (5 femme, 4 homme) voor Shopify import |
| `PRODUCT_IMPORT_GUIDE.md` | Import instructies |
| `products.csv` | Originele 10 test producten |

---

## 🎨 Thema Kenmerken

### Design (Geïnspireerd op Maison Fierce)
- ✅ Minimalistisch, modern design
- ✅ Maison Fierce indeling
- ✅ Franse elegante uitstraling
- ✅ Donker/zwart & goud accent kleuren

### Animaties & Effecten
- ✅ Fade-in animaties bij scrollen
- ✅ Hero zoom effect
- ✅ Product hover (image swap + overlay)
- ✅ Scroll indicator (muis icoon)
- ✅ Smooth transitions
- ✅ Header backdrop blur
- ✅ Video background support in hero

### Pagina's
- ✅ Homepage (hero + collecties + universe + features)
- ✅ Product detail pagina
- ✅ Collectie pagina met filters

---

## 📦 Producten

### Femme Collectie (5 producten)
1. Matilda - Robe longue moulante (€89)
2. Liora - Ensemble blazer et pantalon (€119)
3. Imogen - Robe longue dos nu (€79)
4. Saoirse - Robe courte en dentelle (€69)
5. Céline - Robe longue dos nu drapée (€95)

### Homme Collectie (4 producten)
1. Axel - Short sport 2 en 1 (€45)
2. Kaleb - Pantalon à carreaux (€59)
3. Kade - Pantalon cargo (€65)
4. Noah - Pantalon jogging à carreaux (€49)

---

## 🚀 Implementatie Stappen

### 1. Thema Uploaden
```
Shopify Admin → Onlinewinkel → Thema's → Thema uploaden
→ Selecteer montrelle-theme.zip → Publiceren
```

### 2. Producten Importeren
```
Shopify Admin → Producten → Importeren
→ Upload maison-fierce-products.csv
```

### 3. Collecties Aanmaken
- **Femme**: Condition `tag = femme`
- **Homme**: Condition `tag = homme`

### 4. Thema Configureren
- Hero: Video of afbeelding uploaden
- Featured collections: Femme & Homme koppelen
- Universe: Afbeelding + tekst toevoegen
- Kleuren & fonts aanpassen in theme settings

### 5. Productfoto's
- Eigen foto's uploaden OF
- Dropshipping supplier foto's gebruiken

---

## ⚠️ Belangrijke Notities

### Dropshipping
- Producten zijn gebaseerd op Maison Fierce
- Voor eigen verkoop: eigen supplier nodig (Spocket, CJ Dropshipping, etc.)
- Eigen productfoto's maken/verwerven

### Video Hero
- MP4/WebM formaten ondersteund
- Poster image verplicht voor mobile
- Autoplay werkt niet altijd op mobile devices

### Prijzen
- Prijzen zijn indicatief
- Pas aan op basis van kostprijs + marge
- "Compare at price" voor korting weergave

---

## 📥 Download Links

**Thema ZIP:**  
`http://192.168.1.8:8765/montrelle-theme.zip`

**Producten CSV:**  
`/home/battletron/.openclaw/workspace/dropship-store/dropship-theme/data/maison-fierce-products.csv`

---

## 🔗 Externe Resources

- **Maison Fierce (inspiratie):** https://www.maisonfierce.fr/
- **Maya Theme (video voorbeeld):** https://themes.shopify.com/themes/maya/presets/maya
- **Shopify Theme Documentatie:** https://shopify.dev/themes

---

*Project voltooid: 31 maart 2026*
