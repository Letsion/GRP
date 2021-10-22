import * as alt from "alt-client";
import * as native from "natives";
import { Blips } from "./config.js";

const view = new alt.WebView("http://resource/client/stateFaction/LSMD/html/index.html");

alt.on("connectionComplete", () => {
  if (native.isScreenFadedOut()) native.doScreenFadeIn(10);

  else if (native.isScreenFadingOut()) native.doScreenFadeIn(10);

  native.animpostfxStopAll();
});

alt.onServer("medic:Client:screen", (fade, timeoutOne, timeoutTwo) => {
  native.doScreenFadeOut(fade);
  alt.toggleGameControls(false);
  alt.setTimeout(() => {
    native.setPlayerInvincible(alt.Player.local.scriptID, true);
    native.doScreenFadeIn(fade);
  }, timeoutOne);
  alt.setTimeout(() => {
    native.animpostfxPlay("DeathFailOut", 0, true);
  }, timeoutTwo);
});

alt.onServer("medic:Client:deadState", (bool) => {
  if (bool) {
    alt.toggleGameControls(false);
    view.emit("LSMD:View:name", "Du bist bewusstlos", true);
  } else {
    alt.toggleGameControls(false);
    view.emit("LSMD:View:name", "Du liegst im Koma", false);
  }
});

alt.onServer("medic:Client:dead", () => {
  view.focus();
  native.setPlayerInvincible(alt.Player.local.scriptID, true);
  if (native.isEntityInAir(alt.Player.local.scriptID)) {
    let inter = alt.setInterval(() => {
      if (native.isEntityInAir(alt.Player.local.scriptID)) return;

      if (native.hasAnimDictLoaded("misslamar1dead_body")) {
        alt.clearInterval(inter);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.taskPlayAnim(alt.Player.local.scriptID, "misslamar1dead_body", "dead_idle", 8, 1, -1, 5, 0, true, true, false);
        let height = native.getEntityHeightAboveGround(alt.Player.local.scriptID);
        if (height < 0) {
          alt.emitClient('medic:Client:heightGround', height);
        }
      } else {
        native.requestAnimDict("misslamar1dead_body");
      }
    }, 500);
  } else {
    let int = alt.setInterval(() => {
      if (native.hasAnimDictLoaded("misslamar1dead_body")) {
        alt.clearInterval(int);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        native.taskPlayAnim(alt.Player.local.scriptID, "misslamar1dead_body", "dead_idle", 8, 1, -1, 5, 0, true, true, false);
      } else {
        native.requestAnimDict("misslamar1dead_body");
      }
    }, 500);
  }
});

alt.onServer("medic:Client:revive", () => {
  native.setPlayerInvincible(alt.Player.local.scriptID, false);
  native.animpostfxStopAll();
  native.stopAnimTask(alt.Player.local.scriptID, "misslamar1dead_body", "dead_idle", 0);
  alt.toggleGameControls(true);
  native.freezeEntityPosition(alt.Player.local.scriptID, false);
  if (view) {
    view.unfocus();
    view.emit("LSMD:View:name", null);
  }
});

alt.onServer("medic:Client:fadeOut", (fade) => {
  native.doScreenFadeOut(fade);
});

alt.onServer("medic:Client:fadeIn", (fade) => {
  native.doScreenFadeIn(fade);
});

alt.on("connectionComplete", () => {
  Blips.forEach((i) => {
    //ID 61
    const blip = new alt.PointBlip(i.coords.x, i.coords.y, i.coords.z);
    blip.sprite = 61;
    blip.scale = 0.9;
    blip.color = 1;
    blip.shortRange = true;
    blip.name = i.name;
  });
});
