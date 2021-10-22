import * as alt from "alt-server";
import * as sm from "simplymongo";
import {
  adminHandle,
  playerSearch,
  adminLevel,
  adminLevel2,
  reviveHandle,
  getNearestVeh,
  getNearestPlayer, logAction, unban, dimensionHandler
} from "../system/export.js";
import { ban } from "../system/export";

const db = sm.getDatabase();

alt.on("admin:Server:start", (player) => {
  start(player);
});

alt.onClient("admin:Server:PlayerOnline", async (player) => {
  if (player.account.adminLevel2 !== -1 && player.account.adminLevel === 0 && player.account.project !== 1) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Wollte alle Online Spieler anzeigen!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  let array = [];
  alt.Player.all.forEach((i) => {
    if (!i.valid) return;
    if (!i.account) return;
    array.push({username: i.account.username, characters: i.account.characters, guid: i.account.guid});
  });
  array.sort((a, b) => {
    return a.guid - b.guid;
  });
  alt.emitClient(player, "admin:Client:OnlinePlayer", JSON.stringify(array));
});

alt.onClient("admin:Server:allPlayer", async (player) => {
  if (player.account.adminLevel <= 0 && player.account.project !== 1) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Wollte alle Spieler anzeigen!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  let array = [];
  let accounts = await db.fetchAllData("accounts");
  accounts.forEach((i) => {
    array.push({username: i.username, characters: i.characters });
  });

  alt.emitClient(player, "admin:Client:playerAll", JSON.stringify(array));
});

alt.onClient("admin:Server:triggerPlayer", async (player, name) => {
  if (player.account.adminLevel < 1 && player.account.project !== 1) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der einen Spieler ausgibt!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
    let ply = await db.fetchData("username", name, "accounts");
    ply.password = "";
    ply.email = "";
    let characters = await db.fetchAllByField("username", name, "characters");
    let object = { ...ply, characters: characters};
    return alt.emitClient(player, "admin:Client:playerTrigger", JSON.stringify(object));
  });

alt.onClient("admin:Server:whitelistPlayer", async (player, name) => {
  if (player.account.adminLevel < 2 && player.account.project !== 1) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der einen Spieler whitelisted!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  let ply = await db.fetchData("username", name, "accounts");
  if (ply.ban === 1) {
    return alt.emitClient(player, "notification", 4, "Du kannst keine gebannten Spieler whitelisten", 10000);
  }
  await db.updatePartialData(ply._id, { whitelisted: 1 }, "accounts");

  logAction(player, `Spieler: **${name}** wurde von **${player.account.username}** gewhitelistet!`,`Spieler: ${name} wurde gewhitelisted!`, "Admin System", "#ff0037", "#ff0037")
});

alt.onClient("admin:Server:twoPlayer", async (player, name) => {
  if (player.account.adminLevel < 5 && player.account.project !== 1) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der einen Spieler den 2. Character genehmigt!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  let ply = await playerSearch(player, name);
  if (!ply || ply === -1) {
    ply = await db.fetchData("username", name, "accounts");
    db.updatePartialData(ply._id, { two: 1 }, "accounts");
  } else ply.account.two = 1;

  logAction(player, `Spieler: **${name}** hat von **${player.account.username}** den 2. Charakter bekommen!`, `Du hast Spieler: ${name} den 2. Charakter genehmigt!`, "Admin System", "#ff0037");
});

