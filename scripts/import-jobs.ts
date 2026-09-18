import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type Entry = {
  company: string;
  position: string;
  jobUrl: string;
  workMode: "REMOTE" | "HYBRID" | "UNKNOWN";
  status: "APPLIED" | "NOT_APPLIED";
  appliedAt?: Date;
  interview?: { scheduledAt: Date; type: string; notes: string };
};

const entries: Entry[] = [
  {
    company: "Amusnet",
    position: "Senior JavaScript Developer",
    jobUrl:
      "https://jobs.amusnet.com/Interactive/job/Sofia-Senior-JavaScript-Developer-1766/1362906655/",
    workMode: "HYBRID",
    status: "APPLIED",
    interview: {
      scheduledAt: new Date("2026-09-16T11:00:00"),
      type: "OTHER",
      notes: "First interview",
    },
  },
  {
    company: "Commerzbank",
    position: "Front End/Full Stack разработчик (flexhub)",
    jobUrl: "https://jobs.commerzbank.com/index.php?ac=jobad&id=62366",
    workMode: "HYBRID",
    status: "APPLIED",
  },
  {
    company: "Chargebackhelp",
    position: "React Frontend Developer",
    jobUrl:
      "https://dev.bg/company/jobads/chargebackhelp-react-frontend-developer/",
    workMode: "REMOTE",
    status: "APPLIED",
  },
  {
    company: "Noto 360",
    position: "Senior Front-End Developer",
    jobUrl:
      "https://dev.bg/company/jobads/noto-360-fraud-and-compliance-senior-front-end-developer/",
    workMode: "REMOTE",
    status: "APPLIED",
  },
  {
    company: "Betty Technology",
    position: "Senior Front-End Software Engineer",
    jobUrl:
      "https://dev.bg/company/jobads/betty-technology-senior-front-end-software-engineer/",
    workMode: "HYBRID",
    status: "APPLIED",
  },
  {
    company: "Milestone Systems Bulgaria",
    position: "Senior Frontend Engineer",
    jobUrl:
      "https://dev.bg/company/jobads/milestone-systems-bulgaria-senior-frontend-engineer/",
    workMode: "HYBRID",
    status: "NOT_APPLIED",
  },
  {
    company: "Insurify",
    position: "Senior Frontend Engineer",
    jobUrl: "https://dev.bg/company/jobads/insurify-senior-frontend-engineer/",
    workMode: "HYBRID",
    status: "NOT_APPLIED",
  },
  {
    company: "Digitall",
    position: "Front-End Developer (React)",
    jobUrl: "https://dev.bg/company/jobads/digitall-front-end-developer-react/",
    workMode: "HYBRID",
    status: "NOT_APPLIED",
  },
  {
    company: "Gamito",
    position: "Senior React Developer",
    jobUrl: "https://dev.bg/company/jobads/gamito-senior-react-developer/",
    workMode: "HYBRID",
    status: "NOT_APPLIED",
  },
  {
    company: "LinkedIn",
    position: "Senior JavaScript Engineer",
    jobUrl:
      "https://www.linkedin.com/jobs/search-results/?currentJobId=4464635306&eBP=CwEAAAGgn_qxx6GKOuS5VOb6jjmJjnIwX0m8VF2akWyo-NnTXoV6hQB0uuR490whKkHeGgNbVFAwJYT2CG5x0LchAS__CW-9pTPa1a8teGYzm0Xf-cvkylz5YyN4tvGGDUlJty0dDPAr3dRtdBvi5YsjlZW3LgOSZxVsYLWelO_EyLsyh3m6eUREXQsyX_e3E1CG6o_0AjkrljZEHhWmz1yNNLNXZH6lBJZABRBkrh0ZMazlIZEDI-fw38OpDaX3Ucq0tUmP5QrEUZuC-8-tOQFOE17C0Qk6U2SwHx1f0t28YKElHef7UZSlfQNYkjDdsL7AITtUZDtn1zbIqnC0dnJxSk_LTpJmEnT0OzeTk_1RzPF0vfaH6NUfV1hynh6cYz8DNfzV9nx_mm0L2g7F_2xjTMx7HIRzids1XqWULcUXDRlDqCO0ymbB6U_4VY9CvlNzYzoUHCKt6EOO__sefVQXV9wBDGa9oWPgTp5cqIca_fH9q2ieYjD9OA&refId=imEJmWCOOZAzbz799v5w1w%3D%3D&trackingId=eeVvv42RtKqJYUaYyoZCVw%3D%3D&keywords=Frontend%20Developer&origin=FACET_SUGGESTIONS_COMMS_EMAIL&originToLandingJobPostings=4454508451%2C4465820145&geoId=103835801&distance=25.0&f_TPR=r1296000&f_SAL=f_SA_id_225001%3A272001",
    workMode: "REMOTE",
    status: "NOT_APPLIED",
  },
  {
    company: "LinkedIn",
    position: "Senior JavaScript Engineer",
    jobUrl:
      "https://www.linkedin.com/jobs/search-results/?currentJobId=4410572334&eBP=CwEAAAGgn_qxx2ayu0UBrCy2BwsSJMuzKnc34ecQ2GL6BFaiB-vyKfbgtqPcC45yhANzqdIpO9T4n4X96BW3FOeOhQDols-mshL_epDAjnzqrmDUwAG_X6RigSaY3gWspEwLISUm3ziViKlBxc1UFJMNinqFwsHyxIFXaoFcduON2Z1HDTbOCv5sYRWLJgeoauyni_kBfZPlOOGAth5zPIgSZd6jpQ-Hd7icgLfGqEeN4YYdtpLBbWOwMhPn3pc6QQ-8Xl-vB9kP2E0ZOxKeIv8hb9UY2pdakSchvOj4LFN8cJXxOWJUAH5UdQv8lXNCGOaf_wjAo9Br87KNSBS06lNAa66lo5h3fe_Eg1IInDlkcoVYTGnkUqHDyiQODMnDManwgJBD04Vvp6K7x8iAZVl1rqJ8_M-VmSb6Pe6W9Jl25aZc7cY9e1snQ6qW_eHnvSCnYybAY2qyzLd4Ejy8VXkSeNdSCcn6cJStWieywSPnwh07xAfRZiWOTg&refId=imEJmWCOOZAzbz799v5w1w%3D%3D&trackingId=WDVgTfM7pkcaOioFa8yhjQ%3D%3D&keywords=Frontend%20Developer&origin=FACET_SUGGESTIONS_COMMS_EMAIL&originToLandingJobPostings=4454508451%2C4465820145&geoId=103835801&distance=25.0&f_TPR=r1296000&f_SAL=f_SA_id_225001%3A272001",
    workMode: "REMOTE",
    status: "NOT_APPLIED",
  },
  {
    company: "LinkedIn",
    position: "Senior Frontend Developer",
    jobUrl:
      "https://www.linkedin.com/jobs/search-results/?currentJobId=4465057650&eBP=CwEAAAGgn_qxyPZjNg35dOvf1W46VRD1rj1IcFfpAnwmUvjkYM6PUw_T5v3pLj9ATQSkW8XnYWKR_lLaWY2VM9FBi28dH8sD3FdwQutXs52pOfjhTEamyuUDQYySxfx9SY-u6HBcMaL-kxEwBwsYjngAh-Rgci_x7uW3r6wHdPVzoPD7C0lvuzVVyur3l4zwg7mYVJ9St-eURTltJ5Ps6WhdhLCeZyDDw0hjYiFRGvIv_nInFgS6H1yReq9HZqUM_89m_MLRUtdmmR_04Hyg0_DezHeEt6PjEw-f9eDi9RJokwlzbsluRaRlzyTu1pCRTMBzw6zDxuICBZxcGhalkJSLbRx5k4h0P8IrWvPk08YULojfZZlFdKnf0eJb-SlumpzZ5YEnz2hkFt_-84gBnsHeyCyUMsiFhFEanRZDKRA3H50GNh-DXrrIRL5zbWpci5YJcgNrDSq55JxdD1nZz34vE7xnzjK_ylLKodpMk9ZE2Dgzn5bCf4Y&refId=imEJmWCOOZAzbz799v5w1w%3D%3D&trackingId=y1Xb8O4EGXODwjdRXANmsw%3D%3D&keywords=Frontend%20Developer&origin=FACET_SUGGESTIONS_COMMS_EMAIL&originToLandingJobPostings=4454508451%2C4465820145&geoId=103835801&distance=25.0&f_TPR=r1296000&f_SAL=f_SA_id_225001%3A272001",
    workMode: "REMOTE",
    status: "NOT_APPLIED",
  },
  {
    company: "Jobs.bg",
    position: "Vue.js Developer",
    jobUrl: "https://www.jobs.bg/job/8617831",
    workMode: "REMOTE",
    status: "APPLIED",
  },
  {
    company: "A1 Bulgaria",
    position: "JS Full-Stack Developer",
    jobUrl:
      "https://dev.bg/company/jobads/a1-bulgaria-js-full-stack-developer/",
    workMode: "UNKNOWN",
    status: "NOT_APPLIED",
  },
];

