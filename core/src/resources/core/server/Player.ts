import * as alt from 'alt-server';
import type { Document } from 'mongodb';
import { Spawn } from './Spawn';
import { Dimension } from './Dimension';
import { Model } from './Model';
import { Events } from 'lib/events';
import { Notification } from './Notification';
import { Database } from './Database';
import { Discord } from './Discord';
import { Character } from './Character';
import { ObjectId } from 'mongodb';
import { Keys } from './Keys';
import { MSG } from 'lib/Notification';
import { stringf } from './Uitlity';
import { CauseOfDeath } from './DeadCauses';

export abstract class Player {
    public static initialize(): void {
        alt.on(Events.alt.playerConnect, Player.playerConnect);

        alt.on(Events.alt.playerDisconnect, (player: alt.Player) => Player.playerDisconnect(player));

        alt.on(Events.alt.anyResourceStop, () => {
            alt.Player.all.forEach((player) => Player.playerDisconnect(player));
        });

        alt.on(Events.alt.playerDeath, (player: alt.Player, killer: alt.Entity, weaponHash: number) => Player.playerDeath(player, killer, weaponHash));

        alt.on(Events.alt.playerDamage, Player.playerDamage);

        alt.on(Events.alt.weaponDamage, Player.weaponDamage);

        alt.onClient(Events.player.login, async (player: alt.Player, username: string, passwordHash: string) => Player.login(player, username, passwordHash));

        alt.onClient(Events.player.register, (player: alt.Player, supportNumber: number, passwordHash: string) =>
            Player.register(player, supportNumber, passwordHash)
        );
    }

    private static playerConnect(player: alt.Player): void {
        player.pos = new alt.Vector3(...Spawn.duck);
        player.dimension = Dimension.register();
        player.model = Model.male;
        player.visible = false;
        player.clearBloodDamage();
    }

    private static async playerDisconnect(player: alt.Player): Promise<void> {
        const pos = player.pos;
        const dimension = player.dimension;
        if (player.antiCheat) delete player.antiCheat;
        if (player.account) {
            player.account.guid = -1;
            Discord.log(MSG.login.title, stringf(MSG.login.discord.logout, player.account.username), MSG.login.color);
            await Database.account.updateOne({ _id: new ObjectId(player.account._id) }, { $set: player.account });
            delete player.account;
        }
        if (player.character) {
            player.character.pos = pos;
            player.character.dimension = dimension;
            player.character.joined = false;
            await Database.character.updateOne({ _id: new ObjectId(player.character._id) }, { $set: player.character });
            delete player.character;
        }
    }

    public static weaponDamage(
        _player: alt.Player,
        _target: alt.Entity,
        weaponHash: number,
        damage: number,
        offset: alt.Vector3,
        bodyPart: alt.BodyPart
    ): void {
        //if (player == target) return;
        // @ts-ignore
        alt.log(`Damage: ${damage}, Weapon: ${CauseOfDeath[weaponHash]}, Offset: ${offset}, BodyPart: ${alt.BodyPart[bodyPart]}`);
    }

    public static playerDamage(player: alt.Player, attacker: alt.Entity, damage: number, weaponHash: number): void {
        // @ts-ignore
        alt.log(`Damage: ${damage}, Weapon: ${CauseOfDeath[weaponHash]}`);

        if (player === attacker) {
        }
    }

    public static playerDeath(_player: alt.Player, _killer: alt.Entity, weaponHash: number): void {
        // @ts-ignore
        alt.log(`${CauseOfDeath[weaponHash]}`);
    }

    public static revive(player: alt.Player): void {
        player.spawn(player.pos, 0);
        player.clearBloodDamage();
    }

    private static async login(player: alt.Player, username: string, passwordHash: string): Promise<void> {
        const account: Document | undefined = await Database.account.findOne({ username: username });
        if (account) {
            if (account.ban) return Notification.extended(player, MSG.login.title, stringf(MSG.system.banned, 'GRUND'), MSG.login.color, 10000);
            if (!account.whitelist) return Notification.extended(player, MSG.login.title, MSG.system.notWhitelisted, MSG.login.color, 10000);
            if (!account.password) {
                player.account = account as account;
                player.setSyncedMeta('Username', player.account.username);
                return alt.emitClient(player, Events.player.register);
            }
            if (passwordHash === account.password) {
                player.account = { ...(account as account), guid: player.id, totalLogins: (account.totalLogins += 1) };
                player.adminMode = false;
                Discord.log(MSG.login.title, stringf(MSG.login.discord.login, username, player.id.toString()), MSG.login.color);
                Notification.extended(player, MSG.login.title, MSG.login.login, MSG.login.color, 10000);
                Character.loadMenu(player).then();
                Keys.loadKeys(player).then();
            } else Notification.extended(player, MSG.login.title, MSG.login.wrongPassword, MSG.login.color, 10000);
        } else {
            const res = await Database.MySQL.fetchDataAsync('username', username, 'wcf1_user');
            if (res) {
                const account: Document | undefined = await Database.account.findOne({ username: res.oldUsername });
                const accountTwo: Document | undefined = await Database.account.findOne({ username: res.username });
                if (!account && !accountTwo) {
                    const newUser = {
                        username: username,
                        email: res.email,
                        adminLevel: 0,
                        adminLevel2: 0,
                        ban: false,
                        password: '',
                        totalLogins: 1,
                        ip: [player.ip],
                        whitelist: false,
                        supportNumber: Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000,
                        hwID: { hwIDHash: [player.hwidHash], hwIDExHash: [player.hwidExHash] },
                        socialID: [player.socialID],
                        guid: player.id,
                        characters: [],
                        newCharacter: true,
                    };
                    await Database.account.insertOne(newUser);
                    Notification.extended(player, MSG.login.title, MSG.system.notWhitelisted, MSG.login.color, 10000);
                } else Notification.extended(player, MSG.login.title, MSG.system.noAccount, MSG.login.color, 10000);
            } else Notification.extended(player, MSG.login.title, MSG.system.noAccount, MSG.login.color, 10000);
        }
    }

    private static async register(player: alt.Player, supportNumber: number, passwordHash: string): Promise<void> {
        if (!player.account) return;
        if (player.account.supportNumber === supportNumber) {
            const update = {
                password: passwordHash,
                hwID: { hwIDHash: [player.hwidHash], hwIDExHash: [player.hwidExHash] },
                socialID: [player.socialID],
            };
            player.account = { ...player.account, ...update };
            await Database.account.updateOne({ username: player.account.username }, { $set: update });
            Character.loadMenu(player).then();
            Keys.loadKeys(player).then();
            Notification.extended(player, 'Register System', 'Du hast dich erfolgreich registrierst!', MSG.login.color, 10000);
        } else Notification.extended(player, 'Register System', stringf(MSG.system.wrongSupportNumber, String(supportNumber)), MSG.login.color, 10000);
    }
}
