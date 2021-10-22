import * as alt from "alt-client";
import * as native from "natives";

alt.onServer("veh:enter", (vehicle) => {
  let cleared = false;
  const interval = alt.setInterval(() => {
    if (!vehicle || !vehicle.valid) return;
    const vehicleScriptId = vehicle.scriptID;
    if (vehicleScriptId) {
      native.setPedIntoVehicle(alt.Player.local.scriptID, vehicleScriptId, -1);
      alt.clearInterval(interval);
      cleared = true;
    }
  }, 10);
  alt.setTimeout(() => {
    if (!cleared) alt.clearInterval(interval);
  }, 5000);
});

alt.onServer('blackout', (bool) => {
  //native.setArtificialLightsState(bool);
})