import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  incomes: any[] = [];
  amount: string = ''; // Az összeg szöveges formátumban
  name: string = ''; // Az income neve

  constructor(private financeService: FinanceService) {}

  ngOnInit(): void {
    // Income lista betöltése
    this.financeService.getIncomes().subscribe(transactions => {
      this.incomes = transactions.filter(transaction => transaction.type === 'income');
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
      this.financeService.addIncome({ amount: numericAmount, name: this.name });
      this.amount = '';
      this.name = '';
    }
  }

  removeIncome(index: number): void {
    this.financeService.removeIncome(index); // Törlés a FinanceService-ből
  }

  clearAllIncomes(): void {
    this.financeService.clearAllIncomes();
    this.incomes = [];
  }
}
