import { MongoClient } from 'mongodb';
import type { Db, Collection } from 'mongodb';
import orm from 'typeorm';
import SQL from 'sql';

const wcf1_user: orm.EntitySchema = new orm.EntitySchema({
    name: 'wcf1_user',
    columns: {
        userID: {
            primary: true,
            type: 'int',
            generated: true,
        },
        username: {
            type: 'varchar',
            length: 100,
            default: '',
        },
        email: {
            type: 'varchar',
            length: 191,
            default: '',
        },
        password: {
            type: 'varchar',
            length: 100,
            default: null,
        },
        accessToken: {
            type: 'char',
            length: 40,
            default: '',
        },
        languageID: {
            type: 'int',

            default: 0,
        },
        registrationDate: {
            type: 'int',

            default: 0,
        },
        styleID: {
            type: 'int',

            default: 0,
        },
        banned: {
            type: 'tinyint',
            default: null,
        },
        banReason: {
            type: 'mediumtext',
            default: null,
        },
        banExpires: {
            type: 'int',
            default: 0,
        },
        activationCode: {
            type: 'int',

            default: 0,
        },
        lastLostPasswordRequestTime: {
            type: 'int',

            default: 0,
        },
        lostPasswordKey: {
            type: 'char',
            length: 40,
            default: null,
        },
        lastUsernameChange: {
            type: 'int',

            default: 0,
        },
        newEmail: {
            type: 'varchar',
            length: 255,
            default: '',
        },
        oldUsername: {
            type: 'varchar',
            length: 255,
            default: '',
        },
        quitStarted: {
            type: 'varchar',

            default: 0,
        },
        reactivationCode: {
            type: 'int',

            default: 0,
        },
        registrationIpAddress: {
            type: 'varchar',
            length: 39,
            default: '',
        },
        avatarID: {
            type: 'int',

            default: null,
        },
        disableAvatar: {
            type: 'tinyint',
            default: 0,
        },
        disableAvatarReason: {
            type: 'text',
            default: null,
        },
        disableAvatarExpires: {
            type: 'int',

            default: 0,
        },
        enableGravatar: {
            type: 'tinyint',

            default: 0,
        },
        gravatarFileExtension: {
            type: 'varchar',
            length: 3,
            default: '',
        },
        signature: {
            type: 'text',
            default: null,
        },
        signatureEnableHtml: {
            type: 'tinyint',

            default: 0,
        },
        disableSignature: { type: 'tinyint', default: 0 },
        disableSignatureReason: { type: 'text', default: null },
        disableSignatureExpires: { type: 'int', default: 0 },
        lastActivityTime: { type: 'int', default: 0 },
        profileHits: { type: 'int', default: 0 },
        rankID: { type: 'int', default: null },
        userTitle: { type: 'varchar', length: 255, default: '' },
        userOnlineGroupID: { type: 'int', default: null },
        activityPoints: { type: 'int', default: 0 },
        notificationMailToken: { type: 'varchar', length: 20, default: 'null' },
        authData: { type: 'varchar', length: 191, default: '' },
        likesReceived: { type: 'mediumint', default: 0 },
        trophyPoints: { type: 'int', default: 0 },
        coverPhotoHash: { type: 'char', length: 40, default: null },
        coverPhotoExtension: { type: 'varchar', length: 4, default: '' },
        disableCoverPhoto: { type: 'varchar', length: 50, default: null },
        disableCoverPhotoReason: { type: 'text', default: null },
        disableCoverPhotoExpires: { type: 'int', default: 0 },
        articles: { type: 'int', default: 0 },
        blacklistMatches: { type: 'varchar', length: 255, default: '' },
        wbbPosts: { type: 'int', default: 0 },
        twitchPartnerName: { type: 'varchar', length: 50, default: null },
        twitchPartnerSince: { type: 'int', default: null },
        twitchPartnerLastStream: { type: 'int', default: null },
        twitchPartnerIsLive: { type: 'int', default: 0 },
        discordID: { type: 'bigint', default: null },
        discordOauth2Token: { type: 'varchar', length: 50, default: null },
        discordOauth2RefreshToken: { type: 'varchar', length: 50, default: null },
        discordOauth2Expire: { type: 'int', default: null },
        discordAvatar: { type: 'varchar', length: 50, default: null },
        usedDiscordAvatar: { type: 'varchar', length: 50, default: null },
    },
});

export abstract class Database {
    private static client: MongoClient = new MongoClient('mongodb://localhost:27017');
    private static db: Db;
    public static MySQL: { fetchDataAsync: (arg0: string, arg1: string, arg2: string) => Promise<{ username: string; email: string; oldUsername: string }> };
    public static account: Collection;
    public static character: Collection;
    public static ticket: Collection;

    public static async initialize(): Promise<void> {
        await Database.client.connect();
        Database.db = Database.client.db('goldenRoleplay');
        Database.account = Database.db.collection('account');
        Database.character = Database.db.collection('character');
        Database.ticket = Database.db.collection('ticket');

        // @ts-ignore
        Database.MySQL = new SQL('mysql', '127.0.0.1', 3306, 'forum', 'wGdD(TfUUdfVLlo6', 'forum', [wcf1_user]);
    }
}

/* Beispiel
await Database.account.findOne({ name: 'Nico' });
await Database.account.find({ name: 'Polle' }).toArray();
await Database.account.updateOne({ name: 'Polle' }, { $set: { name: 'Nico' } });
await Database.account.updateOne({ name: 'Polle' }, { $unset: { name: '' } });
await Database.account.insertOne({ name: 'Polle', birth: '21-11-1999' });
await Database.account.insertMany([
    { name: 'Nico', birth: '...' },
    { name: 'Polle', birth: '...' },
]);
//Verweise auf andere Documents
await Database.account.insertOne({ name: Polle, brother: new ObjectId(0) });
 */