alt.onClient("admin:Server:adminLevel", async (player, name, adminLevelNumber, adminLevel2Number) => {
  if (player.account.project !== 1 && player.account.adminLevel <= 6) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der einen Spieler die AdminLevel ändert!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  /**
   * @type {Player}
   */
  let ply = await playerSearch(player, name);
  let text;
  if (!ply || ply === -1) {
    ply = await db.fetchData("username", name, "accounts");
    ply.adminLevel = adminLevelNumber;
    ply.adminLevelTwo = adminLevel2Number;
    adminLevel.forEach((i) => {
      if (i.value === adminLevelNumber) {
        ply.adminLevelName = i.title;
      }
    });
    adminLevel2.forEach((i) => {
      if (i.value === adminLevel2Number[0]) {
        ply.adminLevelTwoName[0] = i.title;
      }
      if (i.value === adminLevel2Number[1]) {
        ply.adminLevelTwoName[1] = i.title;
      }
    });
    text = `User: ${player.account.username} hat Spieler ${name} AdminLevel: ${ply.adminLevelName} und AdminLevel2: ${ply.adminLevelTwoName[0]} und ${ply.adminLevelTwoName[1]} zugewiesen!`;
    db.updatePartialData(ply._id, { ...ply }, "accounts");
  } else {
    ply.account.adminLevel = adminLevelNumber;
    ply.account.adminLevelTwo = adminLevel2Number;
    adminLevel.forEach((i) => {
      if (i.value === adminLevelNumber) {
        ply.account.adminLevelName = i.title;
      }
    });
    adminLevel2.forEach((i) => {
      if (i.value === adminLevel2Number[0]) {
        ply.account.adminLevelTwoName[0] = i.title;
      }
      if (i.value === adminLevel2Number[1]) {
        ply.account.adminLevelTwoName[1] = i.title;
      }
    });
    start(ply);
    text = `User: ${player.account.username} hat Spieler ${name} AdminLevel: ${ply.account.adminLevelName} und AdminLevel2: ${ply.account.adminLevelTwoName[0]} und ${ply.account.adminLevelTwoName[1]} zugewiesen!`;
  }

  logAction(player, text, text, "Admin System", "#ff0037");
});

alt.onClient("admin:Server:tpToPosition", (player, tp) => {
  /**
   * @type {Vector3}
   */
  const pos = tp;
  if (player.account.project !== 1 && player.account.adminLevel < 2) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der sich zu einem Spieler teleportiert!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  player.pos = pos;

  alt.emit("discord:Log", ["#ffffff", "Admin System", "#ff0037", `Spieler: **${player.account.username}** hat sich zur Position **${pos.x}, ${pos.y}, ${pos.z}** teleportiert`]);
  alt.emitClient(player, "notification", 1, `Du hast dich zur Position ${pos.x}, ${pos.y}, ${pos.z} teleportiert!`, 10000);
  console.log(`Spieler: ${player.account.username} hat sich zur Position ${pos.x}, ${pos.y}, ${pos.z} teleportiert`);
});

alt.onClient("admin:Server:aduty", async (player) => {
  if (player.account.project !== 1 && player.account.adminLevel < 2) {
    player.kick("Anti-Cheat: Du wurdest Temporär von unseren Server gebannt! Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Hat einen Event getriggert der sich zu einem Spieler teleportiert!");
  }
  player.aduty();
});

alt.onClient("admin:Server:noclip", async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der einen in den Noclipmodus setzt!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  if (player.visible === true) {
    player.visible = false;
    alt.emitClient(player, "noclip:start");
    logAction(player,`Spieler: **${player.account.username}** ist in den Noclipmodus gegangen`,  `Du bist in den Noclipmodus gegangen`, "Admin System", "#ff0037")
  } else {
    player.visible = true;
    alt.emitClient(player, "noclip:stop");
    logAction(player,`Spieler: **${player.account.username}** ist aus den Noclipmodus gegangen`,  `Du bist aus den Noclipmodus gegangen`, "Admin System", "#ff0037")
  }
});

alt.onClient("admin:Server:visible", async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der einen in den Ghostmodus setzt!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);

  if (player.visible === true) {
    player.visible = false;
    logAction(player,  `Spieler: **${player.account.username}** ist in den Ghostmodus gegangen`, `Du bist ist in den Ghostmodus gegangen`, "Admin System", "#ff0037");
  } else {
    player.visible = true;
    logAction(player,  `Spieler: **${player.account.username}** ist aus den Ghostmodus gegangen`, `Du bist ist aus den Ghostmodus gegangen`, "Admin System", "#ff0037");
  }
});

