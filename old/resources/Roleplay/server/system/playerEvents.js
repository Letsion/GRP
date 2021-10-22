import * as alt from "alt-server";
import * as sm from "simplymongo";
import {dimensionHandler, logAction} from "./export.js";

const db = sm.getDatabase();

// On PlayerConnect
alt.on("playerConnect", async (player) => {
  dimensionHandler(player, player.id + 1);
  player.spawn(32.465, 857.195, 197.727, 0);
  player.pos = new alt.Vector3(-793.9384765625, 335.5384521484375, 158.5853271484375);
  player.visible = false;
  player.clearBloodDamage();
  //Freeze Player
  alt.emitClient(player, "playerConnect:freeze", true, false);
  //fetch Account
  const account = await db.fetchData("username", player.name, "accounts");
  //Fetch Ban
  const ban = await db.fetchData("hwidHash", player.hwidHash, "ban");
  // Ban isn't exist...
  if (!ban) {
    //Account isn't exist...
    if (!account) {
      alt.emit("auth:Server:start", player);
      return;
    }
    if (account.project === 1) {
      alt.emit("auth:Server:start", player);
      return;
    }
    if (account.whitelisted === 0) {
      player.kick("Du bist nicht gewhitelistet. \n Bitte wende dich an den Support!");
      return;
    }
    if (account.first === 1) return alt.emit("auth:Server:start", player);

    if (!account.socialId || account.socialId !== player.socialID) {
      player.kick("Bitte im Support melden! \n Your Game ID is wrong!");
      return logAction(null, 'Spieler: **${player.name}** hat eine falsche SocialClub ID!', null, 'Account System', "#b406ff");
    }
    if (!account.hwid || !account.hwid.hwidHash) {
      player.kick("Bitte im Support melden! \n Your Player ID is Wrong");
      return logAction(null, `Spieler: **${player.name}** hat keine Hardware1 ID!`, null, 'Account System', "#b406ff");
    }
    if (account.hwid.hwidHash !== player.hwidHash) {
      player.kick("Bitte im Support melden! PlayID is wrong");
      return logAction(null, `Spieler: **${player.name}** hat eine falsche Hardware1 ID! \n Seine ID: ${player.hwidHash}, zu erwartende ID: ${account.hwid.hwidHash}`, "#b406ff");
    }
    if (account.hwid.hwidExHash !== "") {
      if (account.hwid.hwidExHash !== player.hwidExHash) {
        player.kick('Bitte in den Support melden. \n Your Player ID 2 is wrong!');
        return logAction(null, `Spieler: **${player.name}** hat eine falsche Hardware2 ID! \n Seine ID: ${player.hwidExHash}, zu erwartende ID: ${account.hwid.hwidExHash}`, "#b406ff");
      }
    }
  } else {
    //Ban Handle
    if (ban.hwidHash === player.hwidHash || ban.socialId === player.socialID || ban.player === player.name) {
      player.kick("Du wurdest gebannt. Im Forum findest du näheres zum Entbannungsantrag. Ist der Ban nicht gerechtfertigt, dann wende dich an den Support!");
      return;
    }
  }
  // is Player on Account banned
  if (account.ban === 1) {
    player.kick("Du wurdest gebannt. Im Forum findest du näheres zum Entbannungsantrag. \n Ist der Ban nicht gerechtfertigt, dann wende dich an den Support!");
    return;
  }
  if (account.whitelisted === 0) {
    player.kick("Du bist nicht gewhitelistet. \n Bitte wende dich an den Support!");
    return;
  }
  // is Player not Banned
  alt.emit("auth:Server:start", player);
});

//On PlayerDisconnect
alt.on("playerDisconnect", async (player, reason) => {
  if (!player.account) return;
  let ply = player;
  await db.updatePartialData(ply.account._id, {... ply.account, guid: -1}, 'accounts');
  console.log(`User ${ply.account.username} wurde gespeichert`);
  console.log(`User ${ply.account.username} hat sich ausgeloggt`);
  alt.emit("discord:Log", ["#12b2e2", "Spieler ausgeloggt", `Spieler: **${ply.account.username}** hat sich ausgeloggt!`]);

  if (ply.character) {
    ply.character.joined = 0;
    if (ply.character.dead.deadTimeout !== -1) {
      alt.clearTimeout(ply.character.dead.deadTimeout);
    }
    if (ply.character.dead.intervall !== -1) {
      alt.clearInterval(ply.character.dead.intervall);
    }
    ply.character.dead.deadTimeout = -1;
    ply.character.dead.intervall = -1;
    await db.updatePartialData(ply.character._id, { ...ply.character }, "characters");
  }
});

//On Server shutdown
alt.on("resourceStop", () => {
  alt.Player.all.forEach((i) => {
    if (!i.valid) return;
    if (!i.account) return;
    i.account.guid = -1;
    db.updatePartialData(i.account._id, { ...i.account }, "accounts");
    alt.emit("discord:Log", ["#12b2e2", "Spieler ausgeloggt", `Spieler: **${i.account.username}** hat sich ausgeloggt!`]);
    console.log(`User ${i.account.username} mit der ID ${i.id} wurde gespeichert`);
    console.log(`User ${i.account.username} mit der ID ${i.id} hat sich ausgeloggt`);
    if (i.character) {
      i.character.pos = { ...i.pos };
      i.character.joined = 0;
      i.character.dead.deadTimeout = -1;
      i.character.dead.intervall = -1;
      db.updatePartialData(i.character._id, { ...i.character }, "characters");
    }
  });
});
