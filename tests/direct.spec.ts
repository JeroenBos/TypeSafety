import { TypeDescriptionsFor, TypeSystem, PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined } from '..';
import { anyDescription } from '../built-ins';
import { ITypeDescriptions } from '../ITypeDescription';

interface L1 {
    x: string;
    b: L2;
}
interface L2 {
    c: L1 | undefined;
    s: string;
}

///////////////////////////

export type CheckableTypes = {
    'L1': L1,
}


export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> {
    public readonly L1 = this.create<L1>({ x: anyDescription, b: anyDescription });
}

describe('direct description', () => {
    it(`can result in true`, () => {
        // arrange
        const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());

        // act
        const is = typesystem.extends('L1', { x: null, b: null });

        // assert
        if (!is) throw new Error();
    });
    it(`can result in true with nested arg`, () => {
        // arrange
        const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());

        // act
        const is = typesystem.extends('L1', { x: '', b: { c: undefined, s: '' } });

        // assert
        if (!is) throw new Error();
    });

    it(`can result in true with nested arg`, () => {
        // arrange
        const particularStringDescription: ITypeDescriptions<string> = { is: (obj: any, ..._args): obj is string => { return obj == 'x'; } }
        const L2Description: ITypeDescriptions<L2> = BaseTypeDescriptions.create<L2, CheckableTypes & PrimitiveTypes>({ c: anyDescription, s: particularStringDescription });
        class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> {

            public readonly L1 = this.create<L1>({ x: anyDescription, b: L2Description });
        }
        const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());

        // act
        const is = typesystem.extends('L1', { x: '', b: { c: undefined, s: 'x' } });
        const is2 = typesystem.extends('L1', { x: '', b: { c: undefined, s: 'y' } });
        // assert
        if (!is) throw new Error();
        if (is2) throw new Error();
    });
}); // TODO: test combination with optional(..). maybe refactor into getSubDescriptions