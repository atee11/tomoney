import { Component, Input, OnChanges, SimpleChanges, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() totalIncome: number = 0;
  @Input() totalExpense: number = 0;
  @Input() remainingBalance: number = 0;

  chartData: any[] = [];

  customColors = [
    { name: 'Income', value: '#7209b7' },        
    { name: 'Expense', value: '#f72585' },        
    { name: 'Remaining Balance', value: '#2a9d8f' }  
  ];


  chartWidth: number = 500;
  chartHeight: number = 500;

  ngOnInit(): void {
    this.adjustChartSize(); // Kezdeti méret beállítás
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartData();
  }

  updateChartData(): void {
    if (this.totalExpense === 0) {
      this.chartData = [
        { name: 'Income', value: this.totalIncome },
        { name: 'Remaining Balance', value: this.totalIncome }
      ];
    } else {
      this.chartData = [
        { name: 'Income', value: this.totalIncome },
        { name: 'Expense', value: this.totalExpense },
        { name: 'Remaining Balance', value: this.remainingBalance }
      ];
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.adjustChartSize();
  }

  adjustChartSize(): void {
    const windowWidth = window.innerWidth;
    if (windowWidth < 600) {
      this.chartWidth = windowWidth;  // Mobilon a teljes szélesség
      this.chartHeight = 300;  // Mobilon kisebb magasság
    } else {
      this.chartWidth = 500;  // Asztali nézet szélessége
      this.chartHeight = 500;  // Asztali nézet magassága
    }
  }  
}
