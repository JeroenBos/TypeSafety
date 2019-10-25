import { anyDescription, stringDescription, PrimitiveTypes, BaseTypeDescriptions } from '../built-ins';
import { ITypeDescriptions, TypeDescriptionsFor } from '../ITypeDescription';
import { DescriptionKeysOrObjects, optional } from '../missingHelper';
import { GetKey } from '../typeHelper';
import { TypeSystem } from '../typeSystem';

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
});
describe('in conjunction with optional(..)', () => {
    type L4 = { m?: string };
    type CheckableTypes = { L1: { m?: string } };
    type L4Description = DescriptionKeysOrObjects<GetKey<L4, PrimitiveTypes & CheckableTypes>, PrimitiveTypes & CheckableTypes, L4>;

    class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> {
        public readonly L1 = this.create<L4>({ m: optional(stringDescription) });
    }
    const descriptions: TypeDescriptionsFor<CheckableTypes & PrimitiveTypes> = new AllTypeDescriptions();
    const typesystem = new TypeSystem(descriptions);

    it(`m is missing is accepted`, () => {
        debugger;
        // act
        const is = typesystem.extends('L1', {}); // m is missing

        // assert
        if (!is) throw new Error();
    });
    it(`m is missing is present is accepted`, () => {
        // act
        const is = typesystem.extends('L1', { m: '' });

        // assert
        if (!is) throw new Error();
    });
    it(`m is missing is undefined is accepted`, () => {
        // act
        const is = typesystem.extends('L1', { m: undefined });

        // assert
        if (!is) throw new Error();
    });
    it(`m of wrong type is not accepted`, () => {
        debugger;
        // act
        const is = typesystem.extends('L1', { m: 0 });

        // assert
        if (is) throw new Error();
    });
});