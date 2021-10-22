import * as alt from "alt-client";
import * as native from "natives";
import { createPedEditCamera, destroyPedEditCamera, setFov, setZPos } from "./camera.js";

const url = `http://resource/client/char/creator/html/index.html`;
let view;
let oldData = {};
let prevData = {};
let tempData = {};
let readyInterval;

//handleEdit
alt.onServer("creator:Edit", (_oldData, se) => {
  oldData = _oldData;
  if (!oldData) {
    oldData = {
      colorOverlays: [
        {
          color1: 0,
          opacity: 0,
          color2: 0,
          id: 4,
          value: 0,
        },
        {
          color1: 0,
          id: 5,
          opacity: 0,
          value: 0,
        },
        {
          color1: 0,
          id: 8,
          opacity: 0,
          value: 0,
        },
      ],
      eyebrows: 0,
      eyes: 0,
      eyebrowsColor1: 0,
      eyebrowsOpacity: 1,
      faceMix: 0.5,
      facialHairOpacity: 0,
      faceFather: 11,
      faceMother: 45,
      facialHair: 29,
      facialHairColor1: 0,
      hair: 4,
      hairColor1: 5,
      hairColor2: 2,
      hairOverlay: {
        collection: "multiplayer_overlays",
        overlay: "NG_F_Hair_004",
      },
      opacityOverlays: [
        {
          id: 0,
          opacity: 0,
          value: 0,
        },
        {
          id: 3,
          opacity: 0,
          value: 0,
        },
        {
          id: 6,
          opacity: 0,
          value: 0,
        },
        {
          id: 7,
          opacity: 0,
          value: 0,
        },
        {
          id: 9,
          opacity: 0,
          value: 0,
        },
        {
          id: 11,
          opacity: 0,
          value: 0,
        },
      ],
      sex: se,
      skinFather: 40,
      skinMix: 0.5,
      skinMother: 45,
      structure: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    };
  } else {
    if (!oldData.sex || _oldData.sex !== se) {
      oldData = { ...oldData, sex: se };
    } else {
      oldData.sex = se;
    }
  }
  native.setEntityHeading(alt.Player.local.scriptID, 180);
  if (!view) {
    alt.toggleGameControls(true);
    view = new alt.WebView(url);
    view.on("creator:ReadyDone", handleReadyDone);
    view.on("creator:Done", handleDone);
    view.on("creator:Cancel", handleCancel);
    view.on("creator:Sync", handleSync);
  }
  view.focus();
  showCursor(true);
  createPedEditCamera();
  setFov(50);
  setZPos(0.6);
  view.on("load", () => {
    view.emit("creator:SetData", JSON.stringify(oldData));
  });

  readyInterval = alt.setInterval(waitForReady, 100);
});

function closeView() {
  if (view && view.destroy) {
    view.destroy();
  }

  oldData = null;
  view = null;
  showCursor(false);
  native.freezeEntityPosition(alt.Player.local.scriptID, false);
  destroyPedEditCamera();
}

function handleDone(newData) {
  alt.emitServer("creator:Server:Done", newData);
  closeView();
}

function handleCancel() {
  alt.emitServer("creator:Server:Done", oldData);
  closeView();
}

function waitForReady() {
  if (!view) {
    return;
  }

  view.emit("creator:Ready");
}

function handleReadyDone() {
  if (readyInterval) {
    alt.clearInterval(readyInterval);
    readyInterval = null;
  }
}

function showCursor(state) {
  try {
    alt.showCursor(state);
  } catch (err) {}
}

//finish Sync
alt.onServer(`creator:FinishSync`, handleFinishSync);
function handleFinishSync() {
  native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
  native.setPedHeadBlendData(alt.Player.local.scriptID, tempData.faceFather, tempData.faceMother, 0, tempData.skinFather, tempData.skinMother, 0, parseFloat(tempData.faceMix), parseFloat(tempData.skinMix), 0, false);

  // Facial Features
  for (let i = 0; i < tempData.structure.length; i++) {
    const value = tempData.structure[i];
    native.setPedFaceFeature(alt.Player.local.scriptID, i, value);
  }

  // Overlay Features - NO COLORS
  for (let i = 0; i < tempData.opacityOverlays.length; i++) {
    const overlay = tempData.opacityOverlays[i];
    native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity));
  }

  // Hair
  const collection = native.getHashKey(tempData.hairOverlay.collection);
  const overlay = native.getHashKey(tempData.hairOverlay.overlay);
  native.addPedDecorationFromHashes(alt.Player.local.scriptID, collection, overlay);
  alt.emitServer("creator:Hair", tempData.hair);
  native.setPedHairColor(alt.Player.local.scriptID, tempData.hairColor1, tempData.hairColor2);

  // Facial Hair
  native.setPedHeadOverlay(alt.Player.local.scriptID, 1, tempData.facialHair, tempData.facialHairOpacity);
  native.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, tempData.facialHairColor1, tempData.facialHairColor1);

  // Eyebrows
  native.setPedHeadOverlay(alt.Player.local.scriptID, 2, tempData.eyebrows, 1);
  native.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, tempData.eyebrowsColor1, tempData.eyebrowsColor1);

  // Decor
  for (let i = 0; i < tempData.colorOverlays.length; i++) {
    const overlay = tempData.colorOverlays[i];
    const color2 = overlay.color2 ? overlay.color2 : overlay.color1;
    native.setPedHeadOverlay(alt.Player.local.scriptID, overlay.id, overlay.value, parseFloat(overlay.opacity));
    native.setPedHeadOverlayColor(alt.Player.local.scriptID, overlay.id, 1, overlay.color1, color2);
  }

  // Eyes
  native.setPedEyeColor(alt.Player.local.scriptID, tempData.eyes);
  prevData = tempData;
}

//handleSync
alt.onServer("creator:Sync", handleSync);
async function handleSync(data) {
  if (typeof data === "string") {
    tempData = JSON.parse(data);
  } else tempData = data;
  native.clearPedBloodDamage(alt.Player.local.scriptID);
  native.clearPedDecorations(alt.Player.local.scriptID);
  native.setPedHeadBlendData(alt.Player.local.scriptID, 0, 0, 0, 0, 0, 0, 0, 0, 0, false);
  handleFinishSync();
}

