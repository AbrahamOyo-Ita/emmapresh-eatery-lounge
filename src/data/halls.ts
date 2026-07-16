import type { Hall } from "@/types";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface RawHall {
  name: string;
  branchSlug: "abuja" | "lagos" | "badagry";
  capacity: { banquet: number; classroom: number; theatre: number; boardroom: number };
  facilities: string[];
  startingPrice: number;
  description: string;
}

const raw: RawHall[] = [
  {
    name: "EmmaPresh Grand Hall",
    branchSlug: "abuja",
    capacity: { banquet: 250, classroom: 180, theatre: 300, boardroom: 40 },
    facilities: ["Air conditioning", "Backup power", "Sound system", "Projector", "Stage", "Parking for 80 cars"],
    startingPrice: 450000,
    description: "Our largest venue — a bright, elegant hall suited to weddings, conferences and large corporate events.",
  },
  {
    name: "EmmaPresh Lekki Terrace Hall",
    branchSlug: "lagos",
    capacity: { banquet: 180, classroom: 120, theatre: 200, boardroom: 30 },
    facilities: ["Air conditioning", "Backup power", "Sound system", "Stage", "Changing room", "Parking for 50 cars"],
    startingPrice: 380000,
    description: "A stylish indoor-outdoor venue in Lekki, popular for birthdays, product launches and private parties.",
  },
  {
    name: "EmmaPresh Boardroom Suite",
    branchSlug: "lagos",
    capacity: { banquet: 40, classroom: 35, theatre: 50, boardroom: 20 },
    facilities: ["Air conditioning", "Projector", "Video conferencing", "Whiteboard", "Complimentary parking"],
    startingPrice: 120000,
    description: "An intimate, professional space for corporate meetings, training sessions and small conferences.",
  },
];

export const halls: Hall[] = raw.map((hall, index) => ({
  id: `hall-${index + 1}`,
  slug: slugify(hall.name),
  name: hall.name,
  branchSlug: hall.branchSlug,
  image: `/images/halls/${slugify(hall.name)}.jpg`,
  gallery: [`/images/halls/${slugify(hall.name)}.jpg`],
  capacity: hall.capacity,
  facilities: hall.facilities,
  startingPrice: hall.startingPrice,
  description: hall.description,
}));

export function getHallBySlug(slug: string) {
  return halls.find((h) => h.slug === slug);
}
