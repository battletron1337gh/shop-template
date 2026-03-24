import { ConfigService } from '@nestjs/config';
interface ExtractedReceiptData {
    date: string | null;
    total: number | null;
    vat: number | null;
    vatRate: '0' | '9' | '21' | null;
    category: string | null;
    merchant: string | null;
    description: string | null;
}
export declare class AiService {
    private configService;
    private openai;
    private isEnabled;
    constructor(configService: ConfigService);
    extractReceiptData(imageBase64: string, mimeType: string): Promise<ExtractedReceiptData>;
    private getMockExtractedData;
    private parseDate;
    private parseAmount;
    private parseVatRate;
    private mapCategory;
}
export {};
