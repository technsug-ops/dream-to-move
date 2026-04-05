import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const currentCount = await prisma.moveRequest.count();

  if (currentCount > 0) {
    console.log("Seed skipped: move requests already exist.");
    return;
  }

  await prisma.moveRequest.createMany({
    data: [
      {
        fullName: "Ayse Yilmaz",
        email: "ayse@example.com",
        phone: "+90 555 100 11 22",
        fromAddress: "Kadikoy, Istanbul",
        toAddress: "Cankaya, Ankara",
        moveDate: new Date("2026-05-12"),
        homeSize: "TWO_PLUS_ONE",
        serviceType: "PACKING_AND_TRANSPORT",
        budget: 42000,
        note: "Asansor var, kirilabilir esya cok.",
        status: "CONTACTED",
        quoteAmount: 46000,
      },
      {
        fullName: "Mehmet Demir",
        email: "mehmet@example.com",
        phone: "+90 555 203 44 55",
        fromAddress: "Bornova, Izmir",
        toAddress: "Muratpasa, Antalya",
        moveDate: new Date("2026-05-25"),
        homeSize: "ONE_PLUS_ONE",
        serviceType: "ONLY_TRANSPORT",
        budget: 25000,
        note: "Hafta ici tasinma uygun.",
        status: "NEW",
      },
    ],
  });

  console.log("Seed completed: sample move requests added.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
