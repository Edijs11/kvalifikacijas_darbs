const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createGenders() {
  const genders = ["Vīrietis", "Sieviete"];

  for await (const gender of genders) {
    const result = await prisma.gender.create({
      data: {
        name: gender,
      },
    });
    console.log(result);
  }
}

async function createGameCategories() {
  const categories = ["Vīriešiem", "Sievietēm"];

  for await (const category of categories) {
    const result = await prisma.gameCategory.create({
      data: {
        name: category,
      },
    });
    console.log(result);
  }
}

async function createGameStatuses() {
  const statuses = ["Plānota", "Aktīva", "Pabeigta"];

  for await (const status of statuses) {
    const result = await prisma.gameStatus.create({
      data: {
        name: status,
      },
    });
    console.log(result);
  }
}

async function createGameEventTypes() {
  const types = [
    "Spēles sākums",
    "Spēles beigas",
    "Pārtraukums",
    "Pārtraukuma beigas",
    "Punkts",
    "Kļūda",
    "Seta beigas",
  ];

  for await (const type of types) {
    const result = await prisma.gameEventType.create({
      data: {
        name: type,
      },
    });
    console.log(result);
  }
}

async function createPointTypes() {
  const types = ["Uzbrukums", "Serve", "Bloks", "Māns", "Cits"];

  for await (const type of types) {
    const result = await prisma.pointType.create({
      data: {
        name: type,
      },
    });
    console.log(result);
  }
}
async function createMistakeTypes() {
  const types = [
    "Bumba laukumā",
    "Pārkāpta līnija",
    "Skarts tīklam",
    "3+ darbības",
    "Skarta antena",
    "Mesta bumba",
    "Bumba skarta 2 reizes",
    "Bumba skar griestus",
    "Blokā piedalās aizsargs",
    "Aizsargs gremdējot pārkāpis uzbrukuma līniju",
    "Servējot pārkāpta līnija",
    "Serve tīklā vai zem tā",
    "Bloks",
  ];

  for await (const type of types) {
    const result = await prisma.mistakeType.create({
      data: {
        name: type,
      },
    });
    console.log(result);
  }
}

async function main() {
  await createGenders();
  await createGameCategories();
  await createGameStatuses();
  await createGameEventTypes();
  await createPointTypes();
  await createMistakeTypes();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
