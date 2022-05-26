import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { makeHelpSections } from './sections/help';

export const cache = new (class Cache {
  constructor() {
    this.store = create(
      subscribeWithSelector((set, get, api) => {
        return {
          __pending: {},
          __timeout: null,
          help: {
            ...makeHelpSections({ value: null }),
          },
        };
      })
    );
  }

  get() {
    return this.store.getState();
  }

  set(state) {
    this.store.setState(state);
  }
})();
