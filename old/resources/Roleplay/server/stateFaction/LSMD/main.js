import * as alt from "alt-server";
import { CauseOfDeath } from "./config.js";
import {deadHandle, dimensionHandler, nearRevivePoints} from "../../system/export.js";

alt.on("playerDeath", (player, killer, weapon) => {
  player.character.dead.deadState = 1;
  player.character.dead.deadTime = 720000;
  if (player.vehicle) player.pos = { ...player.pos };

  if (player.character.dead.deadTimeout !== -1) alt.clearTimeout(player.character.dead.deadTimeout);
  if (player.character.dead.intervall !== -1) alt.clearInterval(player.character.dead.intervall);

  let random = Math.random() * 11;
  let death = CauseOfDeath[weapon];
  if (death === "Antique Cavalry Dagger" || death === "Bottle" || death === "Knife" || death === "Machete" || death === "Switchblade") {
    player.character.dead.deadTime = 600000; //10min
    player.character.dead.deadType = "Stichverletzung";
  } else if (death === ' Fist Ignore') {
    player.character.dead.deadTime = 900000; // 15 min
    player.character.dead.deadType = "Prellung";
  } else if (death === "Hatchet" || death === "Battle Axe" || death === "Stone Hatchet") {
    player.character.dead.deadTime = 300000;//5min
    player.character.dead.deadType = "Fleischwunde";
  } else if (death === "Baseball Bat" || death === "Golf Club" || death === "Flashlight" || death === "Crowbar" || death === "Nightstick" || death === "Pipe Wrench" || death === "Knuckle" || death === "Hammer" || death === "Pool Cue") {
    player.character.dead.deadTime = 900000;// 12min.
    player.character.dead.deadType = "Fraktur";
  } else if (death === "Pistol" || death === "Pistol MK2" || death === "Combat Pistol" || death === "AP Pistol" || death === "Pistol .50" || death === "SNS Pistol" || death === "SNS Pistol MK2" || death === "Heavy Pistol" || death === "Vintage Pistol" || death === "Marksman Pistol" || death === "Heavy Revolver" || death === "Heavy Revolver MK2" || death === "Double Action") {
    if (random <= 5) {
      player.character.dead.deadTime = 300000; // 5 min.
      player.character.dead.deadType = "Steckschuss";
    } else {
      player.character.dead.deadTime = 600000; // 10 min.
      player.character.dead.deadType = "Durchschuss";
    }
  } else if (death === "Micro SMG" || death === "SMG" || death === "SMG MK2" || death === "Assault SMG" || death === "Combat PDW" || death === "Machine Pistol" || death === "Mini SMG" || death === "Assault Rifle" || death === "Assault Rifle MK2" || death === "Carbine Rifle" || death === "Carbine Rifle MK2" || death === "Advanced Rifle" || death === "Special Carbine" || death === "Special Carbine MK2" || death === "Bullpup Rifle" || death === "Bullpup Rifle MK2" || death === "Compact Rifle" || death === "MG" || death === "Combat MG" || death === "Combat MG MK2" || death === "Gusenberg Sweeper") {
    if (random <= 5) {
      player.character.dead.deadTime = 300000; //5min
      player.character.dead.deadType = "Steckschuss";
    } else {
      player.character.dead.deadTime = 600000; // 10min.
      player.character.dead.deadType = "Durchschuss";
    }
  } else if (death === "Pump Shotgun" || death === "Pump Shotgun MK2" || death === "Sawed-Off Shotgun" || death === "Assault Shotgun" || death === "Bullpup Shotgun" || death === "Heavy Shotgun" || death === "Double Barrel Shotgun" || death === "Sweeper Shotgun") {
    if (random <= 5) {
      player.character.dead.deadTime = 250000; //4,16min.
      player.character.dead.deadType = "Ballistisches Trauma";
    } else {
      player.character.dead.deadTime = 550000; //9,16min
      player.character.dead.deadType = "Schrapnellen-Steckschuss";
    }
  } else if (death === "Musket" || death === "Sniper Rifle" || death === "Heavy Sniper" || death === "Heavy Sniper MK2" || death === "Marksman Rifle" || death === "Marksman Rifle MK2") {
    if (random <= 5) {
      player.character.dead.deadTime = 300000; // 5 min.
      player.character.dead.deadType = "Steckschuss";
    } else {
      player.character.dead.deadTime = 600000; // 10min
      player.character.dead.deadType = "Durchschuss";
    }
  } else if (death === "Unholy Hellbringer" || death === "Up-n-Atomizer" || death === "RPG" || death === "Grenade Launcher" || death === "Smoke Grenade Launcher" || death === "Minigun" || death === "Firework Launcher" || death === "Railgun" || death === "Homing Launcher" || death === "Compact Grenade Launcher" || death === "Ray Minigun" || death === "Grenade" || death === "BZ Gas" || death === "Smoke Grenade" || death === "Flare" || death === "Molotov" || death === "Sticky Bomb" || death === "Proximity Mine" || death === "Pipe Bomb" || death === "Baseball" || death === "Jerry Can" || death === "Fire Extinguisher Ignore") {
    player.character.dead.deadTime = 30000; // 30sek.
    player.character.dead.deadType = "Admin-Tot";
  } else if (death === "Vehicle Heli Crash Ignore" || death === "Vehicle Rocket Ignore" || death === "Vehicle Oppressor2 Missile Ignore" || death === "Vehicle Plane Rocket Ignore" || death === "Vehicle Space Rocket Ignore" || death === "Vehicle Tank Ignore" || death === "Vehicle Akula Missile Ignore" || death === "Vehicle Akula Barrage Ignore" || death === "Vehicle APC Missile Ignore" || death === "Vehicle Barrage Rear GL Ignore" || death === "Vehicle Cherno Missile Ignore" || death === "Vehicle Deluxo Missile Ignore" || death === "Vehicle Dogfighter Missile Ignore" || death === "Vehicle Dune Grenade Launcher Ignore" || death === "Vehicle Hacker Missile Ignore" || death === "Vehicle Hacker Missile Homing Ignore" || death === "Vehicle Hunter Barrage Ignore" || death === "Vehicle Hunter Missile Ignore" || death === "Vehicle Khanjali Cannon Ignore" || death === "Vehicle Khanjali Cannon Heavy Ignore" || death === "Vehicle Khanjali GL Ignore" || death === "Vehicle Mule4 Missile Ignore" || death === "Vehicle Mule4 Turret GL Ignore" || death === "Vehicle Oppressor Missile Ignore" || death === "Vehicle Player Lazer Ignore" || death === "Vehicle Player Savage Ignore" || death === "Vehicle Pounder2 Barrage Ignore" || death === "Vehicle Pounder2 Missile Ignore" || death === "Vehicle Rogue Missile Ignore" || death === "Vehicle Ruiner Rocket Ignore" || death === "Vehicle Scramjet Missile Ignore" || death === "Vehicle Strikeforce Barrage Ignore" || death === "Vehicle Strikeforce Cannon Ignore" || death === "Vehicle Strikeforce Missile Ignore" || death === "Vehicle Subcar Missile Ignore" || death === "Vehicle Subcar Torpedo Ignore" || death === "Vehicle Tampa Missile Ignore" || death === "Vehicle Tampa Mortar Ignore" || death === "Vehicle Thruster Missile Ignore" || death === "Vehicle Vigilante Missile Ignore") {
    if (random <= 5) {
      player.character.dead.deadTime = 60000; // 1min
      player.character.dead.deadType = "Zerfetzte Organe";
    } else {
      player.character.dead.deadTime = 120000; // 2min
      player.character.dead.deadType = "Verbrennungen 3 Grades";
    }
  } else if (death === "Vehicle Insurgent Minigun Ignore" || death === "Vehicle Nightshark MG Ignore" || death === "Vehicle Oppressor2 Cannon Ignore" || death === "Vehicle Oppressor2 MG Ignore" || death === "Vehicle Player Buzzard Ignore" || death === "Vehicle Turret Valkyrie Ignore" || death === "Vehicle Turret Insurgent Ignore" || death === "Vehicle Akula Minigun Ignore" || death === "Vehicle Akula Turret Dual Ignore" || death === "Vehicle Akula Turret Single Ignore" || death === "Vehicle APC Cannon Ignore" || death === "Vehicle APC MG Ignore" || death === "Vehicle Ardent MG Ignore" || death === "Vehicle Avenger Cannon Ignore" || death === "Vehicle Barrage Rear MG Ignore" || death === "Vehicle Barrage Rear Minigun Ignore" || death === "Vehicle Barrage Top MG Ignore" || death === "Vehicle Barrage Top Minigun Ignore" || death === "Vehicle Bombushka Cannon Ignore" || death === "Vehicle Bombushka Dual MG Ignore" || death === "Vehicle Cannon Blazer Ignore" || death === "Vehicle Caracara MG Ignore" || death === "Vehicle Caracara Minigun Ignore" || death === "Vehicle Comet MG Ignore" || death === "Vehicle Deluxo MG Ignore" || death === "Vehicle Dogfighter MG Ignore" || death === "Vehicle Dune MG Ignore" || death === "Vehicle Dune Minigun Ignore" || death === "Vehicle Enemy Laser Ignore" || death === "Vehicle Halftrack Dual MG Ignore" || death === "Vehicle Halftrack Quad MG Ignore" || death === "Vehicle Havok Minigun Ignore" || death === "Vehicle Hunter Cannon Ignore" || death === "Vehicle Hunter MG Ignore" || death === "Vehicle Khanjali MG Ignore" || death === "Vehicle Menacer MG Ignore" || death === "Vehicle Microlight MG Ignore" || death === "Vehicle Mobileops Cannon Ignore" || death === "Vehicle Mogul Dual Nose Ignore" || death === "Vehicle Mogul Dual Turret Ignore" || death === "Vehicle Mogul Nose Ignore" || death === "Vehicle Mogul Turret Ignore" || death === "Vehicle Mule4 MG Ignore" || death === "Vehicle Nose Turret Valkyrie Ignore" || death === "Vehicle Oppressor MG Ignore" || death === "Vehicle Pounder2 GL Ignore" || death === "Vehicle Pounder2 Mini Ignore" || death === "Vehicle Radar Ignore" || death === "Vehicle Revolter MG Ignore" || death === "Vehicle Rogue Cannon Ignore" || death === "Vehicle Rogue MG Ignore" || death === "Vehicle Ruiner Bullet Ignore" || death === "Vehicle Savestra MG Ignore" || death === "Vehicle Scramjet MG Ignore" || death === "Vehicle Seabreeze MG Ignore" || death === "Vehicle Speedo4 MG Ignore" || death === "Vehicle Speedo4 Turret MG Ignore" || death === "Vehicle Speedo4 Turret Mini Ignore" || death === "Vehicle Subcar MG Ignore" || death === "Vehicle Tampa Dual Minigun Ignore" || death === "Vehicle Tampa Fixed Minigun Ignore" || death === "Vehicle Technical Minigun Ignore" || death === "Vehicle Thruster MG Ignore" || death === "Vehicle Trailer Dualaa Ignore" || death === "Vehicle Trailer Quad MG Ignore" || death === "Vehicle Tula Dual MG Ignore" || death === "Vehicle Tula MG Ignore" || death === "Vehicle Tula Minigun Ignore" || death === "Vehicle Tula Nose MG Ignore" || death === "Vehicle Turret Boxville Ignore" || death === "Vehicle Turret Limo Ignore" || death === "Vehicle Turret Technical Ignore" || death === "Vehicle Vigilante MG Ignore" || death === "Vehicle Viseris MG Ignore" || death === "Vehicle Volatol Dual MG Ignore") {
    if (random <= 5) {
      player.character.dead.deadTime = 120000;
      player.character.dead.deadType = "Steckschuss";
    } else {
      player.character.dead.deadTime = 180000;
      player.character.dead.deadType = "Durchschuss";
    }
  } else if (death === "Vehicle Water Cannon Ignore" || death === "Vehicle Searchlight Ignore") {
    player.character.dead.deadTime = 900000;
    player.character.dead.deadType = "Test";
  } else if (death === "Explosion Ignore") {
    player.character.dead.deadTime = 150000; //2,5 min
    player.character.dead.deadType = "Zerfetzte Organe mit schweren Verbrennungen";
  } else if (death === "Vehicle Death Ignore") {
    if (random <= 5) {
      player.character.dead.deadTime = 360000; // 6 min.
      player.character.dead.deadType = "Kopfverletzung nach Aufprall";
    } else {
      player.character.dead.deadTime = 600000; // 10 min.
      player.character.dead.deadType = "Schwerer Autounfall";
    }
  }
  alt.emit("SaltyChat:SetPlayerAlive", player, false);
  alt.emitClient(player, "medic:Client:screen", 500, 5500, 6000);

  const pos = {...player.pos};
  const dim = player.dimension;
  dimensionHandler(player, 10);
  player.character.joined = 0;
  alt.setTimeout(() => {player.spawn(85.05, 814.16, 216.27, 0);}, 100);

  killConsoleFeed(player, killer, death);
  alt.setTimeout(() => {
    player.pos = pos;
    dimensionHandler(player, dim);
    player.character.joined = 1;
    timeoutStart(player, player.character.dead.deadTime, false);
  }, 2500)

  alt.setTimeout(() => {
    alt.emitClient(player, "medic:Client:dead");
  }, 7500);
});


