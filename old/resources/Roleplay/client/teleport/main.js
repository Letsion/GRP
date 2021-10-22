import * as alt from 'alt-client';
import * as native from 'natives';
import * as pedCreator from "../ped/ped.js";

alt.on("connectionComplete", async () => {
    await pedCreator.ped({ x: 935.643, y: 47.261, z: 81.093, h: 166.155}, 'a_m_y_clubcust_04', 4, {teleportValue: 'CasinoOutDoor', use: 10, dimension: 1}, 20, true);
    await pedCreator.ped({x: 327.7582, y: -603.876, z: 43.2821, h: 323.16}, 's_m_m_paramedic_01', 4, {teleportValue: 'PillHospitalHall', use: 3, dimension: 1}, 20, true);
    await pedCreator.ped({x: 342.580, y: -582.870, z: 28.79, h: 68.689}, 's_m_m_paramedic_01', 4,{teleportValue: 'PillHospitalGarage', use: 5, dimension: 1}, 20, true);
    await pedCreator.ped({x: 1090.008,y: 205.79,z: -49.004, h: 342.3040}, 'a_m_y_clubcust_04', 4, {teleportValue: 'CasinoInDoor', use: 3, dimension: 1}, 20, true);
    await pedCreator.ped({x: 1838.008, y: 3673.60, z:34.26, h:313.99 }, 's_m_m_paramedic_01', 4, {teleportValue:'SandyShores', use: 3, dimension: 1}, 20, true);
    await pedCreator.ped({x: 300.50, y: -585.34, z: 43.28, h: 275.58}, 's_m_m_paramedic_01', 4, {teleportValue: 'toSandyShores', use: 3, dimension: 11}, 20, true);
    await pedCreator.ped({x:-249.27, y: 6331.46, z: 32.41, h: 274.75}, 's_m_m_paramedic_01', 4, {teleportValue: 'PaletoBay', use: 4}, 20, true);
    await pedCreator.ped({x: 300.50, y: -585.34, z: 43.28, h: 275.58}, 's_m_m_paramedic_01', 4, {teleportValue: 'toPaletoBay', use: 3, dimension: 12}, 20, true);
});

export async function pedTeleportInteraction() {
    let p = native.getClosestPed(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z, 10, false, true, null, false, false, -1)[1];
    let ped = await pedCreator.getPedDataByPed(p);
    if (!ped || !p) return;
    if (!ped.teleportValue) return;
    alt.emitServer('teleport:Server:tpTo', ped.pos, ped.teleportValue, ped.use);
}