alt.onClient("admin:Server:tpToMarker", async (player, x, y, z) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der einen zum Marker teleportiert!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  player.pos = new alt.Vector3(x, y, z);
  player.giveWeapon(0xfbab5776, 250, true);
  player.visible = false;

  logAction(player, `Spieler: **${player.account.username}** hat sich zur Position **${x}, ${y}** teleportiert`, `Du hast dich zum waypoint teleportiert!`, "Admin System", "#ff0037")
});

alt.onClient("admin:Server:toStandardDimension", async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der in die Standarddimension transportiert wird!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  dimensionHandler(player, 1);

  logAction(player, `Spieler: **${player.account.username}** hat sich zur Dimension **1** transportiert`, `Du hast dich sich zur Dimension 1 transportiert`, "Admin System", "#ff0037")
});

alt.onClient('admin:Server:PositionTpTo', async (player, x, y, z) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  player.pos = new alt.Vector3(parseInt(x),parseInt(y),parseInt(z));

  logAction(player, `Spieler: **${player.account.username}** hat sich zur Position **${x}, ${y}, ${z}** teleportiert`, `Du hast dich zur Position ${x}, ${y}, ${z} teleportiert!`, "Admin System", "#ff0037")
});

alt.onClient('admin:Server:spawnVehicle', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ein Fahrzeug spawnt!");
  }
  if (player.account.aduty === false) return;
  const veh = new alt.Vehicle('shotaro', player.pos.x + 1, player.pos.y + 1 , player.pos.z, 0,0,0);
  veh.dimension = player.dimension;
  
  veh.visible = false;
  player.visible = false;
  
  player.emit("veh:enter", veh);
  logAction(player,`Spieler: **${player.account.username}** hat sich ein Fahrzeug gespawnt`, `Du hast dir ein Fahrzeug gespawnt`, `Admin System`);
});

alt.onClient('admin:Server:playerBlip', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn alle Entity spawnt!");
  }
  if (player.account.aduty === false) return;
  alt.emitClient(player, 'admin:Client:adminBlips');
  logAction(player, `Spieler: **${player.account.username}** hat die AdminBlips aktiviert/deaktiviert`, `Du hast die AdminBlips aktiviert/deaktiviert`, "Admin System", "#ff0037")
})

alt.onClient('admin:Server:destroyNearVehicle', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  let vehicle;
  if (player.account.aduty === false) return;
  if (player.vehicle) vehicle = player.vehicle;
  else vehicle = getNearestVeh(player.pos, 10);
  if (!vehicle || !vehicle.valid) return;
  logAction(player, `Spieler: **${player.account.username}** hat das Fahrzeug **${vehicle.model}** entfernt/eingeparkt`, `Du hast ein Fahrzeug in deiner Nähe entfernt/eingeparkt!`, "Admin System", "#ff0037")
  vehicle.destroy();
});

alt.onClient('admin:Server:repairNearVehicle', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  let vehicle;
  if (player.account.aduty === false) return;
  if (player.vehicle) vehicle = player.vehicle;
  else vehicle = getNearestVeh(player.pos, 10);
  if (!vehicle || !vehicle.valid) return;
  vehicle.repair();
  logAction(player, `Spieler: **${player.account.username}** hat das Fahrzeug **${vehicle.model}** repariert`, `Du hast ein Fahrzeug in deiner Nähe repariert!`, "Admin System", "#ff0037")
  vehicle.dirtLevel = 0;
});

alt.onClient('admin:Server:playerRevive', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  let ply = getNearestPlayer(player.pos, 3);
  if (!ply || !ply.valid) return;
  await reviveHandle(player, ply, true);
  logAction(player,`Teammitglied: **${player.account.username}** hat **${ply.name}** wiederbelebt`, `Du hast Spieler: ${ply.name} wiederbelebt!`, "Admin System", "#ff0037");
});