function killConsoleFeed(player, killer, weapon) {
  if (killer && weapon) {
    console.log(`Spieler: ${player.account.username} wurde von ${killer.name} getötet durch: ${weapon}!`);
    alt.emit("discord:Log", ["#1dfa04", "Spieler wurde getötet!", `Spieler: ${player.account.username} wurde von ${killer.name} getötet durch: ${weapon}!`]);
  }
  if (!killer && weapon) {
    console.log(`Spieler: ${player.account.username} wurde getötet durch: ${weapon}!`);
    alt.emit("discord:Log", ["#1dfa04", "Spieler wurde getötet!", `Spieler: ${player.account.username} wurde getötet durch: ${weapon}!`]);
  }
  if (killer && !weapon) {
    console.log(`Spieler: ${player.account.username} wurde getötet von: ${killer.name}!`);
    alt.emit("discord:Log", ["#1dfa04", "Spieler wurde getötet!", `Spieler: ${player.account.username} wurde getötet von ${killer.name}`]);
  }
  if (!killer && !weapon) {
    console.log(`Spieler: ${player.account.username} wurde getötet!`);
    alt.emit("discord:Log", ["#1dfa04", "Spieler wurde getötet!", `Spieler: ${player.account.username} wurde getötet.`]);
  }
}

function timeoutStart(player, deadTime, bool) {
  player.setSyncedMeta('dead', true);
  if (!bool) {
    alt.emitClient(player, "medic:Client:deadState", true);
    player.character.dead.intervall = alt.setInterval(() => {
      player.character.dead.deadTime -= 1000;
    }, 1000);

    player.character.dead.deadTimeout = alt.setTimeout(() => {
      player.character.dead.deadTime = 300000;
      player.character.dead.inComa = 1;

      alt.emitClient(player, "medic:Client:deadState", false);

      player.character.dead.deadTimeout = alt.setTimeout(() => {
        alt.clearInterval(player.character.dead.intervall);
        deadHandle(player);
        const distance = nearRevivePoints(player);

        ply.anticheat.revive += 1;
        alt.emit("SaltyChat:SetPlayerAlive", player, true);
        ply.deleteSyncedMeta('dead');
        ply.clearBloodDamage();

        alt.emitClient(player, "medic:Client:fadeOut", 2500);
        alt.emitClient(player, "medic:Client:revive");
        alt.emitClient(ply, "anticheat:value", 0);

        alt.setTimeout(() => {
          player.pos = distance.coords;
          alt.emitClient(player, "medic:Client:fadeIn", 2500);
        }, 15000);
      }, 300000);
    }, deadTime);
  } else {
    //new Interval
    player.character.dead.intervall = alt.setInterval(() => {
      player.character.dead.deadTime -= 1000;
    }, 1000);

    player.character.dead.inComa = 1;

    alt.emitClient(player, "medic:Client:deadState", false);

    player.character.dead.deadTimeout = alt.setTimeout(() => {
      alt.clearInterval(player.character.dead.intervall);
      deadHandle(player);

      ply.anticheat.revive += 1;
      alt.emit("SaltyChat:SetPlayerAlive", player, true);
      ply.deleteSyncedMeta('dead');
      ply.clearBloodDamage();
      const distance = nearRevivePoints(player);
      alt.emitClient(player, "medic:Client:fadeOut", 2500);
      alt.emitClient(player, "medic:Client:revive");

      alt.setTimeout(() => {
        player.pos = distance.coords;
        alt.emitClient(player, "medic:Client:fadeIn", 2500);
        alt.emitClient(ply, "anticheat:value", 0);
      }, 15000);
    }, deadTime);
  }
}

export function screenDeadOnStart(player) {
  alt.emitClient(player, "medic:Client:screen", 500, 5500, 6000);
  alt.emitClient(player, "medic:Client:dead");

  if (player.character.dead.inComa === 0) timeoutStart(player, player.character.dead.deadTime);
  else timeoutStart(player, player.character.dead.deadTime, true);
}

alt.onClient('medic:Client:heightGround', (player, height) => {
 player.pos = {x: player.pos.x, y: player.pos.y, z: player.pos.z - height};
})
