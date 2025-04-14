import { Page } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config();
import { speak } from '../utils/speak';
import { isFuzzyMatch } from '../utils/fuzzyMatch';
import { testData } from "../test_data/properties.json";
import { CustomWorld } from '../../support/world'; // Adjust path if needed


export class BaptistTranscription {
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

  async clickMic() {
    this.world.addLog('Clicking microphone');
    await this.page.click('[alt="Microphone"]'); // update selector
  }

  async simulateSpeech(text: string) {
    await this.page.waitForTimeout(5000)
    this.world.addLog(`Simulating speech: "${text}"`);
    speak(text)
  }

  async verifyTranscription(originalSentence: string) {
    await this.page.waitForSelector('#auto-resize-textarea[style*="height: 64px"]', {
      timeout: 15000,
    });
    const transcriptedText = await this.page.locator('#auto-resize-textarea').inputValue();
      console.log("🧠 Transcription:", transcriptedText);
      this.world.addLog(`Transcribed text: "${transcriptedText}"`);
      if (!isFuzzyMatch(originalSentence, transcriptedText, 0.8)) {
        // throw new Error(`❌ Transcribed text does not match. Expected something like "${originalSentence}", but got "${transcriptedText}"`);
        const errorMsg = `❌ Transcribed text does not match. Expected something like "${originalSentence}", but got "${transcriptedText}"`;
        this.world.addLog(errorMsg);
        throw new Error(errorMsg);
  
      }
      this.world.addLog('✅ Transcription matched successfully!');
      console.log("✅ Transcription matched successfully!");
    }
    
}
