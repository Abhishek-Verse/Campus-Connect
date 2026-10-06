import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./index";
import {
  announcements,
  certificates,
  clubs,
  events,
  notifications,
  registrations,
  sessions,
  users,
} from "./schema";
import { randomCode } from "@/lib/utils";

const PASSWORD = "campus123";

function at(daysFromNow: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d;
}

// deterministic LCG for repeatable pseudo-random choices
let seedState = 42;
function rand() {
  seedState = (seedState * 1664525 + 1013904223) % 4294967296;
  return seedState / 4294967296;
}

const INTEREST_POOL = [
  "Coding",
  "AI / ML",
  "Design",
  "Robotics",
  "Music",
  "Dance",
  "Sports",
  "Entrepreneurship",
  "Photography",
  "Gaming",
  "Public Speaking",
  "Cybersecurity",
];

const FAKE_STUDENTS = [
  "Aarav Sharma", "Diya Patel", "Rohan Mehta", "Sara Khan", "Vikram Iyer",
  "Ananya Reddy", "Karthik Nair", "Priya Desai", "Aditya Gupta", "Nisha Verma",
  "Rahul Bose", "Tanvi Joshi", "Arnav Singh", "Ishita Rao", "Dev Malhotra",
  "Kavya Pillai", "Nikhil Kulkarni", "Ritika Saxena", "Siddharth Menon", "Aisha Mirza",
  "Varun Chawla", "Meera Krishnan", "Yash Thakur", "Simran Kaur", "Farhan Ali",
  "Lakshmi Narayan", "Aryan Dubey", "Pooja Hegde", "Rajat Kapoor", "Sneha Kulkarni",
  "Imran Sheikh", "Gauri Shinde", "Neel Agarwal", "Tara Bhatt", "Kunal Chandra",
  "Riya Bansal", "Sameer Qureshi", "Anika Pillai", "Dhruv Tandon", "Maya Sridhar",
  "Omar Abdullah", "Zara Ansari",
];

