
export interface UsageRecord {
  id: string;
  timestamp: string;
  comfortMessage?: string;
}

export interface AppState {
  remainingCards: number;
  history: UsageRecord[];
}
