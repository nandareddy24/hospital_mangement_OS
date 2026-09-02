import type { LMSBook, LMSMember, LMSTransaction } from '../types/os';
import { INITIAL_BOOKS, INITIAL_MEMBERS, INITIAL_TRANSACTIONS } from './constants';

const BOOKS_KEY = 'hos_lms_books_v1';
const MEMBERS_KEY = 'hos_lms_members_v1';
const TRANSACTIONS_KEY = 'hos_lms_transactions_v1';

export function getStoredBooks(): LMSBook[] {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (!raw) return INITIAL_BOOKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKS;
  } catch (e) {
    console.error('Error reading books from localStorage:', e);
    return INITIAL_BOOKS;
  }
}

export function saveStoredBooks(books: LMSBook[]): void {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('Error saving books to localStorage:', e);
  }
}

export function getStoredMembers(): LMSMember[] {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    if (!raw) return INITIAL_MEMBERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MEMBERS;
  } catch (e) {
    console.error('Error reading members from localStorage:', e);
    return INITIAL_MEMBERS;
  }
}

export function saveStoredMembers(members: LMSMember[]): void {
  try {
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving members to localStorage:', e);
  }
}

export function getStoredTransactions(): LMSTransaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) return INITIAL_TRANSACTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_TRANSACTIONS;
  } catch (e) {
    console.error('Error reading transactions from localStorage:', e);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: LMSTransaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Error saving transactions to localStorage:', e);
  }
}

export function resetAllLMSStorage(): { books: LMSBook[]; members: LMSMember[]; transactions: LMSTransaction[] } {
  localStorage.removeItem(BOOKS_KEY);
  localStorage.removeItem(MEMBERS_KEY);
  localStorage.removeItem(TRANSACTIONS_KEY);

  saveStoredBooks(INITIAL_BOOKS);
  saveStoredMembers(INITIAL_MEMBERS);
  saveStoredTransactions(INITIAL_TRANSACTIONS);

  return {
    books: INITIAL_BOOKS,
    members: INITIAL_MEMBERS,
    transactions: INITIAL_TRANSACTIONS
  };
}
