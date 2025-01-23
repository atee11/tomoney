import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment'; // Environment importálása

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'financeApp';
  private storeName = 'transactions';
  private encryptionKey = environment.secretKey; // Titkos kulcs az environment-ből

  private transactions: { amount: number, type: string }[] = [];
  private transactionsSubject: BehaviorSubject<{ amount: number, type: string }[]> = new BehaviorSubject(this.transactions);

  constructor() {
    this.loadTransactions();  // Adatok betöltése az IndexedDB-ből
  }

  // Adatok betöltése az IndexedDB-ből
  private loadTransactions() {
    const openRequest = indexedDB.open(this.dbName, 1);

    openRequest.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    openRequest.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(this.storeName, 'readonly');
      const store = transaction.objectStore(this.storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        const storedTransactions = getAllRequest.result.map((item: any) => {
          const decryptedData = CryptoJS.AES.decrypt(item.encryptedData, this.encryptionKey);
          return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8));
        });
        this.transactions = storedTransactions; // Betöltjük az adatokat
        this.transactionsSubject.next(this.transactions);  // Observable frissítése
      };

      getAllRequest.onerror = (err: Event) => {
        console.error('Error fetching data from IndexedDB:', err);
      };
    };

    openRequest.onerror = (err: Event) => {
      console.error('Hiba az IndexedDB megnyitásakor', err);
    };
  }

  // Adatok mentése az IndexedDB-be
  private saveTransactions() {
    const openRequest = indexedDB.open(this.dbName, 1);

    openRequest.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      // Először töröljük a régi adatokat
      store.clear();

      // Titkosítjuk az új tranzakciókat
      const encryptedTransactions = this.transactions.map(transaction => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(transaction), this.encryptionKey).toString();
        return { encryptedData };  // Titkosított adat
      });

      encryptedTransactions.forEach(item => {
        store.put(item);  // Új tranzakciók hozzáadása
      });

      transaction.oncomplete = () => {
        console.log('Tranzakciók sikeresen elmentve!');
      };

      transaction.onerror = (err: Event) => {
        console.error('Hiba az IndexedDB mentésekor', err);
      };
    };

    openRequest.onerror = (err: Event) => {
      console.error('Hiba az IndexedDB megnyitásakor', err);
    };
  }

  // Új tranzakció hozzáadása
  addTransaction(transaction: { amount: number; type: string; name: string }) {
    this.transactions.push(transaction);
    this.saveTransactions();  // Frissítés az IndexedDB-ben
    this.transactionsSubject.next(this.transactions);  // Observable frissítése
  }

  // Az összes tranzakció lekérése
  getTransactions() {
    return this.transactionsSubject.asObservable();
  }

  // Összes bevétel lekérése
  getTotalIncome() {
    return this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Összes kiadás lekérése
  getTotalExpense() {
    return this.transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }

  // Az összes tranzakció törlése
  clearTransactions() {
    const openRequest = indexedDB.open(this.dbName, 1);

    openRequest.onsuccess = (e: any) => {
      const db = e.target.result;
      const transaction = db.transaction(this.storeName, 'readwrite');
      const store = transaction.objectStore(this.storeName);

      store.clear();  // Az összes tranzakció törlése
      transaction.oncomplete = () => {
        this.transactions = [];
        this.transactionsSubject.next(this.transactions);  // Observable frissítése
        console.log('Minden tranzakció törölve az IndexedDB-ből');
      };

      transaction.onerror = (err: Event) => {
        console.error('Hiba az IndexedDB törlésénél', err);
      };
    };

    openRequest.onerror = (err: Event) => {
      console.error('Hiba az IndexedDB megnyitásakor', err);
    };
  }

  // Kiadások törlése
  clearExpenseTransactions() {
    this.transactions = this.transactions.filter(transaction => transaction.type !== 'expense');
    this.saveTransactions();  // Mentés az új listával
    this.transactionsSubject.next(this.transactions);
  }

  // Bevételek törlése
  clearIncomeTransactions() {
    this.transactions = this.transactions.filter(transaction => transaction.type !== 'income');
    this.saveTransactions();  // Mentés az új listával
    this.transactionsSubject.next(this.transactions);
  }

  // Tranzakció eltávolítása
  removeTransaction(index: number, type: string): void {
    const filteredTransactions = this.transactions.filter(transaction => transaction.type === type);
    const transactionToRemove = filteredTransactions[index];

    const originalIndex = this.transactions.indexOf(transactionToRemove);

    if (originalIndex > -1) {
      this.transactions.splice(originalIndex, 1);  // Törlés
      this.saveTransactions();  // Mentés a IndexedDB-be
      this.transactionsSubject.next(this.transactions);  // Observable frissítés
    }
  }
}
