/**
 * Global window extensions for Frame Zero easter eggs.
 * `frameZero` is the console-discoverable API exposed by ConsoleEgg.
 */
export {};

declare global {
  interface FrameZeroApi {
    help: () => void;
    stats: () => void;
    konami: () => void;
    about: () => void;
    theme: (t: 'director' | 'noir') => void;
  }
  interface Window {
    frameZero?: FrameZeroApi;
  }
}
