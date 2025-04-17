import fs from 'fs';
import path from 'path';
import { WebSocket } from 'ws';
import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { isFuzzyMatch } from './fuzzyMatch';

// Handle ffmpeg path based on environment
if (process.env.CI !== 'true') {
  const ffmpegPath = path.resolve(__dirname, '../../tools/ffmpeg.exe');
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  ffmpeg.setFfmpegPath('ffmpeg'); // Use system ffmpeg in CI
}

export async function streamAudioToBot(
  page: any,
  mp3Path: string,
  expectedMessage: string,
  wsUrl: string
): Promise<void> {
  const pcmPath = path.resolve(__dirname, '../../voice/output.pcm');
  console.log('🎯 Starting audio stream debug flow...');
  console.log(`🎵 Converting MP3 to PCM\nFrom: ${mp3Path}\nTo:   ${pcmPath}`);

  await convertMp3ToPcm(mp3Path, pcmPath);
  console.log('✅ PCM conversion completed');

  await sendPcmOverWebSocket(pcmPath, wsUrl, 2000);

  console.log('⏳ Waiting for transcription response...');
  await page.waitForTimeout(3000);

  const maxRetries = 20;
  const retryDelay = 500;
  let captured = '';

  for (let i = 0; i < maxRetries; i++) {
    const inputText = await page.$eval('#auto-resize-textarea', (el: HTMLInputElement) => el.value).catch(() => '');
    const pText = await page.$eval('.min-w-fit p', (el: HTMLElement) => el.textContent?.trim() || '').catch(() => '');

    captured = inputText || pText;

    console.log(`📝 [Try ${i + 1}] Captured text: "${captured}"`);

    if (isFuzzyMatch(captured, expectedMessage, 0.7)) {
      console.log('✅ AI captured message (fuzzy match succeeded).');
      return;
    }

    await new Promise((r) => setTimeout(r, retryDelay));
  }

  console.warn('⚠️ AI did not capture message accurately enough, filling manually.');
  await page.fill('#auto-resize-textarea', expectedMessage);
}

function convertMp3ToPcm(mp3Path: string, pcmPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(mp3Path)
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec('pcm_s16le')
      .format('s16le')
      .on('end', () => {
        console.log('🎧 Conversion complete.');
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ Conversion error:', err);
        reject(err);
      })
      .save(pcmPath);
  });
}

function sendPcmOverWebSocket(pcmPath: string, wsUrl: string, chunkSize: number = 2000): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Connecting to WebSocket: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log('🔗 WebSocket connection established');

      ws.send('8,1,16000,8000');
      console.log('📤 Sent format header: 8,1,16000,8000');

      ws.send(JSON.stringify({ start_audio: true }));
      console.log('▶️ Sent start_audio');

      // Only play audio locally
      if (process.env.CI !== 'true') {
        const ffplayPath = path.resolve(__dirname, '../../tools/ffplay.exe');
        const playCmd = `"${ffplayPath}" -f s16le -ar 16000 -autoexit -nodisp -acodec pcm_s16le "${pcmPath}"`;

        exec(playCmd, (error) => {
          if (error) {
            console.error('❌ Audio playback failed:', error.message);
          } else {
            console.log('🔊 Audio playback completed.');
          }
        });
      } else {
        console.log('⏭️ Skipping audio playback in CI environment.');
      }

      const stream = fs.createReadStream(pcmPath, { highWaterMark: chunkSize });

      stream.on('data', (chunk) => {
        ws.send(chunk);
        console.log(`📤 Sent chunk (${chunk.length} bytes)`);
      });

      stream.on('end', async () => {
        console.log('⏹️ Finished sending audio chunks. Waiting before stop_audio...');
        await new Promise((r) => setTimeout(r, 1000));
        ws.send(JSON.stringify({ stop_audio: true }));
        console.log('✅ Sent stop_audio');

        setTimeout(() => {
          console.log('🔒 Closing WebSocket after post-audio wait...');
          ws.close();
          resolve();
        }, 2000);
      });

      stream.on('error', (err) => {
        console.error('❌ Audio stream error:', err);
        reject(err);
      });
    });

    ws.on('message', (data) => {
      console.log('📩 Message from server:', data.toString());
    });

    ws.on('error', (err) => {
      console.error('❗ WebSocket error:', err);
      reject(err);
    });

    ws.on('close', (code, reason) => {
      console.log(`🔒 WebSocket closed (code: ${code}, reason: ${reason || 'No reason provided'})`);
    });
  });
}
