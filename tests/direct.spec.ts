import { TypeDescriptionsFor, TypeSystem, PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined } from '..';
import { definedDescription, anyDescription } from '../built-ins';

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


export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly L1 = this.create<L1>({ x: anyDescription, b: anyDescription });
}

describe('', () => {
    it(`{ x: null, b: null } ∈ a but with any's`, () => {
        // arrange
        const logStatements: string[] = [];
        const descriptions: TypeDescriptionsFor<CheckableTypes & PrimitiveTypes> = new AllTypeDescriptions();
        const typesystem = new TypeSystem(descriptions, logStatements.push.bind(logStatements));

        // act
        const is = typesystem.extends('L1', { x: null, b: null });

        // assert
        if(!is) throw new Error();
    });
});