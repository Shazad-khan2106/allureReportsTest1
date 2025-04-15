// import { exec } from 'child_process';

// export function speak(message: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//     // Escape double quotes
//     const escapedMessage = message.replace(/"/g, '\\"');

//     // PowerShell command to speak the message
//     const command = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; `
//       + `$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; `
//       + `$speak.Volume = 100; $speak.Speak(\\"${escapedMessage}\\")"`;

//     console.log('🗣️ Speaking:', message);

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error('❌ TTS failed:', error);
//         reject(error);
//       } else {
//         resolve();
//       }
//     });
//   });
// }
import { exec } from 'child_process';
import { isFuzzyMatch } from './fuzzyMatch';

export async function speak(
  page: any,
  message: string,
  inputSelector: string
): Promise<void> {
  const escapedMessage = message.replace(/"/g, '\\"');

  const command = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; `
    + `$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; `
    + `$speak.Volume = 100; $speak.Speak(\\"${escapedMessage}\\")"`;

  console.log('🗣️ Speaking:', message);

  return new Promise((resolve) => {
    exec(command, async (error) => {
      if (error) {
        console.error('❌ TTS failed:', error);
        await page.fill(inputSelector, message);
        return resolve();
      }

      await new Promise(r => setTimeout(r, 1000)); // wait for speaking duration
      const maxRetries = 20;
      const retryDelay = 500;
      let captured = '';

      for (let i = 0; i < maxRetries; i++) {
        captured = await page.$eval(inputSelector, (el: HTMLInputElement) => el.value);
        if (isFuzzyMatch(captured, message, 0.7)) {
          console.log('✅ AI captured message (fuzzy match succeeded).');
          return resolve();
        }
        await new Promise(r => setTimeout(r, retryDelay));
      }

      console.warn('⚠️ AI did not capture message accurately enough, filling manually.');
      await page.fill(inputSelector, message);
      resolve();
    });
  });
}
