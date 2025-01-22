import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private transactions: { amount: number, type: string }[] = [];
  private transactionsSubject: BehaviorSubject<{ amount: number, type: string }[]> = new BehaviorSubject(this.transactions);

  constructor() {
    this.loadTransactions();
  }

  private loadTransactions() {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
      this.transactionsSubject.next(this.transactions);
    }
  }

  private saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  // Új tranzakció hozzáadása
  addTransaction(transaction: { amount: number; type: string; name: string }) {
    this.transactions.push(transaction);
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions);
  }

  // Observable adatokat biztosítunk a komponensek számára
  getTransactions() {
    return this.transactionsSubject.asObservable();
  }

  getTotalIncome() {
    return this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  getTotalExpense() {
    return this.transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Az összes tranzakció törlése
  clearTransactions() {
    this.transactions = [];
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions); // Ezzel frissítjük az Observable-t
  }

  clearIncomeTransactions() {
    this.transactions = this.transactions.filter(transaction => transaction.type !== 'income');
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions);
  }

  clearExpenseTransactions() {
    this.transactions = this.transactions.filter(transaction => transaction.type !== 'expense');
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions);
  }

  removeTransaction(index: number, type: string): void {
    // Csak az adott típusú tranzakciókat szűrjük ki
    const filteredTransactions = this.transactions.filter(transaction => transaction.type === type);
    const transactionToRemove = filteredTransactions[index];

    // Az eredeti lista indexének megkeresése
    const originalIndex = this.transactions.indexOf(transactionToRemove);

    if (originalIndex > -1) {
      this.transactions.splice(originalIndex, 1); // Törlés
      this.saveTransactions(); // Mentés a localStorage-be
      this.transactionsSubject.next(this.transactions); // Observable frissítés
    }
  }

}
