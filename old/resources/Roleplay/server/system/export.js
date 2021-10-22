import alt from "alt-server";
import * as sm from "simplymongo";
import replaceAll from "replaceall";
import { WeaponModel } from "./config.js";
import { revivePoints } from "../stateFaction/LSMD/config.js";

const db = sm.getDatabase();

export const adminLevel = [
  { title: "User", value: 0 },
  { title: "Developer", value: 1 },
  { title: "Supporter", value: 2 },
  { title: "Moderator", value: 3 },
  { title: "Administrator", value: 4 },
  { title: "Super Administrator", value: 5 },
  { title: "Projektmanager", value: 6 },
  { title: "Projektleitung", value: 7 },
];

export const adminLevel2 = [
  { title: "nichts", value: 0 },
  { title: "Guide", value: -1 },
  { title: "Grafiker", value: -2 },
  { title: "Game Designer", value: -3 },
  { title: "Einreisebeamter", value: -4 },
  { title: "Fraktionsverwaltung", value: -5 },
];

/**
 *
 * @param pos
 * @param range
 * @returns {Vehicle}
 */
export function getNearestVeh(pos, range) {
  let lowestDist = range;
  let returnVeh = null;
  alt.Vehicle.all.forEach((veh) => {
    let dist = pos.distanceTo(veh.pos);
    if (dist < lowestDist) {
      returnVeh = veh;
    }
  });
  return returnVeh;
}

/**
 *
 * @param pos
 * @param range
 * @returns {Player}
 */
export function getNearestPlayer(pos, range) {
  let lowestDist = range;
  let returnPlayer = null;
  alt.Player.all.forEach((ply) => {
    let dist = pos.distanceTo(ply.pos);
    if (dist < lowestDist) {
      returnPlayer = ply;
    }
  });
  return returnPlayer;
}

export const isPlayerValid = (id) => {
  if (id === -1) return undefined;
  return new Promise((resolve) => {
    alt.Player.all.forEach((ply) => {
      if (ply.id !== id) return;
      if (!ply.valid) resolve(false);
      resolve(ply);
    });
  });
};

/**
 * @param player
 * @param name
 * Player to Search by Username
 * @returns {Promise<Player>|undefined}
 */

export const playerSearch = (player, name) => {
  return new Promise(async (resolve) => {
    let ply;
    let id = parseInt(name);
    if (id === 0 || id) {
      ply = await isPlayerValid(id,);
      if (!ply) resolve(false);
      resolve(ply);
    } else {
      id = await searchPlayerByName(player, name);
      ply = await isPlayerValid(id);
      if (!ply) resolve(false);
      resolve(ply);
    }
  });
};

export function weaponHandler(name, player) {
  try {
    let arg = parseInt(name);
    if (!arg) arg = name;

    if (typeof arg === "number") {
      player.giveWeapon(parseInt(arg), 1000, true);
      logAction(player, `Spieler: **${player.account.username}** hat sich die Waffe ${name} gegeben`, `Du hast dir die Waffe ${name} gegeben`, 'Admin System', '#FF0037FF')
    } else if (typeof arg === "string") {
      if (WeaponModel[arg]) {
        player.giveWeapon(parseInt(WeaponModel[arg]), 1000, true);
        logAction(player, `Spieler: **${player.account.username}** hat sich die Waffe ${name} gegeben`, `Du hast dir die Waffe ${name} gegeben`, 'Admin System', '#FF0037FF')
      }
      alt.emitClient(player, "notification", 3, `Die Waffe ${name} ist nicht bekannt`, 7000);
    }
  } catch (e) {
    alt.emitClient(player, "notification", 3, `Die Waffe ${name} ist nicht bekannt`, 7000);
  }
}

