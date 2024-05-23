import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

// const { PrismaClient } = require("@prisma/client");
// const { categories, products } = require("./data.js");
const prisma = new PrismaClient();

async function initAdmin() {
  const argon2id = new Argon2id();
  const password_hash = await argon2id.hash(
    process.env.INIT_ADMIN_PASSWORD,
    10
  );

  const admin = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      username: "Ben",
      email: process.env.INIT_ADMIN_EMAIL,
      password_hash,
      role: "admin",
    },
  });
}

async function initUser() {
  const argon2id = new Argon2id();
  const password_hash = await argon2id.hash(process.env.INIT_USER_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      username: "Steve",
      email: process.env.INIT_USER_EMAIL,
      password_hash,
      role: "user",
    },
  });
}

async function schoolsAndPrograms() {
  const arcadia = await prisma.school.create({
    data: {
      name: "Arcadia PS",
      facility_hire: 0,
      resource_levy: 10,
      grades: {
        K: false,
        1: false,
        2: false,
        3: true,
        4: true,
        5: true,
        6: true,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      offers_instrument_rental: false,
      instrument_options: {
        Flute: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Clarinet: {
          program: "Band Program",
          status: "Active",
          enrolled: 0,
          cap: -1,
        },
        "Bass Clarinet": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Alto Saxophone": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        "Tenor Saxophone": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Baritone Saxophone": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "French Horn": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Trumpet: {
          program: "Band Program",
          status: "Active",
          enrolled: 0,
          cap: -1,
        },
        "Baritone Horn": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Euphonium: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Trombone: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        "Keyboard Bass": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Bass Guitar": {
          program: "Band Program",
          status: "Active",
          enrolled: 5,
          cap: 5,
        },
        Percussion: {
          program: "Band Program",
          status: "Active",
          enrolled: 3,
          cap: 3,
        },
      },
      programs: {
        create: [
          {
            school_program_status: "Active",
            program: {
              create: {
                name: "B&G",
                description: "Group Tuition and Band Rehearsals",
                cost: 220,
                cost_breakdown: [
                  { item: "Group Tuition", price: "$220" },
                  { item: "Band Rehearsals", price: "Included" },
                ],
                whats_included: [
                  "One group lesson per week",
                  "Band Rehearsals included",
                  "Access to our Online Resource Library",
                ],
                type: "Band Program",
                classType: "Group",
                program_status: "Active",
                enrol_fee: 30,
              },
            },
          },
          {
            school_program_status: "Active",
            program: {
              create: {
                name: "B&Pr",
                description: "Private Tuition and Band Rehearsals",
                cost: 610,
                cost_breakdown: [
                  { item: "Band Rehearsals", price: "$110" },
                  { item: "Private Tuition", price: "$500" },
                ],
                whats_included: [
                  "One private lesson per week",
                  "Weekly Band Rehearsals",
                  "Access to our Online Resource Library",
                ],
                type: "Band Program",
                classType: "Private",
                program_status: "Active",
                enrol_fee: 30,
              },
            },
          },
          {
            school_program_status: "Active",
            program: {
              create: {
                name: "Band Only",
                description: "Band Rehearsals Only",
                cost: 110,
                cost_breakdown: [{ item: "Band Rehearsals", price: "$110" }],
                whats_included: [
                  "Weekly Band Rehearsals",
                  "Access to our Online Resource Library",
                ],
                type: "Band Program",
                classType: "Band Only",
                program_status: "Inactive",
                enrol_fee: 30,
              },
            },
          },
        ],
      },
    },
  });

  const smr = await prisma.school.create({
    data: {
      name: "St Mary's Rydalmere",
      facility_hire: 0,
      resource_levy: 10,
      offers_instrument_rental: true,
      grades: {
        K: false,
        1: false,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      instrument_options: {
        Flute: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Clarinet: {
          program: "Band Program",
          status: "Active",
          enrolled: 0,
          cap: -1,
        },
        "Bass Clarinet": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Alto Saxophone": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        "Tenor Saxophone": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Baritone Saxophone": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "French Horn": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Trumpet: {
          program: "Band Program",
          status: "Active",
          enrolled: 5,
          cap: 5,
        },
        "Baritone Horn": {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Euphonium: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        Trombone: {
          program: "Band Program",
          status: "Inactive",
          enrolled: 0,
          cap: -1,
        },
        "Keyboard Bass": {
          program: "Band Program",
          status: "Hidden",
          enrolled: 0,
          cap: -1,
        },
        "Bass Guitar": {
          program: "Band Program",
          status: "Active",
          enrolled: 5,
          cap: 5,
        },
        Percussion: {
          program: "Band Program",
          status: "Active",
          enrolled: 3,
          cap: 3,
        },
        Keyboard: {
          program: "Keyboard Program",
          status: "Active",
          enrolled: 2,
          cap: 3,
        },
      },
      programs: {
        create: [
          {
            school_program_status: "Active",
            program: {
              connect: { name: "B&G" },
            },
          },
          {
            school_program_status: "Active",
            program: {
              connect: { name: "B&Pr" },
            },
          },
          {
            school_program_status: "Active",
            program: {
              create: {
                name: "KeyGrp",
                type: "Keyboard Program",
                description: "Group Keyboard Tuition",
                cost: 110,
                cost_breakdown: [{ item: "Group Tuition", price: "$110" }],
                whats_included: [
                  "Weekly Keyboard Lesson",
                  "Access to our Online Resource Library",
                ],
                classType: "Group",
                program_status: "Active",
                enrol_fee: 30,
              },
            },
          },
          {
            school_program_status: "Hidden",
            program: {
              create: {
                name: "KeyPr",
                type: "Keyboard Program",
                description: "Private Keyboard Tuition",
                cost: 300,
                cost_breakdown: [{ item: "Private Tution", price: "$300" }],
                whats_included: [
                  "Weekly Private Keyboard Lesson",
                  "Access to our Online Resource Library",
                ],
                classType: "Private",
                program_status: "Active",
                enrol_fee: 30,
              },
            },
          },
        ],
      },
    },
  });
}

async function instrumentsAndAccessories() {
  const clarinet = await prisma.instrument.create({
    data: {
      name: "Clarinet",
      purchase_options: [
        {
          brand: "Yamaha",
          model: "YCL255",
          image:
            "https://res.cloudinary.com/dgji2hj3t/image/upload/v1713683152/CLARINET_-_YCL255_oigyk6.png",
          rrp: 1099.0,
          sale_price: 849.0,
          features: [
            "Yamaha YCL255",
            "Nickel plated keys",
            "Adjustable thumb rest",
          ],
          status: "Sold Out",
        },
        {
          brand: "Jupiter",
          model: "JCL700NA",
          image:
            "https://res.cloudinary.com/dgji2hj3t/image/upload/v1713683152/CLARINET_-_JCL700NA_cmwgfj.png",
          rrp: 895.0,
          sale_price: 685.0,
          features: [
            "Jupiter JCL700NA",
            "Resin matte finish",
            "Comes with stackable hard case",
          ],
          status: "Available",
        },
      ],
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        create: [
          {
            name: "Music Stand",
            price: 31.0,
            status: "Active",
            is_recommended: true,
            description_short: "Essential for home practice",
            description_long:
              "A height adjustable music stand is a must for any student wanting to learn an instrument. Using a table or any flat surface to hold your music will make it difficult to read, difficult to learn, and difficult to produce a good sound.",
          },
          {
            name: "Clarinet Reeds",
            price: 43.0,
            status: "Active",
            is_recommended: true,
            description_short: "Box of 10",
            description_long:
              "All woodwind instruments require a reed to produce a sound. If you've bought or hired an instrument with us we'll include one but it will likely need to be replaced within the first term. A packet of 10 should last at least 6 months for a beginner but can easily last over a year for students who look after them.",
          },
        ],
      },
    },
  });

  const trumpet = await prisma.instrument.create({
    data: {
      name: "Trumpet",
      purchase_options: [
        {
          brand: "Yamaha",
          model: "YTR2330",
          image:
            "https://res.cloudinary.com/dgji2hj3t/image/upload/v1713683153/TRUMPET_YTR2330_m4tckd.png",
          rrp: 1099.0,
          sale_price: 849.0,
          features: [
            "Yamaha YTR2330",
            "Made with monel valves",
            "Hard case included",
          ],
          status: "Available",
        },
        {
          brand: "Schagerl",
          model: "SLTR355",
          image:
            "https://res.cloudinary.com/dgji2hj3t/image/upload/v1713683152/TRUMPET_-_SLTR355_vgcddl.png",
          rrp: 1299.0,
          sale_price: 849.0,
          features: [
            "Schagerl SLTR355",
            "Gold-brass leadpipe",
            "Stainless steel valves",
          ],
          status: "Sold Out",
        },
      ],
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
        create: [
          {
            name: "Mouthpiece Brush",
            price: 5.0,
            is_recommended: false,
            status: "Active",
            description_short: "Narrow brush for cleaning mouthpiece",
            description_long:
              "Trumpet mouthpieces are narrow and require a special brush to remove the gunk and grit that accumulates within them over time. If you're just starting it's not an urgent accessory, but it's recommended to give the mouthpiece a thorough clean at least once a term.",
          },
          {
            name: "Cleaning Snake",
            price: 11.0,
            status: "Inactive",
            is_recommended: false,
            description_short: "Brush on a flexible pipe for instrument body",
            description_long:
              "Cleaning the inside of a trumpet would be near impossible without a cleaning snake. This brush on a flexible pipe can be fed through the instrument to clear out any gunk or grit that has accumulated inside it.",
          },
        ],
      },
    },
  });

  const keyboard = await prisma.instrument.create({
    data: {
      name: "Keyboard",
      purchase_options: [
        {
          brand: "Yamaha",
          model: "PSRE373",
          image:
            "https://res.cloudinary.com/dgji2hj3t/image/upload/v1713683150/KEYBOARD_-_PSRE373_sncs71.png",
          rrp: 379.99,
          sale_price: 319.0,
          features: [
            "Yamaha PSRE373",
            "622 instrument voices",
            "Built in effects and accompaniment",
          ],
          status: "Available",
        },
      ],
      can_hire: false,
      accessories: {
        create: [
          {
            name: "Sustain Pedal",
            price: 39.95,
            is_recommended: false,
            status: "Active",
            description_short: "Frequently used in piano music",
            description_long:
              "Sustain (or damper) pedals are an essential part of most piano repertoire. The pedal allows a player to sustain the sound of a key without holding it down. A beginner won't be introdued to using this pedal until at least their second year but they are a source of much fascination for young minds!",
          },
        ],
      },
    },
  });
}

const load = async () => {
  try {
    // await prisma.schoolProgram.deleteMany();
    // console.log("Deleted records in School Program table");

    // await prisma.program.deleteMany();
    // console.log("Deleted records in Program table");

    // await prisma.school.deleteMany();
    // console.log("Deleted records in School table");

    // await prisma.school_Program.deleteMany();
    // console.log("Deleted records in School_Program table");

    // await prisma.instrument.deleteMany();
    // console.log("Deleted records in Program table");

    // await prisma.accessory.deleteMany();
    // console.log("Deleted records in Accessory table");

    // await prisma.instrument_Accessory.deleteMany();
    // console.log("Deleted records in Instrument_Accessory table");

    // await prisma.enrolment_Accessory.deleteMany();
    // console.log("Deleted records in Enrolment_Accessory table");

    schoolsAndPrograms();
    instrumentsAndAccessories();
    initAdmin();
    initUser();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
