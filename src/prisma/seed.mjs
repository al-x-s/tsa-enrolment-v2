import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

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
      username: "John",
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
      username: "Jane",
      email: process.env.INIT_USER_EMAIL,
      password_hash,
      role: "user",
    },
  });
}

const createGrades = async () => {
  const grades = [
    { order: 0, name: "Kindergarten", category: "Primary" },
    { order: 1, name: "Year 1", category: "Primary" },
    { order: 2, name: "Year 2", category: "Primary" },
    { order: 3, name: "Year 3", category: "Primary" },
    { order: 4, name: "Year 4", category: "Primary" },
    { order: 5, name: "Year 5", category: "Primary" },
    { order: 6, name: "Year 6", category: "Primary" },
    { order: 7, name: "Year 7", category: "Secondary" },
    { order: 8, name: "Year 8", category: "Secondary" },
    { order: 9, name: "Year 9", category: "Secondary" },
    { order: 10, name: "Year 10", category: "Secondary" },
    { order: 11, name: "Year 11", category: "Secondary" },
    { order: 12, name: "Year 12", category: "Secondary" },
  ];

  for (const grade of grades) {
    await prisma.grade.create({
      data: {
        order: grade.order,
        name: grade.name,
        state_territory: "NSW",
        category: grade.category,
      },
    });
  }
};

const createAccessories = async () => {
  const accessories = [
    {
      name: "Music Stand",
      price: 31,
      status: "Active",
      is_recommended: true,
      description_short: "Essential for home practice",
      description_long:
        "A height adjustable music stand is a must for any student wanting to learn an instrument. Using a table or any flat surface to hold your music will make it difficult to read, difficult to learn, and difficult to produce a good sound.",
    },
    {
      name: "Clarinet Reeds",
      price: 43,
      status: "Active",
      is_recommended: true,
      description_short: "Box of 10",
      description_long:
        "All woodwind instruments require a reed to produce a sound. If you've bought or hired an instrument with us we'll include one but it will likely need to be replaced within the first term. A packet of 10 should last at least 6 months for a beginner but can easily last over a year for students who look after them.",
    },
    {
      name: "Mouthpiece Brush",
      price: 5,
      is_recommended: false,
      status: "Active",
      description_short: "Narrow brush for cleaning mouthpiece",
      description_long:
        "Trumpet mouthpieces are narrow and require a special brush to remove the gunk and grit that accumulates within them over time. If you're just starting it's not an urgent accessory, but it's recommended to give the mouthpiece a thorough clean at least once a term.",
    },
    {
      name: "Cleaning Snake",
      price: 11,
      status: "Inactive",
      is_recommended: false,
      description_short: "Brush on a flexible pipe for instrument body",
      description_long:
        "Cleaning the inside of a trumpet would be near impossible without a cleaning snake. This brush on a flexible pipe can be fed through the instrument to clear out any gunk or grit that has accumulated inside it.",
    },
    {
      name: "Sustain Pedal",
      price: 40,
      is_recommended: false,
      status: "Active",
      description_short: "Frequently used in piano music",
      description_long:
        "Sustain (or damper) pedals are an essential part of most piano repertoire. The pedal allows a player to sustain the sound of a key without holding it down. A beginner won't be introdued to using this pedal until at least their second year but they are a source of much fascination for young minds!",
    },
  ];

  for (const accessory of accessories) {
    await prisma.accessory.create({
      data: accessory,
    });
  }
};

