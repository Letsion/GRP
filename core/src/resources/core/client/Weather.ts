import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';

export abstract class Weather {
    public static initialize(): void {
        alt.onServer(Events.weather.sync, (weather: string, instant: boolean) => {
            if (instant) native.setWeatherTypeNowPersist(weather);
            else native.setWeatherTypeOvertimePersist(weather, 150);
        });
        alt.emitServer(Events.weather.sync, true);
    }
}
