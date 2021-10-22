import * as alt from 'alt-server';
import {dimensionHandler} from "../system/export.js";

alt.onClient('teleport:Server:tpTo', (player, pos, value, range) => {
    if (!pos || !value) return;
    if (player.pos.distanceTo(pos) > range) return;

    switch (value) {
        case 'PillHospitalHall':
            player.pos = new alt.Vector3(340.668, -582.90, 28.79);
        break;
        case 'PillHospitalGarage':
            player.pos = new alt.Vector3(327.7582, -603.876, 43.2821);
        break;
        case 'CasinoOutDoor':
            player.pos = new alt.Vector3(1090.008, 205.79, -49.004);
        break;
        case 'CasinoInDoor':
            player.pos = new alt.Vector3(935.643,47.261, 81.093);
        break;
        case 'SandyShores':
            player.pos = new alt.Vector3(300.50, -585.34, 43.28);
            dimensionHandler(player, 11) // Sandy Shores Dimension: 11
        break;
        case 'toSandyShores':
            player.pos = new alt.Vector3(1838.84, 3673.60, 34.26)
            dimensionHandler(player, 1);
        break;
        case 'PaletoBay':
            player.pos = new alt.Vector3(300.50, -585.34, 43.28);
            dimensionHandler(player, 12) // paletoBay Dimension: 12
        break;
        case 'toPaletoBay':
            player.pos = new alt.Vector3(-249.27, 6331.46, 32.41);
            dimensionHandler(player, 1);
        break;
    }
});