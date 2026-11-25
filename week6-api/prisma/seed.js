const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const ayse = await prisma.user.upsert({
    where: { email: "ayse@example.com" },
    update: {},
    create: { name: "Ayşe", email: "ayse@example.com" }
  });
  await prisma.event.createMany({ data: [
    { title: "Python Atölyesi Planlaması", date: new Date("2026-11-22"),
      done: false, organizerId: ayse.id },
    { title: "Web Dev Bootcamp Kayıtları", date: new Date("2026-10-25"),
      done: true, organizerId: ayse.id }
  ]});
}
main().finally(() => prisma.$disconnect());
