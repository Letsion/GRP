import * as alt from "alt-client";
import * as native from "natives";

let cheat = 0;
let freeze;

alt.onServer("anticheat:value", (number) => {
  cheat = number;
});

alt.setInterval(() => {
  //Godmode
  if (native.networkIsLocalPlayerInvincible() && cheat === 0) {
    alt.emitServer("antiCheat:Invincible");
    cheat = 1;
  } //Godmode
  if (native.getPlayerInvincible(alt.Player.local.scriptID) && cheat === 0) {
    alt.emitServer("antiCheat:Invincible");
    cheat = 1;
  }
}, 500);

alt.onServer("antiCheat:Client:freezePlayer", () => {
  if (freeze) {
    native.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.toggleGameControls(true);
    freeze = false;
  } else {
    native.freezeEntityPosition(alt.Player.local.scriptID, true);
    alt.toggleGameControls(false);
    freeze = true;
  }
});
