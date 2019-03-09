import 'mocha';
import { is, ITypeDescription, stringDescription, BaseTypeSystem, primitiveTypes, TypeDescriptionsFor, TypeDescription, numberDescription, composeDescriptions, undefinedDescription } from '..';


export class A {
    x: string = 'a';
    b: B | undefined;
}
export class B {
    a: A = new A();
}



type checkableTypes = {
    'a': A,
    'b': B,
    'b?': B | undefined
}
export class AllTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    // public readonly a = lazy({}, AllTypeDescriptions.createA);
    // private static createA(this: AllTypeDescriptions): ITypeDescription<A> {
    //     return TypeDescription.create<A>({ x: stringDescription, b: this['b?'] });
    // }
    public readonly a = TypeDescription.create<checkableTypes, A>({ x: 'string', b: 'b?' });
    public readonly b = TypeDescription.create<B>({ a: this.a });
    public readonly 'b?' = composeDescriptions(this.b, undefinedDescription);

    constructor() {
        for (const key in this) {
            const description = this[key] as any as { __factory__: () => any };
            if (AllTypeDescriptions.isLazilyInitializedObject(description)) {
                Object.assign(description, description.__factory__());
                delete description.__factory__;
            }
        }
    }

    private static isLazilyInitializedObject(obj: any): obj is { __factory__: () => any } {
        return obj.__factory__ !== undefined;
    }
}
function lazy<T>(obj: {}, factory: (a: null, _: AllTypeDescriptions) => T): T {
    (obj as any).__factory__ = factory;
    return obj as T;
}
export class TypeSystem extends BaseTypeSystem<checkableTypes> {
    constructor() {
        super(new AllTypeDescriptions())
    }
}

describe('tests', () => {
    it('test number', () => {
        debugger;
        const typeSystem = new TypeSystem();
        typeSystem.assert('a')(null);

    })
});