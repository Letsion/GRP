import * as alt from "alt-server";
import * as sm from "simplymongo";
import SQL from "../database/database.js";
import {ban, logAction, timeHandle} from "../system/export.js";
import * as worker from 'worker_threads';

const db = sm.getDatabase();
const MySQL = new SQL();

//Passwort wird bei diesem Event überprüft
alt.onClient("auth:Server:tryOn", async (player, password) => {
  //Worker
  let verifyPassword = new worker.Worker('./resources/Roleplay/server/system/worker/verifyPassword.js', {workerData: {password: password, storedPassword: player.account.password}});

  verifyPassword.on('message', async (messages) => {
    verifyPassword.terminate();

    //JSON Parse
    let bool = JSON.parse(messages);
    if (!bool) alt.emitClient(player, "notification", 4, "Dein Passwort ist falsch", 10000)
    else {
      alt.emit("char:select", player);
      player.account = {...player.account, logins: player.account.logins + 1, guid: player.id, lastLogin: await timeHandle(), onCount: 0};
      await logAction(player, `Spieler: **${player.account.username}** hat sich mit der Guid: **${player.account.guid}** eingeloggt!`, 'Du hast dich erfolgreich eingeloggt!', 'Login System', "#12b2e2");
    }
  });
});

alt.on("auth:Server:start", isExist);

alt.onClient("auth:Server:supportNumber", async (player, number) => {
  if (player.account.supportNumber === parseInt(number)) {
    await logAction(player, `Spieler: **${player.name}** hat die Support Nummer erfolgreich verwendet`, `Du hast erfolgreich die Support Nummer verwendet!`, 'Auth System', "#12b2e2")
    return alt.emitClient(player, "auth:Client:bool", player.name, false, false, true);
  }
  alt.emitClient(player, "notification", 4, "Support Nummer ist falsch!", 10000);
});

alt.onClient("auth:Server:setPassword", async (player, passwordSet, passwordSetTwo) => {
  if (passwordSet === passwordSetTwo) {
    //Worker
    let encrypt = new worker.Worker('./resources/Roleplay/server/system/worker/encrytPassword.mjs', {workerData: {password: passwordSet}});
    encrypt.on('message', async (messages) => {
      encrypt.terminate();
      let number = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
      // Player account objects
      player.account.password = messages;
      player.account.first = 0;
      player.account.socialId = player.socialID;
      player.account.hwid = {hwidHash: player.hwidHash, hwidExHash: player.hwidExHash};
      player.account.supportNumber = number;
      player.account.guid = player.id;

      await logAction(player, `Spieler: **${player.name}** hat das Passwort erfolgreich erstellt`, 'Du hast erfolgreich das Passwort erstellt!', 'Auth System', "#12b2e2")

      //Object update
      await db.updatePartialData(player.account._id, {password: messages, first: 0, socialId: player.socialID, hwid: { hwidHash: player.hwidHash, hwidExHash: player.hwidExHash }, guid: player.id, supportNumber: number,}, "accounts");
      return alt.emitClient(player, "auth:Client:bool", player.name, true, false, false);
    })

  }
  alt.emitClient(player, "notification", 1, "Das Passwort ist nicht gleich!", 10000);
});

async function isExist(player) {
  //DB Fetch
  const usernames = await db.fetchAllByField("username", player.name, "accounts");
  let res = await MySQL.fetchDataAsync('username', player.name, "wcf1_user");

  if (usernames.length <= 0) {
    if (!res) {
      player.kick("Um auf unseren Server spielen zu können, musst du dich im Forum anmelden. Weitere Infos findest du auf golden-roleplay.de");
      await logAction(null, `Der Username: **${player.name}** wurde nicht im Forum System gefunden`, null, "Login Fehler", "#ff0000")
      return;
    }
    //Search Player with the oldUsername when User changed the Username
    const oldUsernames = await db.fetchAllByField("username", res.oldUsername, "accounts");
    if (oldUsernames.length === 0) {

      const newUser = {
        username: res.username,
        email: res.email,
        adminLevel: 0,
        adminLevelName: "User",
        adminLevelTwo: [0, 0],
        adminLevelTwoName: ["nichts", "nichts"],
        ban: res.banned,
        password: null,
        logins: 1,
        lastIP: player.ip,
        socialId: null,
        first: 1,
        two: 1,
        whitelisted: 0,
        supportNumber: Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000,
        hwid: {},
        guid: -1,
        characters: [],
      };

      //Insert Data from Forum Database to the MongoDB Database (Ingame Database)
      player.kick("Du bist auf unseren Server nicht gewhitelistet. Näheres findest du auf golden-roleplay.de!");
      await db.insertData(newUser, "accounts", true);
      return;
    }
      //Player Account Object
      player.account = oldUsernames[0];
      player.account.username = res.username;
      player.account.email = res.email;
      player.onCount = 0;

      //Update the change
      await db.updatePartialData(oldUsernames[0]._id, {email: res.email, username: res.username}, "accounts");

      if (player.account.password === null) alt.emitClient(player, "auth:Client:start", player.name, false, true, false);
      else alt.emitClient(player, "auth:Client:start", player.name, true, false, false);
    }
    //Player Account Object
    player.account = usernames[0];
    player.account.email = res.email;
    player.onCount = 0;

    //Update the change
    await db.updatePartialData(usernames[0]._id, {email: res.email}, "accounts");
    if (player.account.password === null) alt.emitClient(player, "auth:Client:start", player.name, false, true, false);
    else alt.emitClient(player, "auth:Client:start", player.name, true, false, false);
}