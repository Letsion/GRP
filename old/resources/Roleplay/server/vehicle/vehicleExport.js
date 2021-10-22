import * as alt from "alt-server";

export function engine(player, vehicle) {
  if (vehicle.engineOn === false) {
    vehicle.engineOn = true;
    alt.emitClient(player, "notification", 1, "Motor gestartet", 5000);
    return;
  }
  vehicle.engineOn = false;
  alt.emitClient(player, "notification", 1, "Motor gestoppt", 5000);
}

export function lockState(player, vehicle) {
  if (vehicle.lockState === 0) {
    vehicle.lockState = 2;
    alt.emitClient(player, "notification", 1, "Fahrzeug abgeschlossen", 5000);
    return;
  }
  vehicle.lockState = 0;
  alt.emitClient(player, "notification", 1, "Fahrzeug aufgeschlossen", 5000);
}
