import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenses: any[] = [];
  amount: string = ''; // Az összeg szöveges formátumban
  name: string = ''; // Az expense neve

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    // Expense lista betöltése
    this.financeService.getIncomes().subscribe(transactions => {
      this.expenses = transactions.filter(transaction => transaction.type === 'expense');
    });
  }

  formatAmount(): void {
    const numericAmount = parseFloat(this.amount.replace(/[^0-9]/g, '')); // Csak számokat enged
    if (!isNaN(numericAmount)) {
      this.amount = new Intl.NumberFormat('hu-HU').format(numericAmount); // Forint formázás
    } else {
      this.amount = '';
    }
  }

  addTransaction(): void {
    const numericAmount = parseFloat(this.amount.replace(/[^0-9]/g, ''));
    if (numericAmount > 0 && this.name.trim() !== '') {
      this.financeService.addExpense({ amount: numericAmount, name: this.name });
      this.amount = '';
      this.name = '';
    }
  }

  removeExpense(index: number): void {
    this.financeService.removeExpense(index); // Törlés a FinanceService-ből
  }

  clearAllExpenses(): void {
    this.financeService.clearAllExpenses();
    this.expenses = [];
  }
}
