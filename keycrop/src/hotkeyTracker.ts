import * as fs from 'fs';
import { KEY_MAP } from './keyMap';

export type HotkeyEntry = { hotkey: string; species: string; timestamp: string; file: string };

/**
 * Records every hotkey press to hotkeys.json and keeps lifetime use counts per command.
 * Counts are rebuilt from the log on startup, so they survive restarts and new plants
 * never reset them.
 */
export class HotkeyTracker {
  private log: HotkeyEntry[] = [];
  private useCounts: Record<string, number> = {};

  constructor(private readonly filePath: string) {
    if (fs.existsSync(filePath)) {
      try { this.log = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { this.log = []; }
    }
    this.useCounts = HotkeyTracker.countUses(this.log);
  }

  /** Lifetime uses keyed by KEY_MAP command. */
  get counts(): Readonly<Record<string, number>> { return this.useCounts; }

  record(command: string, species: string, file: string): void {
    const keyEntry = KEY_MAP.find(k => k.command === command);
    this.log.push({
      hotkey: keyEntry?.capital_key ?? command,
      species,
      timestamp: new Date().toISOString(),
      file
    });
    fs.writeFileSync(this.filePath, JSON.stringify(this.log, null, 2));
    this.useCounts[command] = (this.useCounts[command] ?? 0) + 1;
  }

  private static countUses(log: HotkeyEntry[]): Record<string, number> {
    // The log stores the displayed key combo (capital_key); map it back to the command
    const commandByHotkey = new Map(KEY_MAP.map(k => [k.capital_key, k.command]));
    const counts: Record<string, number> = {};
    for (const entry of log) {
      const command = commandByHotkey.get(entry.hotkey) ?? entry.hotkey;
      counts[command] = (counts[command] ?? 0) + 1;
    }
    return counts;
  }
}
