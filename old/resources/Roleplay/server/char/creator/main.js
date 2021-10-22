import alt from "alt-server";
import * as sm from "simplymongo";
import {insertThinks} from "../charselect.js";
import {dimensionHandler} from "../../system/export.js";

const db = sm.getDatabase();

alt.on("creator:Edit", (player, oldData = null) => {
  if (!player || !player.valid) return;

  //O Female ; 1 Male
  if (player.character.geschlecht === "Weiblich") {
    alt.emitClient(player, "creator:Edit", oldData, 0);
  } else alt.emitClient(player, "creator:Edit", oldData, 1);
  player.visible = true;
});

alt.onClient(`creator:AwaitModel`, (player, characterSex) => {
  alt.emitClient(player, `creator:FinishSync`);
});

alt.on("creator:Sync", (player, data) => {
  if (!player || !player.valid) return;
  alt.emitClient(player, "creator:Sync", data);
});

alt.onClient("creator:Server:Done", async (player, newData) => {
  alt.setTimeout(() => {
    player.pos = { ...player.pos };
  }, 2500);
  alt.emitClient(player, "creator:fade");
  db.updatePartialData(player.character._id, { skin: newData }, "characters");
  player.character.skin = newData;

  alt.setTimeout(() => {
    player.pos = new alt.Vector3(-1037, -2737, 20.16);
    dimensionHandler(player, 1);
    player.character.joined = 1;
    alt.emit("SaltyChat:EnablePlayer", player);
    alt.emit("SaltyChat:SetPlayerAlive", player, true);
  }, 6000);
});

alt.onClient("creator:Hair", (player, hair) => {
  player.setClothes(2, hair,0,0);
})
