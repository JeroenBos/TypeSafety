
import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, compose } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact } from "../typeHelper";

type C = { s: string } & { n: string };

///////////////////////////

export type Types = OptionalToMissing<{
    'c': C,
    's': { s: string },
    'n': { n: string },
}>
const create = <T extends object>() => createCreateFunction<Types, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 's' = create<Types['s']>()({ s: 'string' });
    public readonly 'n' = create<Types['n']>()({ n: 'string' });
    public readonly 'c' = compose(this.s, this.n);
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, {}>>(true);


describe('conjunction', () => {
    it('C', () => {
        const c: C = {
            s: '',
            n: ''
        };
        const isC = typeSystem.extends('c', c);
        if (!isC)
            throw new Error();
    });

    it('partial C is no C', () => {
        const c = {
            s: '',
        };
        const isC = typeSystem.extends('c', c);
        if (isC)
            throw new Error();
    });

    it('too large C is not exact C', () => {
        const c = {
            s: '',
            n: '',
            f: ''
        };
        const isExaclyC = typeSystem.isExact('c', c);
        if (isExaclyC)
            throw new Error();
    });

    it('exactly C is partial C', () => {
        const c = {
            s: '',
            n: '',
        };
        const isC = typeSystem.isPartial('c', c);
        if (!isC)
            throw new Error();
    });
});