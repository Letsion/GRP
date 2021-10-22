import * as alt from 'alt-client';
import { Game } from './Game';
import { Events } from 'lib/events';

alt.on(Events.alt.connectionComplete, () => {
    Game.start();
});
