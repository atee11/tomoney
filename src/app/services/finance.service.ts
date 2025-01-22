import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  constructor(private storageService: StorageService) { }

  getIncomes() {
    return this.storageService.getTransactions();
  }

  addIncome(newIncome: { amount: number; name: string }) {
    this.storageService.addTransaction({ ...newIncome, type: 'income' });
  }

  addExpense(newExpense: { amount: number; name: string }) {
    this.storageService.addTransaction({ ...newExpense, type: 'expense' });
  }

  getTotalIncome() {
    return this.storageService.getTotalIncome();
  }

  getTotalExpense() {
    return this.storageService.getTotalExpense();
  }

  getRemainingBalance() {
    const totalIncome = this.getTotalIncome();
    const totalExpense = this.getTotalExpense();
    return totalIncome - totalExpense; 
  }

  clearAllTransactions() {
    this.storageService.clearTransactions();
  }

  clearAllIncomes() {
    this.storageService.clearIncomeTransactions();
  }

  clearAllExpenses() {
    this.storageService.clearExpenseTransactions();
  }

  removeIncome(index: number): void {
    this.storageService.removeTransaction(index, 'income'); 
  }

  removeExpense(index: number): void {
    this.storageService.removeTransaction(index, 'expense'); 
  }

}
