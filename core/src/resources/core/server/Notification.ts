import alt from 'alt-server';
import { Events } from 'lib/events';

export abstract class Notification {
    public static simple(player: alt.Player | null, message: string, colorHex: string, duration: number): void {
        if (player)
            alt.emitClient(player, Events.notification, {
                type: 'Simple',
                msg: message,
                color: colorHex,
                time: duration,
            });
        else
            alt.emitAllClients(Events.notification, {
                type: 'Simple',
                msg: message,
                color: colorHex,
                time: duration,
            });
    }

    public static extended(player: alt.Player | null, title: string, message: string, colorHex: string, duration: number): void {
        if (player)
            alt.emitClient(player, Events.notification, {
                type: 'Extended',
                title: title,
                msg: message,
                color: colorHex,
                time: duration,
            });
        else
            alt.emitAllClients(Events.notification, {
                type: 'Extended',
                title: title,
                msg: message,
                color: colorHex,
                time: duration,
            });
    }

    public static timer(player: alt.Player | null, title: string, message: string, colorHex: string, duration: number): void {
        if (player)
            alt.emitClient(player, Events.notification, {
                type: 'Timer',
                title: title,
                msg: message,
                color: colorHex,
                time: duration,
            });
        else
            alt.emitAllClients(Events.notification, {
                type: 'Timer',
                title: title,
                msg: message,
                color: colorHex,
                time: duration,
            });
    }
}
