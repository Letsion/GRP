import * as alt from 'alt-client';

/**
 *
 * @param playerPos
 * Player Position to range scan
 * @param range
 * Range to scan
 * @returns {Promise<Vehicle>}
 */
export async function getNearestVeh(playerPos, range) {
    return new Promise(resolve => {
        alt.Vehicle.streamedIn.forEach(i => {
           if (playerPos.distanceTo(i.pos) <= range) resolve(i);
        });
    });
}

/**
 *
 * @param playerPos
 * Player Position to range scan
 * @param range
 * Range to scan
 * @returns {Promise<Player>}
 */
export async function getNearestPlayer(playerPos, range) {
    return new Promise(resolve => {
        alt.Player.streamedIn.forEach(i => {
           if (playerPos.distanceTo(i.pos) <= range) resolve(i);
        });
    })
}