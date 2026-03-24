import { ExpenseCategory } from '@prisma/client';
export declare class FilterExpensesDto {
    startDate?: string;
    endDate?: string;
    category?: ExpenseCategory;
    isBusiness?: boolean;
    skip?: number;
    take?: number;
}
