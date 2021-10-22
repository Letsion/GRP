import * as alt from 'alt-client';
import * as native from 'natives';

let array = new Map();
let number = 0;

export async function ped(vector, model, type, data, range, invisible) {
    let intervall;
    number += 1;
    return new Promise(resolve => {
        if (native.hasModelLoaded(alt.hash(model))) {
            const p = native.createPed(type, alt.hash(model), vector.x, vector.y, vector.z, vector.h, false, true);
            alt.setTimeout(() => {
                try {
                    native.freezeEntityPosition(p, true);
                } catch (e) {}
            } , 1500);
            native.setEntityInvincible(p, true);
            native.blockPedDeadBodyShockingEvents(p, true);
            native.setBlockingOfNonTemporaryEvents(p, true);
            if (invisible) {
                native.setEntityVisible(p, false, false);
                native.setEntityCollision(p, false, false);
            }
            array.set(number, {...data, ped: p, id: number, range: range, invisible: invisible, model: model, type: type, vector: vector, pos: new alt.Vector3(vector.x, vector.y, vector.z)});
            alt.log('Ped Erstellt ', number);
            resolve({id: number, pos: new alt.Vector3(vector.x, vector.y, vector.z)})
        }
        else {
            intervall = alt.everyTick(() => {
                if (native.hasModelLoaded(alt.hash(model))) {
                    alt.clearEveryTick(intervall);
                    const p = native.createPed(type, alt.hash(model), vector.x, vector.y, vector.z, vector.h, false, true);
                    alt.setTimeout(() => {
                        try {
                            native.freezeEntityPosition(p, true);
                        } catch (e) {}
                    } , 1500);
                    native.setEntityInvincible(p, true);
                    if (invisible) {
                        native.setEntityVisible(p, false, false);
                        native.setEntityCollision(p, false, false);
                    }
                    native.blockPedDeadBodyShockingEvents(p, true);
                    native.setBlockingOfNonTemporaryEvents(p, true);
                    alt.log('Ped Erstellt ', number);
                    array.set(number, {...data, id: number, invisible: invisible, ped: p, range: range, model: model, type: type, vector: vector, pos: new alt.Vector3(vector.x, vector.y, vector.z)});
                    resolve({id: number, pos: new alt.Vector3(vector.x, vector.y, vector.z)})
                } else {
                    native.requestModel(alt.hash(model));
                }
            });
        }
    })
}

function pedAdd(k) {
    let intervall;
    if (array.has(k)) {
        let value = array.get(k);
        intervall = alt.everyTick(() => {
            if (native.hasModelLoaded(alt.hash(value.model))) {
                if (value.ped !== undefined) return;
                alt.clearEveryTick(intervall);
                const p = native.createPed(value.type, alt.hash(value.model), value.vector.x, value.vector.y, value.vector.z, value.vector.h, false, true);
                alt.setTimeout(() => {
                    try {
                        native.freezeEntityPosition(p, true);
                    } catch (e) {}
                } , 1500);
                if (value.invisible) {
                    native.setEntityVisible(p, false, false);
                    native.setEntityCollision(p, false, false);
                }
                native.setEntityInvincible(p, true);
                native.blockPedDeadBodyShockingEvents(p, true);
                native.setBlockingOfNonTemporaryEvents(p, true);
                alt.log('Ped added ', k);
                array.set(k, {...value, ped: p});
                alt.emit('pedCreated', k);
            } else {
                native.requestModel(alt.hash(value.model));
            }
        });
    } else {
        alt.logError('Array Key undefined');
    }
}

function pedDestroy(k) {
    if (array.has(k)) {
        let value = array.get(k);
        if (value.ped === undefined) return;
        native.deletePed(value.ped);
        alt.log('Ped destroyed ', k);
        alt.emit('destroyPed', k);
        array.set(k, {...value, ped: undefined});
    } else {
        alt.logError('Array Key undefined');
    }
}

export function setPedData(k, value) {
    if (array.has(k)) {
        let a = array.get(k);
        let object = {...value, ped: a.ped}
        array.set(k, object);
        return object;
    } else {
        alt.logError('Key Array undefined, setPedData');
    }
}

export async function getPedData(k) {
    return new Promise(resolve => {
        if (array.has(k)) {
            resolve(array.get(k));
        } else {
            alt.logError('Key Array undefined, getData');
        }
    })
}

export async function getPedDataByPed(ped) {
    return new Promise(resolve => {
        let returns;
        array.forEach((v, k) => {
            if (!v.ped || v.ped !== ped) return;
            resolve(v);
            returns = true;
        });
        if (!returns) resolve(false);
    });
}

alt.setInterval(() => {
    array.forEach((v, k) => {
        if (alt.Player.local.pos.distanceTo(v.pos) < v.range) {
            if (v.dimension === alt.Player.local.getSyncedMeta('Dim')) pedAdd(k);
        } else {
            pedDestroy(k);
        }
    });
}, 3000);