async function main() {
  console.log("Seeding CampusConnect…");

  // wipe in FK-safe order
  await db.delete(notifications);
  await db.delete(certificates);
  await db.delete(announcements);
  await db.delete(registrations);
  await db.delete(sessions);
  await db.delete(events);
  await db.delete(users);
  await db.delete(clubs);

  /* ------------------------------- clubs ------------------------------- */
  const clubSeed = [
    { slug: "codesphere", name: "CodeSphere", tagline: "The coding & developer society", color: "#d63b22" },
    { slug: "ai-society", name: "AI Society", tagline: "Machine learning, research & builders", color: "#0f766e" },
    { slug: "pixel-pulse", name: "Pixel & Pulse", tagline: "The design collective", color: "#c2185b" },
    { slug: "euphony", name: "Euphony", tagline: "Music & cultural club", color: "#b45309" },
    { slug: "robotech", name: "RoboTech", tagline: "Robotics & hardware crew", color: "#3f6212" },
    { slug: "athletics", name: "TCET Athletics", tagline: "The sports council", color: "#166534" },
    { slug: "e-cell", name: "E-Cell", tagline: "Entrepreneurship cell", color: "#1d4ed8" },
  ];
  const clubRows = await db.insert(clubs).values(clubSeed).returning();
  const clubBySlug = new Map(clubRows.map((c) => [c.slug, c]));

  /* ------------------------------- users -------------------------------- */
  const hash = bcrypt.hashSync(PASSWORD, 10);

  const [admin] = await db
    .insert(users)
    .values({
      name: "Aarav Menon",
      email: "admin@tcet.edu",
      passwordHash: hash,
      role: "admin",
    })
    .returning();

  const leadSeeds = [
    ["Rhea Kapoor", "codesphere@tcet.edu", "codesphere"],
    ["Arjun Nair", "ai@tcet.edu", "ai-society"],
    ["Zoya Sheikh", "design@tcet.edu", "pixel-pulse"],
    ["Kabir Rao", "euphony@tcet.edu", "euphony"],
    ["Ishan Verma", "robotech@tcet.edu", "robotech"],
    ["Dev Patel", "athletics@tcet.edu", "athletics"],
    ["Ananya Bose", "ecell@tcet.edu", "e-cell"],
  ] as const;
  await db.insert(users).values(
    leadSeeds.map(([name, email, slug]) => ({
      name,
      email,
      passwordHash: hash,
      role: "club" as const,
      clubId: clubBySlug.get(slug)!.id,
    })),
  );

  const [meera] = await db
    .insert(users)
    .values({
      name: "Meera Iyer",
      email: "meera@student.tcet.edu",
      passwordHash: hash,
      role: "student",
      interests: ["Coding", "AI / ML", "Design"],
    })
    .returning();

  const fakeStudents = await db
    .insert(users)
    .values(
      FAKE_STUDENTS.map((name, i) => {
        const interests = [
          INTEREST_POOL[Math.floor(rand() * INTEREST_POOL.length)],
          INTEREST_POOL[Math.floor(rand() * INTEREST_POOL.length)],
        ].filter((v, idx, arr) => arr.indexOf(v) === idx);
        return {
          name,
          email: `student${String(i + 1).padStart(2, "0")}@student.tcet.edu`,
          passwordHash: hash,
          role: "student" as const,
          interests,
        };
      }),
    )
    .returning();

  /* ------------------------------- events ------------------------------ */
  type EventSeed = {
    key: string;
    title: string;
    description: string;
    category: (typeof events.$inferInsert)["category"];
    club: string;
    venue: string;
    start: Date;
    hours: number;
    capacity: number;
    poster?: string;
    approval?: boolean;
    tags: string[];
  };
  const eventSeeds: EventSeed[] = [
    {
      key: "neurohack",
      title: "NeuroHack '26",
      description:
        "A 24-hour machine-learning hackathon where teams ship working prototypes overnight. Datasets, mentors from the AI lab, GPUs and unlimited coffee provided. Bring your wildest idea — solo hackers welcome, teams form on Day 0.\n\nJudging favours working demos over slideware. Winning team fast-tracks to the national finals.",
      category: "hackathon",
      club: "codesphere",
      venue: "Innovation Lab, Block C",
      start: at(9, 18),
      hours: 24,
      capacity: 50,
      poster: "/posters/hackathon.jpg",
      tags: ["Coding", "AI / ML", "Gaming"],
    },
    {
      key: "aurorafest",
      title: "Aurora Cultural Fest",
      description:
        "The flagship cultural evening of the semester — dance crews, battle of bands, stand-up and a food street on the lawns. Open to all years; perform or just soak it in.\n\nRegistrations close for performers a week early; audience seats are first-come at the gate with your QR ticket.",
      category: "cultural",
      club: "euphony",
      venue: "Main Amphitheatre",
      start: at(14, 17),
      hours: 5,
      capacity: 300,
      poster: "/posters/cultural.jpg",
      tags: ["Music", "Dance"],
    },
    {
      key: "basketball",
      title: "Inter-College Basketball Championship",
      description:
        "Eight colleges. One court. The annual hardwood showdown returns to the Indoor Sports Complex with group stages on Day 1 and knockouts on Day 2.\n\nSpectator entry is free with registration — the home crowd decides the noise award.",
      category: "sports",
      club: "athletics",
      venue: "Indoor Sports Complex",
      start: at(7, 15),
      hours: 8,
      capacity: 64,
      poster: "/posters/sports.jpg",
      tags: ["Sports"],
    },
    {
      key: "webdev",
      title: "Full-Stack Web Dev Bootcamp",
      description:
        "Two weekends, zero fluff: go from HTML basics to deploying a database-backed app. We cover routing, APIs, auth and deployment, then you build a mini project in pairs.\n\nBring a laptop with Node.js LTS installed. Completion certificates issued on check-out after Day 2.",
      category: "workshop",
      club: "codesphere",
      venue: "Lab 4, CS Block",
      start: at(5, 10),
      hours: 6,
      capacity: 60,
      poster: "/posters/workshop.jpg",
      tags: ["Coding"],
    },
    {
      key: "genai",
      title: "Generative AI Hands-on Workshop",
      description:
        "Prompt engineering, retrieval pipelines and fine-tuning demystified in one afternoon — with live demos you can break and fix. Limited lab machines, so registrations are reviewed by the club.\n\nPriority to students who've finished Python: Zero to Hero or equivalent.",
      category: "workshop",
      club: "ai-society",
      venue: "AI & DS Lab",
      start: at(11, 11),
      hours: 4,
      capacity: 80,
      poster: "/posters/ai.jpg",
      approval: true,
      tags: ["AI / ML", "Coding"],
    },
    {
      key: "robowars",
      title: "RoboWars: Arena Combat",
      description:
        "15 kg of spinning steel in a polycarbonate cage. Register your bot or watch the carnage from the stands — either way, sparks will fly.\n\nSafety inspection is mandatory at 1 PM for participating teams.",
      category: "technical",
      club: "robotech",
      venue: "Robotics Arena",
      start: at(16, 14),
      hours: 6,
      capacity: 40,
      poster: "/posters/robotics.jpg",
      tags: ["Robotics", "Gaming"],
    },
    {
      key: "acoustic",
      title: "Euphony Live: Acoustic Night",
      description:
        "Unplugged sets under fairy lights at the open-air theatre — campus bands, solo artists and one secret headliner. Blankets and chai encouraged.\n\nGates open 6 PM. Entry strictly via QR ticket.",
      category: "cultural",
      club: "euphony",
      venue: "Open-Air Theatre",
      start: at(4, 18, 30),
      hours: 3,
      capacity: 200,
      poster: "/posters/music.jpg",
      tags: ["Music"],
    },
    {
      key: "designathon",
      title: "Designathon: 24h UI Marathon",
      description:
        "A sprint for interface obsessives. Redesign a real campus app in 24 hours — research, wireframe, polish, pitch. Figma licenses and critique sessions from industry designers included.\n\nTeams of two. Portfolio-worthy output guaranteed.",
      category: "hackathon",
      club: "pixel-pulse",
      venue: "Design Studio, Architecture Block",
      start: at(12, 9),
      hours: 24,
      capacity: 36,
      poster: "/posters/design.jpg",
      tags: ["Design"],
    },
    {
      key: "pitchnight",
      title: "Startup Pitch Night",
      description:
        "Ten student founders, five minutes each, one very honest panel of alumni investors. Watch how real pitches land — or bring your own and register for the open mic slot.\n\nNetworking over snacks afterwards in the atrium.",
      category: "seminar",
      club: "e-cell",
      venue: "Auditorium B",
      start: at(18, 17),
      hours: 3,
      capacity: 120,
      tags: ["Entrepreneurship", "Public Speaking"],
    },
    {
      key: "photowalk",
      title: "Golden Hour Photo Walk",
      description:
        "Chase the light across campus with the design club's photographers. Architecture, candid portraits and that perfect 6:47 PM glow. Any camera works — yes, phones count.\n\nBest shot gets printed for the library exhibition wall.",
      category: "cultural",
      club: "pixel-pulse",
      venue: "Meet at North Gate",
      start: at(6, 16, 30),
      hours: 2,
      capacity: 30,
      tags: ["Photography"],
    },
    {
      key: "esports",
      title: "National Esports Cup — Campus Qualifier",
      description:
        "The regional qualifier for the national collegiate circuit. Valorant and FIFA brackets, shoutcasters, and a crowd that takes this very seriously.\n\nSeats are extremely limited — registration closes the moment the bracket fills.",
      category: "sports",
      club: "athletics",
      venue: "Gaming Lounge, Student Centre",
      start: at(21, 12),
      hours: 7,
      capacity: 16,
      tags: ["Gaming", "Sports"],
    },
    {
      key: "cyberseminar",
      title: "Cybersecurity Career Seminar",
      description:
        "SOC analysts, red-teamers and one ex-forensics lead walk through what security careers actually look like — certs that matter, labs to practice, and campus hiring pipelines.\n\nIncludes a live phishing demo (volunteers get a free security audit of their inbox habits).",
      category: "seminar",
      club: "codesphere",
      venue: "Seminar Hall 2",
      start: at(13, 15),
      hours: 2,
      capacity: 150,
      tags: ["Cybersecurity", "Coding"],
    },
    /* ------------------------------ past ------------------------------ */
    {
      key: "python",
      title: "Python: Zero to Hero",
      description: "A gentle but thorough intro to Python — from print statements to building a small CLI tool by the end of the day.",
      category: "workshop",
      club: "codesphere",
      venue: "Lab 2, CS Block",
      start: at(-21, 10),
      hours: 5,
      capacity: 60,
      poster: "/posters/workshop.jpg",
      tags: ["Coding"],
    },
    {
      key: "hackspring",
      title: "HackSpring",
      description: "The spring edition 24-hour hack — web, mobile and hardware tracks with midnight debugging fuel.",
      category: "hackathon",
      club: "codesphere",
      venue: "Innovation Lab, Block C",
      start: at(-60, 18),
      hours: 24,
      capacity: 50,
      poster: "/posters/hackathon.jpg",
      tags: ["Coding", "AI / ML"],
    },
    {
      key: "uiux",
      title: "UI/UX Fundamentals",
      description: "Grids, type, colour and critique — the design club's crash course in not shipping ugly software.",
      category: "workshop",
      club: "pixel-pulse",
      venue: "Design Studio, Architecture Block",
      start: at(-45, 11),
      hours: 4,
      capacity: 40,
      poster: "/posters/design.jpg",
      tags: ["Design"],
    },
    {
      key: "cloud101",
      title: "Cloud 101: Deploy Your First App",
      description: "From localhost to the internet in ninety minutes — instances, buckets, and why IAM matters.",
      category: "seminar",
      club: "codesphere",
      venue: "Seminar Hall 1",
      start: at(-30, 15),
      hours: 2,
      capacity: 120,
      tags: ["Coding", "Cybersecurity"],
    },
    {
      key: "arduino",
      title: "Arduino Bootcamp",
      description: "Blink an LED, then build a line-follower. Everything between covered with hands-on kits.",
      category: "workshop",
      club: "robotech",
      venue: "Robotics Lab",
      start: at(-75, 10),
      hours: 6,
      capacity: 35,
      poster: "/posters/robotics.jpg",
      tags: ["Robotics"],
    },
    {
      key: "trials",
      title: "Spring Basketball Trials",
      description: "Open trials for the college squad — all positions, all years.",
      category: "sports",
      club: "athletics",
      venue: "Outdoor Courts",
      start: at(-10, 16),
      hours: 3,
      capacity: 40,
      poster: "/posters/sports.jpg",
      tags: ["Sports"],
    },
  ];

  const eventRows = await db
    .insert(events)
    .values(
      eventSeeds.map((e) => ({
        clubId: clubBySlug.get(e.club)!.id,
        title: e.title,
        description: e.description,
        category: e.category,
        tags: e.tags,
        venue: e.venue,
        startAt: e.start,
        endAt: new Date(e.start.getTime() + e.hours * 3600000),
        capacity: e.capacity,
        posterUrl: e.poster ?? null,
        requiresApproval: e.approval ?? false,
        status: "published" as const,
      })),
    )
    .returning();
  const eventByKey = new Map(eventSeeds.map((s, i) => [s.key, eventRows[i]]));

  /* ---------------------------- registrations --------------------------- */
  type RegInsert = typeof registrations.$inferInsert;
  const regInserts: RegInsert[] = [];
  const pastKeys = new Set(["python", "hackspring", "uiux", "cloud101", "arduino", "trials"]);

  function fillEvent(key: string, count: number, options?: { checkedInRatio?: number; offset?: number }) {
    const ev = eventByKey.get(key)!;
    const isPast = pastKeys.has(key);
    const ratio = options?.checkedInRatio ?? (isPast ? 0.75 : 0);
    const offset = options?.offset ?? 0;
    for (let j = 0; j < count; j++) {
      const student = fakeStudents[(offset + j * 3 + key.length) % fakeStudents.length];
      if (regInserts.some((r) => r.eventId === ev.id && r.userId === student.id)) continue;
      const checkedIn = isPast && rand() < ratio;
      regInserts.push({
        eventId: ev.id,
        userId: student.id,
        status: "confirmed",
        verifyCode: randomCode(10),
        checkedIn,
        checkedInAt: checkedIn ? new Date(ev.startAt.getTime() + 30 * 60000) : null,
        createdAt: new Date(ev.startAt.getTime() - (3 + Math.floor(rand() * 10)) * 86400000),
      });
    }
  }

  fillEvent("neurohack", 46);
  fillEvent("aurorafest", 34);
  fillEvent("basketball", 27);
  fillEvent("webdev", 22);
  fillEvent("genai", 19);
  fillEvent("robowars", 15);
  fillEvent("acoustic", 31);
  fillEvent("designathon", 18);
  fillEvent("pitchnight", 24);
  fillEvent("photowalk", 12);
  fillEvent("esports", 16, { offset: 5 });
  fillEvent("cyberseminar", 9);
  fillEvent("python", 14, { checkedInRatio: 0.8 });
  fillEvent("hackspring", 20, { checkedInRatio: 0.7 });
  fillEvent("uiux", 11, { checkedInRatio: 0.8 });
  fillEvent("cloud101", 16, { checkedInRatio: 0.6 });
  fillEvent("arduino", 13, { checkedInRatio: 0.75 });
  fillEvent("trials", 10, { checkedInRatio: 0.7 });

  /* meera's own registrations */
  const meeraRegs: { key: string; status: "confirmed" | "pending"; checkedIn?: boolean }[] = [
    { key: "neurohack", status: "confirmed" },
    { key: "designathon", status: "confirmed" },
    { key: "genai", status: "pending" },
    { key: "python", status: "confirmed", checkedIn: true },
    { key: "hackspring", status: "confirmed", checkedIn: true },
    { key: "uiux", status: "confirmed", checkedIn: true },
    { key: "cloud101", status: "confirmed", checkedIn: false },
    { key: "arduino", status: "confirmed", checkedIn: true },
  ];
  for (const mr of meeraRegs) {
    const ev = eventByKey.get(mr.key)!;
    regInserts.push({
      eventId: ev.id,
      userId: meera.id,
      status: mr.status,
      verifyCode: randomCode(10),
      checkedIn: mr.checkedIn ?? false,
      checkedInAt: mr.checkedIn ? new Date(ev.startAt.getTime() + 25 * 60000) : null,
      createdAt: new Date(ev.startAt.getTime() - 6 * 86400000),
    });
  }

  const regRows = await db.insert(registrations).values(regInserts).returning();
  const regByEventUser = new Map(regRows.map((r) => [`${r.eventId}:${r.userId}`, r]));

  /* ----------------------------- certificates --------------------------- */
  const certInserts: (typeof certificates.$inferInsert)[] = [];
  for (const r of regRows) {
    if (!r.checkedIn) continue;
    const ev = eventRows.find((e) => e.id === r.eventId)!;
    certInserts.push({
      userId: r.userId,
      eventId: r.eventId,
      registrationId: r.id,
      code: `CERT-${randomCode(6)}`,
      issuedAt: new Date(ev.startAt.getTime() + 2 * 3600000),
    });
  }
  await db.insert(certificates).values(certInserts);

  /* ----------------------------- announcements -------------------------- */
  const [ann1, ann2, ann3] = await db
    .insert(announcements)
    .values([
      {
        clubId: clubBySlug.get("codesphere")!.id,
        eventId: eventByKey.get("neurohack")!.id,
        title: "Team formation mixer — Friday 6 PM",
        message:
          "Solo hackers welcome! Join the team formation mixer this Friday 6 PM at the Innovation Lab. Bring your laptop — teams lock by 9 PM.",
      },
      {
        clubId: clubBySlug.get("codesphere")!.id,
        eventId: eventByKey.get("webdev")!.id,
        title: "Prep checklist for Day 1",
        message:
          "Please install Node.js LTS and VS Code before the bootcamp. Seats are limited — carry your QR ticket for entry.",
      },
      {
        clubId: clubBySlug.get("euphony")!.id,
        eventId: eventByKey.get("acoustic")!.id,
        title: "Gates open 6:00 PM sharp",
        message:
          "Carry your student ID along with the QR ticket. Blankets and chai encouraged — no outside food at the venue.",
      },
    ])
    .returning();

  /* ----------------------------- notifications -------------------------- */
  const meeraNotifs: (typeof notifications.$inferInsert)[] = [
    {
      userId: meera.id,
      title: "Welcome to CampusConnect",
      message: "Your account is ready. Browse upcoming events and grab your first QR ticket.",
      kind: "success",
      link: "/events",
      read: true,
      createdAt: at(-14, 9),
    },
    {
      userId: meera.id,
      title: "You're in — NeuroHack '26",
      message: "Registration confirmed for NeuroHack '26. Your QR ticket is ready under My Events.",
      kind: "success",
      link: "/dashboard/my-events",
      read: true,
      createdAt: at(-3, 20),
    },
    {
      userId: meera.id,
      title: ann1.title,
      message: ann1.message,
      kind: "info",
      link: `/events/${eventByKey.get("neurohack")!.id}`,
      read: false,
      createdAt: at(-1, 18),
    },
    {
      userId: meera.id,
      title: "Request sent — Generative AI Hands-on Workshop",
      message: "The AI Society reviews requests manually. You'll be notified once approved.",
      kind: "info",
      link: "/dashboard/my-events",
      read: false,
      createdAt: at(-2, 12),
    },
    {
      userId: meera.id,
      title: "Checked in — UI/UX Fundamentals",
      message: "Attendance recorded. Your certificate is ready to download.",
      kind: "success",
      link: "/dashboard/certificates",
      read: true,
      createdAt: at(-44, 14),
    },
  ];
  // notify all neurohack registrants of the mixer
  const neurohackRegs = regRows.filter(
    (r) => r.eventId === eventByKey.get("neurohack")!.id && r.userId !== meera.id,
  );
  await db.insert(notifications).values([
    ...meeraNotifs,
    ...neurohackRegs.slice(0, 20).map((r) => ({
      userId: r.userId,
      title: ann1.title,
      message: ann1.message,
      kind: "info",
      link: `/events/${eventByKey.get("neurohack")!.id}`,
      read: false,
      createdAt: at(-1, 18),
    })),
    ...regRows
      .filter((r) => r.eventId === eventByKey.get("webdev")!.id)
      .slice(0, 10)
      .map((r) => ({
        userId: r.userId,
        title: ann2.title,
        message: ann2.message,
        kind: "info",
        link: `/events/${eventByKey.get("webdev")!.id}`,
        read: false,
        createdAt: at(-2, 9),
      })),
    ...regRows
      .filter((r) => r.eventId === eventByKey.get("acoustic")!.id)
      .slice(0, 10)
      .map((r) => ({
        userId: r.userId,
        title: ann3.title,
        message: ann3.message,
        kind: "info",
        link: `/events/${eventByKey.get("acoustic")!.id}`,
        read: false,
        createdAt: at(-1, 10),
      })),
  ]);

  void regByEventUser;
  void admin;

  console.log("Seed complete:");
  console.log(`  clubs:          ${clubRows.length}`);
  console.log(`  students(+fake): ${fakeStudents.length + 1}`);
  console.log(`  events:         ${eventRows.length}`);
  console.log(`  registrations:  ${regRows.length}`);
  console.log(`  certificates:   ${certInserts.length}`);
  console.log("\nDemo accounts (password: campus123):");
  console.log("  student: meera@student.tcet.edu");
  console.log("  club:    codesphere@tcet.edu");
  console.log("  admin:   admin@tcet.edu");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
