/**
 * Used for debugging: tracking the path taken by the type system checker, used to output debugging information.
 * This class contains _one_ global/static stack.
 */
export class DisposableStackElement {
    private static stack: DisposableStackElement[] = [];
    public static enterType(typeName: string): DisposableStackElement {
        return new DisposableStackElement(typeName, true);
    }
    public static enterProperty(propertyName: string): DisposableStackElement {
        return new DisposableStackElement(propertyName, false);
    }
    public static toString(): { path: string, type: string } {
        const path = j(false);
        const type = j(true);

        return { path, type };

        function j(isType: boolean) {
            return DisposableStackElement.stack
                .filter(elem => elem.isType == isType)
                .map(elem => elem.message)
                .reverse()
                .join('.');
        }
    }
    private constructor(private readonly message: string, private readonly isType: boolean) {
        DisposableStackElement.stack.push(this);
    }
    public dispose() {
        const i = DisposableStackElement.stack.indexOf(this);
        if (i !== -1)
            DisposableStackElement.stack.splice(i, 1);
    }
}
