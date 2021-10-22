import * as alt from 'alt-client';

export abstract class Hud {
    public static view: alt.WebView;

    public static initialize(): void {
        // TODO: activated when needed
        Hud.view = new alt.WebView('http://resource/html/index.html');
        Hud.view.focus();
    }

    public static emit(eventName: string, ...args: unknown[]): void {
        Hud.view.emit(eventName, ...args);
    }

    public static visible(enable: boolean): void {
        if (Hud.view.isVisible === enable) return;
        Hud.view.isVisible = !Hud.view.isVisible;
    }
}
