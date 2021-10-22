import * as alt from "alt-client";
import * as native from "natives";
import {drawText3d} from "../utility/markers";

const view = new alt.WebView("http://resource/client/admin/html/index.html");
let freeze = false;

alt.emit('settings:Key:admin', view);

alt.onServer("admin:Client:start", (menu, bool1, bool2, bool3, bool4) => {
  view.emit("admin:View:name", `${alt.Player.local.name}`);
  view.emit("admin:View:menu", menu, bool1, bool2, bool3, bool4);
  view.unfocus();
});

alt.onServer('admin:Client:vehicleEnter', (vehicle) => {
  let cleared = false;
  const interval = alt.setInterval(() => {
    const vehicleScriptId = vehicle.scriptID;
    if (vehicleScriptId) {
      native.setPedIntoVehicle(alt.Player.local.scriptID, vehicleScriptId, 1);
      alt.clearInterval(interval);
      cleared = true;
    }
  }, 10);
  alt.setTimeout(() => {
    if (!cleared) {
      alt.clearInterval(interval);
    }
  }, 5000);
});

view.on("admin:Client:PlayerOnline", () => {
  alt.emitServer("admin:Server:PlayerOnline");
});

view.on("admin:Client:allPlayer", () => {
  alt.emitServer("admin:Server:allPlayer");
});

view.on("admin:Client:triggerPlayer", (name) => {
  alt.emitServer("admin:Server:triggerPlayer", name);
});

view.on("admin:Client:whitelistPlayer", (name) => {
  alt.emitServer("admin:Server:whitelistPlayer", name);
});

view.on("admin:Client:twoPlayer", (name) => {
  alt.emitServer("admin:Server:twoPlayer", name);
});

view.on("admin:Client:adminLevel", (name, adminLevel, adminLevel2) => {
  alt.emitServer("admin:Server:adminLevel", name, adminLevel, adminLevel2);
});

view.on("admin:Client:tpToPosition", (tp) => {
  alt.emitServer("admin:Server:tpToPosition", tp);
});

view.on("admin:Client:aduty", () => {
  alt.emitServer("admin:Server:aduty");
});

view.on("admin:Client:noclip", () => {
  alt.emitServer("admin:Server:noclip");
});

view.on("admin:Client:visible", () => {
  alt.emitServer("admin:Server:visible");
});

view.on("admin:Client:toDimension", (name) => {
  alt.emitServer("admin:Server:toDimension", name);
});

view.on("admin:Client:toStandardDimension", () => {
  alt.emitServer("admin:Server:toStandardDimension");
});

view.on("admin:Client:tpToMarker", () => {
  let waypointHandle = native.getFirstBlipInfoId(8);
  if (native.doesBlipExist(waypointHandle)) {
    let waypointCoords = native.getBlipInfoIdCoord(waypointHandle);
    alt.emitServer("admin:Server:tpToMarker", waypointCoords.x, waypointCoords.y, 850);
  }
});

view.on('admin:Client:PositionTpTo', (x, y, z) => {
  alt.emitServer('admin:Server:PositionTpTo', x, y, z);
});

view.on('admin:Client:spawnVehicle', () => {
  alt.emitServer('admin:Server:spawnVehicle')
});

view.on('admin:Client:playerBlip', () => {alt.emitServer('admin:Server:playerBlip')});

view.on('admin:Client:destroyNearVehicle', () => {alt.emitServer('admin:Server:destroyNearVehicle')})

view.on('admin:Client:repairNearVehicle', () => {alt.emitServer('admin:Server:repairNearVehicle')})

view.on('admin:Client:playerRevive', () => {alt.emitServer('admin:Server:playerRevive')})

view.on('admin:Client:banPlayer', (playerName, dialog) => {alt.emitServer('admin:Server:banPlayer', playerName, dialog);});

view.on('admin:Client:kickPlayer', (playerName, dialog) => {alt.emitServer('admin:Server:kickPlayer', playerName, dialog);});

view.on('admin:Client:freeze', (playerName) => {alt.emitServer('admin:Server:freeze', playerName)});

view.on('admin:Client:revivePlayer', (playerName) => {alt.emitServer('admin:Server:revivePlayer', playerName)});

view.on('admin:Client:killPlayer', (playerName) => {alt.emitServer('admin:Server:killPlayer', playerName)});

view.on('admin:Client:unVisible', (playerName) => {alt.emitServer('admin:Server:unVisible', playerName)});

view.on('admin:Client:playerStandardDimension', (playerName) => {alt.emitServer('admin:Server:playerStandardDimension', playerName)});

view.on('admin:Client:adminInPlayerDimension', (playerName) => {alt.emitServer('admin:Server:adminInPlayerDimension', playerName)});

view.on('admin:Client:playerInAdminDimension', (playerName) => {alt.emitServer('admin:Server:playerInAdminDimension', playerName)})

