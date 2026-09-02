import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  ArrowRightLeft,
  Filter,
  X,
  BookCheck,
  UserPlus,
  Bookmark,
  Layers
} from 'lucide-react';
import type { LMSBook, LMSMember, LMSTransaction } from '../types/os';

interface LibraryViewProps {
  books: LMSBook[];
  members: LMSMember[];
  transactions: LMSTransaction[];
  onAddBook: (book: LMSBook) => void;
  onEditBook: (book: LMSBook) => void;
  onDeleteBook: (bookId: string) => void;
  onAddMember: (member: LMSMember) => void;
  onEditMember: (member: LMSMember) => void;
  onDeleteMember: (memberId: string) => void;
  onIssueBook: (bookId: string, memberId: string, issueDate: string, dueDate: string) => void;
  onReturnBook: (transactionId: string, returnDate: string) => void;
  onResetLibraryData?: () => void;
  onResetData?: () => void;
  setActiveTab?: (tab: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  books,
  members,
  transactions,
  onAddBook,
  onEditBook,
  onDeleteBook,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onIssueBook,
  onReturnBook,
  onResetLibraryData
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'books' | 'members' | 'issue-return' | 'transactions'>('dashboard');

  const [bookSearch, setBookSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [memberSearch, setMemberSearch] = useState('');

  const [txSearch, setTxSearch] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState<'All' | 'Issued' | 'Returned' | 'Overdue'>('All');

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LMSBook | null>(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LMSMember | null>(null);

  const [bookForm, setBookForm] = useState<Partial<LMSBook>>({
    id: '',
    isbn: '',
    title: '',
    author: '',
    category: 'Computer Science',
    quantity: 5,
    availableCopies: 5,
    status: 'Available',
    rackLocation: 25,
    memoryPage: 12,
    processBurst: 4
  });

  const [memberForm, setMemberForm] = useState<Partial<LMSMember>>({
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'Student',
    department: 'Computer Science',
    membershipStatus: 'Active'
  });

  const [issueBookId, setIssueBookId] = useState<string>('');
  const [issueMemberId, setIssueMemberId] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('2026-09-02');
  const [dueDate, setDueDate] = useState<string>('2026-09-16');

  const [returnTxId, setReturnTxId] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('2026-09-02');

  const totalBooksCount = books.length;
  const totalQuantity = books.reduce((acc, b) => acc + b.quantity, 0);
  const totalAvailableCopies = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const issuedCopiesCount = totalQuantity - totalAvailableCopies;
  const totalMembersCount = members.length;
  const overdueTxCount = transactions.filter(t => t.status === 'Overdue').length;

  const categories = ['All', ...Array.from(new Set(books.map(b => b.category)))];

  const openAddBookModal = () => {
    setEditingBook(null);
    setBookForm({
      id: `B-${Math.floor(100 + Math.random() * 900)}`,
      isbn: `978-${Math.floor(100000000 + Math.random() * 900000000)}`,
      title: '',
      author: '',
      category: 'Computer Science',
      quantity: 5,
      availableCopies: 5,
      status: 'Available',
      rackLocation: Math.floor(Math.random() * 130),
      memoryPage: Math.floor(Math.random() * 500),
      processBurst: Math.floor(2 + Math.random() * 8)
    });
    setIsBookModalOpen(true);
  };

  const openEditBookModal = (book: LMSBook) => {
    setEditingBook(book);
    setBookForm({ ...book });
    setIsBookModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.author || !bookForm.isbn) return;

    const qty = Number(bookForm.quantity || 1);
    const avail = Number(bookForm.availableCopies ?? qty);

    let calcStatus: 'Available' | 'Out of Stock' | 'Partially Issued' = 'Available';
    if (avail === 0) calcStatus = 'Out of Stock';
    else if (avail < qty) calcStatus = 'Partially Issued';

    const savedBook: LMSBook = {
      id: bookForm.id || `B-${Math.floor(100 + Math.random() * 900)}`,
      isbn: bookForm.isbn || 'N/A',
      title: bookForm.title,
      author: bookForm.author,
      category: bookForm.category || 'Computer Science',
      quantity: qty,
      availableCopies: avail,
      status: calcStatus,
      rackLocation: Number(bookForm.rackLocation || 25),
      memoryPage: Number(bookForm.memoryPage || 12),
      processBurst: Number(bookForm.processBurst || 4)
    };

    if (editingBook) {
      onEditBook(savedBook);
    } else {
      onAddBook(savedBook);
    }
    setIsBookModalOpen(false);
  };

  const openAddMemberModal = () => {
    setEditingMember(null);
    setMemberForm({
      id: `M-${Math.floor(200 + Math.random() * 800)}`,
      name: '',
      email: '',
      phone: '',
      role: 'Student',
      department: 'Computer Science',
      membershipStatus: 'Active'
    });
    setIsMemberModalOpen(true);
  };

  const openEditMemberModal = (member: LMSMember) => {
    setEditingMember(member);
    setMemberForm({ ...member });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.email) return;

    const savedMember: LMSMember = {
      id: memberForm.id || `M-${Math.floor(200 + Math.random() * 800)}`,
      name: memberForm.name,
      email: memberForm.email,
      phone: memberForm.phone || '+1 (555) 000-0000',
      role: memberForm.role || 'Student',
      department: memberForm.department || 'Computer Science',
      membershipStatus: memberForm.membershipStatus || 'Active'
    };

    if (editingMember) {
      onEditMember(savedMember);
    } else {
      onAddMember(savedMember);
    }
    setIsMemberModalOpen(false);
  };

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
                          b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
                          b.isbn.includes(bookSearch) ||
                          b.id.toLowerCase().includes(bookSearch.toLowerCase());
    const matchesCat = categoryFilter === 'All' || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredMembers = members.filter(m => {
    return m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
           m.id.toLowerCase().includes(memberSearch.toLowerCase()) ||
           m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
           m.department.toLowerCase().includes(memberSearch.toLowerCase());
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.bookTitle.toLowerCase().includes(txSearch.toLowerCase()) ||
                          t.memberName.toLowerCase().includes(txSearch.toLowerCase()) ||
                          t.id.toLowerCase().includes(txSearch.toLowerCase());
    const matchesStatus = txStatusFilter === 'All' || t.status === txStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeIssuedTransactions = transactions.filter(t => t.status === 'Issued' || t.status === 'Overdue');
  const availableBooksList = books.filter(b => b.availableCopies > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-950/50 via-gray-950 to-gray-950 border border-purple-900/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Library Management System</h1>
            <span className="badge-academic">Academic Module</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Complete LMS module with Book & Member CRUD, Issue/Return Center, Overdue Fine Calculator, and Local Storage Persistence.
          </p>
        </div>

        <button
          onClick={onResetLibraryData}
          className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-800 rounded-xl text-xs font-mono transition"
        >
          Reset LMS Sample Data
        </button>
      </div>

      <div className="flex space-x-2 border-b border-gray-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'dashboard'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('books')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'books'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Book Management ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('members')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'members'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Member Management ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('issue-return')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'issue-return'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4 text-emerald-400" />
          <span>Issue & Return Center</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transactions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition ${
            activeSubTab === 'transactions'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900'
          }`}
        >
          <Clock className="h-4 w-4 text-amber-400" />
          <span>Transaction Audit History</span>
        </button>
      </div>

      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-purple-500">
              <span className="text-xs text-gray-400 font-mono">Total Books</span>
              <div className="text-2xl font-bold font-mono text-white">{totalBooksCount} <span className="text-xs text-gray-400 font-normal">titles</span></div>
              <p className="text-[11px] text-gray-500 font-mono">{totalQuantity} total physical copies</p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-emerald-500">
              <span className="text-xs text-gray-400 font-mono">Available Copies</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">{totalAvailableCopies}</div>
              <p className="text-[11px] text-gray-500 font-mono">Ready for checkout</p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-blue-500">
              <span className="text-xs text-gray-400 font-mono">Issued Copies</span>
              <div className="text-2xl font-bold font-mono text-blue-400">{issuedCopiesCount}</div>
              <p className="text-[11px] text-gray-500 font-mono">Currently checked out</p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-indigo-500">
              <span className="text-xs text-gray-400 font-mono">Total Members</span>
              <div className="text-2xl font-bold font-mono text-indigo-400">{totalMembersCount}</div>
              <p className="text-[11px] text-gray-500 font-mono">Active library users</p>
            </div>

            <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-rose-500">
              <span className="text-xs text-gray-400 font-mono">Overdue Books</span>
              <div className="text-2xl font-bold font-mono text-rose-400">{overdueTxCount}</div>
              <p className="text-[11px] text-gray-500 font-mono">Past due return date</p>
            </div>
          </div>

          <div className="p-4 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-purple-300 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-purple-400" />
              <span>Academic OS Simulator Cross-Module Linkage</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              In this integrated academic suite, every Library Management action triggers corresponding low-level Operating System events:
              <br />
              &bull; <strong>Issue/Borrow Book</strong>: Spawns CPU burst execution task (Round Robin Q=4), maps Virtual Page to physical RAM frame, and calculates Disk SSTF cylinder seek track.
              <br />
              &bull; <strong>Return Book</strong>: Completes CPU process, unmaps memory page frame, and writes back catalog index to disk track.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200">Recent Transactions Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="pb-2">Tx ID</th>
                    <th className="pb-2">Book Title</th>
                    <th className="pb-2">Borrower</th>
                    <th className="pb-2">Issue Date</th>
                    <th className="pb-2">Due Date</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {transactions.slice(0, 5).map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-900/40">
                      <td className="py-2.5 font-bold text-purple-400">{tx.id}</td>
                      <td className="py-2.5 text-gray-200 font-semibold">{tx.bookTitle}</td>
                      <td className="py-2.5 text-gray-300">{tx.memberName}</td>
                      <td className="py-2.5 text-gray-400">{tx.issueDate}</td>
                      <td className="py-2.5 text-gray-400">{tx.dueDate}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'Issued' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          tx.status === 'Returned' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {tx.status} {tx.overdueDays > 0 ? `(${tx.overdueDays}d late)` : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'books' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl">
            <div className="flex items-center space-x-3 flex-1 min-w-[280px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search books by title, author, ISBN, or ID..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={openAddBookModal}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400">
                    <th className="p-3">Book ID</th>
                    <th className="p-3">ISBN</th>
                    <th className="p-3">Title & Author</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Total Qty</th>
                    <th className="p-3 text-emerald-400">Available</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-amber-400">OS Mapping (Track / Pg / Burst)</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {filteredBooks.map(book => (
                    <tr key={book.id} className="hover:bg-gray-900/50 transition">
                      <td className="p-3 font-bold text-purple-400">{book.id}</td>
                      <td className="p-3 text-gray-400 text-[11px]">{book.isbn}</td>
                      <td className="p-3">
                        <div className="font-bold text-white font-sans text-sm">{book.title}</div>
                        <div className="text-gray-400 text-[11px] font-sans">{book.author}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800 text-[10px]">
                          {book.category}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-gray-300">{book.quantity}</td>
                      <td className="p-3 font-bold text-emerald-400">{book.availableCopies}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          book.status === 'Available' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          book.status === 'Partially Issued' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {book.status}
                        </span>
                      </td>
                      <td className="p-3 text-[11px]">
                        <span className="text-amber-400 font-bold">Cyl #{book.rackLocation}</span> | <span className="text-emerald-400 font-bold">Pg #{book.memoryPage}</span> | <span className="text-blue-400 font-bold">{book.processBurst}u</span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditBookModal(book)}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
                          title="Edit Book"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBook(book.id)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition"
                          title="Delete Book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'members' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search members by name, ID, email, or department..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={openAddMemberModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-500/20 transition"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add New Member</span>
            </button>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400">
                    <th className="p-3">Member ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Role & Dept</th>
                    <th className="p-3">Membership Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {filteredMembers.map(m => (
                    <tr key={m.id} className="hover:bg-gray-900/50 transition">
                      <td className="p-3 font-bold text-indigo-400">{m.id}</td>
                      <td className="p-3 font-bold text-white font-sans text-sm">{m.name}</td>
                      <td className="p-3">
                        <div className="text-gray-300 font-sans">{m.email}</div>
                        <div className="text-gray-500 text-[11px]">{m.phone}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-purple-300 font-bold">{m.role}</div>
                        <div className="text-gray-400 text-[11px] font-sans">{m.department}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.membershipStatus === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          m.membershipStatus === 'Inactive' ? 'bg-gray-900 text-gray-400 border border-gray-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {m.membershipStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => openEditMemberModal(m)}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
                          title="Edit Member"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMember(m.id)}
                          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition"
                          title="Delete Member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'issue-return' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div className="glass-card p-6 rounded-2xl space-y-5 border border-purple-900/40">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <BookCheck className="h-5 w-5 text-purple-400" />
              <span>Issue Book to Member</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (issueBookId && issueMemberId) {
                onIssueBook(issueBookId, issueMemberId, issueDate, dueDate);
                setIssueBookId('');
                setIssueMemberId('');
              }
            }} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-gray-400">Select Member:</label>
                <select
                  value={issueMemberId}
                  onChange={(e) => setIssueMemberId(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose Member --</option>
                  {members.filter(m => m.membershipStatus === 'Active').map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role} - {m.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Select Available Book:</label>
                <select
                  value={issueBookId}
                  onChange={(e) => setIssueBookId(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="">-- Choose Available Book --</option>
                  {availableBooksList.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} (Available: {b.availableCopies}/{b.quantity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400">Issue Date:</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400">Due Date:</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!issueBookId || !issueMemberId}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20 transition flex items-center justify-center space-x-2"
              >
                <BookCheck className="h-4 w-4" />
                <span>Issue Book & Decrement Available Copies</span>
              </button>
            </form>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-5 border border-emerald-900/40">
            <h3 className="text-base font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <ArrowRightLeft className="h-5 w-5 text-emerald-400" />
              <span>Return Issued Book</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (returnTxId) {
                onReturnBook(returnTxId, returnDate);
                setReturnTxId('');
              }
            }} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-gray-400">Select Issued Transaction:</label>
                <select
                  value={returnTxId}
                  onChange={(e) => setReturnTxId(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Select Active Issue Transaction --</option>
                  {activeIssuedTransactions.map(tx => (
                    <option key={tx.id} value={tx.id}>
                      {tx.bookTitle} &rarr; {tx.memberName} (Due: {tx.dueDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400">Actual Return Date:</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-gray-200"
                />
              </div>

              <div className="p-3 bg-gray-950 rounded-xl border border-gray-800 text-[11px] text-gray-400 space-y-1">
                <div>Return Action Logic:</div>
                <div>&bull; Automatically increments available book copies.</div>
                <div>&bull; Calculates overdue days & fine amount if Return Date &gt; Due Date.</div>
              </div>

              <button
                type="submit"
                disabled={!returnTxId}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                <span>Return Book & Increment Available Copies</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {activeSubTab === 'transactions' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions by book, borrower, or Tx ID..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-gray-400">Status:</span>
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800">
                {(['All', 'Issued', 'Returned', 'Overdue'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setTxStatusFilter(s)}
                    className={`px-3 py-1 rounded-lg transition ${
                      txStatusFilter === s ? 'bg-purple-600 text-white font-bold' : 'text-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/60 text-gray-400">
                    <th className="p-3">Tx ID</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Borrower Name</th>
                    <th className="p-3">Issue Date</th>
                    <th className="p-3">Due Date</th>
                    <th className="p-3">Return Date</th>
                    <th className="p-3">Overdue Days</th>
                    <th className="p-3 text-rose-400">Fine</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/80">
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-900/50 transition">
                      <td className="p-3 font-bold text-purple-400">{tx.id}</td>
                      <td className="p-3 font-bold text-white font-sans text-sm">{tx.bookTitle}</td>
                      <td className="p-3 text-gray-300 font-sans">{tx.memberName}</td>
                      <td className="p-3 text-gray-400">{tx.issueDate}</td>
                      <td className="p-3 text-gray-400">{tx.dueDate}</td>
                      <td className="p-3 text-emerald-400">{tx.returnDate || '-'}</td>
                      <td className="p-3 font-bold text-amber-400">{tx.overdueDays} days</td>
                      <td className="p-3 font-bold text-rose-400">${tx.fineAmount.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.status === 'Issued' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          tx.status === 'Returned' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-4 border border-purple-900/50 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingBook ? 'Edit Book Record' : 'Add New Library Book'}
              </h3>
              <button onClick={() => setIsBookModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Book ID:</label>
                  <input
                    type="text"
                    value={bookForm.id}
                    onChange={(e) => setBookForm({ ...bookForm, id: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-purple-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400">ISBN:</label>
                  <input
                    type="text"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400">Title:</label>
                <input
                  type="text"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  required
                  className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-100 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Author:</label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200 font-sans"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Category:</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Programming">Programming</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Networking">Networking</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Total Quantity:</label>
                  <input
                    type="number"
                    min={1}
                    value={bookForm.quantity}
                    onChange={(e) => setBookForm({ ...bookForm, quantity: Number(e.target.value) })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Available Copies:</label>
                  <input
                    type="number"
                    min={0}
                    value={bookForm.availableCopies}
                    onChange={(e) => setBookForm({ ...bookForm, availableCopies: Number(e.target.value) })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-emerald-400 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800 space-y-2 pt-2">
                <span className="text-amber-400 font-bold text-[11px]">OS Simulation Parameters Mapping:</span>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <label className="text-gray-400">Disk Cylinder (0-130):</label>
                    <input
                      type="number"
                      min={0}
                      max={130}
                      value={bookForm.rackLocation}
                      onChange={(e) => setBookForm({ ...bookForm, rackLocation: Number(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-1.5 py-1 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400">Virtual Page (0-8191):</label>
                    <input
                      type="number"
                      min={0}
                      max={8191}
                      value={bookForm.memoryPage}
                      onChange={(e) => setBookForm({ ...bookForm, memoryPage: Number(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-1.5 py-1 text-emerald-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400">CPU Burst Units:</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={bookForm.processBurst}
                      onChange={(e) => setBookForm({ ...bookForm, processBurst: Number(e.target.value) })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-1.5 py-1 text-blue-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/20"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-4 border border-indigo-900/50 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">
                {editingMember ? 'Edit Member Record' : 'Add New Library Member'}
              </h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Member ID:</label>
                  <input
                    type="text"
                    value={memberForm.id}
                    onChange={(e) => setMemberForm({ ...memberForm, id: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-indigo-300 font-bold"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Full Name:</label>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-100 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400">Email Address:</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    required
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  />
                </div>
                <div>
                  <label className="text-gray-400">Phone Number:</label>
                  <input
                    type="text"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400">Role:</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Researcher">Researcher</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-400">Department:</label>
                  <input
                    type="text"
                    value={memberForm.department}
                    onChange={(e) => setMemberForm({ ...memberForm, department: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-gray-200 font-sans"
                  />
                </div>

                <div>
                  <label className="text-gray-400">Membership Status:</label>
                  <select
                    value={memberForm.membershipStatus}
                    onChange={(e) => setMemberForm({ ...memberForm, membershipStatus: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-800 rounded px-2.5 py-1.5 text-emerald-400 font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
