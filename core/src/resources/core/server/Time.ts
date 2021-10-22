import * as alt from 'alt-server';
import { Events } from 'lib/events';

export abstract class Time {
    private static realtime = true;
    private static frozenDate = new Date();

    public static initialize(): void {
        Time.frozenDate.setHours(0, 0, 0);
        alt.onClient(Events.time.sync, (player: alt.Player, instant: boolean) => Time.broadcastTime(player, instant));
    }

    private static broadcastTime(player: alt.Player | null, instant: boolean): void {
        const date = Time.realtime ? new Date() : Time.frozenDate;
        if (player) alt.emitClient(player, Events.time.sync, date.getTime(), instant);
        else alt.emitAllClients(Events.time.sync, date.getTime(), instant);
    }

    public static setTime(date: Date, instant: boolean): void {
        Time.realtime = false;
        Time.frozenDate = date;
        Time.broadcastTime(null, instant);
    }

    public static setRealtime(instant: boolean): void {
        Time.realtime = true;
        Time.broadcastTime(null, instant);
    }

    public static getTimeMark(): string {
        const time = new Date();
        return `${time.getHours()}:${time.getMinutes()}Uhr am ${time.getDay()}.${time.getMonth()}.${time.getFullYear()}`;
    }
}
