import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';

export abstract class Time {
    private static target: Date;
    private static now: Date;
    private static animationIntervall: number | null = null;
    private static animationSpeed = 100000;

    public static initialize(): void {
        Time.target = new Date();
        Time.now = Time.target;
        +alt.onServer(Events.time.sync, (date: number, instant: boolean) => Time.setDate(new Date(date), instant));
        alt.emitServer(Events.time.sync, true);
    }

    private static setDate(date: Date, instant: boolean): void {
        Time.target = date;
        if (instant) {
            Time.now = date;
            Time.setDateNow();
        } else if (Time.animationIntervall === null) Time.runDateAnimation();
    }

    private static runDateAnimation(): void {
        Time.animationIntervall = alt.setInterval(() => {
            const distance = Time.target.getTime() - Time.now.getTime();
            if (distance == 0 && Time.animationIntervall !== null) {
                alt.clearInterval(Time.animationIntervall);
                Time.animationIntervall = null;
            } else {
                const step = Math.abs(distance) < Time.animationSpeed ? distance : distance > 0 ? Time.animationSpeed : -Time.animationSpeed;
                Time.now = new Date(Time.now.getTime() + step);
                Time.setDateNow();
            }
        }, 10);
    }

    private static setDateNow(): void {
        native.setClockDate(Time.now.getDate(), Time.now.getMonth(), Time.now.getFullYear());
        native.setClockTime(Time.now.getHours(), Time.now.getMinutes(), Time.now.getSeconds());
    }
}