const createInstrumentModel = async () => {
  const models = [
    // CLARINETS
    {
      brand: "Yamaha",
      model: "YCL255",
      image: "CLARINET_-_YCL255_oigyk6",
      rrp: 1099.0,
      sale_price: 849.0,
      status: "Sold_Out",
    },
    {
      brand: "Jupiter",
      model: "JCL700NA",
      image: "CLARINET_-_JCL700NA_cmwgfj",
      rrp: 895.0,
      sale_price: 685.0,
      status: "Available",
    },
    // TRUMPET
    {
      brand: "Yamaha",
      model: "YTR2330",
      image: "TRUMPET_YTR2330_m4tckd",
      rrp: 1099.0,
      sale_price: 849.0,
      status: "Available",
    },
    {
      brand: "Schagerl",
      model: "SLTR355",
      image: "TRUMPET_-_SLTR355_vgcddl",
      rrp: 1299.0,
      sale_price: 849.0,
      status: "Sold_Out",
    },
    // KEYBOARD
    {
      brand: "Yamaha",
      model: "PSRE373",
      image: "KEYBOARD_-_PSRE373_sncs71",
      rrp: 379.99,
      sale_price: 319.0,
      status: "Available",
    },
  ];

  for (const model of models) {
    await prisma.instrumentModel.create({
      data: model,
    });
  }
};

const createInstruments = async () => {
  const instruments = [
    {
      name: "Flute",
      program_type: "Band",
      can_hire: true,
      hire_cost: 30,
      hire_insurance: 31,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "Clarinet",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
      models: {
        connect: [{ model: "YCL255" }, { model: "JCL700NA" }],
      },
    },
    {
      name: "Trumpet",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [
          { name: "Music Stand" },
          { name: "Mouthpiece Brush" },
          { name: "Cleaning Snake" },
        ],
      },
      models: {
        connect: [{ model: "YTR2330" }, { model: "SLTR355" }],
      },
    },
    {
      name: "Keyboard",
      program_type: "Keyboard",
      can_hire: false,
      accessories: {
        connect: [{ name: "Sustain Pedal" }],
      },
      models: { connect: [{ model: "PSRE373" }] },
    },
    {
      name: "Trombone",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }, { name: "Mouthpiece Brush" }],
      },
    },
    {
      name: "Euphonium",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }, { name: "Mouthpiece Brush" }],
      },
    },
    {
      name: "Percussion",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "Bass Guitar",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "French Horn",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }, { name: "Mouthpiece Brush" }],
      },
    },
    {
      name: "Baritone Horn",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }, { name: "Mouthpiece Brush" }],
      },
    },
    {
      name: "Bass Clarinet",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "Keyboard Bass",
      program_type: "Band",
      can_hire: false,
      accessories: {
        connect: [{ name: "Sustain Pedal" }],
      },
      models: { connect: [{ model: "PSRE373" }] },
    },
    {
      name: "Alto Saxophone",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "Tenor Saxophone",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
    {
      name: "Baritone Saxophone",
      program_type: "Band",
      can_hire: true,
      hire_cost: 43,
      hire_insurance: 3,
      accessories: {
        connect: [{ name: "Music Stand" }],
      },
    },
  ];

  for (const instrument of instruments) {
    await prisma.instrument.create({
      data: instrument,
    });
  }
};

const createPrograms = async () => {
  const programs = [
    {
      name: "B&G",
      description: "Group Tuition and Band Rehearsals",
      tuition_fee: 220,
      rehearsal_fee: 0,
      type: "Band",
      classType: "Group",
      program_status: "Active",
      enrol_fee: 30,
    },
    {
      name: "B&Pr",
      description: "Private Tuition and Band Rehearsals",

      tuition_fee: 500,
      rehearsal_fee: 110,
      type: "Band",
      classType: "Private",
      program_status: "Active",
      enrol_fee: 30,
    },
    {
      name: "Band Only",
      description: "Band Rehearsals Only",

      tuition_fee: 0,
      rehearsal_fee: 110,
      type: "Band",
      classType: "Rehearsal",
      program_status: "Inactive",
      enrol_fee: 30,
    },
    {
      name: "KeyGrp",
      type: "Keyboard",
      description: "Group Keyboard Tuition",
      tuition_fee: 110,
      rehearsal_fee: 0,
      classType: "Group",
      program_status: "Active",
      enrol_fee: 30,
    },
    {
      name: "KeyPr",
      type: "Keyboard",
      description: "Private Keyboard Tuition",
      tuition_fee: 300,
      rehearsal_fee: 0,
      classType: "Private",
      program_status: "Active",
      enrol_fee: 30,
    },
  ];

  for (const program of programs) {
    await prisma.program.create({
      data: program,
    });
  }
};

