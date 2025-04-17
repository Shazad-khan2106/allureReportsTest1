import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config();
import { streamAudioToBot } from '../utils/streamAudioToBot';
import { isFuzzyMatch } from '../utils/fuzzyMatch';
import { testData } from "../test_data/properties.json";
import { CustomWorld } from '../../support/world'; // Adjust path if needed


export class BaptistTranscription {
  private wsUrl?: string;
  // constructor(private page: Page) {}
  constructor(private world: CustomWorld) {}

  private get page() {
    return this.world.page;
  }
  async gotoLogin() {
    this.world.addLog('Navigating to login page');
    await this.page.goto(testData.URL); // replace with real URL
  }

  async login(username: string, password: string) {
    this.world.addLog(`Logging in with user: ${username}`);
    await this.page.fill('#LoginId', username);
    await this.page.fill('#password', password);
    await this.page.click('[type="submit"]');
    await this.page.waitForSelector('[aria-label="Open page"]');
  }

  async isHomepageVisible() {
    const visible = await this.page.locator('[aria-label="Open page"]').isVisible();
    this.world.addLog(`Homepage visibility: ${visible}`);
    return visible;
  }

  async openChatbot() {
    this.world.addLog('Opening chatbot');
    await this.page.click('[aria-label="Open page"]'); // update selector
  }

  async clickOnMicIcon() {
    
    await this.page.waitForTimeout(2000); // buffer time before click
    await this.page.waitForSelector('[alt="Microphone"]', { timeout: 10000 });
    // await this.page.click('[alt="Microphone"]');
    await this.page.$eval('[alt="Microphone"]', (el: HTMLElement) => el.click());
    await this.page.waitForTimeout(2000);
  }



  async getWebSocketURL() {
    

      this.world.addLog('Clicking microphone and listening for WebSocket');
      this.page.on('websocket', (websocket) => {
        const url = websocket.url();
        if (url.includes('audio-stream')) {
          this.wsUrl = url;
          this.world.addLog(`Captured WebSocket URL: ${url}`);
          console.log("🔌 WebSocket URL captured:", url);
          return;
        }
      });
    // this.world.addLog('Clicking microphone and listening for WebSocket');

    // // Intercept WebSocket connection
    // this.page.on('websocket', (websocket) => {
    //   const url = websocket.url();
    //   if (url.includes('audio-stream')) {
    //     this.wsUrl = url;
    //     this.world.addLog(`Captured WebSocket URL: ${url}`);
    //     console.log("🔌 WebSocket URL captured:", url);
    //   }
    // });
    
    // await this.page.waitForTimeout(500);
    // await this.page.click('[alt="Microphone"]'); // update selector
    // await this.page.waitForTimeout(2000); // update selector
  }

  async simulateSpeech(text: string) {
    if (!this.wsUrl) {
      throw new Error('❌ WebSocket URL not available. Did you forget to call clickMic()?');
    }
  
    await streamAudioToBot(
      this.page,
      path.resolve(__dirname, '../../voice/English.mp3'),
      text,
      this.wsUrl
    );
    

    // await this.page.waitForTimeout(3000)
    // this.world.addLog(`Simulating speech: "${text}"`);
    // const inputSelector = '#auto-resize-textarea'; 
    // speak(this.page,text, inputSelector )
  }

  async verifyTranscription(originalSentence: string) {
    // await this.page.waitForSelector('#auto-resize-textarea[style*="height: 64px"]', {
    //   timeout: 15000,
    // });
    const maxRetries = 20;
    const retryDelay = 500;
    let captured = '';

    for (let i = 0; i < maxRetries; i++) {
      const inputText = await this.page.$eval('#auto-resize-textarea', (el: HTMLInputElement) => el.value).catch(() => '');
      const pText = await this.page.$eval('.min-w-fit p', (el) => el.textContent?.trim() || '').catch(() => '');
      captured = inputText || pText;

      console.log(`📝 [Verify Try ${i + 1}] Text: "${captured}"`);

      if (isFuzzyMatch(originalSentence, captured, 0.8)) {
        this.world.addLog('✅ Transcription matched successfully!');
        console.log("✅ Transcription matched successfully!");
        return;
      }

      await this.page.waitForTimeout(retryDelay);
    }

    const errorMsg = `❌ Transcribed text does not match. Expected "${originalSentence}", got "${captured}"`;
    this.world.addLog(errorMsg);
    throw new Error(errorMsg);
    }
    
}
