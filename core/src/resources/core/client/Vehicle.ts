import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';
import { Player } from './Player';

export abstract class Vehicle {
    private static everyTick: number | null = null;
    public static initialize(): void {
        alt.on(Events.alt.enteredVehicle, () => {
            Player.toggleRadar(true);
            Vehicle.everyTick = alt.everyTick(() => {
                alt.beginScaleformMovieMethodMinimap('SETUP_HEALTH_ARMOUR');
                native.scaleformMovieMethodAddParamInt(3);
                native.endScaleformMovieMethod();
            });
        });

        alt.on(Events.alt.leftVehicle, () => {
            Player.toggleRadar(false);
            if (Vehicle.everyTick) {
                alt.clearEveryTick(Vehicle.everyTick);
                Vehicle.everyTick = null;
            }
        });

        alt.onServer(Events.vehicle.enter, (vehicle: alt.Vehicle) => {
            let cleared = false;
            const interval = alt.setInterval(() => {
                if (!vehicle || !vehicle.valid) return;
                const vehicleScriptId = vehicle.scriptID;
                if (vehicleScriptId) {
                    native.setPedIntoVehicle(alt.Player.local, vehicleScriptId, -1);
                    alt.clearInterval(interval);
                    cleared = true;
                }
            }, 10);
            alt.setTimeout(() => {
                if (!cleared) alt.clearInterval(interval);
            }, 5000);
        });
    }

    public static engine(): void {
        if (!alt.Player.local.vehicle) return;
        alt.emitServer(Events.vehicle.engine, !native.getIsVehicleEngineRunning(alt.Player.local.vehicle));
    }
}
