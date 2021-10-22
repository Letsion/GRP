import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from 'lib/events';

const boardProp = 'prop_police_id_board';
const textProp = 'prop_police_id_text';
const renderTargetName = 'ID_Text';
const animDict = 'mp_character_creation@lineup@male_a';
const animName = 'loop_raised';

native.requestAnimDict(animDict);

export abstract class Mugshot {
    private static active = false;
    private static everyTickHandle: number | null = null;
    private static handles = {
        board: 0 as number,
        text: '' as unknown,
        scaleform: 0 as unknown,
        renderTarget: 0 as unknown,
    };

    public static initialize(): void {
        alt.onServer(Events.mugshot.start, Mugshot.start);
        alt.onServer(Events.mugshot.stop, Mugshot.stop);
    }

    public static async start(title: string, topText: string, midText: string, bottomText: string, rank = -1): Promise<void> {
        Mugshot.active = true;

        Mugshot.setupObjects();
        await Mugshot.setupScaleform(title, topText, midText, bottomText, rank);
        Mugshot.setupRendertarget();
        Mugshot.attachObjects();
        Mugshot.playAnimation();

        Mugshot.everyTickHandle = alt.everyTick(Mugshot.everyTick);
    }

    private static setupObjects(): void {
        Mugshot.handles.board = native.createObject(
            alt.hash(boardProp),
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            false,
            false,
            false
        );
        Mugshot.handles.text = native.createObject(
            alt.hash(textProp),
            alt.Player.local.pos.x,
            alt.Player.local.pos.y,
            alt.Player.local.pos.z,
            false,
            false,
            false
        );
    }

    private static async setupScaleform(title: string, topText: string, midText: string, bottomText: string, rank: number): Promise<void> {
        const handle = native.requestScaleformMovie('mugshot_board_01');
        await awaitScaleformLoad(handle);
        native.beginScaleformMovieMethod(handle, 'SET_BOARD');
        native.scaleformMovieMethodAddParamPlayerNameString(title);
        native.scaleformMovieMethodAddParamPlayerNameString(midText);
        native.scaleformMovieMethodAddParamPlayerNameString(bottomText);
        native.scaleformMovieMethodAddParamPlayerNameString(topText);
        native.scaleformMovieMethodAddParamInt(0);
        if (rank > -1) native.scaleformMovieMethodAddParamInt(rank);
        native.endScaleformMovieMethod();

        Mugshot.handles.scaleform = handle;
    }

    private static setupRendertarget(): void {
        native.registerNamedRendertarget(renderTargetName, false);
        native.linkNamedRendertarget(alt.hash(textProp));
        Mugshot.handles.renderTarget = native.getNamedRendertargetRenderId(renderTargetName);
    }

    private static attachObjects(): void {
        native.attachEntityToEntity(
            Mugshot.handles.board,
            alt.Player.local.scriptID,
            native.getPedBoneIndex(alt.Player.local.scriptID, 28422),
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            2,
            true
        );
        native.attachEntityToEntity(
            //@ts-ignore
            Mugshot.handles.text,
            alt.Player.local.scriptID,
            native.getPedBoneIndex(alt.Player.local.scriptID, 28422),
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            2,
            true
        );
    }

    private static playAnimation(): void {
        native.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8, -8, -1, 1, 0, false, false, false);
    }

    private static everyTick(): void {
        native.setTextRenderId(Mugshot.handles.renderTarget as unknown as number);
        native.drawScaleformMovie(Mugshot.handles.scaleform as unknown as number, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255, 0);
        native.setTextRenderId(1);
    }

    public static stop(): void {
        if (!Mugshot.active) return;
        Mugshot.active = false;

        native.deleteObject(Mugshot.handles.board);
        native.deleteObject(Mugshot.handles.text as number);
        native.setScaleformMovieAsNoLongerNeeded(Mugshot.handles.scaleform as number);
        native.releaseNamedRendertarget(Mugshot.handles.renderTarget as string);

        native.stopAnimTask(alt.Player.local.scriptID, animDict, animName, -4);

        alt.clearEveryTick(Mugshot.everyTickHandle as number);
    }
}

function awaitScaleformLoad(scaleform: number): Promise<void> {
    return new Promise<void>((resolve) => {
        const interval = alt.setInterval(() => {
            if (native.hasScaleformMovieLoaded(scaleform)) {
                alt.clearInterval(interval);
                resolve();
            }
        }, 50);
    });
}
