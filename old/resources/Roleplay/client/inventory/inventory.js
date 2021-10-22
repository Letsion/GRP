import * as alt from 'alt-client';
import * as native from 'natives';

const view = new alt.WebView('http://resource/client/inventory/html/index.html');

view.on('load', () => {
    alt.emit('settings:Inventory', view);
});

alt.onServer('inventory:Client:name', () => {
    view.emit('inventory:View:name', alt.Player.local.getSyncedMeta('Name'), alt.Player.local.getSyncedMeta('Sex'))
});
