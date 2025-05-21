/** @file Provides common context for the options page. */

import { createContext } from 'react';
import { UrlMapping } from '@app/rules_handler';

export type OptionsContextType = {
  urlMapping: UrlMapping[];
  updateUrlMapping: () => Promise<void>;
}

export const OptionsContext = createContext({
  urlMapping:[],
  async updateUrlMapping() {},
} as OptionsContextType);
