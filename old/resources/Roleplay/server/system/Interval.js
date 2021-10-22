import * as alt from "alt-server";
import * as sm from "simplymongo";
import * as chat from "../chat/index.js";

const db = sm.getDatabase();
let weather = 1;
let blackout;
alt.on('system:Weather:set', (number) => {
  weather = number;
  alt.Player.all.forEach(i => {
    if (!i || !i.valid) return;
    i.setWeather(weather);
  });
});

alt.on('playerConnect', player => {
  player.setWeather(weather);
  alt.emitClient(player, 'blackout', blackout);
});

chat.registerCmd('blackout', (player) => {
  if (player.account.project !== 1) return;
 if (blackout) {
   alt.emitAllClients('blackout', false);
   blackout = false;
 } else {
   alt.emitAllClients('blackout', true);
   blackout = true;
 }
});

alt.setInterval(() => {
  alt.Player.all.forEach((i) => {
    if (!i.valid) return;
    if (!i.account) return;
      i.account.onCount = 0;
  });
}, 1000);

// Time Sync
alt.setInterval(() => {
  if (alt.Player.all.length !== 0) {
    alt.Player.all.forEach((i) => {
      //i.setDateTime(1,1,2014,12,0,0);
      i.setDateTime(new Date().getDate(), new Date().getMonth(), new Date().getFullYear(), new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
    });
  }
}, 3000); // Sync Time all 3 Seconds

alt.setInterval(() => {
  if (alt.Player.all.length === 0) return;
  alt.Player.all.forEach(async (i) => {
    if (!i || !i.character || !i.valid || !i.character.joined) return;
    if (i.character.joined === 1) {
      i.character = {...i.character, health: i.health, armour: i.armour, pos: {...i.pos}, dimension: i.dimension};
      await db.updatePartialData(i.character._id, {...i.character}, "characters");
    }
  });
}, 10000); // Sync Data all 10 Seconds

alt.setInterval(() => {
  if (alt.Player.all.length === 0) return;
  alt.Player.all.forEach(async (i) => {
    if (!i ||!i.valid || !i.account || !i.character || !i.character.joined) return;
    i.setWeather(weather);
    await db.updatePartialData(i.account._id, {...i.account}, 'accounts');
  });
}, 150000);


//server Started

async function start() {
  let support = await db.fetchAllData('support');
  support.forEach(async i => {
    if (i.open === true) return;
    await db.deleteById(i._id, 'support');
    console.log(`Ticket vom Spieler: ${i.player} gelöscht`);
  });
}

start();
