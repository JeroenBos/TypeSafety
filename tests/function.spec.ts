import { assert, IsExact, GetKey } from '../typeHelper';
import { TypeDescriptionsFor, ITypeDescriptions, Variance } from '../ITypeDescription';
import { BaseTypeDescriptions, PrimitiveTypes, nonnullNorUndefinedDescription, nonnullDescription, definedDescription } from '../built-ins';
import { TypeSystem } from '../typeSystem';

export type CheckableTypes = {
    'f': (x: number) => void,
    'C': { someFunction: () => void },
    'D': { f: (i: number) => void },
}
export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly f = this.create<(x: number) => void>('a');
    public readonly C = this.create<CheckableTypes['C']>({ someFunction: 'function' });
    public readonly D = this.create<CheckableTypes['D']>({ f: 'f' });
}
export const typeSystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions(), console.warn);


describe('function type system', () => {
    it('function is function', () => {
        const isFunction = typeSystem.extends('function', () => { });
        if (!isFunction)
            throw new Error();
    });

    it('0 is not a function', () => {
        const isFunction = typeSystem.extends('function', 0);
        if (isFunction)
            throw new Error();
    });

    it('null is not a function', () => {
        const isFunction = typeSystem.extends('function', null);
        if (isFunction)
            throw new Error();
    });

    it('null is a nullable function', () => {
        const isFunction = typeSystem.extends('nullable function', null);
        if (!isFunction)
            throw new Error();
    });
});
