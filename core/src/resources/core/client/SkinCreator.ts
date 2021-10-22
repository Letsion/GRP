import * as alt from 'alt-client';
import * as native from 'natives';
import { Hud } from './Hud';
import { Events } from 'lib/events';

export abstract class SkinCreator {
    /*private data = {
        colorOverlays: [
            {
                color1: 0,
                opacity: 0,
                color2: 0,
                id: 4,
                value: 0,
            },
            {
                color1: 0,
                id: 5,
                opacity: 0,
                value: 0,
            },
            {
                color1: 0,
                id: 8,
                opacity: 0,
                value: 0,
            },
        ],
        eyebrows: 0,
        eyes: 0,
        eyebrowsColor1: 0,
        eyebrowsOpacity: 1,
        faceMix: 0.5,
        facialHairOpacity: 0,
        faceFather: 11,
        faceMother: 45,
        facialHair: 29,
        facialHairColor1: 0,
        hair: 4,
        hairColor1: 5,
        hairColor2: 2,
        hairOverlay: {
            collection: 'multiplayer_overlays',
            overlay: 'NG_F_Hair_004',
        },
        opacityOverlays: [
            {
                id: 0,
                opacity: 0,
                value: 0,
            },
            {
                id: 3,
                opacity: 0,
                value: 0,
            },
            {
                id: 6,
                opacity: 0,
                value: 0,
            },
            {
                id: 7,
                opacity: 0,
                value: 0,
            },
            {
                id: 9,
                opacity: 0,
                value: 0,
            },
            {
                id: 11,
                opacity: 0,
                value: 0,
            },
        ],
        sex: 'Männlich',
        skinFather: 40,
        skinMix: 0.5,
        skinMother: 45,
        structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }; */

    public static initialize(): void {
        alt.onServer(Events.skinCreator.sync, (data: skin) => SkinCreator.sync(data));

        Hud.view.on('', () => {
            alt.log('w');
        });
    }

    private static sync(data: skin): void {
        native.setPedHeadBlendData(alt.Player.local, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
        native.setPedHeadBlendData(
            alt.Player.local,
            data.faceFather,
            data.faceMother,
            0,
            data.skinFather,
            data.skinMother,
            0,
            data.faceMix,
            data.skinMix,
            0,
            false
        );

        // Facial Features
        for (let i = 0; i < data.structure.length; i++) {
            const value = data.structure[i];
            native.setPedFaceFeature(alt.Player.local, i, value);
        }

        // Overlay Features - NO COLORS
        for (let i = 0; i < data.opacityOverlays.length; i++) {
            const overlay = data.opacityOverlays[i];
            native.setPedHeadOverlay(alt.Player.local, overlay.id, overlay.value, overlay.opacity);
        }

        // Hair
        const collection = native.getHashKey(data.hairOverlay.collection);
        const overlay = native.getHashKey(data.hairOverlay.overlay);
        native.addPedDecorationFromHashes(alt.Player.local, collection, overlay);
        native.setPedHairColor(alt.Player.local, data.hairColor1, data.hairColor2);

        // Facial Hair
        native.setPedHeadOverlay(alt.Player.local, 1, data.facialHair, data.facialHairOpacity);
        native.setPedHeadOverlayColor(alt.Player.local, 1, 1, data.facialHairColor1, data.facialHairColor1);

        // Eyebrows
        native.setPedHeadOverlay(alt.Player.local, 2, data.eyebrows, 1);
        native.setPedHeadOverlayColor(alt.Player.local, 2, 1, data.eyebrowsColor1, data.eyebrowsColor1);

        // Decor
        for (let i = 0; i < data.colorOverlays.length; i++) {
            const overlay = data.colorOverlays[i];
            // @ts-ignore
            const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
            native.setPedHeadOverlay(alt.Player.local, overlay.id, overlay.value, overlay.opacity);
            native.setPedHeadOverlayColor(alt.Player.local, overlay.id, 1, overlay.color1, color2);
        }

        // Eyes
        native.setPedEyeColor(alt.Player.local, data.eyes);
    }
}
