import * as alt from "alt-server";
import * as sm from "simplymongo";
import {dimensionHandler, loginHandler, reviveHandle} from "../system/export.js";
import {screenDeadOnStart} from "../stateFaction/LSMD/main.js";
const db = sm.getDatabase();

alt.on("char:select", async (player) => {
    const characters = await db.fetchAllByField("username", player.account.username, "characters");
    player.characters = characters;
    let array = []
    let two = false;

    characters.forEach(i => {
      array.push(`${i.vorname} ${i.nachname}`);
    });
    if (player.account.two === 1) two = true;
    if (characters.length !== 0) player.visible = true;

    //emits
    player.emit('character:Client:start', array, two);
    player.emit('auth:Client:status');
    player.emit('character:Client:Camera', new alt.Vector3(-793.9384765625, 335.5384521484375, 158.5853271484375));
});

alt.onClient("charSelect:Server:newCharacter", (player) => {
    player.emit("charSelect:Client:Close");
    player.emit("charCreator:open");
});

alt.onClient("character:Server:inNewCharacter", (player) => {
    if (player.account.two !== 1) return player.kick("Ein Fehler ist aufgetreten. \n Bitte gehe in den Support!");
    player.emit( "character:Client:newCharacter");
});

alt.onClient("character:Server:inCharacter", async (player, index) => {
  if (Object.keys(player.characters[index].skin).length === 0) {
        player.character = player.characters[index];
        player.pos = new alt.Vector3(402.83, -996.92, -99.01);
        player.anticheat = {revive: 0};

        //emits
        player.emit("notification", 2, "Du hast noch dein Charakter konfiguriert, deshalb bist du im Character Creator", 5000);
        player.emit("creator:fade");
        alt.setTimeout(() => {
          player.pos = new alt.Vector3(402.83, -996.92, -99.01);
        }, 2500);
        alt.setTimeout(() => {
            alt.emit("creator:Edit", player);
            alt.emit('clothes:sync', player);
            player.emit( 'mugshot:stop');
            player.emit("auth:Client:stop");
        }, 6000);
        return;
    }
    player.visible = false;
    let count = 0;

    //emits
    player.emit('character:Client:go')
    player.emit("auth:Client:stop");
    player.emit('mugshot:stop');

    if (!player.characters[index]) return player.kick("Es ist ein Fehler aufgetreten. \n Fehler: Dein Charakter ist nicht bekannt \n Bitte im Support melden");
    await alt.setTimeout(async () => {
        player.character = player.characters[index];
        player.character.joined = 0;

        //functions
        loginHandler(player);
        await login(player);

        player.account.characters.forEach(i => {
            if (i === `${player.character.vorname} ${player.character.nachname}`) {
            count = 1;
            }
        });
        if (count !== 1) {
                player.account.characters.push(`${player.character.vorname} ${player.character.nachname}`);
            }
    }, 10000);
});

alt.onClient("charSelect:Server:REVIVE", (player) => {
      if (player.anticheat.revive > 0) return;
      alt.setTimeout(() => {
          reviveHandle(player, null, false);
          player.emit('notification', 3,'Du wurdest wiederbelebt, da du in der Luft gespawnt bist!', 10000);
      }, 30000);
});

alt.onClient('character:Server:loadPlayer', (player, i) => {
    let character = player.characters[i];

    player.pos = new alt.Vector3(-793.9384765625, 335.5384521484375, 158.5853271484375);
    if (character) {
        player.model = character.geschlecht === "Weiblich" ? "mp_f_freemode_01" : "mp_m_freemode_01";
        //emits
        alt.emit("creator:Sync", player, JSON.stringify(character.skin));
        player.emit('mugshot:stop');
        player.emit('mugshot:start', 'Charakter', `${character.geburtstag}`, `${character.vorname} ${character.nachname}`, `${character.geschlecht}`, i + 1)
    }
})

async function login(player) {
    //function
    await insertThinks(player);
    if (player.character.dimension === 0) dimensionHandler(player, 1);
    else dimensionHandler(player, player.character.dimension);

    //SyncedMeta
    player.setSyncedMeta('Name', `${player.character.vorname} ${player.character.nachname}`);
    player.setSyncedMeta('Sex', `${player.character.geschlecht}`);

    //emits
    player.emit('inventory:Client:name');
    player.emit("notification", 1, `Du bist als ${player.character.vorname} ${player.character.nachname} eingreist`, 7000);
    if (player.account.adminLevel >= 1 || player.account.project === 1) alt.emit("admin:Server:start", player);
    let pos;
    try {
        pos = new alt.Vector3(player.character.pos.x, player.character.pos.y, player.character.pos.z);
    } catch (e) {
        pos = new alt.Vector3(-1037, -2737, 20.16)
    }
    alt.setTimeout(() => {
        //character Skin
        player.model = player.character.geschlecht === "Weiblich" ? "mp_f_freemode_01" : "mp_m_freemode_01";
        alt.emit("creator:Sync", player, JSON.stringify(player.character.skin));

        alt.setTimeout(() => {
        player.visible = true;
        player.anticheat = {revive: 0};

            alt.setTimeout(() => {
                player.character.joined = 1;
                player.pos = pos;

                //Saltychat
                alt.emit("SaltyChat:EnablePlayer", player);
                alt.emit("SaltyChat:SetPlayerAlive", player, true);

                //Player Dead
                if (player.character.dead.deadState === 1) {
                    alt.setTimeout(() => {
                        screenDeadOnStart(player);
                    }, 15000);
                } else {
                    player.health = player.character.health;
                    player.armour = player.character.armour;
                }
            }, 1500);
        }, 2000);
    }, 2000);
    alt.setTimeout(() => {
        player.emit("charSelect:Client:isFlying");
    }, 16100);
}


export async function insertThinks(player) {
    // Keys
    let keys = await db.fetchData('username', player.account.username, 'keys');
    if (!keys || keys.length === 0) {
        let key = {
          username: player.account.username,
          adminKey: [222, 'Ä'],
          chatKey: [84, 'T'],
          funkKey: [18, 'Alt'],
          funkSecondKey: [190, '.'],
          voiceRangeKey: [89, 'Y'],
          megaphoneKey: [188, ','],
          engineKey: [77, 'm'],
          lockKey: [76, 'l'],
          inventoryKey: [73, 'i'],
          multiMenuKey: [88, 'x'],
          beltKey: [75, 'k'],
          interactionKey: [69, 'e'],
        }
        keys = await db.insertData(key, 'keys', true);
    }

    player.emit('settings:Client:keyLoading', keys);

    //inventory
    let inventorys = await db.fetchData('charID', player.character._id, 'inventory')
    if (!inventorys || inventorys.length === 0) {
        let inventory = {
            username: player.account.username,
            charID: player.character._id,
            walletData: [],
            bagData: [],
            clothesData: [],
            weaponData: [],
            clothesLeftData: []
        }
        inventorys = await db.insertData(inventory, 'inventory', true);
    }

    player.emit('inventory:Client:inventoryData', inventorys);
    player.temp = {keys: {...keys}, inventory: {...inventorys}};

}