export async function ban(player, ply, msg, number) {
  let text, bool;
  if (player !== null) bool = await adminHandle(player, ply, 3, true);
  if (typeof msg === "object") {
    const command = msg.toString();
    const textState = replaceAll(",", " ", command);
    const textOne = replaceAll(";", ",", textState);
    text = textOne.replace(ply.name, "");
  } else {
    text = msg;
  }
  if (!bool && player !== null) {
    return;
  }

  if (player) {
    alt.emitClient(player, "notification", 1, `Du hast den Spieler ${ply.name} gebannt`, 7000);
    if (ply instanceof alt.Player) ply.kick(`Du wurdest gebannt! Im Forum findest du näheres zur Entbannung!`);
    console.error(`Spieler: ${ply.name} wurde von ${player.account.username} gebannt mit der Begründung: ${text}`);
    alt.emit("discord:Log", ["#fa0000", "Spieler gebannt", `Spieler: **${ply.account.username}** wurde von ${player.account.username} gebannt! Mit der Begründung: ${text}`]);
  } else {
    if (ply instanceof alt.Player) ply.kick(`Du wurdest gebannt! Im Forum findest du näheres zur Entbannung!`);
    console.error(`Spieler: ${ply.name} wurde von gebannt mit der Begründung: ${text}`);
    alt.emit("discord:Log", ["#fa0000", "Spieler gebannt", `Spieler: **${ply.account.username}** wurde von gebannt! Mit der Begründung: ${text}`]);
  }

  // Update Ban on Account
  await db.updatePartialData(ply.account._id, { ban: 1 }, "accounts");
  const newBan = {
    player: ply.name,
    hwidHash: ply.hwidHash,
    hwidExHash: ply.hwidExHash,
    date: new Date().toLocaleDateString('de-De', {hour: "numeric", minute: "numeric", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
    why: text,
    playerBanned: player.account.username,
    dateEx: number,
  };
  // Insert in Ban Col.
  await db.insertData(newBan, "ban", false);
}

export async function unban(player, username) {
  const name = await db.fetchAllByField("player", username, "ban");

  if (name.length === 0) return alt.emitClient(player, "notification", 1, `Der Spieler ${username} wurde nicht gefunden`, 7000);

  const account = await db.fetchAllByField("username", username, "accounts");

  if (account.length === 0) {
    logAction(player, `Spieler: **${account[0].username}** wurde von Teammitglied: **${player.account.username}** entbannt`, `Du hast ${account[0].username} entbannt`, 'Admin System', "#ff0037");
    return await db.deleteById(name[0]._id, "ban");
  }

  await db.deleteById(name[0]._id, "ban");
  await db.updatePartialData(account[0]._id, { ban: 0 }, "accounts");
  logAction(player, `Spieler: **${account[0].username}** wurde von Teammitglied: **${player.account.username}** entbannt`, `Du hast ${account[0].username} entbannt`, 'Admin System', "#ff0037");
}

export const searchPlayerByName = (player, name) => {
  return new Promise(async (resolve) => {
    const account = await db.fetchData("username", name, "accounts");
    if (!account) resolve(-1);
    else resolve(account.guid);
  });
};

export function vehicleSpawner(player, name, boolean) {
  let car;
  try {
    car = new alt.Vehicle(name, player.pos.x, player.pos.y, player.pos.z, 0, 0, 0);
    car.dimension = 1;
    car.manualEngineControl = true;
    car.lockState = 0;
    car.customPrimaryColor = new alt.RGBA(255, 161, 0, 100);
    car.customSecondaryColor = new alt.RGBA(0, 0, 0, 100);
    car.numberPlateText = "GoldenRP";

    alt.emitClient(player, "notification", 1, `Du hast das Fahrzeug, mit dem Namen ${name}, gespawt`, 9000);
  } catch (e) {
    alt.emitClient(player, "notification", 3, `Das Fahrzeug ${name} wurde nicht gefunden`, 7000);
  }
  if (boolean) {
    alt.emitClient(player, "veh:enter", car);
  }
}

export function loginHandler(player) {
  //Login switch out of the Player
  alt.setTimeout(() => {
    alt.emitClient(player, "login:screen", true);
    alt.emit('clothes:sync', player);
  }, 550);

  alt.setTimeout(() => {
    alt.emitClient(player, "login:screen", false);
  }, 15000);
}

export function dimensionHandler(player, dim) {
  player.dimension = dim;
  player.setSyncedMeta('Dim', dim);
}
/**
 *
 * @param player
 * @param target
 * @param lvl
 * @param bool
 * @returns {Promise<boolean>}
 */
export const adminHandle = (player, target, lvl, bool) => {
  return new Promise(async (resolve) => {
    if (bool) {
      if (player.account.project === 1 && target.account.project && target.account.project === 1) {
        alt.emitClient(player, "notification", 2, "Keine Berechtigung zum Nutzen der Funktion", 5000);
        return resolve(false);
      }
      if (player.account.project === 1) return resolve(true);
      if (player.account.adminLevel < lvl || player.account.adminLevel <= target.account.adminLevel) {
        alt.emitClient(player, "notification", 2, "Keine Berechtigung zum Nutzen der Funktion", 5000);
        return resolve(false);
      } else return resolve(true);
    } else {
      if (player.account.project === 1) return resolve(true);
      if (player.account.adminLevel < lvl) {
        alt.emitClient(player, "notification", 2, "Keine Berechtigung zum Nutzen der Funktion", 5000);
        return resolve(false);
      }
      return resolve(true);
    }
  });
};

export function reviveHandle(player, ply, bool) {
  if (bool) {
    if (!ply) {
      alt.emitClient(player, "notification", 3, `Der Spieler mit der ID: ${ply} ist nicht bekannt oder nicht online`, 7000);
    }
    ply.anticheat.revive += 1;
    ply.deleteSyncedMeta('dead');
    alt.emit("SaltyChat:SetPlayerAlive", ply, true);
    alt.emitClient(player, "notification", 2, `Der Spieler ${ply.name} wurde revived`, 7000);
    alt.emitClient(ply, "notification", 1, `Du wurdest von ${player.character.vorname} ${player.character.nachname} wiederbelebt`, 7000);
    ply.clearBloodDamage();
    alt.clearTimeout(ply.character.dead.deadTimeout);
    alt.clearInterval(player.character.dead.intervall);
    ply.spawn(ply.pos.x, ply.pos.y, ply.pos.z, 0);
    deadHandle(ply);
    alt.emitClient(ply, "medic:Client:revive");
    alt.setTimeout(() => {
      alt.emitClient(ply, "anticheat:value", 0);
    }, 50);
  } else {
    const ply = player;
    ply.anticheat.revive += 1;
    alt.emit("SaltyChat:SetPlayerAlive", ply, true);
    ply.deleteSyncedMeta('dead');
    ply.clearBloodDamage();
    alt.clearInterval(player.character.dead.intervall);
    alt.clearTimeout(ply.character.dead.deadTimeout);
    deadHandle(ply);
    ply.spawn(ply.pos.x, ply.pos.y, ply.pos.z, 0);
    alt.emitClient(ply, "medic:Client:revive");
    alt.setTimeout(() => {
      alt.emitClient(ply, "anticheat:value", 0);
    }, 50);
  }
}

export function deadHandle(player) {
  player.character.dead.inComa = 0;
  player.character.dead.deadState = 0;
  player.character.dead.deadTimeout = -1;
  player.character.dead.deadType = "";
  player.character.dead.intervall = -1;
  player.character.dead.deadTime = -1;
}

export const nearRevivePoints = (player) => {
  let distance = [];
  revivePoints.forEach((i) => {
    distance.push({ distance: player.pos.distanceTo(i), coords: i });
  });
  distance.sort((a, b) => {
    return a.distance - b.distance;
  });
  return distance[0];
};

export const adminLevelTwoExist = (player, lvl) => {
  return new Promise(async (resolve) => {
    let bool = false;
    player.account.adminLevel2.forEach((i) => {
      if (i === lvl) {
        bool = true;
        resolve(true);
      }
    });
    if (!bool) resolve(false);
  });
};

/**
 *
 * @param player
 * Player that trigger the action
 * @param textOne
 * Is the Maintext
 * @param playerMSG
 * is the Text for Player
 * @param textTwo
 * for Discord Log: Caption of the Report
 * @param hex
 * for Discord Log: HEX for the left border
 */
export async function logAction(player, textOne, playerMSG, textTwo, hex) {
  return new Promise(async resolve => {
    if (!hex) alt.emit("discord:Log", ["#ffffff", textTwo, textOne]);
    else alt.emit("discord:Log", [hex, textTwo, textOne])
    alt.emitClient(player, "notification", 1, playerMSG, 10000);
    alt.log(textOne);
    resolve(true);
  });
}

export async function timeHandle() {
  return new Promise(async resolve => {
    resolve(new Date().toLocaleDateString('de-De', {hour: "numeric", minute: "numeric", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
  });
}

