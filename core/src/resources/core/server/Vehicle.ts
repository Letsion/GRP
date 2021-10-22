import * as alt from 'alt-server';
import { Events } from 'lib/events';

export abstract class Vehicle {
    public static initialize(): void {
        alt.onClient(Events.vehicle.engine, (player, engineSet) => Vehicle.engineHandler(player, engineSet));
    }

    public static create(vehicle: string, pos: position, rot: position): alt.Vehicle {
        return new alt.Vehicle(vehicle, ...pos, ...rot);
    }

    public static engineHandler(player: alt.Player, engineSet: boolean): void {
        if (player.vehicle) player.vehicle.engineOn = engineSet;
    }

    public static getNearestVehicle(pos: alt.Vector3, radius: number): Promise<alt.Vehicle | undefined> {
        return new Promise((resolve) => {
            alt.Vehicle.all.forEach((Vehicle: alt.Vehicle) => {
                if (Vehicle.pos.distanceTo(pos) <= radius) {
                    resolve(Vehicle);
                }
            });
        });
    }
}
