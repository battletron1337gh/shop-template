/**
 * AutoAd Generator - Main Application
 * Generates professional car advertisements for Marktplaats, Autoscout24, etc.
 */

// Storage key for localStorage
const STORAGE_KEY = 'autoad_generator_saved';

// Current ad data
let currentAdData = null;
let currentAdType = 'marktplaats';

// DOM Elements
const carForm = document.getElementById('carForm');
const adSection = document.getElementById('adSection');
const adText = document.getElementById('adText');
const adTitle = document.getElementById('adTitle');
const previewBox = document.getElementById('previewBox');
const savedList = document.getElementById('savedList');
const toast = document.getElementById('toast');
const resetBtn = document.getElementById('resetBtn');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const tabBtns = document.querySelectorAll('.tab-btn');

// Initialize
function init() {
    loadSavedAds();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Form submit
    carForm.addEventListener('submit', handleFormSubmit);
    
    // Reset button
    resetBtn.addEventListener('click', resetForm);
    
    // Copy button
    copyBtn.addEventListener('click', copyAdText);
    
    // Save button
    saveBtn.addEventListener('click', saveAd);
    
    // Tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(carForm);
    const data = {
        merk: formData.get('merk'),
        model: formData.get('model'),
        bouwjaar: formData.get('bouwjaar'),
        kmStand: formData.get('kmStand'),
        prijs: formData.get('prijs'),
        brandstof: formData.get('brandstof'),
        transmissie: formData.get('transmissie'),
        motorinhoud: formData.get('motorinhoud'),
        vermogen: formData.get('vermogen'),
        kenteken: formData.get('kenteken'),
        staat: formData.get('staat'),
        apk: formData.get('apk'),
        opties: formData.getAll('opties'),
        omschrijving: formData.get('omschrijving')
    };
    
    currentAdData = data;
    generateAd(data, currentAdType);
    
    // Show ad section
    adSection.style.display = 'block';
    adSection.scrollIntoView({ behavior: 'smooth' });
    
    showToast('Advertentie succesvol gegenereerd!', 'success');
}

// Generate advertisement text
function generateAd(data, type) {
    let ad = '';
    const title = `${data.merk} ${data.model} ${data.bouwjaar}`;
    
    switch(type) {
        case 'marktplaats':
            ad = generateMarktplaatsAd(data);
            break;
        case 'autoscout':
            ad = generateAutoscoutAd(data);
            break;
        case 'generic':
            ad = generateGenericAd(data);
            break;
    }
    
    adTitle.textContent = title;
    adText.value = ad;
    previewBox.textContent = ad;
}

// Generate Marktplaats style ad
function generateMarktplaatsAd(data) {
    const prijsFormatted = formatPrice(data.prijs);
    const kmFormatted = formatNumber(data.kmStand);
    
    let ad = `🚗 ${data.merk} ${data.model} - ${data.bouwjaar}\n`;
    ad += `💰 Prijs: €${prijsFormatted}\n`;
    ad += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    ad += `✅ SPECIFICATIES:\n`;
    ad += `• Merk: ${data.merk}\n`;
    ad += `• Model: ${data.model}\n`;
    ad += `• Bouwjaar: ${data.bouwjaar}\n`;
    ad += `• Kilometerstand: ${kmFormatted} km\n`;
    ad += `• Brandstof: ${data.brandstof}\n`;
    ad += `• Transmissie: ${data.transmissie}\n`;
    
    if (data.motorinhoud) {
        ad += `• Motorinhoud: ${data.motorinhoud} cc\n`;
    }
    if (data.vermogen) {
        ad += `• Vermogen: ${data.vermogen} pk\n`;
    }
    if (data.kenteken) {
        ad += `• Kenteken: ${data.kenteken}\n`;
    }
    
    ad += `• Staat: ${data.staat}\n`;
    
    if (data.apk) {
        const apkDate = formatAPK(data.apk);
        ad += `• APK: tot ${apkDate}\n`;
    }
    
    ad += `\n`;
    
    if (data.opties.length > 0) {
        ad += `⭐ OPTIES & UITERUSTING:\n`;
        data.opties.forEach(optie => {
            ad += `✓ ${optie}\n`;
        });
        ad += `\n`;
    }
    
    if (data.omschrijving) {
        ad += `📝 OMSCHRIJVING:\n`;
        ad += `${data.omschrijving}\n\n`;
    }
    
    ad += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    ad += `💶 VRAAGPRIJS: €${prijsFormatted}\n\n`;
    
    ad += `📞 Interesse? Neem gerust contact op!\n`;
    ad += `🔍 Bezichtiging en proefrit mogelijk\n`;
    
    return ad;
}

