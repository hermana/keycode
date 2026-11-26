import * as fs from 'fs';
import type { ViewEvent } from './baseWebViewProvider';

type ActivityEntry = { view: string; event: ViewEvent; timestamp: string };

/** Records when each KeyCrop view (and VS Code itself) is opened or closed, to plugin_data.json. */
export class ActivityLog {
  private entries: ActivityEntry[] = [];

  constructor(private readonly filePath: string) {
    if (fs.existsSync(filePath)) {
      try { this.entries = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { this.entries = []; }
    }
  }

  record(view: string, event: ViewEvent): void {
    this.entries.push({ view, event, timestamp: new Date().toISOString() });
    fs.writeFileSync(this.filePath, JSON.stringify(this.entries, null, 2));
  }
}
