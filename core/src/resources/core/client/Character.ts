import * as alt from 'alt-client';
import { Events } from 'lib/events';
import { Mugshot } from './Mugshot';
import { Hud } from './Hud';
import { Screen } from './Screen';
import { Camera } from './Camera';
import native from 'natives';
import { Player } from './Player';
import { Game } from './Game';

export abstract class Character {
    public static initialize(): void {
        alt.onServer(Events.character.loadMenu, (characters: character[], characterCreate: boolean) => Character.loadMenu(characters, characterCreate));
        Hud.view.on(Events.character.switchCharacter, (characterIndex: number) => Character.switchCharacter(characterIndex));

        Hud.view.on(Events.character.set, (characterIndex: number) => Character.setCharacter(characterIndex));

        Hud.view.on(Events.character.create, (firstname: string, lastname: string, birth: string, sex: string) =>
            Character.addCharacter(firstname, lastname, birth, sex)
        );
    }

    public static switchCharacter(characterIndex: number): void {
        Mugshot.stop();

        Game.emitServer(Events.character.switchCharacter, characterIndex);
    }

    public static loadMenu(characters: character[], characterCreate: boolean): void {
        Hud.emit(Events.player.closeLogin);
        Screen.animfxStopAll();
        Player.toggleController(false);
        Player.freeze(false);
        Screen.fadeOut(1000);
        alt.setTimeout(() => {
            Camera.deleteAllCam();
            Player.freeze(true);
            const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
            const position: position = [-793.9384765625 + forwardVector.x * 1.5, 335.5384521484375 + forwardVector.y * 1.5, 158.5853271484375 + 0.5];
            Camera.create(position, [0, 0, 0], 90);
            Camera.pointCamToEntity(alt.Player.local);
            Camera.renderCam(true, false, 0);
        }, 1100);
        alt.setTimeout(() => {
            Screen.fadeIn(1000);
            Hud.emit(Events.character.loadMenu, characters, characterCreate);
        }, 7500);
    }

    public static setCharacter(characterIndex: number): void {
        Mugshot.stop();
        Game.emitServer(Events.character.set, characterIndex);
        const ped = native.clonePed(alt.Player.local, 0, false, true);
        native.taskGoStraightToCoord(ped, -774.09228515625, 340.4175720214844, 160.000732421875, 1, 15000, 1, 1);
        Camera.pointCamToEntity(ped as unknown as alt.Entity);
        alt.setTimeout(() => {
            Screen.fadeOut(1000);
            alt.setTimeout(() => {
                native.deletePed(ped);
                Camera.deleteAllCam();
                Camera.disableRender();
                Player.toggleController(true);
                Player.toggleCursor(false);
                Player.freeze(false);
                Screen.fadeIn(1000);
            }, 7500);
        }, 10100);
    }

    public static async addCharacter(firstname: string, lastname: string, birth: string, sex: string): Promise<void> {
        Mugshot.stop();
        Screen.fadeOut(1000);
        alt.setTimeout(() => {
            Camera.deleteAllCam();
            Camera.disableRender();
            Player.toggleController(true);
            Player.toggleCursor(false);
            Player.freeze(false);
            Screen.fadeIn(1000);
        }, 11000);
        Game.emitServer(Events.character.create, firstname, lastname, birth, sex);
    }
}
