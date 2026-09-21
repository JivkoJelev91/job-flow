import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

/**
 * Helper that returns a date at noon, `offset` days from today.
 * The seed is relative to "today" so upcoming interviews and overdue
 * actions always look realistic whenever the database is seeded.
 */
function day(offset: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

const DEFAULT_TASKS = [
  "Review and update your résumé",
  "Follow up on pending applications",
  "Research 3 new companies to apply to",
  "Polish your LinkedIn profile",
  "Prepare for upcoming interviews",
];

async function main() {
  const force = process.env.SEED_FORCE === "1";

  // Tasks are safe to seed any time — only added when the table is empty so
  // new databases get a few starter tasks.
  if ((await db.task.count()) === 0) {
    await db.task.createMany({
      data: DEFAULT_TASKS.map((title) => ({ title })),
    });
    console.log(`Seeded ${DEFAULT_TASKS.length} default tasks.`);
  }

  const [applications, companies] = await Promise.all([
    db.application.count(),
    db.company.count(),
  ]);
  if ((applications > 0 || companies > 0) && !force) {
    console.error(
      `Refusing to seed: ${applications} application(s) and ${companies} company(ies) already exist. ` +
        "This seed deletes all existing data. Set SEED_FORCE=1 to wipe and reseed.",
    );
    return;
  }

  await db.note.deleteMany();
  await db.interview.deleteMany();
  await db.application.deleteMany();
  await db.company.deleteMany();

  const acme = await db.company.create({
    data: {
      name: "Acme Corp",
      website: "https://acme.com",
      industry: "SaaS",
      notes: "Enterprise software vendor, growing platform team.",
    },
  });

  const northwind = await db.company.create({
    data: {
      name: "Northwind Trading",
      website: "https://northwind.io",
      industry: "E-commerce",
      notes: "Fast-growing marketplace startup.",
    },
  });

  const glacier = await db.company.create({
    data: {
      name: "Glacier Analytics",
      website: "https://glacier.co",
      industry: "Data & Analytics",
    },
  });

  const meridian = await db.company.create({
    data: {
      name: "Meridian Health",
      website: "https://meridian.health",
      industry: "Healthcare",
    },
  });

  const quantum = await db.company.create({
    data: {
      name: "Quantum Bank",
      website: "https://qbank.com",
      industry: "Fintech",
    },
  });

  const westwind = await db.company.create({
    data: {
      name: "Westwind Studios",
      website: "https://westwind.studio",
      industry: "Gaming",
    },
  });

  const helios = await db.company.create({
    data: {
      name: "Helios Energy",
      website: "https://helios.energy",
      industry: "Clean Energy",
    },
  });

  const cloudline = await db.company.create({
    data: {
      name: "Cloudline Systems",
      website: "https://cloudline.dev",
      industry: "Cloud Infrastructure",
    },
  });

  const arete = await db.company.create({
    data: {
      name: "Arete Ventures",
      website: "https://arete.vc",
      industry: "Marketing",
    },
  });

  await db.application.create({
    data: {
      companyId: acme.id,
      position: "Senior Software Engineer",
      jobUrl: "https://acme.com/careers/senior-software-engineer",
      jobDescription:
        "Design and build the core platform services. Strong TypeScript and distributed systems skills required.",
      salaryMin: 120000,
      salaryMax: 150000,
      currency: "USD",
      location: "Remote (US)",
      workMode: "REMOTE",
      employmentType: "FULL_TIME",
      status: "INTERVIEW",
      appliedAt: day(-35),
      nextAction: "Send thank-you email after technical round",
      nextActionDate: day(1),
      interviews: {
        create: [
          {
            scheduledAt: day(-21),
            type: "HR",
            location: "Google Meet",
            result: "Passed",
            notes: "Talked about the team structure and expectations.",
          },
          {
            scheduledAt: day(7),
            type: "TECHNICAL",
            location: "Google Meet",
            notes: "System design + coding round with the platform team.",
          },
        ],
      },
      notes: {
        create: [
          {
            content: "Recruiter is friendly and responds within a day. Company seems well funded.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: northwind.id,
      position: "Frontend Engineer",
      jobUrl: "https://northwind.io/jobs/frontend-engineer",
      jobDescription:
        "Build the customer-facing storefront with React, TypeScript and Remix.",
      salaryMin: 110000,
      salaryMax: 130000,
      currency: "USD",
      location: "Amsterdam",
      workMode: "OFFICE",
      employmentType: "FULL_TIME",
      status: "APPLIED",
      appliedAt: day(-16),
      nextAction: "Follow up with recruiter",
      nextActionDate: day(12),
      notes: {
        create: [
          {
            content: "Tech stack: React + TypeScript + Remix. Remote-friendly leadership.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: glacier.id,
      position: "Data Engineer",
      jobUrl: "https://glacier.co/careers/data-engineer",
      jobDescription:
        "Own the data pipelines and warehouse. SQL, dbt and Airflow experience valued.",
      salaryMin: 95000,
      salaryMax: 125000,
      currency: "EUR",
      location: "Berlin",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      status: "INTERVIEW",
      appliedAt: day(-24),
      nextAction: "Prepare technical round material",
      nextActionDate: day(1),
      interviews: {
        create: [
          {
            scheduledAt: day(-10),
            type: "PHONE",
            result: "Passed",
            notes: "Quick screening call, went well.",
          },
          {
            scheduledAt: day(2),
            type: "ONSITE",
            location: "Berlin office",
            notes: "Meet the analytics team.",
          },
        ],
      },
      notes: {
        create: [
          {
            content: "Team is small but experienced. Highlight dbt experience in technical round.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: meridian.id,
      position: "Product Manager",
      jobUrl: "https://meridian.health/jobs/product-manager",
      jobDescription:
        "Own the patient-facing product roadmap and coordinate with engineering.",
      salaryMin: 140000,
      salaryMax: 165000,
      currency: "USD",
      location: "Remote",
      workMode: "REMOTE",
      employmentType: "FULL_TIME",
      status: "OFFER",
      appliedAt: day(-60),
      nextAction: "Review offer and benefits package",
      nextActionDate: day(4),
      interviews: {
        create: [
          {
            scheduledAt: day(-55),
            type: "HR",
            result: "Passed",
          },
          {
            scheduledAt: day(-30),
            type: "ONSITE",
            result: "Offer extended",
            notes: "Panel interview with product and eng leadership.",
          },
        ],
      },
      notes: {
        create: [
          {
            content: "Offer received. Compare with other options before accepting.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: quantum.id,
      position: "Backend Engineer (Go)",
      jobUrl: "https://qbank.com/careers/backend-engineer-go",
      jobDescription:
        "Build payment processing microservices in Go on top of PostgreSQL.",
      salaryMin: 130000,
      salaryMax: 145000,
      currency: "USD",
      location: "New York",
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      status: "REJECTED",
      appliedAt: day(-100),
      notes: {
        create: [
          {
            content: "Feedback: moved forward with more senior candidates. Reapply in a year.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: westwind.id,
      position: "Gameplay Programmer",
      jobUrl: "https://westwind.studio/careers/gameplay-programmer",
      jobDescription: "Implement gameplay systems for our upcoming open-world title.",
      salaryMin: 85000,
      salaryMax: 105000,
      currency: "USD",
      location: "Montreal",
      workMode: "OFFICE",
      employmentType: "FULL_TIME",
      status: "GHOSTED",
      appliedAt: day(-110),
      notes: {
        create: [
          {
            content: "No response after two follow-ups. Assume not moving forward.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: helios.id,
      position: "Data Scientist",
      jobUrl: "https://helios.energy/jobs/data-scientist",
      jobDescription:
        "Forecast energy demand using time-series models and guide investment decisions.",
      salaryMin: 100000,
      salaryMax: 130000,
      currency: "USD",
      location: "Remote",
      workMode: "REMOTE",
      employmentType: "FULL_TIME",
      status: "NOT_APPLIED",
      deadline: day(13),
      nextAction: "Research the team and draft application",
      nextActionDate: day(7),
      notes: {
        create: [
          {
            content: "Application closes soon. Portfolio projects in renewable energy are a plus.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: cloudline.id,
      position: "DevOps Engineer",
      jobUrl: "https://cloudline.dev/jobs/devops-engineer",
      jobDescription:
        "Own CI/CD, infrastructure as code and Kubernetes clusters at scale.",
      salaryMin: 130000,
      salaryMax: 160000,
      currency: "USD",
      location: "Remote (EU)",
      workMode: "REMOTE",
      employmentType: "FULL_TIME",
      status: "INTERVIEW",
      appliedAt: day(-17),
      nextAction: "Follow up about technical interview feedback",
      nextActionDate: day(-3),
      interviews: {
        create: [
          {
            scheduledAt: day(5),
            type: "TECHNICAL",
            location: "Zoom",
            notes: "Kubernetes troubleshooting scenario.",
          },
        ],
      },
      notes: {
        create: [
          {
            content: "Next action is overdue — follow up today.",
          },
        ],
      },
    },
  });

  await db.application.create({
    data: {
      companyId: arete.id,
      position: "Growth Marketing Consultant",
      jobUrl: "https://arete.vc/jobs/growth-consultant",
      jobDescription: "Short-term engagement to revamp acquisition funnels.",
      salaryMin: 90000,
      salaryMax: 110000,
      currency: "USD",
      location: "Remote",
      workMode: "HYBRID",
      employmentType: "CONTRACT",
      status: "CLOSED",
      appliedAt: day(-45),
      notes: {
        create: [
          {
            content: "Withdrew — accepted an internal role at my current employer.",
          },
        ],
      },
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());