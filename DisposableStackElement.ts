/**
 * Used for debugging: tracking the path taken by the type system checker, used to output debugging information.
 * This class contains _one_ global/static stack.
 */
export class DisposableStackElement {
    private static stack: DisposableStackElement[] = [];
    public static create(message: string): DisposableStackElement {
        return new DisposableStackElement(message);
    }
    public static print(separator: string): string {
        return DisposableStackElement.stack.map(elem => elem.message).join(separator);
    }
    private constructor(private readonly message: string) {
        DisposableStackElement.stack.push(this);
    }
    public dispose() {
        const i = DisposableStackElement.stack.indexOf(this);
        if (i !== -1)
            DisposableStackElement.stack.splice(i, 1);
    }
}
