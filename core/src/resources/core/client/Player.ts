import * as alt from 'alt-client';
import * as native from 'natives';
import { Hud } from './Hud';
import { Events } from 'lib/events';
import { sha256 } from './Hash';
import { NoClip } from './Noclip';

export abstract class Player {
    private static frozen = false;
    private static cursorActive = false;

    public static initialize(): void {
        Player.freeze(true);
        Player.toggleController(false);
        Player.toggleRadar(false);
        Player.toggleCursor(true);

        native.setAudioFlag('DisableFlightMusic', true);

        alt.setInterval(() => {
            native.resetPlayerStamina(alt.Player.local);
            native.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 241, true);
            native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
            native.invalidateIdleCam();
            native.invalidateVehicleIdleCam();
        }, 10000);

        Hud.view.on(Events.alt.load, () => {
            Hud.view.on(Events.player.login, (username, login) => Player.login(username, login));
            Hud.view.on(Events.player.register, (supportNumber, login) => Player.register(supportNumber, login));
        });

        alt.onServer(Events.player.register, () => Hud.view.emit(Events.player.register));

        alt.onServer(Events.player.noclip, () => Player.noclip());
    }

    public static freeze(freeze: boolean): void {
        if (Player.frozen === freeze) return;
        Player.frozen = freeze;
        native.freezeEntityPosition(alt.Player.local, freeze);
    }

    public static toggleController(enable: boolean): void {
        if (alt.gameControlsEnabled() === enable) return;
        alt.toggleGameControls(enable);
    }

    public static toggleCursor(enable: boolean): void {
        if (Player.cursorActive === enable) return;
        Player.cursorActive = enable;
        alt.showCursor(enable);
    }

    public static toggleRadar(enable: boolean): void {
        if (native.isRadarHidden() !== enable) return;
        native.displayRadar(enable);
    }

    private static login(username: string, password: string): void {
        const passwordHash = sha256(password);
        alt.emitServer(Events.player.login, username, passwordHash);
    }

    private static register(supportNumber: string, password: string): void {
        const passwordHash = sha256(password);
        alt.emitServer(Events.player.register, parseInt(supportNumber), passwordHash);
    }

    private static noclip(): void {
        if (NoClip.enabled) NoClip.stop();
        else NoClip.start();
    }
}
