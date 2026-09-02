import type { Team10Parameters, LMSBook, LMSMember, LMSTransaction } from '../types/os';

export const TEAM_10_DEFAULTS: Team10Parameters = {
  teamName: "Team 10",
  processes: [
    { id: "p1", name: "P1", arrivalTime: 0, burstTime: 6, color: "#3B82F6" },
    { id: "p2", name: "P2", arrivalTime: 2, burstTime: 2, color: "#10B981" },
    { id: "p3", name: "P3", arrivalTime: 3, burstTime: 5, color: "#F59E0B" },
    { id: "p4", name: "P4", arrivalTime: 5, burstTime: 9, color: "#EC4899" },
    { id: "p5", name: "P5", arrivalTime: 7, burstTime: 3, color: "#8B5CF6" },
  ],
  timeQuantum: 4,
  ramGB: 4,
  pageSizeKB: 4,
  logicalSpaceMB: 32,
  numFrames: 4,
  cylinderMin: 0,
  cylinderMax: 130,
  initialHead: 65,
  diskQueue: [25, 105, 40, 115, 55, 90, 10, 120]
};

export const INITIAL_BOOKS: LMSBook[] = [
  {
    id: "B-101",
    isbn: "978-0133591620",
    title: "Operating System Concepts (10th Ed)",
    author: "Silberschatz, Galvin, Gagne",
    category: "Computer Science",
    quantity: 5,
    availableCopies: 3,
    status: "Partially Issued",
    rackLocation: 25,
    memoryPage: 12,
    processBurst: 6,
    coverColor: "from-blue-600 to-indigo-700"
  },
  {
    id: "B-102",
    isbn: "978-0134685991",
    title: "Modern Operating Systems (4th Ed)",
    author: "Andrew S. Tanenbaum",
    category: "Computer Science",
    quantity: 4,
    availableCopies: 2,
    status: "Partially Issued",
    rackLocation: 105,
    memoryPage: 48,
    processBurst: 2,
    coverColor: "from-emerald-600 to-teal-700"
  },
  {
    id: "B-103",
    isbn: "978-0262033848",
    title: "Introduction to Algorithms (4th Ed)",
    author: "Cormen, Leiserson, Rivest, Stein",
    category: "Algorithms",
    quantity: 6,
    availableCopies: 6,
    status: "Available",
    rackLocation: 40,
    memoryPage: 102,
    processBurst: 5,
    coverColor: "from-amber-600 to-orange-700"
  },
  {
    id: "B-104",
    isbn: "978-0131103627",
    title: "The C Programming Language (2nd Ed)",
    author: "Brian W. Kernighan, Dennis M. Ritchie",
    category: "Programming",
    quantity: 3,
    availableCopies: 3,
    status: "Available",
    rackLocation: 115,
    memoryPage: 256,
    processBurst: 9,
    coverColor: "from-pink-600 to-rose-700"
  },
  {
    id: "B-105",
    isbn: "978-0596007126",
    title: "Head First Design Patterns",
    author: "Eric Freeman, Elisabeth Robson",
    category: "Software Engineering",
    quantity: 4,
    availableCopies: 4,
    status: "Available",
    rackLocation: 55,
    memoryPage: 384,
    processBurst: 3,
    coverColor: "from-purple-600 to-violet-700"
  },
  {
    id: "B-106",
    isbn: "978-0132350884",
    title: "Clean Code: Handbook of Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Software Engineering",
    quantity: 5,
    availableCopies: 4,
    status: "Partially Issued",
    rackLocation: 90,
    memoryPage: 512,
    processBurst: 4,
    coverColor: "from-cyan-600 to-blue-700"
  },
  {
    id: "B-107",
    isbn: "978-0321573513",
    title: "Algorithms (4th Edition)",
    author: "Robert Sedgewick, Kevin Wayne",
    category: "Algorithms",
    quantity: 3,
    availableCopies: 3,
    status: "Available",
    rackLocation: 10,
    memoryPage: 640,
    processBurst: 7,
    coverColor: "from-red-600 to-pink-700"
  },
  {
    id: "B-108",
    isbn: "978-0134093413",
    title: "Computer Networking: A Top-Down Approach",
    author: "Kurose & Ross",
    category: "Networking",
    quantity: 4,
    availableCopies: 4,
    status: "Available",
    rackLocation: 120,
    memoryPage: 800,
    processBurst: 5,
    coverColor: "from-indigo-600 to-purple-700"
  }
];

export const INITIAL_MEMBERS: LMSMember[] = [
  {
    id: "M-201",
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    phone: "+1 (555) 234-5678",
    membershipStatus: "Active",
    role: "Student",
    department: "Computer Science"
  },
  {
    id: "M-202",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@university.edu",
    phone: "+1 (555) 876-5432",
    membershipStatus: "Active",
    role: "Faculty",
    department: "Software Engineering"
  },
  {
    id: "M-203",
    name: "Marcus Chen",
    email: "marcus.chen@university.edu",
    phone: "+1 (555) 345-6789",
    membershipStatus: "Active",
    role: "Researcher",
    department: "Data Science"
  },
  {
    id: "M-204",
    name: "Sophia Martinez",
    email: "sophia.m@university.edu",
    phone: "+1 (555) 901-2345",
    membershipStatus: "Active",
    role: "Student",
    department: "Computer Engineering"
  },
  {
    id: "M-205",
    name: "David Vance",
    email: "david.vance@university.edu",
    phone: "+1 (555) 432-1098",
    membershipStatus: "Inactive",
    role: "Student",
    department: "Information Technology"
  }
];

export const INITIAL_TRANSACTIONS: LMSTransaction[] = [
  {
    id: "TX-301",
    bookId: "B-101",
    bookTitle: "Operating System Concepts (10th Ed)",
    memberId: "M-201",
    memberName: "Alex Rivera",
    issueDate: "2026-08-15",
    dueDate: "2026-08-29",
    status: "Overdue",
    overdueDays: 4,
    fineAmount: 4.00
  },
  {
    id: "TX-302",
    bookId: "B-102",
    bookTitle: "Modern Operating Systems (4th Ed)",
    memberId: "M-202",
    memberName: "Dr. Elena Rostova",
    issueDate: "2026-08-25",
    dueDate: "2026-09-08",
    status: "Issued",
    overdueDays: 0,
    fineAmount: 0.00
  },
  {
    id: "TX-303",
    bookId: "B-106",
    bookTitle: "Clean Code: Handbook of Software Craftsmanship",
    memberId: "M-204",
    memberName: "Sophia Martinez",
    issueDate: "2026-08-20",
    dueDate: "2026-09-03",
    status: "Issued",
    overdueDays: 0,
    fineAmount: 0.00
  },
  {
    id: "TX-304",
    bookId: "B-101",
    bookTitle: "Operating System Concepts (10th Ed)",
    memberId: "M-203",
    memberName: "Marcus Chen",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    returnDate: "2026-08-14",
    status: "Returned",
    overdueDays: 0,
    fineAmount: 0.00
  }
];
