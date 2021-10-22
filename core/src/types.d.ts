type Vector = import('alt-shared').Vector3;
type BodyPart = import('alt-server').BodyPart;

type spawn = [number, number, number];
type position = [number, number, number];
type key = [keys, keys, keys];

interface skin {
    colorOverlays: [
        {
            color1: number;
            opacity: number;
            color2: number;
            id: number;
            value: number;
        },
        {
            color1: number;
            id: number;
            opacity: number;
            value: number;
        },
        {
            color1: number;
            id: number;
            opacity: number;
            value: number;
        }
    ];
    eyebrows: number;
    eyes: number;
    eyebrowsColor1: number;
    eyebrowsOpacity: number;
    faceMix: number;
    facialHairOpacity: number;
    faceFather: number;
    faceMother: number;
    facialHair: number;
    facialHairColor1: number;
    hair: number;
    hairColor1: number;
    hairColor2: number;
    hairOverlay: {
        collection: string;
        overlay: string;
    };
    opacityOverlays: [
        {
            id: number;
            opacity: number;
            value: number;
        },
        {
            id: number;
            opacity: number;
            value: number;
        },
        {
            id: number;
            opacity: number;
            value: number;
        },
        {
            id: number;
            opacity: number;
            value: number;
        },
        {
            id: number;
            opacity: number;
            value: number;
        },
        {
            id: number;
            opacity: number;
            value: number;
        }
    ];
    sex: string;
    skinFather: number;
    skinMix: number;
    skinMother: number;
    structure: [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number
    ];
}
interface keys {
    name: string;
    default: boolean;
    keys: {
        adminKey: [number, string, string];
        funkKey: [number, string, string];
        funkSecondKey: [number, string, string];
        voiceRangeKey: [number, string, string];
        megaphoneKey: [number, string, string];
        engineKey: [number, string, string];
        lockKey: [number, string, string];
        inventoryKey: [number, string, string];
        multiMenuKey: [number, string, string];
        beltKey: [number, string, string];
        interactionKey: [number, string, string];
    };
}

interface account {
    _id: string;
    username: string;
    email: string;
    adminLevel: number;
    adminLevel2: number;
    ban: boolean;
    password: string;
    totalLogins: number;
    newCharacter: boolean;
    ip: string[];
    whitelist: boolean;
    supportNumber: number;
    socialID: string[];
    hwID: { hwIDHash: string[]; hwIDExHash: string[] };
    guid: number;
    characters: unknown[];
    keys: [keys, keys, keys];
}

interface character {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    birthday: string;
    sex: string;
    pos: Vector;
    dimension: number;
    joined: boolean;
    clothes: [
        undefined,
        { drawable: number; texture: number; palette: number | undefined },
        undefined,
        { drawable: number; texture: number; palette: number | undefined },
        { drawable: number; texture: number; palette: number | undefined },
        undefined,
        { drawable: number; texture: number; palette: number | undefined },
        { drawable: number; texture: number; palette: number | undefined },
        { drawable: number; texture: number; palette: number | undefined },
        undefined,
        undefined,
        { drawable: number; texture: number; palette: number | undefined }
    ];
    skin: skin;
    health: { damage: number; bodyPart: BodyPart; weapon: number; exited: Date }[];
}

declare module 'discord.js' {
    export interface Channel {
        send: (msg: string | MessageEmbed) => Message;
    }
}

declare module 'alt-server' {
    export interface Player {
        account: account | undefined;
        adminMode: boolean;
        characters: character[] | undefined;
        character: character | undefined;
        antiCheat: { events: number } | undefined;
    }
}

declare module 'sql' {}
declare module 'replaceall';
