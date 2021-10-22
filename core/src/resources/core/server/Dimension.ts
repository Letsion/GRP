export abstract class Dimension {
    private static freeDimensions = [false];
    public static register(): number {
        const index = Dimension.freeDimensions.indexOf(true);
        if (index === -1) return Dimension.freeDimensions.push(false) - 1;
        Dimension.freeDimensions[index] = false;
        return index;
    }

    public static unregister(index: number): void {
        if (Dimension.freeDimensions[index] === undefined) throw new Error('Unknown dimension!');
        if (Dimension.freeDimensions[index]) throw new Error("Can't unregister free dimension!");
        Dimension.freeDimensions[index] = true;
    }
}
