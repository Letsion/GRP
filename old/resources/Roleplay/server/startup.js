import * as alt from "alt-server";
import * as sm from "simplymongo";
import SQL from "./database/database.js";
import chalk from "chalk";
import orm from "typeorm";
import fs from "fs";
import path from "path";
import pkg from './password/passwords.json';
const {mongodb, mysql} = pkg;


//Prototype Important
alt.Player.prototype.emit = function(...args) {
  alt.emitClient(this, ...args);
}

const wcf1_user = new orm.EntitySchema({
      name: "wcf1_user",
      columns: {
        userID: {
          primary: true,
          type: "int",
          generated: true,
        },
        username: {
          type: "varchar",
          length: 100,
          default: "",
        },
        email: {
          type: "varchar",
          length: 191,
          default: "",
        },
        password: {
          type: "varchar",
          length: 100,
          default: null,
        },
        accessToken: {
          type: "char",
          length: 40,
          default: "",
        },
        languageID: {
          type: "int",

          default: 0,
        },
        registrationDate: {
          type: "int",

          default: 0,
        },
        styleID: {
          type: "int",

          default: 0,
        },
        banned: {
          type: "tinyint",
          default: null,
        },
        banReason: {
          type: "mediumtext",
          default: null,
        },
        banExpires: {
          type: "int",
          default: 0,
        },
        activationCode: {
          type: "int",

          default: 0,
        },
        lastLostPasswordRequestTime: {
          type: "int",

          default: 0,
        },
        lostPasswordKey: {
          type: "char",
          length: 40,
          default: null,
        },
        lastUsernameChange: {
          type: "int",

          default: 0,
        },
        newEmail: {
          type: "varchar",
          length: 255,
          default: "",
        },
        oldUsername: {
          type: "varchar",
          length: 255,
          default: "",
        },
        quitStarted: {
          type: "varchar",

          default: 0,
        },
        reactivationCode: {
          type: "int",

          default: 0,
        },
        registrationIpAddress: {
          type: "varchar",
          length: 39,
          default: "",
        },
        avatarID: {
          type: "int",

          default: null,
        },
        disableAvatar: {
          type: "tinyint",
          default: 0,
        },
        disableAvatarReason: {
          type: "text",
          default: null,
        },
        disableAvatarExpires: {
          type: "int",

          default: 0,
        },
        enableGravatar: {
          type: "tinyint",

          default: 0,
        },
        gravatarFileExtension: {
          type: "varchar",
          length: 3,
          default: "",
        },
        signature: {
          type: "text",
          default: null,
        },
        signatureEnableHtml: {
          type: "tinyint",

          default: 0,
        },
        disableSignature: { type: "tinyint", default: 0 },
        disableSignatureReason: { type: "text", default: null },
        disableSignatureExpires: { type: "int", default: 0 },
        lastActivityTime: { type: "int", default: 0 },
        profileHits: { type: "int", default: 0 },
        rankID: { type: "int", default: null },
        userTitle: { type: "varchar", length: 255, default: "" },
        userOnlineGroupID: { type: "int", default: null },
        activityPoints: { type: "int", default: 0 },
        notificationMailToken: { type: "varchar", length: 20, default: "null" },
        authData: { type: "varchar", length: 191, default: "" },
        likesReceived: { type: "mediumint", default: 0 },
        trophyPoints: { type: "int", default: 0 },
        coverPhotoHash: { type: "char", length: 40, default: null },
        coverPhotoExtension: { type: "varchar", length: 4, default: "" },
        disableCoverPhoto: { type: "varchar", length: 50, default: null },
        disableCoverPhotoReason: { type: "text", default: null },
        disableCoverPhotoExpires: { type: "int", default: 0 },
        articles: { type: "int", default: 0 },
        blacklistMatches: { type: "varchar", length: 255, default: "" },
        wbbPosts: { type: "int", default: 0 },
        twitchPartnerName: { type: "varchar", length: 50, default: null },
        twitchPartnerSince: { type: "int", default: null },
        twitchPartnerLastStream: { type: "int", default: null },
        twitchPartnerIsLive: { type: "int", default: 0 },
        discordID: { type: "bigint", default: null },
        discordOauth2Token: { type: "varchar", length: 50, default: null },
        discordOauth2RefreshToken: { type: "varchar", length: 50, default: null },
        discordOauth2Expire: { type: "int", default: null },
        discordAvatar: { type: "varchar", length: 50, default: null },
        usedDiscordAvatar: { type: "varchar", length: 50, default: null },
      },
    });

    const mySQL = new SQL("mysql", mysql.ipAddress, mysql.port, mysql.username, mysql.password, mysql.dbName, [wcf1_user]);

    alt.on("ConnectionComplete", () => {
      console.log(chalk.magenta("------------ MySQL verbunden -----------------"));
      new sm.Database("mongodb://localhost:27017", "goldenRoleplay", ["accounts", "characters", "economy", "ban", "support", 'keys', 'inventory', /*'garage'*/]);
    });

    sm.onReady(loadFiles);

    function loadFiles() {
      import("./char/creator/main.js");
      import("./stateFaction/LSMD/main.js");
      let filesLoaded = 0;
      const folders = fs.readdirSync(path.join(alt.rootDir, "/resources/Roleplay/server/"));
      const filterFolders = folders.filter((x) => !x.includes(".js"));
      for (let i = 0; i < filterFolders.length; i++) {
        const folder = filterFolders[i];
    const files = fs.readdirSync(path.join(alt.rootDir, `/resources/Roleplay/server/${folder}`));
    const filterFiles = files.filter((x) => x.includes(".js"));
    for (let f = 0; f < filterFiles.length; f++) {
      const newPath = `./${folder}/${filterFiles[f]}`;
      import(newPath);
      console.log(chalk.magenta(`${newPath} loaded`));
    }
  }
}
