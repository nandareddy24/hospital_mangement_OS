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
      'Loaded master OS parameters: Round Robin Q=4, RAM 4GB/4KB, Disk 0-130.',
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
    setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleAddBook = (newBook: LMSBook) => {
    const updated = [newBook, ...books];
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book "${newBook.title}" added to library catalog.`);
    logActivity('LMS', 'Add New Book', `Added "${newBook.title}" (ISBN: ${newBook.isbn}).`, 'success');
  };

  const handleEditBook = (updatedBook: LMSBook) => {
    const updated = books.map(b => b.id === updatedBook.id ? updatedBook : b);
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book "${updatedBook.title}" updated.`);
    logActivity('LMS', 'Edit Book Details', `Updated "${updatedBook.title}".`, 'info');
  };

  const handleDeleteBook = (bookId: string) => {
    const target = books.find(b => b.id === bookId);
    const updated = books.filter(b => b.id !== bookId);
    setBooks(updated);
    saveStoredBooks(updated);
    showToast(`Book "${target?.title || bookId}" deleted.`);
    logActivity('LMS', 'Delete Book', `Deleted book ID ${bookId}.`, 'warning');
  };

  const handleAddMember = (newMember: LMSMember) => {
    const updated = [newMember, ...members];
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member "${newMember.name}" registered.`);
    logActivity('LMS', 'Register Member', `Registered member "${newMember.name}" (${newMember.role}).`, 'success');
  };

  const handleEditMember = (updatedMember: LMSMember) => {
    const updated = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member "${updatedMember.name}" updated.`);
    logActivity('LMS', 'Edit Member', `Updated member "${updatedMember.name}".`, 'info');
  };

  const handleDeleteMember = (memberId: string) => {
    const target = members.find(m => m.id === memberId);
    const updated = members.filter(m => m.id !== memberId);
    setMembers(updated);
    saveStoredMembers(updated);
    showToast(`Member "${target?.name || memberId}" deleted.`);
    logActivity('LMS', 'Delete Member', `Deleted member ID ${memberId}.`, 'warning');
  };

  const handleIssueBook = (bookId: string, memberId: string, issueDate: string, dueDate: string) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);

    if (!book || !member) return;
    if (book.availableCopies <= 0) {
      showToast(`Error: Book "${book.title}" has zero available copies.`);
      return;
    }

    const newTx: LMSTransaction = {
      id: 'TX-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: member.name,
      issueDate,
      dueDate,
      status: 'Issued',
      overdueDays: 0,
      fineAmount: 0.00
    };

    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    saveStoredTransactions(updatedTx);

    const updatedBooks = books.map(b => {
      if (b.id === bookId) {
        const newAvail = b.availableCopies - 1;
        return {
          ...b,
          availableCopies: newAvail,
          status: (newAvail <= 0 ? 'Out of Stock' : 'Partially Issued') as any
        };
      }
      return b;
    });
    setBooks(updatedBooks);
    saveStoredBooks(updatedBooks);

    showToast(`Issued "${book.title}" to ${member.name}.`);
    logActivity(
      'LMS',
      'Issue Book Transaction',
      `Issued "${book.title}" to ${member.name} (Due: ${dueDate}).`,
      'success'
    );
  };

  const handleReturnBook = (transactionId: string, returnDate: string) => {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;

    const due = new Date(tx.dueDate);
    const ret = new Date(returnDate);
    const diffTime = ret.getTime() - due.getTime();
    const overdueDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = overdueDays * 1; // $1.00 per day

    const updatedTx = transactions.map(t => {
      if (t.id === transactionId) {
        return {
          ...t,
          returnDate,
          status: 'Returned' as any,
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

  const handleResetDefaults = () => {
    const { books: b, members: m, transactions: t } = resetAllLMSStorage();
    setBooks(b);
    setMembers(m);
    setTransactions(t);
    showToast('Official master sample data reset successfully.');
    logActivity('PROCESS', 'Reset Master Parameters', 'Restored initial sample data to defaults.', 'warning');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a12] text-slate-100 font-sans">
      <Navbar
        activeView={activeView}
        onResetData={handleResetDefaults}
        onNavigateToView={setActiveView}
      />

      <div className="flex flex-1">
        <Sidebar
          activeView={activeView}
          onNavigateToView={setActiveView}
          isOpen={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900/95 border border-cyan-500/40 text-cyan-300 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-mono flex items-center space-x-3 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
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
              onResetData={handleResetDefaults}
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
              onResetTeam10={handleResetDefaults}
            />
          )}
          {activeView === 'about' && <AboutProjectView />}
        </main>
      </div>
    </div>
  );
};

export default App;
