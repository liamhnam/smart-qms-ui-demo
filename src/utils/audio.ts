/**
 * Web Audio API synthesizer for high-quality Queue Chime ("Ding-Dong")
 * Zero external audio files required, operates 100% offline and latency-free.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDingDongChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) {
        resolve();
        return;
      }

      const now = ctx.currentTime;

      // Note 1: High tone (E5 ~ 659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.7);

      // Note 2: Lower tone (C5 ~ 523.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.35);

      gain2.gain.setValueAtTime(0.001, now + 0.35);
      gain2.gain.exponentialRampToValueAtTime(0.4, now + 0.39);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.35);
      osc2.stop(now + 1.3);

      setTimeout(() => {
        resolve();
      }, 1300);
    } catch (e) {
      console.warn('Audio chime playback failed:', e);
      resolve();
    }
  });
}

export function speakVietnameseAnnouncement(ticketNumber: string, counterTitle: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Format text: "Xin mời số thứ tự A 1 0 2 đến quầy số 01"
    const formattedNumber = ticketNumber.split('').join(' ');
    const text = `Xin mời số thứ tự ${formattedNumber} đến ${counterTitle}`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Try finding Vietnamese voice
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis failed:', e);
  }
}

export async function announceTicketCalling(ticketNumber: string, counterTitle: string) {
  await playDingDongChime();
  speakVietnameseAnnouncement(ticketNumber, counterTitle);
}