async function main() {
  const [beforeApps, beforeCompanies] = await Promise.all([
    db.application.count(),
    db.company.count(),
  ]);

  let created = 0;
  let skipped = 0;

  for (const entry of entries) {
    const existing = await db.application.findFirst({
      where: { jobUrl: entry.jobUrl },
    });
    if (existing) {
      skipped += 1;
      continue;
    }

    let company = await db.company.findFirst({
      where: { name: entry.company },
    });
    if (!company) {
      company = await db.company.create({ data: { name: entry.company } });
    }

    await db.application.create({
      data: {
        companyId: company.id,
        position: entry.position,
        jobUrl: entry.jobUrl,
        workMode: entry.workMode,
        status: entry.status,
        appliedAt: entry.appliedAt,
        interviews: entry.interview
          ? {
              create: [
                {
                  scheduledAt: entry.interview.scheduledAt,
                  type: entry.interview.type as never,
                  notes: entry.interview.notes,
                },
              ],
            }
          : undefined,
      },
    });
    created += 1;
  }

  const [afterApps, afterCompanies] = await Promise.all([
    db.application.count(),
    db.company.count(),
  ]);

  console.log(`Applications: ${beforeApps} -> ${afterApps} (created ${created}, skipped ${skipped})`);
  console.log(`Companies:   ${beforeCompanies} -> ${afterCompanies}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());