import * as alt from "alt-client";
import * as native from "natives";

const view = new alt.WebView("http:/resource/client/vehicle/html/index.html");
let interval;
let displayOpen = false;
let everyTick;

alt.on('enteredVehicle', () => {
  native.displayRadar(true);
  /*everyTick = alt.setInterval(() => {
    alt.beginScaleformMovieMethodMinimap("SETUP_HEALTH_ARMOUR");
    native.scaleformMovieMethodAddParamInt(3);
    native.endScaleformMovieMethod();
  },0);

   */

  if (!displayOpen) {
    displayOpen = true;
    start();
  }
});

alt.on('leftVehicle', () => {
  alt.clearInterval(interval);
  alt.clearInterval(everyTick);
  native.displayRadar(false);
  view.emit("speedometer:isOpen", false);
  view.unfocus();
  displayOpen = false;
});

function start () {
  view.emit("speedometer:kmh", JSON.stringify(0));
  view.emit("speedometer:isOpen", true);
  view.unfocus();
  interval = alt.setInterval(() => {
    if (alt.Player.local.vehicle) {
      view.emit("speedometer:kmh", parseInt(native.getEntitySpeed(alt.Player.local.vehicle.scriptID) * 3.6));
      view.emit("speedometer:engine", native.getIsVehicleEngineRunning(alt.Player.local.vehicle.scriptID));
      view.emit("speedometer:lock", native.getVehicleDoorLockStatus(alt.Player.local.vehicle.scriptID) === 2);
    }
  }, 100);
}
