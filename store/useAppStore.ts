import { create } from 'zustand';
import type { ScamAnalysis, ThreadMessage } from '../types';

interface AppState {
  /** Analysis currently shown on the Result/Trajectory/Thread screens */
  currentAnalysis: ScamAnalysis | null;
  /** Past analyses, newest first (in-memory for now) */
  history: ScamAnalysis[];
  isAnalyzing: boolean;
  analysisError: string | null;

  /** Follow-up chat about currentAnalysis */
  threadMessages: ThreadMessage[];
  isThreadBusy: boolean;

  startAnalysis: () => void;
  completeAnalysis: (analysis: ScamAnalysis) => void;
  failAnalysis: (message: string) => void;
  clearError: () => void;
  selectAnalysis: (analysis: ScamAnalysis) => void;
  clearHistory: () => void;

  addThreadMessage: (message: ThreadMessage) => void;
  setThreadBusy: (busy: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentAnalysis: null,
  history: [],
  isAnalyzing: false,
  analysisError: null,

  threadMessages: [],
  isThreadBusy: false,

  startAnalysis: () => set({ isAnalyzing: true, analysisError: null }),

  completeAnalysis: (analysis) =>
    set((state) => ({
      isAnalyzing: false,
      currentAnalysis: analysis,
      history: [analysis, ...state.history].slice(0, 50),
      threadMessages: [],
    })),

  failAnalysis: (message) => set({ isAnalyzing: false, analysisError: message }),

  clearError: () => set({ analysisError: null }),

  selectAnalysis: (analysis) =>
    set({ currentAnalysis: analysis, threadMessages: [] }),

  clearHistory: () => set({ history: [] }),

  addThreadMessage: (message) =>
    set((state) => ({ threadMessages: [...state.threadMessages, message] })),

  setThreadBusy: (busy) => set({ isThreadBusy: busy }),
}));
