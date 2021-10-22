import * as alt from 'alt-server';
import { Player } from './Player';
import { Time } from './Time';
import { Weather } from './Weather';
import { Database } from './Database';
import { Discord } from './Discord';
import { Console } from './Console';
import { Character } from './Character';
import { Vehicle } from './Vehicle';
import { SkinCreator } from './SkinCreator';
import { Keys } from './Keys';
import { Security } from './Security';
import { Noclip } from './Noclip';
import { ObjectId } from 'mongodb';

export abstract class Game {
    public static start(): void {
        Player.initialize();
        Time.initialize();
        Weather.initialize();
        Database.initialize().then();
        Discord.initialize().then();
        Console.initialize();
        Character.initialize();
        Vehicle.initialize();
        SkinCreator.initialize();
        Keys.initialize();
        Game.interval();
        Security.initialize();
        Noclip.initialize();
    }

    private static interval(): void {
        alt.setInterval(() => {
            if (alt.Player.all.length === 0) return;
            alt.Player.all.forEach((player) => {
                if (!player.valid || !player.antiCheat) return;
                player.antiCheat.events = 0;
            });
        }, 1000); // 1 sek.

        alt.setInterval(() => {
            if (alt.Player.all.length === 0) return;
            alt.Player.all.forEach((player) => {
                if (!player.valid || !player.account || !player.character || !player.character.joined) return;
                player.character.pos = player.pos;
                player.character.dimension = player.dimension;
                Database.account.updateOne({ _id: new ObjectId(player.account._id) }, { $set: player.account }).then();
                Database.character.updateOne({ _id: new ObjectId(player.character._id) }, { $set: player.character }).then();
            });
        }, 600000); // 10min.
    }
}
