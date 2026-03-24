import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FilterExpensesDto } from './dto/filter-expenses.dto';
export declare class ExpensesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, filters: FilterExpensesDto): Promise<{
        expenses: ({
            vehicle: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                licensePlate: string;
                make: string | null;
                model: string | null;
                year: number | null;
                fuelType: string | null;
            };
            receipt: {
                id: string;
                createdAt: Date;
                userId: string;
                status: import(".prisma/client").$Enums.ReceiptStatus;
                filename: string;
                originalFilename: string;
                mimeType: string | null;
                fileSize: number | null;
                filePath: string;
                extractedData: import("@prisma/client/runtime/library").JsonValue | null;
                extractedAmount: import("@prisma/client/runtime/library").Decimal | null;
                extractedVatAmount: import("@prisma/client/runtime/library").Decimal | null;
                extractedDate: Date | null;
                extractedMerchant: string | null;
                processedAt: Date | null;
                errorMessage: string | null;
                expenseId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expenseDate: Date;
            category: import(".prisma/client").$Enums.ExpenseCategory;
            description: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            vatRate: import(".prisma/client").$Enums.VatRate;
            vatAmount: import("@prisma/client/runtime/library").Decimal;
            isBusinessExpense: boolean;
            isDeductible: boolean;
            kilometers: number | null;
            notes: string | null;
            receiptId: string | null;
            vehicleId: string | null;
        })[];
        total: number;
    }>;
    findOne(id: string, userId: string): Promise<{
        vehicle: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            licensePlate: string;
            make: string | null;
            model: string | null;
            year: number | null;
            fuelType: string | null;
        };
        receipt: {
            id: string;
            createdAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.ReceiptStatus;
            filename: string;
            originalFilename: string;
            mimeType: string | null;
            fileSize: number | null;
            filePath: string;
            extractedData: import("@prisma/client/runtime/library").JsonValue | null;
            extractedAmount: import("@prisma/client/runtime/library").Decimal | null;
            extractedVatAmount: import("@prisma/client/runtime/library").Decimal | null;
            extractedDate: Date | null;
            extractedMerchant: string | null;
            processedAt: Date | null;
            errorMessage: string | null;
            expenseId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expenseDate: Date;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        vatRate: import(".prisma/client").$Enums.VatRate;
        vatAmount: import("@prisma/client/runtime/library").Decimal;
        isBusinessExpense: boolean;
        isDeductible: boolean;
        kilometers: number | null;
        notes: string | null;
        receiptId: string | null;
        vehicleId: string | null;
    }>;
    create(userId: string, createExpenseDto: CreateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expenseDate: Date;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        vatRate: import(".prisma/client").$Enums.VatRate;
        vatAmount: import("@prisma/client/runtime/library").Decimal;
        isBusinessExpense: boolean;
        isDeductible: boolean;
        kilometers: number | null;
        notes: string | null;
        receiptId: string | null;
        vehicleId: string | null;
    }>;
    update(id: string, userId: string, updateExpenseDto: UpdateExpenseDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expenseDate: Date;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        vatRate: import(".prisma/client").$Enums.VatRate;
        vatAmount: import("@prisma/client/runtime/library").Decimal;
        isBusinessExpense: boolean;
        isDeductible: boolean;
        kilometers: number | null;
        notes: string | null;
        receiptId: string | null;
        vehicleId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expenseDate: Date;
        category: import(".prisma/client").$Enums.ExpenseCategory;
        description: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        vatRate: import(".prisma/client").$Enums.VatRate;
        vatAmount: import("@prisma/client/runtime/library").Decimal;
        isBusinessExpense: boolean;
        isDeductible: boolean;
        kilometers: number | null;
        notes: string | null;
        receiptId: string | null;
        vehicleId: string | null;
    }>;
    getSummary(userId: string, year: number, month?: number): Promise<{
        totals: {
            totalAmount: number | import("@prisma/client/runtime/library").Decimal;
            totalVat: number | import("@prisma/client/runtime/library").Decimal;
            totalExpenses: number;
        };
        byCategory: {
            category: import(".prisma/client").$Enums.ExpenseCategory;
            amount: number | import("@prisma/client/runtime/library").Decimal;
            count: number;
        }[];
    }>;
}
