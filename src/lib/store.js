// In-memory data store for the Book Club Platform
// All data resets on page refresh

// Book cover placeholder colors
const coverColors = [
  "from-primary to-chart-3",
  "from-chart-2 to-chart-4",
  "from-chart-3 to-chart-5",
  "from-chart-4 to-primary",
  "from-chart-5 to-chart-2",
  "from-primary to-chart-4",
]

// Initial mock data

export const initialBooks = [
  {
    id: "1",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    description:
      "A lone astronaut must save the earth from disaster in this propulsive interstellar adventure.",
    image: "https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg",
      // cover: coverColors[0],
    pages: 496,
    suggestedBy: "Siri",
    suggestedAt: new Date(2026, 1, 1),
    votes: 12,
    voters: [
      "Siri","Hema","pavani","Deva","Mani","Reema","Navya","Jaan",
      "Arjun","Karthik","Arushi","Ammu"
    ],
    ratings: [
      { userId: "Siri", value: 5, date: new Date() },
      { userId: "Hema", value: 4, date: new Date() }
    ],
    reviews: [
      {
        id: "r1",
        userId: "Siri",
        userName: "Siri",
        bookId: "1",
        rating: 5,
        text: "Absolutely brilliant! Weir does it again.",
        date: new Date(2026, 1, 10),
        likes: 5,
        likedBy: ["Hema","Pavani","Deva","Mani","Reema"],
      }
    ],
  },

  {
    id: "2",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    genre: "Literary Fiction",
    description:
      "A moving story told from the perspective of an Artificial Friend.",
      image: "https://covers.openlibrary.org/b/isbn/9780593318171-L.jpg",
    pages: 307,
    suggestedBy: "Hema",
    suggestedAt: new Date(2026, 1, 3),
    votes: 10,
    voters: ["Siri","Hema","pavani","Deva","Mani","Reema","Navya","Jaan","Ammu","Arjun"],
    ratings: [
      { userId: "Pavani", value: 5, date: new Date() },
      { userId: "Hema", value: 4, date: new Date() }
    ],
    reviews: [{
        id: "r2",
        userId: "Pavani",
        userName: "Pavani",
        bookId: "2",
        rating: 5,
        text: "Beautifully written and emotionally powerful story about AI, love, and sacrifice.",
        date: new Date(2026, 1, 10),
        likes: 7,
        likedBy: ["Hema","Pavani","Deva","Mani","Reema","Navya","Jaan"],
      }],
  },



  {
    id: "3",
    title: "Your Dreams Are Mine Now",
    author: "Ravinder Singh",
    genre: "Romance / Drama",
    description:
      "Your Dreams Are Mine Now is a romantic fiction novel set in a college campus backdrop with political drama.",
      image: "https://covers.openlibrary.org/b/isbn/9780143423003-L.jpg",
    pages: 336,
    suggestedBy: "Pavani",
    suggestedAt: new Date(2026, 1, 3),
    votes: 7,
    voters: ["Siri","Hema","pavani","Deva","Mani","Reema","Navya","Jaan"],
    ratings: [
      { userId: "Mani", value: 5, date: new Date() },
      { userId: "Hema", value: 4, date: new Date() }
    ],
    reviews: [
      {
        id: "r3",
        userId: "Mani",
        userName: "Mani",
        bookId: "3",
        rating: 5,
        text: "Emotional and powerful campus love story with strong social message.",
        date: new Date(2026, 1, 10),
        likes: 5,
        likedBy: ["Hema","Pavani","Deva","Mani","Reema"],
      }
    ],
  },
   {
    id: "4",
    title: "2 States",
    author: "Chetan Bhagat",
    genre: "Romance, Comedy, Contemporary Fiction",
    description:
      "The story is about Krish (Punjabi boy) and Ananya (Tamil girl) who fall in love during their MBA at IIM Ahmedabad.",
      image: "https://covers.openlibrary.org/b/isbn/9788129135520-L.jpg",
    pages: 336,
    suggestedBy: "Ammu",
    suggestedAt: new Date(2026, 1, 3),
    votes: 5,
    voters: ["Siri","Hema","pavani","Deva","Mani","Reema",],
    ratings: [

    ],
    reviews: [],
    
  },
]

export const initialDiscussions = [
  {
    id: "d1",
    bookId: "1", // Project Hail Mary
    title: "Did you like the ending?",
    createdBy: "Siri",
    createdAt: new Date(2026, 1, 3),
    replies: [
      {
        id: "c1",
        author: "Hema",
        content: "The ending was brilliant and emotional!",
        date: new Date(2026, 1, 12),
        likes:0,
        likedBy: [],
      },
      {
        id: "c2",
        author: "Mani",
        content: "I loved the science explanation at the end.",
        date: new Date(2026, 1, 13),
      },
    ],
  },
]

export const initialProgress = [
  {
    bookId: "1",
    userId: "You",
    pagesRead: 312,
    totalPages: 496,
    lastUpdated: new Date(2026, 1, 18),
  },

  {
    bookId: "4",
    userId: "You",
    pagesRead: 336,
    totalPages: 336,
    lastUpdated: new Date(2026, 1, 20),
  },
]

export const initialGoals = [
  {
    id: "g1",
    userId: "You",
    type: "books",
    target: 24,
    current: 8,
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 11, 31),
  },
  {
    id: "g2",
    userId: "You",
    type: "pages",
    target: 5000,
    current: 1144,
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 11, 31),
  },
]

export const initialMeetings = [
  {
    id: "m1",
    title: "Klara and the Sun Discussion",
    bookId: "2", // Klara and the Sun
    date: new Date(2026, 2, 15),
    time: "6:00 PM",
    description: "Discuss themes of AI, love, and sacrifice.",
    rsvps: ["You", "Siri", "Hema", "Pavani"],
    createdBy: "You",
  },
]

export const initialLibrary = [
  {
    bookId: "1",      // Project Hail Mary
    shelf: "reading",
    notes: "Really enjoying the science details!",
    tags: ["Sci-Fi", "Space"]
  },
  {
    bookId: "2",      // Klara and the Sun
    shelf: "read",
    notes: "Emotional and thoughtful story.",
    tags: ["AI", "Philosophy"]
  },
]

export const initialAchievements = [
  {
    id: "a1",
    name: "Bookworm",
    description: "Read 5 books",
    icon: "📚",
    requirement: 5,
    type: "books_read",
    earnedAt: new Date(2026, 1, 1),
  },
]

export const initialNotifications = []

export const initialActivity = [
  {
    id: "a1",
    user: "Siri",
    message: "suggested Project Hail Mary.",
    date: new Date(2026, 1, 1),
  },
  {
    id: "a2",
    user: "Hema",
    message: "rated Klara and the Sun 4⭐.",
    date: new Date(2026, 1, 5),
  },
  {
    id: "a3",
    user: "Mani",
    message: "added 2 States to their library.",
    date: new Date(2026, 1, 7),
  },
  {
    id: "a4",
    user: "Pavani",
    message: "completed Your Dreams Are Mine Now.",
    date: new Date(2026, 1, 10),
  },
]
  


// Members list
export const members = [
  "You","Siri","Hema","pavani","Deva","Mani","Reema","Navya","Jaan",
      "Arjun","Karthik","Arushi","Ammu"
]

// Genre list
export const genres = [
  "Sci-Fi","Fantasy","Literary Fiction","Mythology",
  "Mystery","Romance","Non-Fiction","Horror",
  "Historical Fiction","Thriller"
]