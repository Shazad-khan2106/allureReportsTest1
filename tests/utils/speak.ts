import { exec } from 'child_process';

export function speak(message: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Escape double quotes
    const escapedMessage = message.replace(/"/g, '\\"');

    // PowerShell command to speak the message
    const command = `powershell -NoProfile -Command "Add-Type -AssemblyName System.Speech; `
      + `$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer; `
      + `$speak.Volume = 100; $speak.Speak(\\"${escapedMessage}\\")"`;

    console.log('🗣️ Speaking:', message);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ TTS failed:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
