import 'mocha';
import { is, ITypeDescription, stringDescription, BaseTypeSystem, primitiveTypes } from '..';
import { Russell as IRussell } from '..';


export class A {
    x: string = 'a';
}
export class B {
    y: number = 3;
}



type checkableTypes = {
    'a': A,
    'b': B
}
export class AllTypeDescriptions {
    readonly x = stringDescription;
}
export class TypeSystem extends BaseTypeSystem<checkableTypes> {
    constructor() {
        super({
            a: null as any,
            b: null as any

        })
    }
}

describe('tests', () => {
    it('test number', () => {
        debugger;
        const typeSystem = new TypeSystem();
        typeSystem.assert('a')(null);

    })
});