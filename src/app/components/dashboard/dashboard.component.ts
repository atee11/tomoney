import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpense: number = 0;
  remainingBalance: number = 0; 

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    // Feliratkozás a tranzakciók változására
    this.storageService.getTransactions().subscribe(transactions => {
      this.totalIncome = this.storageService.getTotalIncome();
      this.totalExpense = this.storageService.getTotalExpense();
      this.remainingBalance = this.totalIncome - this.totalExpense; 
    });
  }

  // Adatok törlésére szolgáló metódus
  clearAll(): void {
    this.storageService.clearTransactions();
    this.totalIncome = 0;
    this.totalExpense = 0;
    this.remainingBalance = 0; 
  }
}
