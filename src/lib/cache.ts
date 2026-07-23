type CacheItem<T> = {
  data: T;
  timestamp: number;
};

type CacheStore = {
  [key: string]: CacheItem<any>;
};

type PromiseStore = {
  [key: string]: Promise<any>;
};

class ApiCache {
  private cache: CacheStore = {};
  private activePromises: PromiseStore = {};
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Get an item from the cache. Returns null if missing or expired.
   */
  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    if (Date.now() - item.timestamp > this.defaultTTL) {
      delete this.cache[key];
      return null;
    }

    return item.data as T;
  }

  /**
   * Set an item in the cache
   */
  set<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * Get an active promise to deduplicate concurrent requests
   */
  getPromise<T>(key: string): Promise<T> | null {
    return this.activePromises[key] || null;
  }

  /**
   * Set an active promise
   */
  setPromise<T>(key: string, promise: Promise<T>): void {
    this.activePromises[key] = promise;
    // Automatically clean up the promise when it settles
    promise
      .finally(() => {
        if (this.activePromises[key] === promise) {
          delete this.activePromises[key];
        }
      })
      .catch(() => {
        // Do nothing on catch, the caller handles the error
      });
  }

  /**
   * Delete specific cache key
   */
  delete(key: string): void {
    delete this.cache[key];
    delete this.activePromises[key];
  }

  /**
   * Invalidate any cache keys that start with the given prefix.
   * Useful for clearing related endpoint caches on POST/PUT/DELETE.
   */
  invalidatePrefix(prefix: string): void {
    const keys = Object.keys(this.cache);
    keys.forEach((key) => {
      // Split the prefix by ? in case it has query params, we just want to match the base path
      const basePrefix = prefix.split('?')[0];
      const baseKey = key.split('?')[0];
      
      if (baseKey.startsWith(basePrefix)) {
        delete this.cache[key];
      }
    });

    const promiseKeys = Object.keys(this.activePromises);
    promiseKeys.forEach((key) => {
      const basePrefix = prefix.split('?')[0];
      const baseKey = key.split('?')[0];
      
      if (baseKey.startsWith(basePrefix)) {
        delete this.activePromises[key];
      }
    });
  }
  
  /**
   * Clears the entire cache
   */
  clear(): void {
    this.cache = {};
    this.activePromises = {};
  }
}

export const apiCache = new ApiCache();
