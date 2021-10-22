import * as alt from 'alt-server';
import { Events } from 'lib/events';
import { Database } from './Database';
import { ObjectId } from 'mongodb';

export abstract class Keys {
    public static initialize(): void {
        alt.onClient(Events.keys.update, async (player, keys: key) => await Keys.updateKeys(player, keys));
    }

    public static async loadKeys(player: alt.Player): Promise<void> {
        if (!player.account) return;
        if (player.account.keys) alt.emitClient(player, Events.keys.load, player.account.keys);
        else {
            const keys: keys = {
                name: 'Layout 1',
                default: false,
                keys: {
                    adminKey: [222, 'Ä', 'Adminpanel'],
                    funkKey: [18, 'Alt', 'Funken 1'],
                    funkSecondKey: [190, '.', 'Funken 2'],
                    voiceRangeKey: [89, 'Y', 'Sprachreichweite'],
                    megaphoneKey: [188, ',', 'Megafon'],
                    engineKey: [77, 'M', 'Motor an-/ausschalten'],
                    lockKey: [76, 'L', 'Fahrzeug auf-/absperren'],
                    inventoryKey: [73, 'I', 'Inventar'],
                    multiMenuKey: [88, 'X', 'Radialmenü'],
                    beltKey: [75, 'K', 'Gurt an-/ablegen'],
                    interactionKey: [69, 'E', 'Interagieren'],
                },
            };
            player.account = {
                ...player.account,
                keys: [
                    { ...keys, default: true },
                    { ...keys, name: 'Layout 2' },
                    { ...keys, name: 'Layout 3' },
                ],
            };
            await Database.account.updateOne({ _id: new ObjectId(player.account._id) }, { $set: player.account });
            alt.emitClient(player, Events.keys.load, player.account.keys);
        }
    }

    public static async updateKeys(player: alt.Player, keys: key): Promise<void> {
        if (!player.account) return;
        player.account.keys = keys;
        await Database.account.updateOne({ _id: new ObjectId(player.account._id) }, { $set: player.account });
    }
}
