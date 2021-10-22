export abstract class Events {
    public static alt = {
        consoleCommand: 'consoleCommand',
        connectionComplete: 'connectionComplete',
        playerConnect: 'playerConnect',
        enteredVehicle: 'enteredVehicle',
        leftVehicle: 'leftVehicle',
        keydown: 'keydown',
        keyup: 'keyup',
        load: 'load',
        playerDisconnect: 'playerDisconnect',
        anyResourceStop: 'anyResourceStop',
        playerDeath: 'playerDeath',
        weaponDamage: 'weaponDamage',
        playerDamage: 'playerDamage',
        gameEntityDestroy: 'gameEntityDestroy',
        gameEntityCreate: 'gameEntityCreate',
    };

    public static player = {
        login: 'player:login',
        closeLogin: 'player:close',
        register: 'player:register',
        noclip: 'player:noclip',
    };

    public static time = { sync: 'time:sync', set: 'time:set' };
    public static weather = { sync: 'weather:sync' };
    public static console = {
        login: 'console:login',
        revive: 'console:revive',
        vehicle: 'console:vehicle',
        weather: 'console:weather',
        time: 'console:time',
        pos: 'console:pos',
        getPos: 'console:getPos',
        weapon: 'console:weapon',
        dv: 'console:dv',
        noclip: 'console:noclip',
        ad: 'console:aduty',
        blips: 'console:blips',
        repair: 'console:repair',
        report: 'console:report',
    };

    public static character = {
        loadMenu: 'character:load',
        switchCharacter: 'character:switch',
        set: 'character:set',
        create: 'character:create',
    };

    public static mugshot = { start: 'mugshot:start', stop: 'mugshot:stop' };
    public static vehicle = { engine: 'vehicle:setEngine', enter: 'vehicle:enter' };
    public static hud = { hideAll: 'hud:hideAll' };
    public static notification = 'notification';
    public static noclip = { pos: 'noclip:pos' };
    public static keys = { load: 'keys:load', update: 'keys:update', setLayout: 'keys:setLayout', enableKeys: 'keys:toggle' };
    public static settings = { load: 'settings:load', toggle: 'settings:toggle' };
    public static skinCreator = { sync: 'skinCreator:sync' };
    public static adminUtility = { blips: 'blips:admin', nameTag: 'blips:nameTag' };
}
