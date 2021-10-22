export abstract class MSG {
    public static login = {
        title: 'Login System',
        color: '#12b0e1',
        login: 'Du hast dich erfolgreich eingeloggt',
        wrongPassword: 'Dein Passwort ist falsch',

        discord: {
            login: 'Spieler: **{1}** hat sich erfolgreich mit der GUID: **{2}** eingeloggt',
            logout: 'Spieler: **{1}** hat sich ausgeloggt',
        },
    };

    public static system = {
        notWhitelisted: 'Du bist nicht gewhitelistet',
        banned: 'Du wurdest mit der Begründung: {1} von unserem Server gebannt',
        wrongSupportNumber: 'Die eingegebene Supportnummer: {1} ist falsch',
        noAccount: 'Dein Account wurde nicht gefunden!',
        spamKick: 'DU wurdest wegen Spamming gekickt. \n Bitte wende dich an den Support',

        discord: {
            banned: 'Spieler: **{1}** wurde von Admin: {2}** mit der Begründung: **{3}** von unserem Server gebannt',
            spamKick: 'Spieler: **{1}** wurde wegen spammen des Events: **{2}** gekickt!',
        },
    };

    public static character = {
        color: '#ee00ff',
        title: 'Charakter System',
        newCharacter: 'Du hast dir den Charakter: {1} {2} erstellst',
        setCharacter: 'Du bist mit dem Charakter: {1} {2} eingereist',

        discord: {
            newCharacter: 'Spieler: {1} hast sich den Charakter: **{2} {3}** erstellst',
            setCharacter: 'Spieler: **{1}** ist mit dem Charakter: **{1} {2}** eingereist',
        },
    };

    public static admin = {
        color: '#ff3434',
        title: 'Admin System',

        revive: 'Du hast den Spieler: {1} wiederbelebt',
        addVehicle: 'Du hast dir das Fahrzeug: {1} gespawnt',
        weather: 'Du hast das Wetter zu {1} umgestellt',
        realTime: 'Du hast die Zeit auf Livetime gestellt!',
        time: 'Du hast die Zeit auf {1}:{2} gestellt',
        tp: 'Du hast dich zu den Koordinaten: {1}, {2}, {3} teleportiert',
        weapon: 'Du hast dir die Waffe {1} gegeben',
        deleteVehicle: 'Du hast das Fahrzeug: {1} gelöscht',
        noclip: 'Du hast dich in/aus den Noclipmodus gesetzt',
        aduty: 'Du hast dich in/aus dem Adminmodus begeben',
        blips: 'Du hast die Blips aktiviert/deaktiviert',
        noPermissions: 'Du hast nicht die ausreichende Berechtigung',
        repair: 'Du hast hat das Fahrzeug: {1} repariert',

        user: {
            revive: 'Du wurdest von einem Admin wiederbelebt',
        },

        discord: {
            revive: 'Spieler: **{1}** wurde von dem Admin: **{2}** wiederbelebt',
            addVehicle: 'Admin: **{1}** hat sich das Fahrzeug: **{2}** gespawnt',
            weather: 'Admin: **{1}** hat das Wetter zu: **{2}** umgestellt',
            realTime: 'Admin: **{1}** hat die Zeit auf Livetime gestellt',
            time: 'Admin: **{1}** hat die Zeit auf: **{2}:{1}** gestellt',
            tp: 'Admin: **{1}** hat sich zu den Koordinaten: **{2}, {3}, {4}** teleportiert',
            weapon: 'Admin: **{1}** hat sich die Waffe: **{2}** gegeben',
            deleteVehicle: 'Admin: **{1}** hat das Fahrzeug: **{2}** gelöscht',
            noclip: 'Admin: **{1}** hat sich in/aus den Noclipmodus gesetzt',
            aduty: 'Admin: **{1}** hat sich in/aus den Adminmodus begeben',
            blips: 'Admin **{1}** hat die Blips aktiviert/deaktiviert',
            repair: 'Admin: **{1}** hat das Fahrzeug: **{2}** repariert',
        },
    };
}
