export interface PlaylistCategory {
  id: string;
  name: string;
  description: string;
  songIds: string[];
}

export const PLAYLIST_CATEGORIES: PlaylistCategory[] = [
  {
    id: "all",
    name: "2005–2010 All Memories",
    description: "The complete collection of golden era memories",
    songIds: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  {
    id: "bollywood-romance",
    name: "Bollywood Romance",
    description: "Timeless romantic anthems from Om Shanti Om to Jab We Met",
    songIds: ["1", "2", "4", "10"],
  },
  {
    id: "kk-essentials",
    name: "KK Specials",
    description: "Soulful, soaring vocals that defined a generation",
    songIds: ["1", "4", "9"],
  },
  {
    id: "monsoon-melodies",
    name: "Monsoon Melodies",
    description: "Rain drops on train windows, umbrellas, and chai",
    songIds: ["2", "3", "5", "9"],
  },
  {
    id: "college-youth",
    name: "College & Youth Anthems",
    description: "Rock On guitars, Jaane Tu college canteen, and hostel dreams",
    songIds: ["5", "7", "8"],
  },
  {
    id: "late-night-soul",
    name: "Late Night & Soulful",
    description: "Delhi-6 havelis, Mumbai local ballads, and night streetlights",
    songIds: ["3", "4", "6", "9"],
  },
];
