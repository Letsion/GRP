import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';

export class NoClip {
    public static enabled = false;
    private static speed = 3.0;
    private static everyTick = 0;

    public static start(): void {
        if (NoClip.enabled) return;
        NoClip.enabled = true;
        native.freezeEntityPosition(alt.Player.local.scriptID, true);
        NoClip.everyTick = alt.everyTick(NoClip.keyHandler);
    }

    public static stop(): void {
        if (!NoClip.enabled) return;
        NoClip.enabled = false;
        native.freezeEntityPosition(alt.Player.local.scriptID, false);
        alt.clearEveryTick(NoClip.everyTick as unknown as number);
    }

    private static KEYS = {
        FORWARD: 32,
        BACKWARD: 33,
        LEFT: 34,
        RIGHT: 35,
        UP: 22,
        DOWN: 36,
        SHIFT: 21,
    };

    private static keyHandler(): void {
        let currentPos = alt.Player.local.pos;
        let speed = NoClip.speed;
        const rot = native.getGameplayCamRot(2);
        const dirForward = camVectorForward(rot);
        const dirRight = camVectorRight(rot);

        if (native.isDisabledControlPressed(0, NoClip.KEYS.SHIFT)) speed = speed * 5;

        if (native.isDisabledControlPressed(0, NoClip.KEYS.FORWARD)) currentPos = addSpeedToVector(currentPos, dirForward, speed);
        if (native.isDisabledControlPressed(0, NoClip.KEYS.BACKWARD)) currentPos = addSpeedToVector(currentPos, dirForward, -speed);
        if (native.isDisabledControlPressed(0, NoClip.KEYS.LEFT)) currentPos = addSpeedToVector(currentPos, dirRight, -speed, true);
        if (native.isDisabledControlPressed(0, NoClip.KEYS.RIGHT)) currentPos = addSpeedToVector(currentPos, dirRight, speed, true);
        let zModifier = 0;
        if (native.isDisabledControlPressed(0, NoClip.KEYS.UP)) zModifier += speed;
        if (native.isDisabledControlPressed(0, NoClip.KEYS.DOWN)) zModifier -= speed;

        if (!isVectorEqual(new alt.Vector3(currentPos.x, currentPos.y, currentPos.z + zModifier), alt.Player.local.pos))
            alt.emitServer(Events.noclip.pos, currentPos.x, currentPos.y, currentPos.z + zModifier);
    }
}

function addSpeedToVector(vector1: alt.Vector3, vector2: alt.Vector3, speed: number, lr = false): alt.Vector3 {
    return new alt.Vector3(vector1.x + vector2.x * speed, vector1.y + vector2.y * speed, lr ? vector1.z : vector1.z + vector2.z * speed);
}

function camVectorForward(camRot: alt.Vector3): alt.Vector3 {
    const rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180) + Math.PI / 2,
    };
    return new alt.Vector3(Math.cos(rotInRad.z), Math.sin(rotInRad.z), Math.sin(rotInRad.z));
}

function camVectorRight(camRot: alt.Vector3): alt.Vector3 {
    const rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180),
    };

    return new alt.Vector3(Math.cos(rotInRad.z), Math.sin(rotInRad.z), Math.sin(rotInRad.x));
}

function isVectorEqual(vector1: alt.Vector3, vector2: alt.Vector3): boolean {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
