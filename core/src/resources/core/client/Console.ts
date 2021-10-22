import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';
import * as natives from 'natives';

export abstract class Console {
    static [index: string]: (...args: string[]) => void;

    public static initialize(): void {
        alt.on(Events.alt.consoleCommand, (command: string, ...args) => {
            if (Console.hasOwnProperty(command)) {
                Console[command](...args);
            }
        });
    }

    protected static revive(name: string): void {
        alt.emitServer(Events.console.revive, name);
    }

    protected static car(vehicle: string): void {
        alt.emitServer(Events.console.vehicle, vehicle);
    }

    protected static weather(weather: string): void {
        alt.emitServer(Events.console.weather, weather.toUpperCase());
    }

    protected static time(hour: string, minute: string): void {
        alt.emitServer(Events.console.time, hour, minute);
    }

    protected static speed(speed: string): void {
        native.setVehicleForwardSpeed(alt.Player.local.vehicle as alt.Vehicle, parseInt(speed));
        native.setVehicleMaxSpeed(alt.Player.local.vehicle as alt.Vehicle, parseInt(speed));
    }

    protected static pos(x: string, y: string, z: string): void {
        alt.emitServer(Events.console.pos, parseInt(x), parseInt(y), parseInt(z));
    }

    protected static getPos(): void {
        alt.emitServer(Events.console.getPos);
    }

    protected static getRot(): void {
        alt.log(native.getEntityRotation(alt.Player.local, 5));
    }

    protected static weapon(weapon: string): void {
        alt.emitServer(Events.console.weapon, weapon);
    }

    protected static noclip(): void {
        alt.emitServer(Events.console.noclip);
    }

    protected static test(number: string): void {
        alt.emitServer('test', number);
    }

    protected static dv(radius: string): void {
        alt.emitServer(Events.console.dv, parseInt(radius));
    }

    protected static ad(): void {
        alt.emitServer(Events.console.ad);
    }

    protected static blips(): void {
        alt.emitServer(Events.console.blips);
    }

    protected static repair(): void {
        alt.emitServer(Events.console.repair);
    }

    protected static report(...args: string[]): void {
        alt.emitServer(Events.console.report, args);
    }

    protected static loadIPL(): void {
        alt.requestIpl('tr_tuner_shop_burton');
        alt.requestIpl('tr_tuner_shop_strawberry');
        alt.requestIpl('tr_tuner_shop_rancho');
        alt.requestIpl('tr_tuner_shop_mission');
        alt.requestIpl('tr_tuner_shop_mesa');
        alt.requestIpl('tr_tuner_shop_burton');
        alt.requestIpl('tr_tuner_race_line');
        alt.requestIpl('tr_tuner_meetup');

        const TunerInteriorID = natives.getInteriorAtCoords(-1350.0, 160.0, -100.0);
        if (natives.isValidInterior(TunerInteriorID)) {
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_1'); // Default Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_2'); // White Design
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_style_3'); // Dark Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_4'); // Concrete Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_5'); // Home Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_6'); // Street Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_7'); // Japan Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_8'); // Color Design
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_style_9'); // Race Design
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_bedroom'); // With Bed room
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_bedroom_empty'); // Bed room is clean

            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_table'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_thermal'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_tints'); // railing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_train'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_laptop'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_lightbox'); // lights ceiling
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_plate'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_cabinets'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_chalkboard'); // panel at the top of two rooms in front
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_box_clutter'); // Box

            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_car_lift_cutscene'); // Carlift Cutscene
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_car_lift_default'); // Carlift Default
            natives.deactivateInteriorEntitySet(TunerInteriorID, 'entity_set_car_lift_purchase'); // Carlift Purchase

            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_scope'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_cut_seats'); // Seats in corner
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_def_table'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_container'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_virus'); // nothing
            natives.activateInteriorEntitySet(TunerInteriorID, 'entity_set_bombs'); // nothing

            natives.refreshInterior(TunerInteriorID);
        }
    }

    protected static removeIPL(ipl: string): void {
        alt.removeIpl(ipl);
    }
}
