import * as alt from "alt-client";
import * as native from "natives";

let view;
let camera;

alt.on("char:view:charSelect", (number) => {
  view = number;
  viewStart();
});

alt.onServer("character:Client:start", (array, two) => {
  view.emit("character:View:start", array, two);
  //view.isVisible = false;
});

alt.onServer('character:Client:Visible', () => {
  view.isVisible = true;
});

alt.onServer("character:Client:newCharacter", () => {
  view.emit("character:View:newCharacter");
});

alt.onServer('character:Client:Camera', (pos) => {
  let startPosition = pos;
  if (!camera) {
    const forwardVector = native.getEntityForwardVector(alt.Player.local.scriptID);
    const forwardCameraPosition = {
      x: startPosition.x + forwardVector.x * 1.5,
      y: startPosition.y + forwardVector.y * 1.5,
      z: startPosition.z + 0.5,
    };

    let fov = 90;

    camera = native.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", forwardCameraPosition.x, forwardCameraPosition.y, forwardCameraPosition.z, 0, 0, 0, fov, true, 0);

    native.pointCamAtCoord(camera, startPosition.x, startPosition.y, startPosition.z);
    native.setCamActive(camera, true);
    native.renderScriptCams(true, false, 1000, true, false, 0);
    alt.setTimeout(() => {alt.emit('auth:camDestroy');}, 1000);
    alt.emitServer('character:Server:loadPlayer', 0)
  } else native.destroyCam(camera,false);

});

alt.onServer('character:Client:go', () => {
  let ped = native.clonePed(alt.Player.local.scriptID, 0, false, false);
  native.taskGoStraightToCoord(ped, -774.09228515625, 340.4175720214844, 160.000732421875, 1, 15000, 1, 1);
  native.pointCamAtCoord(camera, -774.09228515625, 340.4175720214844, 160.000732421875);
  alt.setTimeout(() => {native.deletePed(ped)}, 11100);
});

function viewStart() {
  view.on("character:Client:inCharacter", (index) => {
    alt.emitServer("character:Server:inCharacter", index);
  });

  view.on("character:Client:inNewCharacter", () => {
    alt.emitServer("character:Server:inNewCharacter");
  });

  view.on('character:Client:loadPlayer', i => {
    alt.emitServer('character:Server:loadPlayer', i)
  })
}

let inter;
alt.onServer("charSelect:Client:isFlying", () => {
  if (inter) return;
  if (native.isEntityInAir(alt.Player.local.scriptID)) {
    alt.setTimeout(() => {
      alt.clearInterval(inter);
      inter = true;
    }, 30000);

    inter = alt.setInterval(() => {
      if (alt.Player.local.health === 0) {
        alt.clearInterval(inter);
        alt.emitServer("charSelect:Server:REVIVE");
        inter = true;
      }
    }, 1);
  }
});
