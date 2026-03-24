import { ExpenseCategory, VatRate } from '@prisma/client';
export declare class CreateExpenseDto {
    expenseDate: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    vatRate?: VatRate;
    isBusinessExpense?: boolean;
    isDeductible?: boolean;
    kilometers?: number;
    vehicleId?: string;
    notes?: string;
}
