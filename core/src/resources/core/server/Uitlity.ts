import * as alt from 'alt-server';

export enum adminStates {
    User,
    Supporter,
    Moderator,
    Developer,
    Administrator,
    SuperAdministrator,
    Projektleitung,
}

export function stringf(msg: string, ...args: string[]): string {
    if (!msg) {
        alt.logError('Keine MSG');
        return '';
    }

    let langValue = msg;
    if (args.length > 0) {
        for (let i = 0; i < args.length; ++i) {
            langValue = replaceAll(`{${i + 1}}`, args[i], langValue);
        }
    }

    return langValue;
}

export function replaceAll(a: string, b: string, c: string): string {
    const d = b.replace(/\$/g, '$$$$');
    return c.replace(new RegExp(a.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|<>\-\&])/g, '\\$&'), 'g'), d);
}
