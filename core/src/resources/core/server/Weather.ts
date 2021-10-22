import * as alt from 'alt-server';
import { Events } from 'lib/events';

export abstract class Weather {
    private static weather = 'CLEAR';
    public static initialize(): void {
        alt.onClient(Events.weather.sync, (player: alt.Player, instant: boolean) => Weather.broadcastWeather(player, instant));
    }

    private static broadcastWeather(player: alt.Player | null, instant: boolean): void {
        if (player) alt.emitClient(player, Events.weather.sync, Weather.weather, instant);
        else alt.emitAllClients(Events.weather.sync, Weather.weather, instant);
    }

    public static setWeather(weather: string, instant: boolean): void {
        Weather.weather = weather;
        Weather.broadcastWeather(null, instant);
    }
}
