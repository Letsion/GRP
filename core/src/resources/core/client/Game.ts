import * as alt from 'alt-client';
import { Ipl } from './Ipl';
import { Player } from './Player';
import { Screen } from './Screen';
import { Camera } from './Camera';
import { Hud } from './Hud';
import { Console } from './Console';
import { Time } from './Time';
import { Vehicle } from './Vehicle';
import { Weather } from './Weather';
import { Mugshot } from './Mugshot';
import { Character } from './Character';
import { Keys } from './Keys';
import { Notification } from './Notification';
import { SkinCreator } from './SkinCreator';
import { AdminUtility } from './AdminUtility';

export abstract class Game {
    public static start(): void {
        Ipl.remove.forEach((ipl) => alt.removeIpl(ipl));
        Ipl.request.forEach((ipl) => alt.requestIpl(ipl));
        Hud.initialize();
        Player.initialize();
        Screen.initialize();
        Camera.initialize();
        Console.initialize();
        Time.initialize();
        Vehicle.initialize();
        Weather.initialize();
        Mugshot.initialize();
        Character.initialize();
        Keys.initialize();
        Notification.initialize();
        SkinCreator.initialize();
        AdminUtility.initialize();
    }

    public static emitServer(eventName: string, ...args: unknown[]): void {
        alt.emitServer(eventName, ...args);
    }
}
