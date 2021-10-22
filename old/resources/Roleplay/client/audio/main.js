import * as alt from 'alt-client';
import * as native from 'natives';

let array = new Map();

alt.onServer('audio', (player) => {
    const audio = new alt.Audio('@pack/client/audio/twitchAmLimit.mp3', 1, 'radio', false);
    audio.addOutput(player);
    audio.play();
    audio.looped = false;
});

alt.onServer('audioIphone', (player) => {
    if (array.has(player.id)) {
        const audio = array.get(player.id);
        audio.play();
        audio.looped = true;
        return;
    }
    const audio = new alt.Audio('@pack/client/audio/deadpool.mp3', 0.45, 'radio', false);
    audio.addOutput(player);
    audio.play();
    audio.looped = true;
    array.set(player.id, audio);
});

alt.onServer('stopIphone', (player) => {
    if (array.has(player.id)) {
        const audio = array.get(player.id);
        audio.pause();
    }
});
