"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let AiService = class AiService {
    constructor(configService) {
        this.configService = configService;
        this.openai = null;
        this.isEnabled = false;
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && !apiKey.includes('test') && !apiKey.includes('disabled') && apiKey.startsWith('sk-')) {
            this.openai = new openai_1.default({ apiKey });
            this.isEnabled = true;
        }
    }
    async extractReceiptData(imageBase64, mimeType) {
        if (!this.isEnabled || !this.openai) {
            console.log('🧪 OpenAI disabled - returning mock data for development');
            return this.getMockExtractedData();
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'system',
                        content: `Je bent een assistent die bonnetjes en facturen analyseert voor een boekhoudsysteem voor taxi chauffeurs.
Extraheer de volgende informatie uit het bonnetje in het Nederlands:
- Datum (YYYY-MM-DD formaat)
- Totaalbedrag (inclusief BTW)
- BTW bedrag
- BTW percentage (0%, 9% of 21%)
- Categorie (brandstof, onderhoud, verzekering, wegenvignet, parkeerkosten, telefoon, administratie, overig)
- Bedrijfsnaam/verkoper
- Korte omschrijving

Geef de output als JSON.`,
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${imageBase64}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
                response_format: { type: 'json_object' },
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('Geen antwoord van AI');
            }
            const parsed = JSON.parse(content);
            return {
                date: this.parseDate(parsed.datum || parsed.date),
                total: this.parseAmount(parsed.totaal || parsed.total || parsed.bedrag),
                vat: this.parseAmount(parsed.btw || parsed.vat || parsed.BTW),
                vatRate: this.parseVatRate(parsed.btw_percentage || parsed.vatRate || parsed.btw_tarief),
                category: this.mapCategory(parsed.categorie || parsed.category),
                merchant: parsed.bedrijf || parsed.merchant || parsed.verkoper || null,
                description: parsed.omschrijving || parsed.description || parsed.beschrijving || null,
            };
        }
        catch (error) {
            console.error('AI extraction error:', error);
            return this.getMockExtractedData();
        }
    }
    getMockExtractedData() {
        const categories = ['brandstof', 'onderhoud', 'parkeerkosten', 'administratie'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomAmount = Math.round((20 + Math.random() * 100) * 100) / 100;
        const vatRate = '21';
        const vatAmount = Math.round(randomAmount * 0.21 * 100) / 100;
        return {
            date: new Date().toISOString().split('T')[0],
            total: randomAmount,
            vat: vatAmount,
            vatRate,
            category: randomCategory,
            merchant: 'Test Winkel BV',
            description: `Test ${randomCategory} uitgave`,
        };
    }
    parseDate(dateStr) {
        if (!dateStr)
            return null;
        const formats = [
            /(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})/,
            /(\d{4})[-/](\d{1,2})[-/](\d{1,2})/,
        ];
        for (const format of formats) {
            const match = dateStr.match(format);
            if (match) {
                const parts = dateStr.split(/[-/]/);
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]);
                    const year = parseInt(parts[2].length === 2 ? '20' + parts[2] : parts[2]);
                    if (day <= 12 && month > 12) {
                        return `${year}-${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}`;
                    }
                    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                }
            }
        }
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }
        return null;
    }
    parseAmount(amountStr) {
        if (amountStr === null || amountStr === undefined)
            return null;
        if (typeof amountStr === 'number')
            return amountStr;
        const cleaned = amountStr
            .replace(/[€$£\s]/g, '')
            .replace(/,/g, '.');
        const amount = parseFloat(cleaned);
        return isNaN(amount) ? null : Math.round(amount * 100) / 100;
    }
    parseVatRate(rate) {
        if (rate === null || rate === undefined)
            return null;
        const rateStr = String(rate).replace(/[%\s]/g, '');
        const rateNum = parseFloat(rateStr);
        if (rateNum === 0 || rateNum === 0.0)
            return '0';
        if (rateNum === 9 || rateNum === 0.09)
            return '9';
        if (rateNum === 21 || rateNum === 0.21)
            return '21';
        return null;
    }
    mapCategory(category) {
        if (!category)
            return 'overig';
        const categoryMap = {
            'brandstof': 'brandstof',
            'benzine': 'brandstof',
            'diesel': 'brandstof',
            'tanken': 'brandstof',
            'onderhoud': 'onderhoud',
            'reparatie': 'onderhoud',
            'garage': 'onderhoud',
            'verzekering': 'verzekering',
            'verzeker': 'verzekering',
            'wegenvignet': 'wegenvignet',
            'tol': 'wegenvignet',
            'parkeerkosten': 'parkeerkosten',
            'parkeren': 'parkeerkosten',
            'telefoon': 'telefoon',
            'mobiel': 'telefoon',
            'administratie': 'administratie',
            'boekhouder': 'administratie',
            'accountant': 'administratie',
        };
        const lowerCategory = category.toLowerCase();
        return categoryMap[lowerCategory] || 'overig';
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map