view.on('admin:Client:inVehicleSet', (playerName) => {alt.emitServer('admin:Server:inVehicleSet', playerName)});

view.on('admin:Client:tpToAdmin', (playerName) => {alt.emitServer('admin:Server:tpToAdmin', playerName)});

view.on('admin:Client:tpToPlayer', (playerName) => {alt.emitServer('admin:Server:TpToPlayer', playerName)});

view.on('admin:Client:banList', () => {alt.emitServer('admin:Server:banList')})

view.on('admin:Client:unbanPlayer', (name) => {alt.emitServer('admin:Server:unbanPlayer', name)})

alt.onServer("admin:Client:loading", (bool, bool2) => {view.emit("admin:View:loading", bool, bool2);});

alt.onServer("admin:Client:OnlinePlayer", (array) => {view.emit("admin:View:PlayerOnline", array);});

alt.onServer("admin:Client:playerAll", (array) => {view.emit("admin:View:allPlayer", array);});

alt.onServer("admin:Client:playerTrigger", (array) => {view.emit("admin:View:triggerPlayer", array);});

alt.onServer("admin:Client:Freeze", () => {
  if (freeze) {
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    freeze = false;
  } else {
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    freeze = true;
  }
});

alt.onServer("admin:Client:invincible", (bool) => {native.setPlayerInvincible(alt.Player.local.scriptID, bool);});

alt.onServer('admin:Client:listBan', (ban) => {view.emit('admin:View:banList', ban);});

view.on('admin:Client:supportTicket', () => {alt.emitServer('admin:Server:supportTicket')});

alt.onServer('admin:Client:ticketSupport', (array) => {view.emit('admin:View:supportTicket', array);})

view.on('admin:Client:ticketProgress', (objectID) => {alt.emitServer('admin:Server:ticketProgress', objectID);});

view.on('admin:Client:ticketClose', (objectID) => {alt.emitServer('admin:Server:ticketClose', objectID);});

//LeonMr&&&&&& Noclip System
export default class NoClip {
  static enabled = false;
  static speed = 2.0;
  static everyTick = null;

  static start() {
    if (NoClip.enabled) return;
    NoClip.enabled = true;
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    this.everyTick = alt.everyTick(NoClip.keyHandler);
  }
  static stop() {
    if (!NoClip.enabled) return;
    NoClip.enabled = false;
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.clearEveryTick(this.everyTick);
  }

  static KEYS = {
    FORWARD: 32,
    BACKWARD: 33,
    LEFT: 34,
    RIGHT: 35,
    UP: 22,
    DOWN: 36,
    SHIFT: 21,
  };
  static keyHandler() {
    let currentPos = alt.Player.local.pos;
    let speed = NoClip.speed;
    let rot = native.getGameplayCamRot(2);
    let dirForward = camVectorForward(rot);
    let dirRight = camVectorRight(rot);

    if (native.isDisabledControlPressed(0, NoClip.KEYS.SHIFT)) speed = speed * 5;

    if (native.isDisabledControlPressed(0, NoClip.KEYS.FORWARD)) currentPos = addSpeedToVector(currentPos, dirForward, speed);
    if (native.isDisabledControlPressed(0, NoClip.KEYS.BACKWARD)) currentPos = addSpeedToVector(currentPos, dirForward, -speed);
    if (native.isDisabledControlPressed(0, NoClip.KEYS.LEFT)) currentPos = addSpeedToVector(currentPos, dirRight, -speed, true);
    if (native.isDisabledControlPressed(0, NoClip.KEYS.RIGHT)) currentPos = addSpeedToVector(currentPos, dirRight, speed, true);
    let zModifier = 0;
    if (native.isDisabledControlPressed(0, NoClip.KEYS.UP)) zModifier += speed;
    if (native.isDisabledControlPressed(0, NoClip.KEYS.DOWN)) zModifier -= speed;

    if (!isVectorEqual(new alt.Vector3(currentPos.x, currentPos.y, currentPos.z + zModifier), alt.Player.local.pos)) alt.emitServer("noclip:setPos", currentPos.x, currentPos.y, currentPos.z + zModifier);
  }
}

function addSpeedToVector(vector1, vector2, speed, lr = false) {
  return new alt.Vector3(vector1.x + vector2.x * speed, vector1.y + vector2.y * speed, lr === true ? vector1.z : vector1.z + vector2.z * speed);
}

function camVectorForward(camRot) {
  let rotInRad = {
    x: camRot.x * (Math.PI / 180),
    y: camRot.y * (Math.PI / 180),
    z: camRot.z * (Math.PI / 180) + Math.PI / 2,
  };

  let camDir = {
    x: Math.cos(rotInRad.z),
    y: Math.sin(rotInRad.z),
    z: Math.sin(rotInRad.x),
  };

  return camDir;
}