// Generate Autoscout24 style ad
function generateAutoscoutAd(data) {
    const prijsFormatted = formatPrice(data.prijs);
    const kmFormatted = formatNumber(data.kmStand);
    
    let ad = `${data.merk} ${data.model} - ${data.bouwjaar} - ${data.staat}\n`;
    ad += `Prijs: € ${prijsFormatted}\n\n`;
    
    ad += `Voertuiggegevens:\n`;
    ad += `Merk / Model: ${data.merk} ${data.model}\n`;
    ad += `Bouwjaar: ${data.bouwjaar}\n`;
    ad += `Kilometerstand: ${kmFormatted} km\n`;
    ad += `Brandstof: ${data.brandstof}\n`;
    ad += `Transmissie: ${data.transmissie}\n`;
    
    if (data.motorinhoud) {
        ad += `Cilinderinhoud: ${data.motorinhoud} cm³\n`;
    }
    if (data.vermogen) {
        ad += `Vermogen: ${data.vermogen} pk (${Math.round(data.vermogen * 0.7355)} kW)\n`;
    }
    if (data.kenteken) {
        ad += `Kenteken: ${data.kenteken}\n`;
    }
    
    if (data.apk) {
        const apkDate = formatAPK(data.apk);
        ad += `APK tot: ${apkDate}\n`;
    }
    
    ad += `Staat: ${data.staat}\n\n`;
    
    if (data.opties.length > 0) {
        ad += `Uitrusting:\n`;
        data.opties.forEach(optie => {
            ad += `- ${optie}\n`;
        });
        ad += `\n`;
    }
    
    if (data.omschrijving) {
        ad += `Beschrijving:\n`;
        ad += `${data.omschrijving}\n\n`;
    }
    
    ad += `Prijs: € ${prijsFormatted}\n`;
    ad += `Bekijk de auto gerust en maak een proefrit!\n`;
    
    return ad;
}

// Generate generic ad
function generateGenericAd(data) {
    const prijsFormatted = formatPrice(data.prijs);
    const kmFormatted = formatNumber(data.kmStand);
    
    let ad = `Te koop: ${data.merk} ${data.model} (${data.bouwjaar})\n\n`;
    
    ad += `PRIJS: €${prijsFormatted}\n\n`;
    
    ad += `KENMERKEN:\n`;
    ad += `- Merk: ${data.merk}\n`;
    ad += `- Model: ${data.model}\n`;
    ad += `- Bouwjaar: ${data.bouwjaar}\n`;
    ad += `- Kilometerstand: ${kmFormatted} km\n`;
    ad += `- Brandstof: ${data.brandstof}\n`;
    ad += `- Transmissie: ${data.transmissie}\n`;
    
    if (data.motorinhoud) ad += `- Motor: ${data.motorinhoud} cc\n`;
    if (data.vermogen) ad += `- Vermogen: ${data.vermogen} pk\n`;
    if (data.kenteken) ad += `- Kenteken: ${data.kenteken}\n`;
    
    ad += `- Staat: ${data.staat}\n`;
    if (data.apk) ad += `- APK: ${formatAPK(data.apk)}\n`;
    
    ad += `\n`;
    
    if (data.opties.length > 0) {
        ad += `OPTIES:\n`;
        data.opties.forEach(optie => ad += `- ${optie}\n`);
        ad += `\n`;
    }
    
    if (data.omschrijving) {
        ad += `BESCHRIJVING:\n${data.omschrijving}\n\n`;
    }
    
    ad += `Interesse? Neem contact op voor een bezichtiging of proefrit!`;
    
    return ad;
}

// Switch tab
function switchTab(tab) {
    currentAdType = tab;
    
    // Update active tab
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Regenerate ad if data exists
    if (currentAdData) {
        generateAd(currentAdData, tab);
    }
}

