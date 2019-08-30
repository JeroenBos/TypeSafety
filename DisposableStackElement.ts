/**
 * Used for debugging: tracking the path taken by the type system checker, used to output debugging information.
 * This class contains _one_ global/static stack.
 */
export class DisposableStackElement {
    private static stack: DisposableStackElement[] = [];
    public static enter(propertyName: string, typeName: string) {
        return new DisposableStackElement(propertyName, typeName);
    }
    public static toString(): { path: string, type: string } {
        const path = DisposableStackElement.stack
            .map(elem => elem.propertyName)
            .filter(elem => elem != '')
            .join('.');

        const type = DisposableStackElement.stack[DisposableStackElement.stack.length - 1].typeName;
        return { path, type };
    }
    private constructor(private readonly propertyName: string, private readonly typeName: string) {
        DisposableStackElement.stack.push(this);
    }
    public dispose() {
        const i = DisposableStackElement.stack.indexOf(this);
        if (i !== -1)
            DisposableStackElement.stack.splice(i, 1);
    }
}
