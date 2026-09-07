/**
 * IndexedDB Manager
 * مدیریت ذخیره‌سازی و بازیابی داده‌های API در IndexedDB
 */

const DB_NAME = 'rawzat_hussein_cache';
const DB_VERSION = 1;
const STORE_NAME = 'api_cache';

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * باز کردن یا ایجاد دیتابیس
   */
  private async openDB(): Promise<IDBDatabase> {
    // استفاده از window.indexedDB برای جلوگیری از تداخل نام
    if (typeof window === 'undefined' || !window.indexedDB) {
      throw new Error('IndexedDB is not available');
    }

    return new Promise((resolve, reject) => {
      const openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onsuccess = () => resolve(openRequest.result);

      openRequest.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;

        // ایجاد object store اگر وجود ندارد
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * مقداردهی اولیه دیتابیس
   */
  async init(): Promise<void> {
    if (this.db) return;
    
    if (!this.initPromise) {
      this.initPromise = this.openDB().then((database) => {
        this.db = database;
      });
    }
    
    return this.initPromise;
  }

  /**
   * ذخیره داده در کش
   */
  async set<T>(key: string, data: T, ttl: number = 3600000): Promise<void> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const putRequest = store.put(entry);

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    });
  }

  /**
   * دریافت داده از کش
   */
  async get<T>(key: string): Promise<T | null> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        const entry = getRequest.result as CacheEntry<T> | undefined;
        
        if (!entry) {
          resolve(null);
          return;
        }

        // بررسی انقضا
        if (Date.now() > entry.expiresAt) {
          this.delete(key); // حذف داده منقضی شده
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * حذف داده از کش
   */
  async delete(key: string): Promise<void> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(key);

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });
  }

  /**
   * پاک کردن تمام کش
   */
  async clear(): Promise<void> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  /**
   * حذف داده‌های منقضی شده
   */
  async clearExpired(): Promise<void> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('expiresAt');
      const range = IDBKeyRange.upperBound(Date.now());
      const cursorRequest = index.openCursor(range);

      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      cursorRequest.onerror = () => reject(cursorRequest.error);
    });
  }

  /**
   * دریافت تمام کلیدها
   */
  async getAllKeys(): Promise<string[]> {
    await this.init();
    
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const keysRequest = store.getAllKeys();

      keysRequest.onsuccess = () => resolve(keysRequest.result as string[]);
      keysRequest.onerror = () => reject(keysRequest.error);
    });
  }

  /**
   * بستن دیتابیس
   */
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initPromise = null;
    }
  }
}

// Singleton instance - فقط در client-side ایجاد می‌شود
let indexedDBManagerInstance: IndexedDBManager | null = null;

if (typeof window !== 'undefined') {
  indexedDBManagerInstance = new IndexedDBManager();
}

export { indexedDBManagerInstance as indexedDBManager };
export default indexedDBManagerInstance;
