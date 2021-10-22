import * as alt from "alt-server";
import * as sm from "simplymongo";
import {insertThinks} from "./charselect.js";

const db = sm.getDatabase();

alt.onClient("character:Server:setNewCharacter", async (player, character) => {
  if (player.account.two !== 1) return player.kick("Ein Fehler ist aufgetreten. \n Fehler: Charakter Erstellung\n Bitte wende dich in den Support");
  const char = await db.insertData(character, "characters", true);
  player.account.characters.push(`${char.vorname} ${char.nachname}`);
  player.character = {...char, joined: 0};
  player.anticheat = {revive: 0};

  //functions
  await insertThinks(player);
  await db.updatePartialData(player.account._id, { two: 0 }, "accounts");
  //syncedMeta
  player.setSyncedMeta('Sex', `${player.character.geschlecht}`);
  player.setSyncedMeta('Name', `${player.character.vorname} ${player.character.nachname}`);

  //emits
  player.emit("creator:fade");
  player.emit('inventory:Client:name');
  player.emit("notification", 1, "Dein Character wurde erfolgreich erstellt", 5000);
  player.emit("auth:Client:stop");

  if (player.account.adminLevel >= 1 || player.account.project === 1) alt.emit("admin:Server:start", player);

  alt.setTimeout(() => {
    if (player.character.geschlecht === "Weiblich") player.model = "mp_f_freemode_01";
    else player.model = "mp_m_freemode_01";
    player.visible = true;
    player.pos = new alt.Vector3(402.83, -996.92, -99.01);
  }, 5000);
  alt.setTimeout(() => {
    alt.emit("creator:Edit", player);
    alt.emit('clothes:sync', player);
  }, 6000);
});
