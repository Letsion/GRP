import * as alt from 'alt-client';
import * as native from 'natives';
import {getNearestVeh} from "../system/export";
import {pedTeleportInteraction} from "../teleport/main";

let keys = {}, settings, admin, chat, chatOpen, inventory, inventoryOpen, everyTick, belt, beltIntervall;

alt.on('settings:Key:admin', (view) => {
    admin = view;
});
alt.on('settings:Inventory', (view) => {
    inventory = view;
    inventoryOpen = false;
});

alt.on('settings:Client:viewChat', (view) => {
    chat = view;
    chat.on("chatmessage", (text) => {
        alt.emitServer("chatmessage", text);
        enableESC();
        if (text !== undefined && text.length >= 1) alt.emit("messageSent", text);
        chatOpen = false;
        alt.emit("chatClosed");
        if (alt.Player.local.hasSyncedMeta('dead')) alt.toggleGameControls(false);
        else alt.toggleGameControls(true);
        chat.unfocus();
    });
});

alt.on('keydown', async (key) => {
    if (Object.keys(keys).length === 0) return;
    //Voice
    if (key === keys.voiceRangeKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:ToggleRange");
    }
    if (key === keys.funkKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:SetRadioVolume", 1.0);
        alt.emit("SaltyChat:UseRadio", true, true);
    }
    if (key === keys.funkSecondKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:UseRadio", false, true);
    }
    if (key === keys.megaphoneKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:UseMegaphone", true);
    }

    //Utility
    if (key === keys.adminKey[0] && alt.Player.local.hasSyncedMeta("team")) {
        if (alt.gameControlsEnabled()) {
            disableESC();
            admin.emit("admin:View:on", true);
            admin.focus();
            alt.toggleGameControls(false);
            alt.showCursor(true);
        }
    }
    if (key === 120) {
        if (alt.gameControlsEnabled()) {
            if (settings) allViewClose();
            else {
                disableESC();
                settings = new alt.WebView('http://resource/client/settings/html/index.html');
                settings.focus();
                startSettings();
                alt.emitServer('settings:Server:loading');
                settings.on('load', () => {
                    settings.emit('settings:View:loadingKeys', keys);
                })
                alt.showCursor(true);
                alt.toggleGameControls(false);
            }
        }
    }
    if (key === keys.inventoryKey[0]) {
        if (alt.gameControlsEnabled()) {
            disableESC();
            inventory.emit('inventory:View:status', true, undefined);
            inventoryOpen = true;
            alt.showCursor(true);
            alt.toggleGameControls(false);
            inventory.focus();
        } else {
            if (inventoryOpen) {
                allViewClose();
                inventory.emit('inventory:View:status', false, undefined);
                inventoryOpen = false;
                alt.showCursor(false);
                alt.toggleGameControls(true);
                inventory.unfocus();
            }
        }
    }

    //Vehicle
    if (key === keys.engineKey[0] && alt.gameControlsEnabled()) {
        if (alt.Player.local.seat === 1) alt.emitServer("vehicle:engine");
    }
    if (key === keys.lockKey[0] && alt.gameControlsEnabled()) {
        alt.emitServer("vehicle:lockState");
    }
    if (key === keys.beltKey[0] && alt.gameControlsEnabled()) {

    }

    //CloseAll
    if (key === 27) {
        allViewClose();
    }
});

alt.on('keyup', async (key) => {
    if (Object.keys(keys).length === 0) return;

    if (key === keys.funkKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:UseRadio", true, false);
    }
    if (key === keys.funkSecondKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:UseRadio", false, false);
    }
    if (key === keys.megaphoneKey[0] && alt.gameControlsEnabled()) {
        alt.emit("SaltyChat:UseMegaphone", false);
    }

    if (key === keys.chatKey[0]) {
        if (!alt.gameControlsEnabled() && alt.Player.local.hasSyncedMeta('dead')){}
        else {if (!alt.gameControlsEnabled()) return;}
        disableESC()
        chat.emit("openChat", false);
        chat.focus();
        alt.emit("chatOpened");
        alt.toggleGameControls(false);
        chatOpen = true;
    }

    if (key === keys.interactionKey[0]) {
        await pedTeleportInteraction();
    }
});

alt.onServer('settings:Client:keyLoading', (key) => {
   keys = {...key};
   alt.Player.local.setMeta('keys', keys);
});

alt.onServer('settings:Client:load', (player) => {
    settings.on('load', () => {
        settings.emit('setting:View:loading', player);
    });
});

function startSettings() {
    settings.on('settings:Client:saveSettings', (username, email) => {
        alt.emitServer('settings:Server:saveSettings', username, email);
    });

    settings.on('settings:Client:loadingSetting', () => {
        alt.emitServer('settings:Server:loading');
    });

    settings.on('settings:Client:savePassword', (oldPassword, password, rerunPassword) => {
       alt.emitServer('settings:Server:savePassword', oldPassword, password, rerunPassword);
    });
    settings.on('settings:Client:safeKey', (i, e, k) => {
        if (keys[e]) return alt.emit('notification', 4, 'Key ist schon belegt', 3000);
        switch(i) {
            case 0:
                keys.adminKey = [e, k];
            break;
            case 1:
                keys.chatKey = [e, k];
            break;
            case 2:
                keys.voiceRangeKey = [e, k];
            break;
            case 3:
                keys.funkKey = [e, k];
            break;
            case 4:
                keys.engineKey = [e, k];
            break;
            case 5:
                keys.lockKey = [e, k];
            break;
            case 6:
                keys.inventoryKey = [e, k];
            break;
            case 7:
                keys.multiMenuKey = [e, k];
            break;
            case 8:
                keys.beltKey = [e, k];
            break;
            case 9:
                keys.interactionKey = [e, k];
            break;
            case 10:
                keys.megaphoneKey = [e, k];
            break;
            case 11:
                keys.funkSecondKey = [e, k];
            break;
        }
        settings.emit('settings:View:loadingKeys', keys);
    });
    settings.on('settings:Client:keysSafe', () => {
        alt.emitServer('settings:Client:keysSafe', keys);
        alt.Player.local.setMeta('keys', keys);
    });
}

export function allViewClose() {
    if (settings) {
        settings.destroy();
        settings = undefined;
    }
    if (chatOpen) {
        chatOpen = false;
        chat.emit("closeChat");
        alt.emit("chatClosed");
        chat.unfocus();
    }
    if (inventoryOpen) {
        inventoryOpen = false;
        inventory.unfocus();
        inventory.emit('inventory:View:status', false, undefined);
    }
    admin.emit("admin:View:on", false);
    admin.unfocus();
    enableESC();
    if (alt.Player.local.hasSyncedMeta('dead')) alt.toggleGameControls(false);
    else alt.toggleGameControls(true);
    alt.showCursor(false);
}

function disableESC() {
    if (!everyTick) {
        everyTick = alt.everyTick(() => {
            native.disableControlAction(0, 200, true);
            native.disableControlAction(1, 200, true);
            native.disableControlAction(0, 199, true);
            native.disableControlAction(1, 199, true);
            native.disableControlAction(2, 200, true);
            native.disableControlAction(2, 199, true);
        });
    }
}

function enableESC() {
    if (everyTick) {
        alt.setTimeout(() => {
            alt.clearEveryTick(everyTick);
            everyTick = undefined;
        }, 1500);
    }
}

alt.onServer('allViewClose', allViewClose);