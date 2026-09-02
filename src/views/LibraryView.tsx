import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  Plus,
  Search,
  ArrowRightLeft,
  RotateCcw,
  Edit2,
  Trash2,
  X
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
  onResetData
}) => {
  const [activeTab, setActiveTabState] = useState<'books' | 'members' | 'transactions' | 'issue' | 'return'>('books');

  const [bookSearch, setBookSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [memberSearch, setMemberSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');

  // Modals state
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<LMSBook | null>(null);

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LMSMember | null>(null);

  // Form states - Book
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookCategory, setBookCategory] = useState('Operating Systems');
  const [bookQty, setBookQty] = useState(5);

  // Form states - Member
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberRole, setMemberRole] = useState<'Student' | 'Faculty' | 'Researcher'>('Student');

  // Form states - Issue
  const [issueBookId, setIssueBookId] = useState('');
  const [issueMemberId, setIssueMemberId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Form states - Return
  const [returnTxId, setReturnTxId] = useState('');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);

  // Derived filtered arrays
  const filteredBooks = books.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.isbn.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.id.toLowerCase().includes(bookSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredMembers = members.filter(m => {
    return (
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(memberSearch.toLowerCase())
    );
  });

  const filteredTx = transactions.filter(t => {
    return (
      t.bookTitle.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.memberName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txSearch.toLowerCase())
    );
  });

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle || !bookAuthor || !bookIsbn) return;

    if (editingBook) {
      onEditBook({
        ...editingBook,
        title: bookTitle,
        author: bookAuthor,
        isbn: bookIsbn,
        category: bookCategory,
        quantity: Number(bookQty),
        availableCopies: Math.min(Number(bookQty), editingBook.availableCopies)
      });
      setEditingBook(null);
    } else {
      const newBook: LMSBook = {
        id: 'BK-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        title: bookTitle,
        author: bookAuthor,
        isbn: bookIsbn,
        category: bookCategory,
        quantity: Number(bookQty),
        availableCopies: Number(bookQty),
        rackLocation: 101,
        memoryPage: Math.floor(Math.random() * 8192),
        processBurst: Math.floor(Math.random() * 8) + 1,
        status: 'Available'
      };
      onAddBook(newBook);
    }

    setBookTitle('');
    setBookAuthor('');
    setBookIsbn('');
    setIsAddBookOpen(false);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberEmail) return;

    if (editingMember) {
      onEditMember({
        ...editingMember,
        name: memberName,
        email: memberEmail,
        phone: memberPhone,
        role: memberRole
      });
      setEditingMember(null);
    } else {
      const newMember: LMSMember = {
        id: 'MEM-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        name: memberName,
        email: memberEmail,
        phone: memberPhone,
        role: memberRole,
        department: 'Computer Science',
        membershipStatus: 'Active'
      };
      onAddMember(newMember);
    }

    setMemberName('');
    setMemberEmail('');
    setMemberPhone('');
    setIsAddMemberOpen(false);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookId || !issueMemberId) return;
    onIssueBook(issueBookId, issueMemberId, issueDate, dueDate);
    setIssueBookId('');
    setIssueMemberId('');
    setActiveTabState('transactions');
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnTxId) return;
    onReturnBook(returnTxId, returnDate);
    setReturnTxId('');
    setActiveTabState('transactions');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="soft-card p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-orange-500">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Library Management System</h1>
            <span className="badge-academic">Domain Suite</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Functional academic library management interface with CRUD operations, checkout transactions, and persistent storage.
          </p>
        </div>

        {onResetData && (
          <button
            onClick={onResetData}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-mono transition flex items-center space-x-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Library Sample Data</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 soft-card p-2 rounded-2xl text-xs font-mono">
        {[
          { id: 'books', label: 'Book Catalog', count: books.length, icon: BookOpen },
          { id: 'members', label: 'Member Directory', count: members.length, icon: Users },
          { id: 'transactions', label: 'Transactions Log', count: transactions.length, icon: ArrowRightLeft },
          { id: 'issue', label: 'Issue Book', icon: Plus },
          { id: 'return', label: 'Return Book', icon: RotateCcw }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabState(tab.id as any)}
              className={`
                px-4 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition
                ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.2 text-[10px] rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOK CATALOG */}
      {activeTab === 'books' && (
        <div className="soft-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs flex-1">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Title, Author, ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-slate-800 w-full text-xs"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Software Engineering">Software Engineering</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingBook(null);
                setBookTitle('');
                setBookAuthor('');
                setBookIsbn('');
                setIsAddBookOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition font-mono"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                  <th className="p-3">Book ID</th>
                  <th className="p-3">Title &amp; Author</th>
                  <th className="p-3">ISBN</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBooks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-orange-600">{b.id}</td>
                    <td className="p-3 font-sans">
                      <div className="font-bold text-slate-900 text-sm">{b.title}</div>
                      <div className="text-xs text-slate-500">by {b.author}</div>
                    </td>
                    <td className="p-3 text-slate-600">{b.isbn}</td>
                    <td className="p-3 text-slate-700 font-bold">{b.category}</td>
                    <td className="p-3 text-slate-800 font-bold">{b.quantity}</td>
                    <td className="p-3 text-emerald-600 font-bold">{b.availableCopies}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.availableCopies > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {b.availableCopies > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingBook(b);
                          setBookTitle(b.title);
                          setBookAuthor(b.author);
                          setBookIsbn(b.isbn);
                          setBookCategory(b.category);
                          setBookQty(b.quantity);
                          setIsAddBookOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBook(b.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MEMBER DIRECTORY */}
      {activeTab === 'members' && (
        <div className="soft-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-full sm:w-80">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Member Name, ID, Email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-800 w-full text-xs"
              />
            </div>

            <button
              onClick={() => {
                setEditingMember(null);
                setMemberName('');
                setMemberEmail('');
                setMemberPhone('');
                setIsAddMemberOpen(true);
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center space-x-1.5 transition font-mono"
            >
              <Plus className="h-4 w-4" />
              <span>Register New Member</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                  <th className="p-3">Member ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email &amp; Phone</th>
                  <th className="p-3">Academic Role</th>
                  <th className="p-3">Membership Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-orange-600">{m.id}</td>
                    <td className="p-3 font-sans font-bold text-slate-900 text-sm">{m.name}</td>
                    <td className="p-3 text-slate-600">
                      <div>{m.email}</div>
                      <div className="text-[10px] text-slate-400">{m.phone}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-800">{m.role}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {m.membershipStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setMemberName(m.name);
                          setMemberEmail(m.email);
                          setMemberPhone(m.phone);
                          setMemberRole(m.role);
                          setIsAddMemberOpen(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteMember(m.id)}
                        className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRANSACTIONS LOG */}
      {activeTab === 'transactions' && (
        <div className="soft-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs w-80">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Transaction ID, Book, Borrower..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-slate-800 w-full text-xs"
              />
            </div>
            <span className="text-xs font-mono text-slate-500">Total Audit Logs: {transactions.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 bg-slate-50">
                  <th className="p-3">Tx ID</th>
                  <th className="p-3">Book Title</th>
                  <th className="p-3">Borrower Name</th>
                  <th className="p-3">Issue Date</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Return Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Overdue Fine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTx.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-orange-600">{t.id}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">{t.bookTitle}</td>
                    <td className="p-3 text-slate-700">{t.memberName}</td>
                    <td className="p-3 text-slate-600">{t.issueDate}</td>
                    <td className="p-3 text-slate-600">{t.dueDate}</td>
                    <td className="p-3 text-slate-600">{t.returnDate || '-'}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Returned' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        t.status === 'Issued' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {t.fineAmount > 0 ? <span className="text-rose-600">${t.fineAmount}.00</span> : '$0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ISSUE BOOK FORM */}
      {activeTab === 'issue' && (
        <div className="soft-card p-6 max-w-xl mx-auto space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 font-mono">
            <Plus className="h-5 w-5 text-orange-500" />
            <span>Issue Available Book to Member</span>
          </h3>

          <form onSubmit={handleIssueSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-bold">Select Available Book:</label>
              <select
                value={issueBookId}
                onChange={(e) => setIssueBookId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.availableCopies > 0).map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} (Available: {b.availableCopies} copies)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">Select Active Borrower Member:</label>
              <select
                value={issueMemberId}
                onChange={(e) => setIssueMemberId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role} - {m.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Issue Date:</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Due Date (14 Days Default):</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20 transition text-sm"
            >
              Confirm &amp; Issue Book Transaction
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: RETURN BOOK FORM */}
      {activeTab === 'return' && (
        <div className="soft-card p-6 max-w-xl mx-auto space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 font-mono">
            <RotateCcw className="h-5 w-5 text-emerald-600" />
            <span>Process Book Return Transaction</span>
          </h3>

          <form onSubmit={handleReturnSubmit} className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <label className="text-slate-600 font-bold">Select Active Issued Transaction:</label>
              <select
                value={returnTxId}
                onChange={(e) => setReturnTxId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose Issued Transaction --</option>
                {transactions.filter(t => t.status === 'Issued').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id}: "{t.bookTitle}" borrowed by {t.memberName} (Due: {t.dueDate})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-600 font-bold">Return Date:</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-md transition text-sm"
            >
              Confirm Book Return &amp; Calculate Overdue
            </button>
          </form>
        </div>
      )}

      {/* ADD/EDIT BOOK MODAL */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-panel w-full max-w-lg p-6 rounded-2xl space-y-4 border border-slate-200 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingBook ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h3>
              <button onClick={() => setIsAddBookOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Book Title:</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Author:</label>
                <input
                  type="text"
                  required
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">ISBN:</label>
                  <input
                    type="text"
                    required
                    value={bookIsbn}
                    onChange={(e) => setBookIsbn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Category:</label>
                  <select
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                  >
                    <option value="Operating Systems">Operating Systems</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Algorithms">Algorithms</option>
                    <option value="Software Engineering">Software Engineering</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Total Copies Quantity:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={bookQty}
                  onChange={(e) => setBookQty(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD/EDIT MEMBER MODAL */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-panel w-full max-w-lg p-6 rounded-2xl space-y-4 border border-slate-200 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingMember ? 'Edit Member Details' : 'Register New Member'}
              </h3>
              <button onClick={() => setIsAddMemberOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Full Name:</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Email:</label>
                  <input
                    type="email"
                    required
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-600 font-bold">Phone Number:</label>
                  <input
                    type="text"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold">Academic Role:</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Researcher">Researcher</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-md shadow-orange-500/20"
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
