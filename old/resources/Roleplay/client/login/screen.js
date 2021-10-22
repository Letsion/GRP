import alt from "alt-client";
import native from "natives";

alt.onServer("login:screen", (state) => {
  if (!state) {
      native.freezeEntityPosition(alt.Player.local.scriptID, false);
      alt.toggleGameControls(true);
      native.destroyAllCams(false);
      native.renderScriptCams(false, false, 0, true, true, 0);
      native.displayRadar(false);
      native.doScreenFadeIn(1000);
  } else {
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    native.doScreenFadeOut(1000);
  }
});