// Copy ad text
async function copyAdText() {
    try {
        await navigator.clipboard.writeText(adText.value);
        showToast('Advertentie gekopieerd naar klembord!', 'success');
    } catch (err) {
        // Fallback
        adText.select();
        document.execCommand('copy');
        showToast('Advertentie gekopieerd naar klembord!', 'success');
    }
}

// Save ad
function saveAd() {
    if (!currentAdData) return;
    
    const savedAds = getSavedAds();
    const adEntry = {
        id: Date.now(),
        title: `${currentAdData.merk} ${currentAdData.model} ${currentAdData.bouwjaar}`,
        price: currentAdData.prijs,
        data: currentAdData,
        adText: adText.value,
        type: currentAdType,
        createdAt: new Date().toISOString()
    };
    
    savedAds.unshift(adEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAds));
    
    loadSavedAds();
    showToast('Advertentie opgeslagen!', 'success');
}

// Get saved ads from localStorage
function getSavedAds() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

// Load saved ads
function loadSavedAds() {
    const savedAds = getSavedAds();
    
    if (savedAds.length === 0) {
        savedList.innerHTML = '<p class="empty-state">Nog geen advertenties opgeslagen</p>';
        return;
    }
    
    savedList.innerHTML = savedAds.map(ad => `
        <div class="saved-item">
            <div class="saved-item-info">
                <h4>${ad.title}</h4>
                <p>€${formatPrice(ad.price)} • ${formatDate(ad.createdAt)}</p>
            </div>
            <div class="saved-item-actions">
                <button class="btn btn-small btn-edit" onclick="loadSavedAd(${ad.id})">Laad</button>
                <button class="btn btn-small btn-delete" onclick="deleteSavedAd(${ad.id})">Verwijder</button>
            </div>
        </div>
    `).join('');
}

// Load saved ad
function loadSavedAd(id) {
    const savedAds = getSavedAds();
    const ad = savedAds.find(a => a.id === id);
    
    if (!ad) return;
    
    // Fill form
    const data = ad.data;
    document.getElementById('merk').value = data.merk || '';
    document.getElementById('model').value = data.model || '';
    document.getElementById('bouwjaar').value = data.bouwjaar || '';
    document.getElementById('kmStand').value = data.kmStand || '';
    document.getElementById('prijs').value = data.prijs || '';
    document.getElementById('brandstof').value = data.brandstof || '';
    document.getElementById('transmissie').value = data.transmissie || '';
    document.getElementById('motorinhoud').value = data.motorinhoud || '';
    document.getElementById('vermogen').value = data.vermogen || '';
    document.getElementById('kenteken').value = data.kenteken || '';
    document.getElementById('staat').value = data.staat || '';
    document.getElementById('apk').value = data.apk || '';
    document.getElementById('omschrijving').value = data.omschrijving || '';
    
    // Check options
    document.querySelectorAll('input[name="opties"]').forEach(cb => {
        cb.checked = data.opties.includes(cb.value);
    });
    
    currentAdData = data;
    currentAdType = ad.type;
    
    // Update tabs
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === ad.type);
    });
    
    // Show and generate
    adSection.style.display = 'block';
    generateAd(data, ad.type);
    
    showToast('Advertentie geladen!', 'success');
}

// Delete saved ad
function deleteSavedAd(id) {
    if (!confirm('Weet je zeker dat je deze advertentie wilt verwijderen?')) return;
    
    const savedAds = getSavedAds().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAds));
    loadSavedAds();
    showToast('Advertentie verwijderd', 'success');
}

// Reset form
function resetForm() {
    if (!confirm('Weet je zeker dat je alle velden wilt wissen?')) return;
    
    carForm.reset();
    adSection.style.display = 'none';
    currentAdData = null;
    
    showToast('Formulier gewist', 'success');
}

// Format price
function formatPrice(price) {
    return parseInt(price).toLocaleString('nl-NL');
}

// Format number
function formatNumber(num) {
    return parseInt(num).toLocaleString('nl-NL');
}

// Format APK date
function formatAPK(apkValue) {
    const [year, month] = apkValue.split('-');
    const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 
                    'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
    return `${months[parseInt(month) - 1]} ${year}`;
}

// Format date
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);
