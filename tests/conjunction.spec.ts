
import { TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, PrimitiveTypes, conjunct } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact } from "../typeHelper";

type C = { s: string } & { n: string };

///////////////////////////

export type Types = OptionalToMissing<{
    'c': C,
    's': { s: string },
    'n': { n: string },
}>

export class AllTypeDescriptions extends BaseTypeDescriptions<Types> implements TypeDescriptionsFor<Types> {
    public readonly 's' = this.create<Types['s']>({ s: 'string' });
    public readonly 'n' = this.create<Types['n']>({ n: 'string' });
    public readonly 'c' = conjunct(this.s, this.n);
}

export const typeSystem = new TypeSystem<Types & PrimitiveTypes>(new AllTypeDescriptions());

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