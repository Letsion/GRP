import * as alt from "alt-server";
import * as chat from "../chat";
import {
  vehicleSpawner,
  weaponHandler,
  adminHandle,
  reviveHandle,
  playerSearch,
  logAction, getNearestVeh
} from "../system/export.js";
import replaceAll from "replaceall";

chat.registerCmd("revive", async (player, args) => {
  if (!(await adminHandle(player, null, 1, false))) return;
  if (!args[0]) {
    reviveHandle(player, null, false);
    alt.emitClient(player, "notification", 1, `Du hast dich wiederbelebt`, 5000);
  }
  else {
    const ply = await playerSearch(player, args[0]);
    if (!ply) return;
    reviveHandle(player, ply, true);
  }
});

chat.registerCmd("car", async (player, args) => {
  if (!(await adminHandle(player, null, 2, false))) return;
  if (!args || !args[0]) return alt.emitClient(player, "notification", 4, "Bitte schreibe den Command so: /car [fahrzeug]", 5000);

  vehicleSpawner(player, args[0], true);
});

chat.registerCmd("veh", async (player, args) => {
  if (!(await adminHandle(player, null, 2, false))) return;
  if (!args || !args[0]) return alt.emitClient(player, "notification", 4, "Bitte schreibe den Command so: /veh [fahrzeug]", 5000);

  vehicleSpawner(player, args[0], true);
});

chat.registerCmd('dv', async (player, args) => {
  if (player.account.project === 1) {
    let vehicle, range;
    if (args[0]) {
      // Range to high or Unknown
      if (args[0] < "10" || args[0] === "0" || args[0] === "") range = 10;
      else range = parseInt(args[0]);
    } else {
      range = 10;
    }

    if (player.vehicle) vehicle = player.vehicle;
    else vehicle = getNearestVeh(player.pos, range);

    await logAction(player, `Spieler: ${player.account.username} hat das Fahrzeug ${vehicle.model} gelöscht/eingeparkt`, 'Du hast das Fahrzeug eingeparkt', 'Admin System', "#ff0037");

    if (vehicle.valid) vehicle.destroy();
  } else alt.emitClient(player, 'notification', 4, 'Unbekannter Command: /dv', 10000);

})

chat.registerCmd("weapon", async (player, args) => {
  if (!(await adminHandle(player, null, 5, false))) return;
  if (!args[1]) return weaponHandler(args[0], player);
  const ply = await playerSearch(player, args[1]);
  if (!ply) return;
  weaponHandler(args[0], ply);
});

chat.registerCmd("announce", async (player, args) => {
  if (!(await adminHandle(player, null, 1, false))) return;

  const command = args.toString();
  const textState = replaceAll(",", " ", command);
  const text = replaceAll(";", ",", textState);
  alt.emitAllClients("notification", 5, text, 10000);
});

chat.registerCmd("heading", (player) => {
  if (player.account.adminLevel === 1 || player.account.adminLevel <= 3) alt.emitClient(player, "command:heading");
});

alt.onClient("command:Server:heading", (player, head) => {
  alt.emitClient(player, "notification", 1, `Heading: ${head}`, 10000);
  console.log(`Heading: ${head}`);
});

chat.registerCmd('rot', async (player) => {
  if (!await adminHandle(player, null, 4, false)) return;
  alt.emitClient(player, 'command:rot');
})

alt.onClient("command:Server:rot", (player, head) => {
  alt.emitClient(player, "notification", 1, `rot: ${head}`, 10000);
  console.log(`Rot: ${head}`);
});

chat.registerCmd('coords', async (player, args) => {
  if (!await adminHandle(player, null, 4, false)) return;
  console.log(player.pos);
})

chat.registerCmd('setWeather', async (player, args) => {
  if (!await adminHandle(player, null, 4, false)) return;
  alt.emit('system:Weather:set', parseInt(args[0]));
});

chat.registerCmd('aduty', async (player) => {
  if (player.account.project !== 1) return;
  player.aduty();
});

chat.registerCmd('radioJoin', (player, args) => {
  alt.emit('SaltyChat:JoinRadioChannel', player, args[0], true);
})

chat.registerCmd('radioLeave', (player, args) => {
  alt.emit("SaltyChat:LeaveAllRadioChannel", player)
});

//test

chat.registerCmd('test', (player, args) => {
  if (player.account.project !== 1) return;
  alt.emitClient(player, 'animation', args[0], args[1]);
});

chat.registerCmd('stop', (player) => {
  if (player.account.project !== 1) return;
  alt.emitClient(player, 'stopAnim');
});

chat.registerCmd('ped', (player, args) => {
  if (player.account.project !== 1) return;
  player.model = args[0];
});

chat.registerCmd('startPlayer', async (player) => {
  alt.emitAllClients('audio', player);
})
chat.registerCmd('startVehicle', async (player) => {
  let veh = await getNearestVeh(player.pos, 5);
  alt.emitAllClients('audio', veh);
})

chat.registerCmd('startIphone', (player) => {
  alt.emitAllClients('audioIphone', player);
});

chat.registerCmd('stopIphone', (player) => {
  alt.emitAllClients('stopIphone', player);
});