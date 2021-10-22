import * as alt from 'alt-client';
import { Events } from 'lib/events';
import { Hud } from './Hud';

export abstract class Notification {
    public static initialize(): void {
        alt.onServer(Events.notification, (notification) => Hud.emit(Events.notification, notification));
    }

    public static simple(message: string, colorHex: string, duration: number): void {
        Hud.emit(Events.notification, {
            type: 'Simple',
            msg: message,
            color: colorHex,
            time: duration,
        });
    }

    public static extended(title: string, message: string, colorHex: string, duration: number): void {
        Hud.emit(Events.notification, {
            type: 'Extended',
            title: title,
            msg: message,
            color: colorHex,
            time: duration,
        });
    }

    public static timer(title: string, message: string, colorHex: string, duration: number): void {
        Hud.emit(Events.notification, {
            type: 'Timer',
            title: title,
            msg: message,
            color: colorHex,
            time: duration,
        });
    }
}
