import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, Page, BrowserContext } from 'playwright';
import { BaptistTranscription } from '../tests/pages/BaptistTranscription';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  baptistPage!: BaptistTranscription;
  logs: string[] = [];

  addLog(message: string) {
    const timestamp = new Date().toISOString();
    this.logs.push(`[${timestamp}] ${message}`);
  }
}

setWorldConstructor(CustomWorld);
