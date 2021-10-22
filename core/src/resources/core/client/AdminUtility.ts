import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';
import { Player } from './Player';

export abstract class AdminUtility {
    private static adminBlip: boolean;
    private static adminMap = new Map();
    private static nameTag: boolean;
    private static nameTagEveryTick: number | undefined = undefined;
    private static nameTagMap = new Map();

    public static initialize(): void {
        alt.onServer(Events.adminUtility.blips, () => AdminUtility.adminBlips());

        alt.onServer(Events.adminUtility.nameTag, () => AdminUtility.nameTags());

        alt.on(Events.alt.gameEntityCreate, (entity: alt.Entity) => {
            if (AdminUtility.adminBlip) AdminUtility.createBlip(entity);
            if (AdminUtility.nameTag) AdminUtility.createText(entity);
        });

        alt.on(Events.alt.gameEntityDestroy, (entity: alt.Entity) => {
            if (AdminUtility.adminBlip) AdminUtility.destroyBlip(entity);
            if (AdminUtility.nameTag) AdminUtility.destroyText(entity);
        });
    }

    private static adminBlips(): void {
        if (AdminUtility.adminBlip) {
            AdminUtility.adminMap.forEach(native.removeBlip);
            AdminUtility.adminMap = new Map();
            AdminUtility.adminBlip = false;
            Player.toggleRadar(false);
        } else {
            AdminUtility.adminBlip = true;
            Player.toggleRadar(true);
            alt.Player.streamedIn.forEach(AdminUtility.createBlip);
            alt.Vehicle.streamedIn.forEach(AdminUtility.createBlip);
        }
    }

    private static createBlip(entity: alt.Entity): void {
        if (!entity.valid || entity === alt.Player.local) return;
        const blip = native.addBlipForEntity(entity);
        if (entity instanceof alt.Player) {
            native.setBlipSprite(blip, 1);
            native.setBlipScale(blip, 0.9);
            native.setBlipColour(blip, 4);
            native.beginTextCommandSetBlipName('STRING');
            native.addTextComponentSubstringPlayerName(entity.name);
        } else if (entity instanceof alt.Vehicle) {
            if (native.isThisModelAJetski(entity.model)) native.setBlipSprite(blip, 471);
            else if (native.isThisModelABoat(entity.model)) native.setBlipSprite(blip, 426);
            else if (native.isThisModelAHeli(entity.model)) native.setBlipSprite(blip, 64);
            else if (native.isThisModelABicycle(entity.model)) native.setBlipSprite(blip, 494);
            else if (native.isThisModelABike(entity.model)) native.setBlipSprite(blip, 226);
            else if (native.isThisModelACar(entity.model)) native.setBlipSprite(blip, 523);
            else if (native.isThisModelAQuadbike(entity.model)) native.setBlipSprite(blip, 512);
            else if (native.isThisModelAPlane(entity.model)) native.setBlipSprite(blip, 251);
            else native.setBlipSprite(blip, 523);

            native.setBlipScale(blip, 0.9);
            native.setBlipColour(blip, 4);
            native.beginTextCommandSetBlipName('STRING');
            native.addTextComponentSubstringPlayerName(`${entity.id}`);
        }
        native.endTextCommandSetBlipName(blip);
        native.setBlipAsShortRange(blip, true);
        AdminUtility.adminMap.set(entity, blip);
    }

    private static destroyBlip(entity: alt.Entity): void {
        if (entity === alt.Player.local) return;
        native.removeBlip(AdminUtility.adminMap.get(entity));
        AdminUtility.adminMap.delete(entity);
    }

    private static nameTags(): void {
        if (AdminUtility.nameTag) {
            if (AdminUtility.nameTagEveryTick) alt.clearEveryTick(AdminUtility.nameTagEveryTick);
            AdminUtility.nameTagEveryTick = undefined;
            AdminUtility.nameTagMap = new Map();
            AdminUtility.nameTag = false;
        } else {
            AdminUtility.nameTag = true;
            alt.Player.streamedIn.forEach(AdminUtility.createText);
            AdminUtility.nameTagEveryTick = alt.everyTick(() => {
                AdminUtility.nameTagMap.forEach((_k, i) => {
                    AdminUtility.drawText3D(
                        `${i.getSyncedMeta('Username')} \n ID: ${i.id} \n ${i.getSyncedMeta('Name')}`,
                        i.pos.x,
                        i.pos.y,
                        i.pos.z + 1.1,
                        0.29,
                        4,
                        255,
                        255,
                        255,
                        255,
                        true,
                        true
                    );
                });
            });
        }
    }

    public static drawText3D(
        msg: string,
        x: number,
        y: number,
        z: number,
        scale: number,
        fontType: number,
        r: number,
        g: number,
        b: number,
        a: number,
        useOutline: boolean,
        useDropShadow: boolean
    ): void {
        native.setDrawOrigin(x, y, z, 0);
        native.beginTextCommandDisplayText('STRING');
        native.addTextComponentSubstringPlayerName(msg);
        native.setTextFont(fontType);
        native.setTextScale(1, scale);
        native.setTextWrap(0.0, 1.0);
        native.setTextCentre(true);
        native.setTextColour(r, g, b, a);

        if (useOutline) {
            native.setTextOutline();
        }

        if (useDropShadow) {
            native.setTextDropShadow();
        }

        native.endTextCommandDisplayText(0, 0, 0);
        native.clearDrawOrigin();
    }

    private static createText(entity: alt.Entity): void {
        if (entity === alt.Player.local || !entity.valid || entity instanceof alt.Vehicle) return;
        AdminUtility.drawText3D(
            `${entity.getSyncedMeta('Username')} \n ID: ${entity.id} \n ${entity.getSyncedMeta('Name')}`,
            entity.pos.x,
            entity.pos.y,
            entity.pos.z + 1.1,
            0.29,
            4,
            255,
            255,
            255,
            255,
            true,
            true
        );
        AdminUtility.nameTagMap.set(entity, true);
    }

    private static destroyText(entity: alt.Entity): void {
        if (entity === alt.Player.local || !entity.valid || entity instanceof alt.Vehicle) return;
        AdminUtility.nameTagMap.delete(entity);
    }
}
