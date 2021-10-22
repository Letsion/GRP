import * as alt from "alt-server";
import { getNearestVeh } from "../system/export.js";
import { engine, lockState } from "./vehicleExport.js";

alt.on("playerEnteringVehicle", (player, vehicle) => {
  if (vehicle.lockState === 2) {
    let i = 0;
    const interval = alt.setInterval(() => {
      if (i === 20) {
        alt.clearInterval(interval);
        return;
      }
      if (vehicle.lockState === 0) {
        alt.emitClient(player, "task:enterVehicle", vehicle);
        alt.clearInterval(interval);
        return;
      }
      i++;
    }, 200);
  }
});

alt.onClient("vehicle:engine", async (player) => {
  let vehicle;
  if (player.vehicle) vehicle = player.vehicle;
  else vehicle = await getNearestVeh(player.pos, 3);
  if (!vehicle) return;
  engine(player, vehicle);
});

alt.onClient("vehicle:lockState", async (player) => {
  let vehicle;
  if (player.vehicle) vehicle = player.vehicle;
  else vehicle = await getNearestVeh(player.pos, 3);
  if (!vehicle) return;
  lockState(player, vehicle);
});
