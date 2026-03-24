"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Start met seeden...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@taxiboek.nl' },
        update: {},
        create: {
            email: 'admin@taxiboek.nl',
            passwordHash: adminPassword,
            firstName: 'Admin',
            lastName: 'Gebruiker',
            role: 'admin',
            emailVerified: true,
            onboardingCompleted: true,
        },
    });
    console.log('👤 Admin aangemaakt:', admin.email);
    const demoPassword = await bcrypt.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
        where: { email: 'demo@taxiboek.nl' },
        update: {},
        create: {
            email: 'demo@taxiboek.nl',
            passwordHash: demoPassword,
            firstName: 'Jan',
            lastName: 'Jansen',
            phone: '06-12345678',
            kvkNumber: '12345678',
            btwNumber: 'NL123456789B01',
            korSchemeEnabled: false,
            emailVerified: true,
            onboardingCompleted: true,
        },
    });
    console.log('👤 Demo gebruiker aangemaakt:', demoUser.email);
    await prisma.subscription.upsert({
        where: { id: '550e8400-e29b-41d4-a716-446655440000' },
        update: {},
        create: {
            userId: demoUser.id,
            plan: 'pro',
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
    });
    console.log('💳 Abonnement aangemaakt');
    const vehicle = await prisma.vehicle.create({
        data: {
            userId: demoUser.id,
            licensePlate: 'XX-123-X',
            make: 'Toyota',
            model: 'Prius',
            year: 2022,
            fuelType: 'hybride',
        },
    });
    console.log('🚗 Voertuig aangemaakt:', vehicle.licensePlate);
    const today = new Date();
    const rides = [];
    for (let i = 0; i < 20; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        const grossAmount = Math.round((20 + Math.random() * 80) * 100) / 100;
        const commission = Math.round(grossAmount * 0.25 * 100) / 100;
        const netAmount = grossAmount - commission;
        const vatRate = 'NINE';
        const vatAmount = Math.round((netAmount * 0.09) * 100) / 100;
        rides.push({
            userId: demoUser.id,
            platform: Math.random() > 0.5 ? 'uber' : 'bolt',
            rideDate: date,
            grossAmount,
            platformCommission: commission,
            netAmount,
            vatRate,
            vatAmount,
            paymentMethod: Math.random() > 0.3 ? 'card' : 'cash',
            isManualEntry: false,
            syncedFromPlatform: true,
        });
    }
    await prisma.ride.createMany({ data: rides });
    console.log(`🚕 ${rides.length} ritten aangemaakt`);
    const expenses = [
        { category: 'brandstof', description: 'Tanken Shell', amount: 65.50, vatRate: 'TWENTY_ONE' },
        { category: 'onderhoud', description: 'Olie verversen', amount: 120.00, vatRate: 'TWENTY_ONE' },
        { category: 'verzekering', description: 'Autoverzekering', amount: 85.00, vatRate: 'TWENTY_ONE' },
        { category: 'parkeerkosten', description: 'Parkeergarage', amount: 15.00, vatRate: 'TWENTY_ONE' },
    ];
    for (const exp of expenses) {
        const vatAmount = exp.vatRate === 'TWENTY_ONE'
            ? Math.round((exp.amount * 0.21 / 1.21) * 100) / 100
            : 0;
        await prisma.expense.create({
            data: {
                userId: demoUser.id,
                expenseDate: new Date(today.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                category: exp.category,
                description: exp.description,
                amount: exp.amount,
                vatRate: exp.vatRate,
                vatAmount,
                vehicleId: vehicle.id,
                isBusinessExpense: true,
                isDeductible: true,
            },
        });
    }
    console.log(`💰 ${expenses.length} kosten aangemaakt`);
    console.log('✅ Seeding voltooid!');
    console.log('');
    console.log('🔑 Inloggegevens:');
    console.log('   Admin: admin@taxiboek.nl / admin123');
    console.log('   Demo:  demo@taxiboek.nl / demo123');
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map