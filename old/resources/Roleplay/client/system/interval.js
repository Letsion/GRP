import * as alt from "alt-client";
import * as native from "natives";
import * as pedCreator from "../ped/ped.js";

let teleport;

alt.on("connectionComplete", () => {
  alt.setInterval(async () => {
    let p = native.getClosestPed(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 10, false, true, null, false, false, -1)[1];
    let ped = await pedCreator.getPedDataByPed(p);

    if (!ped || !p || !ped.teleportValue || teleport === ped.teleportValue || alt.Player.local.pos.distanceTo(ped.pos) > ped.use) return;

    teleport = ped.teleportValue;
    let interaction = alt.Player.local.getMeta('keys').interactionKey[1];
    switch (teleport) {
      case 'PillHospitalHall':
      case 'PillHospitalGarage':
        alt.emit('notification', 2, `Drücke ${interaction.toUpperCase()} um den Fahrstuhl zu benutzen!`, 2500);
      break;
      case 'CasinoOutDoor':
        alt.emit('notification', 2, `Drücke ${interaction.toUpperCase()} um das Casino zu betreten!`, 2500);
      break;
      case 'CasinoInDoor':
        alt.emit('notification', 2, `Drücke ${interaction.toUpperCase()} um das Casino zu verlassen`, 2500);
      break;
      case 'SandyShores':
      case 'PaletoBay':
        alt.emit('notification', 2, `Drücke ${interaction.toUpperCase()} um das Krankenhaus zu betreten!`, 2500);
      break;
      case 'toSandyShores':
      case 'toPaletoBay':
        alt.emit('notification', 2, `Drücke ${interaction.toUpperCase()} um das Krankenhaus zu verlassen!`, 2500);
      break;
    }

    alt.setTimeout(() => {teleport = undefined}, 15000);
    /*
    if (native.getClosestObjectOfType(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0.7, alt.hash("prop_atm_03"), false, false, false) || native.getClosestObjectOfType(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0.7, alt.hash("prop_fleeca_atm"), false, false, false) || native.getClosestObjectOfType(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0.7, alt.hash("prop_atm_01"), false, false, false) || native.getClosestObjectOfType(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 0.7, alt.hash("prop_atm_02"), false, false, false)) {
      if (alt.Player.local.vehicle) return;
    }
     */
  }, 650);
/*
  alt.setInterval(() => {
    native.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 241, true);
    native.setPedConfigFlag(alt.Player.local.scriptID, 429, true);
    native.invalidateIdleCam();
    native.invalidateVehicleIdleCam();
  }, 25000); */
});