function camVectorRight(camRot) {
  let rotInRad = {
    x: camRot.x * (Math.PI / 180),
    y: camRot.y * (Math.PI / 180),
    z: camRot.z * (Math.PI / 180),
  };

  var camDir = {
    x: Math.cos(rotInRad.z),
    y: Math.sin(rotInRad.z),
    z: Math.sin(rotInRad.x),
  };

  return camDir;
}

function isVectorEqual(vector1, vector2) {
  return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}

alt.onServer("noclip:start", start);
function start() {
  if (NoClip.enabled) return;
  NoClip.start();
}

alt.onServer("noclip:stop", stop);
function stop() {
  if (!NoClip.enabled) return;
  NoClip.stop();
}

//end LeonMr&&&&& Noclip System


let blipsMap = new Map();
let blipsActive = false;

let interval;
let textMap = new Map();
let textActive = false;

alt.on("gameEntityCreate", (entity) => {
  if (!(entity instanceof alt.Player) && !(entity instanceof alt.Vehicle)) return;
  if (blipsActive) createBlip(entity);
  if (textActive) createText(entity);

});
alt.on("gameEntityDestroy", (entity) => {
  if (!(entity instanceof alt.Player) && !(entity instanceof alt.Vehicle)) return;
  if (blipsActive) destroyBlip(entity);
  if (textActive) destroyText(entity);
});

function createBlip(entity) {
  if (!entity.valid || !entity.scriptID) return;
  if (entity === alt.Player.local) return;
  let blip = native.addBlipForEntity(entity.scriptID);
  if (entity instanceof alt.Player) {
    native.setBlipSprite(blip,1);
    native.setBlipScale(blip, 0.9);
    native.setBlipColour(blip, 4);
    native.beginTextCommandSetBlipName("STRING");
    native.addTextComponentSubstringPlayerName(entity.name);
  }
  else if (entity instanceof alt.Vehicle) {
    if (native.isThisModelAJetski(entity.model)) native.setBlipSprite(blip,471);
    else if (native.isThisModelABoat(entity.model)) native.setBlipSprite(blip,426);
    else if (native.isThisModelAHeli(entity.model)) native.setBlipSprite(blip,64);
    else if (native.isThisModelABicycle(entity.model)) native.setBlipSprite(blip,494);
    else if (native.isThisModelABike(entity.model)) native.setBlipSprite(blip,226);
    else if (native.isThisModelACar(entity.model)) native.setBlipSprite(blip,523);
    else if (native.isThisModelAQuadbike(entity.model)) native.setBlipSprite(blip,512);
    else if (native.isThisModelAPlane(entity.model)) native.setBlipSprite(blip,251);
    else native.setBlipSprite(blip,523);

    native.setBlipScale(blip, 0.9);
    native.setBlipColour(blip, 4);
    native.beginTextCommandSetBlipName("STRING");
    native.addTextComponentSubstringPlayerName(`${entity.id}`);
  }
  native.endTextCommandSetBlipName(blip);
  native.setBlipAsShortRange(blip, true);
  blipsMap.set(entity, blip);
}

function destroyBlip(entity) {
  if (entity === alt.Player.local) return;
  native.removeBlip(blipsMap.get(entity));
  blipsMap.delete(entity);
}

alt.onServer("admin:Client:adminBlips", () => {
  if (blipsActive) {
    blipsMap.forEach(native.removeBlip);
    blipsMap = new Map();
    return blipsActive = false;
  }
  blipsActive = true;
  alt.Player.streamedIn.forEach(createBlip);
  alt.Vehicle.streamedIn.forEach(createBlip);
});

alt.onServer('admin:Client:playerText', () => {
  if (textActive) {
    alt.clearInterval(interval);
    interval = undefined;
    textMap = new Map();
    return textActive = false;
  }
  textActive = true;
  alt.Player.streamedIn.forEach(createText);
  interval = alt.setInterval(() => {
    textMap.forEach((k, i) => {
      drawText3d(`${i.name} \n ID: ${i.id} \n ${i.getSyncedMeta('Name')}`, i.pos.x, i.pos.y, i.pos.z + 1.1, 0.29, 4, 255, 255, 255, 255);
    });
  }, 0);
});

function createText(entity) {
  if (entity === alt.Player.local) return;
  if (!entity.valid || !entity.scriptID || entity instanceof alt.Vehicle) return;
  let pos = new alt.Vector3(entity.pos.x, entity.pos.y, entity.pos.z + 1.1);
  drawText3d(`${entity.name} \n ID: ${entity.id} \n ${entity.getSyncedMeta('Name')}`, pos.x, pos.y, pos.z, 0.29, 4, 255, 255, 255, 255);
  textMap.set(entity, true);
}

function destroyText(entity) {
  if (entity === alt.Player.local) return;
  if (!entity.valid || !entity.scriptID || entity instanceof alt.Vehicle) return;
  textMap.delete(entity);
}