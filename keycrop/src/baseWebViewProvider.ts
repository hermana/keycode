import * as vscode from 'vscode';

export type ViewEvent = 'opened' | 'closed';

/**
 * Shared setup for KeyCrop's sidebar webviews: stores the view, logs open/close
 * events, enables scripts, sets the HTML and routes incoming messages.
 */
export abstract class BaseWebViewProvider implements vscode.WebviewViewProvider {

  private view?: vscode.WebviewView;

  constructor(
    protected readonly context: vscode.ExtensionContext,
    private readonly onViewEvent?: (event: ViewEvent) => void
  ) {}

  public postMessage(message: any): void {
    this.view?.webview.postMessage(message);
  }

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void {
    this.view = webviewView;
    this.onViewEvent?.('opened');
    webviewView.onDidChangeVisibility(() => this.onViewEvent?.(webviewView.visible ? 'opened' : 'closed'));
    webviewView.onDidDispose(() => this.onViewEvent?.('closed'));

    const webview = webviewView.webview;
    webview.options = { enableScripts: true };
    webview.html = this.getHtmlContent(webview);
    webview.onDidReceiveMessage((message) => this.onMessage(message, webview));
  }

  protected abstract getHtmlContent(webview: vscode.Webview): string;

  protected abstract onMessage(message: any, webview: vscode.Webview): void;
}
