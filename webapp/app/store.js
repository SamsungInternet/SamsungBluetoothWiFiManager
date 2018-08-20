import { Store } from 'svelte/store.js'

/**
 * Based on code by Nolan Lawson from https://github.com/nolanlawson/pinafore/
 */

const KEY = 'ui-store';

class LocalStorageStore extends Store {
  constructor (state) {
    super(state);
    if (process.browser) {
      let cached = localStorage.getItem(KEY);
      if (cached) {
        this.set(JSON.parse(cached));
      }
      window.addEventListener('beforeunload', () => this.save());
    }
  }

  save() {
    if (process.browser) {
      console.log('Saving state to localStorage');
      localStorage.setItem(KEY, JSON.stringify(this._state))
    }
  }
}

export {LocalStorageStore as Store};