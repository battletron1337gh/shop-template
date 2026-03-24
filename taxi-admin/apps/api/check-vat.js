const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rides = await prisma.ride.findMany({ take: 5 });
  console.log('=== RITTEN ===');
  rides.forEach(r => {
    console.log(`Datum: ${r.rideDate.toISOString().split('T')[0]}, Netto: €${r.netAmount}, BTW: ${r.vatRate}, BTW Bedrag: €${r.vatAmount}`);
  });
  
  const expenses = await prisma.expense.findMany({ take: 5 });
  console.log('\n=== KOSTEN ===');
  expenses.forEach(e => {
    console.log(`Datum: ${e.expenseDate.toISOString().split('T')[0]}, Bedrag: €${e.amount}, BTW: ${e.vatRate}, BTW Bedrag: €${e.vatAmount}`);
  });
  
  // Check aggregate
  const rideSum = await prisma.ride.aggregate({
    _sum: { vatAmount: true, netAmount: true }
  });
  console.log('\n=== TOTALEN RITTEN ===');
  console.log(`Netto omzet: €${rideSum._sum.netAmount}, BTW: €${rideSum._sum.vatAmount}`);
  
  const expenseSum = await prisma.expense.aggregate({
    _sum: { vatAmount: true, amount: true }
  });
  console.log('\n=== TOTALEN KOSTEN ===');
  console.log(`Kosten: €${expenseSum._sum.amount}, BTW: €${expenseSum._sum.vatAmount}`);
  
  await prisma.$disconnect();
}

main();