alt.onClient('admin:Server:banPlayer', async (player, playerName, dialog) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  let ply = await playerSearch(player, playerName);
  if (!ply) {
    const account = await db.fetchAllByField('username', playerName, 'accounts');
    if (account.length === 0) return;
    ply = {account: {...account[0]}, name: account[0].username, hwidHash: account[0].hwid.hwidHash, hwidExHash: account[0].hwid.hwidExHash};
    if (player.account.username === ply.account.username) return;
    if (!(await adminHandle(player, ply, 3, true))) return;
    return await ban(player, ply, dialog);
  }
  if (!(await adminHandle(player, ply, 3, true))) return;
  if (player.account.username === ply.account.username) return;
  await ban(player, ply, dialog);
});

alt.onClient('admin:Server:kickPlayer', async (player, playerName, dialog) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 1, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** mit der Begründung: **"${dialog}"** gekickt`, `Du hast Spieler: ${playerName} mit der Begründung: "${dialog}" gekickt`, "Admin System", "#ff0037");
  ply.kick(`Du wurdest vom Server mit der Begründung ${dialog} gekickt! \n In den Meisten Fällen wende dich an den Support!`);
});

alt.onClient('admin:Server:freeze', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 1, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** gefreezed/unfreezed`, `Du hast Spieler: ${playerName} gefreezed/unfreezed`, "Admin System", "#ff0037");
  alt.emitClient(ply, "antiCheat:Client:freezePlayer");
});

alt.onClient('admin:Server:revivePlayer', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 1, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** wiederbelebt`, `Du hast Spieler: ${playerName} wiederbelebt`, "Admin System", "#ff0037");
  reviveHandle(player, ply, true);
})

alt.onClient('admin:Server:killPlayer', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 2, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** getötet`, `Du hast Spieler: ${playerName} getötet`, "Admin System", "#ff0037");
  ply.health = 0;
  ply.armour = 0;
});

alt.onClient('admin:Server:unVisible', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 0, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** Sichbar/unsichtbar gemacht`, `Du hast Spieler: ${playerName} unsichtbar/sichtbar gemacht`, "Admin System", "#ff0037");
  if (ply.visible) {
    ply.visible = false;
  } else {
    ply.visible = true;
  }
})

alt.onClient('admin:Server:playerStandardDimension', async(player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 0, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat Spieler: **${playerName}** in die Standarddimension gesetzt`, `Du hast Spieler: ${playerName} in die Standarddimension gesetzt`, "Admin System", "#ff0037");
  dimensionHandler(ply, 1);
});

alt.onClient('admin:Server:adminInPlayerDimension', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 0, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} in die Dimension des Spielers: **${playerName}** gegangen`, `Du bist in die Dimension des Spielers: ${playerName} gegangen`, "Admin System", "#ff0037");
  dimensionHandler(player, ply.dimension);
});

alt.onClient('admin:Server:playerInAdminDimension', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 0, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat den Spieler: **${playerName}** in seine Dimension gepackt`, `Du hast  den Spieler: ${playerName} in deine Dimension gepackt`, "Admin System", "#ff0037");
  dimensionHandler(ply, player.dimension);
})

alt.onClient('admin:Server:inVehicleSet', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 0, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat den Spieler: **${playerName}** in ein Fahrzeug gepackt`, `Du hast  den Spieler: ${playerName} in das Fahrzeug gepackt`, "Admin System", "#ff0037");
  let veh;
  if (player.vehicle) veh = player.vehicle;
  else {
    veh = getNearestVeh(player.pos, 5)
  }
  if (veh instanceof alt.Vehicle) alt.emitClient(ply, 'admin:Client:vehicleEnter', veh)
});

alt.onClient('admin:Server:tpToAdmin', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 1, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat den Spieler: **${playerName}** zu ihn teleportiert`, `Du hast den Spieler: ${playerName} zu dir teleportiert`, "Admin System", "#ff0037");
  ply.pos = player.pos;
});

