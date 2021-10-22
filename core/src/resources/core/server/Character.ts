import * as alt from 'alt-server';
import { Events } from 'lib/events';
import { Clothes } from './Clothes';
import { Database } from './Database';
import { ObjectId } from 'mongodb';
import { Spawn } from './Spawn';
import { Dimension } from './Dimension';
import { Discord } from './Discord';
import { Notification } from './Notification';
import { MSG } from 'lib/Notification';
import { stringf } from './Uitlity';

export abstract class Character {
    public static initialize(): void {
        alt.onClient(Events.character.switchCharacter, (player: alt.Player, characterIndex: number) => Character.switchCharacter(player, characterIndex));

        alt.onClient(Events.character.set, (player: alt.Player, characterIndex: number) => Character.setCharacter(player, characterIndex));

        alt.onClient(Events.character.create, (player: alt.Player, firstname: string, lastname: string, birth: string, sex: string) =>
            Character.addCharacter(player, firstname, lastname, birth, sex)
        );
    }

    public static async loadMenu(player: alt.Player): Promise<void> {
        if (!player.account) return;
        player.spawn(new alt.Vector3(-793.9384765625, 335.5384521484375, 158.5853271484375), 0);
        player.characters = (await Database.character.find({ username: player.account.username }).toArray()) as character[];
        if (player.characters.length !== 0) {
            player.model = player.characters[0].sex === 'Weiblich' ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
            alt.setTimeout(() => {
                if (!player.characters) return;
                player.visible = true;
                player.characters[0].clothes.forEach((value, index) => {
                    if (!value) return;
                    Clothes.set(player, index, value.drawable, value.texture, value.palette);
                });
                alt.emitClient(
                    player,
                    Events.mugshot.start,
                    'Charakter',
                    `${player.characters[0].birthday}`,
                    `${player.characters[0].firstname} ${player.characters[0].lastname}`,
                    `${player.characters[0].sex}`,
                    1
                );
            }, 1500);
        }
        alt.emitClient(player, Events.character.loadMenu, player.characters, player.account.newCharacter);
    }

    private static switchCharacter(player: alt.Player, characterIndex: number): void {
        if (!player.characters) return;
        const character = player.characters[characterIndex];
        if (!character) return;
        player.model = character.sex === 'Weiblich' ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
        character.clothes.forEach((value, index) => {
            if (!value) return;
            Clothes.set(player, index, value.drawable, value.texture, value.palette);
        });
        alt.emitClient(
            player,
            Events.mugshot.start,
            'Charakter',
            `${character.birthday}`,
            `${character.firstname} ${character.lastname}`,
            `${character.sex}`,
            characterIndex + 1
        );
    }

    private static setCharacter(player: alt.Player, characterIndex: number): void {
        if (!player.characters) return;
        player.character = player.characters[characterIndex];
        delete player.characters;
        player.setSyncedMeta('Name', `${player.character.firstname} ${player.character.lastname}`);
        Notification.extended(
            player,
            MSG.character.title,
            stringf(MSG.character.setCharacter, player.character.firstname, player.character.lastname),
            MSG.character.color,
            10000
        );
        Discord.log(
            MSG.character.title,
            stringf(MSG.character.discord.setCharacter, player.character.firstname, player.character.lastname),
            MSG.character.color
        );
        player.visible = false;
        alt.setTimeout(() => {
            if (!player.character) return;
            player.pos = player.character.pos;
            player.character.joined = true;
            player.model = player.character.sex === 'Weiblich' ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
            alt.emitClient(player, Events.keys.enableKeys, true);
            player.character.clothes.forEach((value, index) => {
                if (!value) return;
                Clothes.set(player, index, value.drawable, value.texture, value.palette);
            });
            player.visible = true;
            Dimension.unregister(player.dimension);
            player.dimension = 0;
        }, 17600);
    }

    private static async addCharacter(player: alt.Player, firstname: string, lastname: string, birth: string, sex: string): Promise<void> {
        if (!player.account || !player.account.newCharacter) return;
        const newCharacter = {
            username: player.account.username,
            firstname: firstname,
            lastname: lastname,
            birthday: birth,
            sex: sex,
            pos: new alt.Vector3(0, 0, 0),
            joined: true,
            dimension: player.dimension,
            clothes: [
                undefined,
                { drawable: 0, texture: 0, palette: undefined },
                undefined,
                { drawable: 0, texture: 0, palette: undefined },
                { drawable: 1, texture: 0, palette: undefined },
                undefined,
                { drawable: 1, texture: 0, palette: undefined },
                { drawable: 0, texture: 0, palette: undefined },
                { drawable: 15, texture: 0, palette: undefined },
                undefined,
                undefined,
                { drawable: 0, texture: 0, palette: undefined },
            ],
        };

        const result = await Database.character.insertOne(newCharacter);
        player.character = { ...(newCharacter as character), _id: result.insertedId.toHexString() };
        player.setSyncedMeta('Name', `${player.character.firstname} ${player.character.lastname}`);
        Discord.log(
            MSG.character.title,
            stringf(MSG.character.discord.newCharacter, player.account.username, player.character.firstname, player.character.lastname),
            MSG.character.color
        );
        Notification.extended(
            player,
            MSG.character.title,
            stringf(MSG.character.newCharacter, player.character.firstname, player.character.lastname),
            MSG.character.color,
            10000
        );

        player.account.newCharacter = false;
        player.account.characters.push(new ObjectId(player.character._id));
        await Database.account.updateOne({ _id: new ObjectId(player.account._id) }, { $set: player.account });

        alt.setTimeout(() => {
            if (!player.character) return;
            player.pos = new alt.Vector3(Spawn.airport);
            Dimension.unregister(player.dimension);
            player.dimension = 0;
            player.visible = true;
            player.model = player.character.sex === 'Weiblich' ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
            player.character.clothes.forEach((value, index) => {
                if (!value) return;
                Clothes.set(player, index, value.drawable, value.texture, value.palette);
            });
        }, 1100);
    }
}
