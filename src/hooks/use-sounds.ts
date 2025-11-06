
"use client";

import { useEffect, useRef, useCallback } from 'react';
import type { PolySynth, Synth, NoiseSynth } from 'tone';

const getTone = async () => (typeof window !== 'undefined' ? (await import('tone')) : null);

type Synths = {
  active?: Synth;
  blank?: Synth;
  reset?: PolySynth;
  toggle?: NoiseSynth;
};

type SoundQueueItem = {
  type: keyof Synths;
  options: { note?: any; duration?: any; force?: boolean };
};

export function useSounds(enabled: boolean) {
  const Tone = useRef<any>(null);
  const synths = useRef<Synths>({});
  const isAudioReady = useRef(false);
  const isInitializing = useRef(false);
  const soundQueue = useRef<SoundQueueItem[]>([]);

  const initializeAudio = useCallback(async () => {
    if (isAudioReady.current || isInitializing.current) return;
    isInitializing.current = true;

    try {
      const ToneModule = await getTone();
      if (ToneModule) {
        Tone.current = ToneModule;
        await Tone.current.start();
        
        const volumeNode = new Tone.current.Volume(-18).toDestination();
        
        synths.current = {
          active: new Tone.current.Synth({
            oscillator: { type: 'triangle' },
            envelope: { attack: 0.005, decay: 0.1, sustain: 0.05, release: 0.1 },
          }).connect(volumeNode),
          blank: new Tone.current.Synth({
            oscillator: { type: 'square' },
            envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 },
          }).connect(volumeNode),
          reset: new Tone.current.PolySynth(Tone.current.Synth, {
            oscillator: { type: 'fatsawtooth' },
            envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 },
          }).connect(volumeNode),
          toggle: new Tone.current.NoiseSynth({
            noise: { type: 'white' },
            envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.1 },
          }).connect(volumeNode),
        };
        
        isAudioReady.current = true;
        
        soundQueue.current.forEach(item => playSound(item.type, item.options));
        soundQueue.current = [];
      }
    } catch (e) {
      console.error("Failed to initialize audio:", e);
    } finally {
      isInitializing.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(synths.current).forEach(synth => synth?.dispose());
    };
  }, []);

  const playSound = useCallback((synthType: keyof Synths, options: { note?: any; duration?: any; force?: boolean } = {}) => {
    if (!isAudioReady.current) {
      soundQueue.current.push({ type: synthType, options });
      initializeAudio();
      return;
    }

    if ((!enabled && !options.force) || !Tone.current) return;

    const { note, duration } = options;
    const synth = synths.current[synthType];

    if (!synth) return;
    
    const now = Tone.current.now();
    
    if (synthType === 'active' || synthType === 'blank' || synthType === 'toggle') {
       // @ts-ignore
      if (synth.getStateAtTime(now) === 'started') {
         // @ts-ignore
        synth.triggerRelease(now);
      }
    }

    if (note && duration) {
      // @ts-ignore
      synth.triggerAttackRelease(note, duration);
    } else if (synthType === 'toggle') {
        // @ts-ignore
        synth.triggerAttackRelease("16n");
    }
  }, [enabled, initializeAudio]);

  const playToggleSound = useCallback((shouldPlay: boolean) => {
    playSound('toggle', { force: shouldPlay });
  }, [playSound]);

  return {
    playActiveShellSound: useCallback(() => playSound('active', { note: 'C5', duration: '16n' }), [playSound]),
    playBlankShellSound: useCallback(() => playSound('blank', { note: 'G4', duration: '16n' }), [playSound]),
    playResetSound: useCallback(() => playSound('reset', { note: ['C4', 'E4', 'G4'], duration: '4n' }), [playSound]),
    playToggleSound,
  };
}
