import * as alt from "alt-client";
import * as native from "natives";

alt.onServer("task:enterVehicle", (vehicle) => {
  native.taskEnterVehicle(alt.Player.local.scriptID, vehicle.scriptID, 5000, -1, 2, 1, 0);
});