alt.onClient('admin:Server:TpToPlayer', async (player, playerName) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  /**
   *
   * @type {Player}
   */
  let ply = await playerSearch(player, playerName);
  console.log(ply);
  if (!ply || !ply.valid) return;
  if (!(await adminHandle(player, ply, 1, false))) return;
  logAction(player, `Teammitglied: ${player.account.username} hat sich zu dem Spieler: **${playerName}** teleportiert`, `Du hast dich zu dem Spieler: ${playerName} teleportiert`, "Admin System", "#ff0037");
  player.pos = ply.pos;
})

alt.onClient('admin:Server:banList', async (player) => {
  if (!(await adminHandle(player, null, 3, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  const banList = await db.fetchAllData('ban');
  player.emit('admin:Client:listBan', banList);
});

alt.onClient('admin:Server:unbanPlayer', async (player, playername) => {
  if (!(await adminHandle(player, null, 4, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return;
  await unban(player, playername);
});

alt.onClient('admin:Server:supportTicket', async (player) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  if (player.account.aduty === false) return alt.emitClient(player, "admin:Client:loading", false, true);
  const tickets = await db.fetchAllData('support');
  player.emit('admin:Client:ticketSupport', tickets);
})

alt.on('admin:Server:reporting', async (player, msg) => {
  let object = [];
  alt.Player.all.forEach(i => {
    if (!i.valid || !i.account || !i.character) return;
    if (player.pos.distanceTo(i.pos) <= 50) {
      if (player.account.username !== i.account.username) object.push(i.account.username);
    }
    if (i.account.adminLevel > 1 || i.account.project === 1) alt.emitClient(i, 'notification', 2, 'Neues Ticket wurde eröffnet!', 5000);
  });
  let tickets = await db.fetchAllData('support');
  let document = {};
  if (tickets.length === 0) {
    document.id = 1;
  } else {
    let lastTicket = tickets[tickets.length - 1];
    document.id = lastTicket.id + 1;
  }
  document.players = object;
  document.player = player.account.username;
  document.msg = msg;
  document.time = new Date().toLocaleDateString('de-De', {hour: "numeric", minute: "numeric", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
  document.open = true;
  document.inProgress = false;
  document.Progress = "";
  await db.insertData(document, 'support', false);
});

alt.onClient('admin:Server:ticketProgress', async (player, index) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  let i = await db.fetchData('id', index, 'support');
  if (player.account.aduty === false) return;
  logAction(player, `Teammitglied: **${player.account.username}** bearbeitet dass Ticket von **${i.player}**`, `Du bearbeitest das Ticket von ${i.player}`, 'Admin System');
  await db.updatePartialData(i._id, {inProgress: true, Progress: `${player.account.username}`}, 'support');
  /**
   * @type {Player}
   */
  let ply = await playerSearch(player, i.player);

  if (ply === -1 || !ply) return;
  alt.emitClient(ply, 'notification', 2, 'Dein Ticket wird von einen Admin bearbeitet', 10000);
});

alt.onClient('admin:Server:ticketClose', async (player, index) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position teleportiert!");
  }
  let i = await db.fetchData('id', index, 'support');
  if (player.account.aduty === false) return;
  logAction(player, `Teammitglied: **${player.account.username}** hat dass Ticket von **${i.player}** geschlossen!`, `Du hast das Ticket von ${i.player} geschlossen`, 'Admin System');
  await db.updatePartialData(i._id, {open: false}, 'support');
  /**
   * @type {Player}
   */
  let ply = await playerSearch(player, i.player);

  if (ply === -1 || !ply) return;
  alt.emitClient(ply, 'notification', 2, 'Dein Ticket wurde geschlossen', 10000);
});

export function playerClothes(ply) {
  /**
   * @type {Player}
   */
  const player = ply;
  let texture;
  switch (player.account.adminLevel) {
    case 1:
      texture = 8;
      break;
    case 2:
      texture = 11;
      break;
    case 3:
      texture = 6;
      break;
    case 4:
      texture = 10;
      break;
    case 5:
      texture = 4;
      break;
    case 6:
      texture = 3;
      break;
    case 7:
      texture = 2;
      break;
  }
  if (player.character.skin.sex === 1) {
    player.setClothes(1, 135, texture);
    player.setClothes(2, 0, 0);
    player.setClothes(3, 31, 0);
    player.setClothes(4, 114, texture);
    player.setClothes(5, 0, 0);
    player.setClothes(6, 78, texture);
    player.setClothes(7, 0, 0);
    player.setClothes(8, 15, 0);
    player.setClothes(9, 0, 0);
    player.setClothes(10, 0, 0);
    player.setClothes(11, 287, texture);
  } else {
    player.setClothes(1, 135, texture);
    player.setClothes(2, 0, 0);
    player.setClothes(3, 36, 0);
    player.setClothes(4, 121, texture);
    player.setClothes(5, 0, 0);
    player.setClothes(6, 82, texture);
    player.setClothes(7, 0, 0);
    player.setClothes(8, 15, 0);
    player.setClothes(9, 0, 0);
    player.setClothes(10, 0, 0);
    player.setClothes(11, 300, texture);
  }
}

function start(player) {
 if (!player.hasSyncedMeta("team")) player.setSyncedMeta("team", true);
  player.account.aduty = false;
  let kick = false;
  let ban = false;
  let two = false;
  let admin = false;
  let menu = [
    { title: "Main Menü", icon: "mdi-dots-horizontal", value: 5 },
    { title: "Online Spieler", icon: "mdi-account-multiple", value: 0 },
    { title: "Alle Spieler", icon: "mdi-account-group", value: 1 },
    { title: "Support Tickets", icon: "mdi-ticket-account", value: 2 },
  ];
  if (player.account.adminLevel >= 2 || player.account.project === 1) {
    kick = true;
  }
  if (player.account.adminLevel >= 4 || player.account.project === 1) {
    menu.push({ title: "Banliste", icon: "mdi-gavel", value: 3 });
    ban = true;
  }
  if (player.account.adminLevel >= 5 || player.account.project === 1) {
    two = true;
  }
  if (player.account.project === 1) admin = true;
  alt.emitClient(player, "admin:Client:start", menu, kick, ban, two, admin);
}

alt.onClient("noclip:setPos", async (player, x, y, z) => {
  if (!(await adminHandle(player, null, 0, false))) {
    player.kick("Anti Cheat: Du wurdest temporär von unserem Server gebannt. Bitte wende dich an den Support!");
    return ban(null, player, "Anti-Cheat: Der Spieler Hat einen Event getriggert der ihn zu einer Position im Noclip teleportiert!");
  }
  if (player.account.aduty === false) return;

  player.visible = false;
  player.pos = { x, y, z };
});

alt.Player.prototype.aduty = async function aduty() {
  this.emit('admin:Client:playerText');
  if (this.account.aduty) {
    alt.emit("creator:Sync", this, this.character.skin);
    alt.emit("clothes:sync", this);
    this.emit("admin:Client:invincible", false);
    this.emit("anticheat:value", 0);
    this.visible = true;
    this.emit("noclip:stop");
    await logAction(this, `Spieler: **${this.account.username}** ist aus den Adminmodus gegangen!`, `Du bist aus den Adminmodus gegangen!`, "Admin System", "#ff0037");
    this.account.aduty = false;
  } else {
    this.emit("admin:Client:invincible", true);
    this.account.aduty = true;
    playerClothes(this);
    await logAction(this, `Spieler: **${this.account.username}** ist in den Adminmodus gegangen!`, `Du bist in den Adminmodus gegangen!`, "Admin System", "#ff0037");
  }
}
