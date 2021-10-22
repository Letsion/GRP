import * as alt from 'alt-server';
import SQL from "../database/database.js";
import {logAction} from "../system/export.js";
import * as sm from "simplymongo";
import * as worker from 'worker_threads';

const MySQL = new SQL();
const db = sm.getDatabase();

alt.onClient('settings:Server:loading', (player) => {
    alt.emitClient(player, 'settings:Client:load', player.account);
});

alt.onClient('settings:Server:saveSettings', async (player, username, email) => {
    let oldUsername = player.account.username;
    let oldEmail = player.account.email;

    if (oldEmail === email && oldUsername === username) return;
    if (player.account.username !== username) {
        let accounts = await db.fetchAllByField('username', username, 'accounts');
        if (accounts.length !== 0) return alt.emitClient(player, 'notification',3 ,'der Username ist bereits vergeben!', 10000);

        let res = await MySQL.fetchAllByFieldAsync('username', username, 'wcf1_user')
        if (res.length !== 0) return alt.emitClient(player, 'notification','der Username ist bereits vergeben!');
        await MySQL.updatePartialDataAsync(res.id, {username: player.account.username, oldUsername: oldUsername});
    }
    if (player.account.email !== email) {
        let accounts = await db.fetchAllByField('email', email, 'accounts');
        if (accounts.length !== 0) return alt.emitClient(player, 'notification', 3, 'die Email ist bereits vergeben!', 10000);

        let res = await MySQL.fetchAllByFieldAsync('email', email, 'wcf1_user');
        if (res.length !== 0) return alt.emitClient(player, 'notification',3, 'die Email ist bereits vergeben!', 10000);
        await MySQL.updatePartialDataAsync(res.id, {email: player.account.email, newEmail: player.account.email});
    }
    player.account.email = email;
    player.account.username = username;
    await updateUsername(player, oldUsername);

    let res = await MySQL.fetchDataAsync('username', oldUsername, 'wcf1_user')
    if (!res) return logAction(player, `[Setting.mjs] ein Fehler ist beim Fetchen des Spielers **${oldUsername}** von der MySQL ist auf getreten`, 'Ein Fehler ist aufgetreten. Bitte wende dich an den Support', 'Error', '#ff0013');

    logAction(player, `[Setting.mjs] Spieler **${player.account.username}** hat seine Email von **${oldEmail}** zur Email **${player.account.email}** und sein Username von **${oldUsername}** zum Username **${player.account.username}** umgeändert`, 'Dein Username und Email wurde aktualisiert', 'Einstellung', '#a600ff');
});

alt.onClient('settings:Server:savePassword', async (player, oldPassword, password, rerunPassword) => {
    if (password !== rerunPassword) return alt.emitClient(player, "notification", 4, "Die neuen Passwörter sind nicht gleich!", 10000);
    if (oldPassword === password) return alt.emitClient(player, "notification", 4, "Das alte Passwort und das neue sind identisch zueinander!", 10000);

    let verifyPassword = new worker.Worker('./resources/Roleplay/server/system/worker/verifyPassword.js', {
        workerData: {password: oldPassword, storedPassword: player.account.password}
    });
    verifyPassword.on('message', async (messages) => {
        verifyPassword.terminate();
        let bool = JSON.parse(messages);
        if (!bool) return alt.emitClient(player, "notification", 4, "Dein altes Passwort ist falsch", 10000);
        let encrypt = new worker.Worker('./resources/Roleplay/server/system/worker/encryptPassword.js', {workerData: {password: password}});
        encrypt.on('message', async (messages) => {
            encrypt.terminate();
            player.account.password = messages;
            logAction(player, `Spieler: ${player.account.username} hat sein Passwort geändert`, 'Du hast dein Passwort geändert', 'Einstellung', '#a600ff');
        });
    });
});

alt.onClient('settings:Client:keysSafe', async (player, keys) => {
    alt.emitClient(player, 'notification', 1, 'Deine Keys wurden erfolgreich abgespeichert!', 10000);
    let id = await db.fetchData('username', player.account.username, 'keys');
    if (!id) return;
   player.temp.keys = {...keys};
   await db.updatePartialData(id._id, {...keys, _id: id._id}, 'keys');
});


async function updateUsername(player, oldUsername) {
    let key = await db.fetchData('username', oldUsername, 'keys');
    let support = await db.fetchAllByField('player', oldUsername, 'support');
    if (key && key.length !== 0) {
        await db.updatePartialData(key._id,  {username: player.account.username} ,'keys');
    }
    if (support && support.length !== 0) {
        support.forEach( i => {
            db.updatePartialData(i._id, {player: player.account.username}, 'support');
        });
    }
}