async function createSchools() {
  const arcadia = await prisma.school.create({
    data: {
      name: "Arcadia PS",
      state_territory: "NSW",
      facility_hire: 0,
      resource_levy: 10,
      offers_instrument_rental: false,
      instruments: {
        create: [
          { status: "Unavailable", instrument: { connect: { name: "Flute" } } },
          { instrument: { connect: { name: "Clarinet" } } },
          {
            status: "Hidden",
            instrument: { connect: { name: "Bass Clarinet" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Alto Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Tenor Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Baritone Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "French Horn" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Baritone Horn" } },
          },
          { status: "Hidden", instrument: { connect: { name: "Euphonium" } } },
          { instrument: { connect: { name: "Trumpet" } } },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Trombone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Keyboard Bass" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Bass Guitar" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Percussion" } },
          },
        ],
      },
      grades: {
        create: [
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 3",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 4",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 5",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 6",
                  state_territory: "NSW",
                },
              },
            },
          },
        ],
      },
      programs: {
        create: [
          {
            status: "Active",
            program: {
              connect: { name: "B&G" },
            },
          },
          {
            status: "Active",
            program: {
              connect: { name: "B&Pr" },
            },
          },
          {
            status: "Active",
            program: {
              connect: { name: "Band Only" },
            },
          },
        ],
      },
    },
  });

  const smr = await prisma.school.create({
    data: {
      name: "St Mary's Rydalmere",
      state_territory: "NSW",
      facility_hire: 0,
      resource_levy: 10,
      offers_instrument_rental: true,
      grades: {
        create: [
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 3",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 4",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 5",
                  state_territory: "NSW",
                },
              },
            },
          },
          {
            grade: {
              connect: {
                name_state_territory: {
                  name: "Year 6",
                  state_territory: "NSW",
                },
              },
            },
          },
        ],
      },
      instruments: {
        create: [
          { status: "Unavailable", instrument: { connect: { name: "Flute" } } },
          { instrument: { connect: { name: "Clarinet" } } },
          {
            status: "Hidden",
            instrument: { connect: { name: "Bass Clarinet" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Alto Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Tenor Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Baritone Saxophone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "French Horn" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Baritone Horn" } },
          },
          { status: "Hidden", instrument: { connect: { name: "Euphonium" } } },
          { instrument: { connect: { name: "Trumpet" } } },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Trombone" } },
          },
          {
            status: "Hidden",
            instrument: { connect: { name: "Keyboard Bass" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Bass Guitar" } },
          },
          {
            status: "Unavailable",
            instrument: { connect: { name: "Percussion" } },
          },
          {
            instrument: { connect: { name: "Keyboard" } },
          },
        ],
      },
      programs: {
        create: [
          {
            status: "Active",
            program: {
              connect: { name: "B&G" },
            },
          },
          {
            status: "Active",
            program: {
              connect: { name: "B&Pr" },
            },
          },
          {
            status: "Active",
            program: {
              connect: { name: "KeyGrp" },
            },
          },
          {
            status: "Inactive",
            program: {
              connect: { name: "KeyPr" },
            },
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

    await initAdmin();
    console.log("InitAdmin ran successfully");
    await initUser();
    console.log("InitUser ran successfully");
    await createGrades();
    console.log("CreateGrades ran successfully");
    await createAccessories();
    console.log("CreateAccessories ran successfully");
    await createInstrumentModel();
    console.log("CreateInstrumentModels ran successfully");
    await createInstruments();
    console.log("CreateInstruments ran successfully");
    await createPrograms();
    console.log("CreatePrograms ran successfully");
    await createSchools();
    console.log("CreateSchools ran successfully");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
