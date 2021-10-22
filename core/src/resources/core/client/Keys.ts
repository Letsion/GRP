import * as alt from 'alt-client';
import { Events } from 'lib/events';
import { Vehicle } from './Vehicle';
import { Hud } from './Hud';
import native from 'natives';
import { Player } from './Player';

export abstract class Keys {
    private static key: keys | undefined;
    private static allKeys: keys[];
    private static esc: number | undefined;
    private static enableKeys = false;

    public static initialize(): void {
        alt.on(Events.alt.keydown, (key: number) => Keys.keydown(key));

        alt.on(Events.alt.keyup, (key: number) => Keys.keyup(key));

        alt.onServer(Events.keys.load, (keys: keys[]) => {
            Keys.load(keys);
        });

        alt.onServer(Events.keys.enableKeys, (enable: boolean) => {
            Keys.enableKeys = enable;
        });

        Hud.view.on(Events.keys.update, (keys: keys[]) => Keys.update(keys));

        Hud.view.on(Events.keys.setLayout, (keyValue: number) => Keys.setLayoutDefault(keyValue));
    }

    private static keydown(key: number): void {
        if (!Keys.key || !Keys.enableKeys) return;
        switch (key) {
            case Keys.key.keys.engineKey[0]:
                Vehicle.engine();
                break;
        }
    }

    private static keyup(key: number): void {
        if (!Keys.key || !Keys.enableKeys) return;
        switch (key) {
            case Keys.key.keys.inventoryKey[0]:
                break;
            case 120:
                if (Keys.esc) Player.toggleCursor(false);
                else Player.toggleCursor(true);
                Keys.toggleESC(undefined);
                Hud.emit(Events.settings.toggle);
                break;
            case 27:
                Keys.toggleESC(true);
                Hud.emit(Events.settings.toggle, false);
                break;
        }
    }

    private static load(keys: keys[]): void {
        Keys.allKeys = keys;
        Keys.allKeys.forEach((value) => {
            if (value.default) Keys.key = value;
        });
    }

    private static update(keys: keys[]): void {
        Keys.allKeys = keys;
        alt.emitServer(Events.keys.update, keys);
    }

    private static setLayoutDefault(keyValue: number): void {
        Keys.allKeys.forEach((v, k) => {
            if (v.default) v.default = false;
            if (keyValue === k) {
                Keys.key = v;
                v.default = true;
            }
        });
        alt.emitServer(Events.keys.update, Keys.allKeys);
    }

    private static toggleESC(enable: boolean | undefined): void {
        if (Keys.esc || (enable && Keys.esc)) {
            alt.clearEveryTick(Keys.esc);
            Player.toggleController(true);
            delete Keys.esc;
        } else {
            Player.toggleController(false);
            Keys.esc = alt.everyTick(() => {
                native.disableControlAction(0, 200, true);
                native.disableControlAction(1, 200, true);
                native.disableControlAction(0, 199, true);
                native.disableControlAction(1, 199, true);
                native.disableControlAction(2, 200, true);
                native.disableControlAction(2, 199, true);
            });
        }
    }
}
