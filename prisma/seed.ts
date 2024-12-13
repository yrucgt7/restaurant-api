import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const category1 = await prisma.category.create({
    data: {
      id: "cat1",
      name: "Entrantes",
    },
  });

  const category2 = await prisma.category.create({
    data: {
      id: "cat2",
      name: "Postres",
    },
  });

  
  await prisma.menuItem.createMany({
    data: [
      { id: "item1", description: "Ensalada", price: 5, categoryId: category1.id },
      { id: "item2", description: "Sopa", price: 3, categoryId: category1.id },
      { id: "item3", description: "Helado", price: 4, categoryId: category2.id },
      { id: "item4", description: "Tarta", price: 6, categoryId: category2.id },
    ],
  });
  console.log("Datos iniciales insertados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
