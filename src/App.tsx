import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { LibraryView } from './views/LibraryView';
import { ProcessManagementView } from './views/ProcessManagementView';
import { MemoryManagementView } from './views/MemoryManagementView';
import { DiskSchedulingView } from './views/DiskSchedulingView';
import { ResultsAnalysisView } from './views/ResultsAnalysisView';
import { TestingValidationView } from './views/TestingValidationView';
import { TeamParametersView } from './views/TeamParametersView';
import { AboutProjectView } from './views/AboutProjectView';
import type { LMSBook, LMSMember, LMSTransaction, ActivityLog } from './types/os';
import {
  getStoredBooks,
  saveStoredBooks,
  getStoredMembers,
  saveStoredMembers,
  getStoredTransactions,
  saveStoredTransactions,
  resetAllLMSStorage
} from './utils/lmsStorage';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const [books, setBooks] = useState<LMSBook[]>([]);
  const [members, setMembers] = useState<LMSMember[]>([]);
  const [transactions, setTransactions] = useState<LMSTransaction[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  useEffect(() => {
    setBooks(getStoredBooks());
    setMembers(getStoredMembers());
    setTransactions(getStoredTransactions());
    
    logActivity(
      'PROCESS',
      'System Kernel Boot Completed',
      'Loaded Team 10 OS parameters: Round Robin Q=4, RAM 4GB/4KB, Disk 0-130.',
      'success'
    );
  }, []);

  const logActivity = (
    module: 'LMS' | 'PROCESS' | 'MEMORY' | 'DISK',
    action: string,
    details: string,
    status: 'success' | 'info' | 'warning' | 'alert' = 'info'
  ) => {
    const newLog: ActivityLog = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      module,
      action,
      details,
      status
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const handleAddBook = (book: LMSBook) => {
    const updated = [book, ...books];
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book "${book.title}" added to catalog.`);
    logActivity('LMS', 'Add Book', `Added book "${book.title}" (ISBN: ${book.isbn})`, 'success');
  };

  const handleEditBook = (book: LMSBook) => {
    const updated = books.map(b => (b.id === book.id ? book : b));
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book "${book.title}" updated.`);
    logActivity('LMS', 'Edit Book', `Updated details for book ID ${book.id}`, 'info');
  };

  const handleDeleteBook = (id: string) => {
    const target = books.find(b => b.id === id);
    const updated = books.filter(b => b.id !== id);
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book deleted.`);
    logActivity('LMS', 'Delete Book', `Deleted book ID ${id} (${target?.title || ''})`, 'warning');
  };

  const handleAddMember = (member: LMSMember) => {
    const updated = [member, ...members];
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member "${member.name}" registered.`);
    logActivity('LMS', 'Register Member', `Registered member "${member.name}" (${member.role})`, 'success');
  };

  const handleEditMember = (member: LMSMember) => {
    const updated = members.map(m => (m.id === member.id ? member : m));
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member "${member.name}" updated.`);
    logActivity('LMS', 'Edit Member', `Updated member details for ${member.id}`, 'info');
  };

  const handleDeleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member deleted.`);
    logActivity('LMS', 'Delete Member', `Deleted member ID ${id} (${target?.name || ''})`, 'warning');
  };

  const handleIssueBook = (bookId: string, memberId: string, issueDate: string, dueDate: string) => {
    const targetBook = books.find(b => b.id === bookId);
    const targetMember = members.find(m => m.id === memberId);
    if (!targetBook || !targetMember) return;

    const newTx: LMSTransaction = {
      id: 'TX-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      bookId,
      bookTitle: targetBook.title,
      memberId,
      memberName: targetMember.name,
      issueDate,
      dueDate,
      status: 'Issued',
      overdueDays: 0,
      fineAmount: 0
    };

    const updatedBooks = books.map(b => {
      if (b.id === bookId) {
        const newAvailable = Math.max(0, b.availableCopies - 1);
        return {
          ...b,
          availableCopies: newAvailable,
          status: (newAvailable === 0 ? 'Out of Stock' : 'Partially Issued') as any
        };
      }
      return b;
    });
    setBooks(updatedBooks);
    saveStoredBooks(updatedBooks);

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    saveStoredTransactions(updatedTx);

    showToast(`Book "${targetBook.title}" issued to ${targetMember.name}.`);
    logActivity(
      'LMS',
      'Issue Book Transaction',
      `Issued "${targetBook.title}" to ${targetMember.name}. Triggered CPU Round Robin task & Page Translation.`,
      'success'
    );
  };

  const handleReturnBook = (txId: string, returnDate: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    let overdueDays = 0;
    let fineAmount = 0;
    const due = new Date(tx.dueDate);
    const ret = new Date(returnDate);
    if (ret > due) {
      const diffTime = Math.abs(ret.getTime() - due.getTime());
      overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 1.0;
    }

    const updatedTx = transactions.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          returnDate,
          status: 'Returned' as const,
          overdueDays,
          fineAmount
        };
      }
      return t;
    });
    setTransactions(updatedTx);
    saveStoredTransactions(updatedTx);

    const updatedBooks = books.map(b => {
      if (b.id === tx.bookId) {
        const newAvail = b.availableCopies + 1;
        return {
          ...b,
          availableCopies: newAvail,
          status: (newAvail >= b.quantity ? 'Available' : 'Partially Issued') as any
        };
      }
      return b;
    });
    setBooks(updatedBooks);
    saveStoredBooks(updatedBooks);

    showToast(`Book "${tx.bookTitle}" returned. ${overdueDays > 0 ? `Overdue fine: $${fineAmount}.00` : ''}`);
    logActivity(
      'LMS',
      'Return Book Transaction',
      `Returned "${tx.bookTitle}". Overdue: ${overdueDays} days. Fine: $${fineAmount}.`,
      'info'
    );
  };

  const handleResetTeam10 = () => {
    const { books: b, members: m, transactions: t } = resetAllLMSStorage();
    setBooks(b);
    setMembers(m);
    setTransactions(t);
    showToast('Team 10 sample data reset successfully.');
    logActivity('PROCESS', 'Reset Team 10 Parameters', 'Restored initial sample data for Team 10.', 'warning');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100 font-sans">
      <Navbar
        onResetTeam10={handleResetTeam10}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
        />

        <main className="flex-1 lg:ml-64 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-950/90 border border-emerald-700/80 text-emerald-200 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-mono flex items-center space-x-3 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>{toastMessage}</span>
            </div>
          )}

          {activeView === 'dashboard' && (
            <DashboardView
              books={books}
              members={members}
              transactions={transactions}
              activityLogs={activityLogs}
              onNavigateToView={setActiveView}
            />
          )}

          {activeView === 'library' && (
            <LibraryView
              books={books}
              members={members}
              transactions={transactions}
              onAddBook={handleAddBook}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              onAddMember={handleAddMember}
              onEditMember={handleEditMember}
              onDeleteMember={handleDeleteMember}
              onIssueBook={handleIssueBook}
              onReturnBook={handleReturnBook}
              onResetData={handleResetTeam10}
            />
          )}

          {activeView === 'process' && <ProcessManagementView />}
          {activeView === 'memory' && <MemoryManagementView />}
          {activeView === 'disk' && <DiskSchedulingView />}
          {activeView === 'results' && <ResultsAnalysisView />}
          {activeView === 'testing' && <TestingValidationView />}
          {activeView === 'team10' && (
            <TeamParametersView
              onNavigateToView={setActiveView}
              onResetTeam10={handleResetTeam10}
            />
          )}
          {activeView === 'about' && <AboutProjectView />}
        </main>
      </div>
    </div>
  );
};

export default App;
