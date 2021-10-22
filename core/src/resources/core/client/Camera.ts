import * as alt from 'alt-client';
import * as native from 'natives';

export abstract class Camera {
    private static id: number;

    public static initialize(): void {
        Camera.create([1906.839599609375, -1204.971435546875, 513.99853515625], [-0.0, 0.0, 54.9409], 90);
        Camera.activeCam(true);
        Camera.renderCam(true, false, 0);
    }

    public static create(pos: position, rot: position, fov: number): void {
        Camera.id = native.createCamWithParams('DEFAULT_SCRIPTED_CAMERA', ...pos, ...rot, fov, true, 0);
    }

    public static renderCam(state: boolean, ease: boolean, time: number): void {
        native.renderScriptCams(state, ease, time, true, true, 0);
    }

    public static activeCam(active: boolean): void {
        native.setCamActive(Camera.id, active);
    }

    public static deleteAllCam(): void {
        native.destroyAllCams(true);
    }

    public static disableRender(): void {
        native.renderScriptCams(false, false, 0, true, true, 0);
    }

    public static pointCam(pos: position): void {
        native.pointCamAtCoord(Camera.id, ...pos);
    }

    public static pointCamToEntity(entity: alt.Entity): void {
        native.pointCamAtEntity(Camera.id, entity, 0, 0, 0, true);
    }

    public static setRot(rot: position): void {
        native.setCamRot(Camera.id, ...rot, 5);
    }
}
