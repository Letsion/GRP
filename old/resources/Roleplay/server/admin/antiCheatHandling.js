import * as alt from "alt-server";
import * as sm from "simplymongo";
import {ban, logAction} from "../system/export.js";

const db = sm.getDatabase();

alt.onClient("antiCheat:Invincible", async (player) => {
  if (player.account.adminLevel >= 1 || player.account.project === 1 || player.character.dead.deadState === 1) return;
  // Update Ban on Account
  await ban(null, player, 'AntiCheat: GodMode aktiviert', -1);
});

alt.onClient((event, player) => {
  if (player.account.onCount === 20) {
    if (Object.keys(player.character.skin).length === 0) return;
    if (player.account.aduty === true) return;
    player.kick("Server Performance: Du wurdest für Event Spamming gekickt...");
    logAction(null, `Spieler: **${player.account.username}** wurde gekickt wegen Spamming des Events: **${event}**`, null, 'Anticheat Handler', "#ff0000")
    alt.emit('discord:Log', ['#00000', 'Server Performance', `Spieler: **${player.account.username}** wurde gekickt wegen Spamming des Events: **${event}**`]);
  }
  player.account.onCount += 1;
});




