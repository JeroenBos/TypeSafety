
import { TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, compose, nullable, PrimitiveTypes } from "../built-ins";
import { TypeDescriptionsFor, ITypeDescriptions } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact, GetKey, Optionals } from "../typeHelper";
import { optional } from "../missingHelper";

type C = { s: string } & { n: string };

///////////////////////////

export type Types = OptionalToMissing<{
    'optional c': { c?: string },
}>



///////////////////////////
// Type tests:

assert<IsExact<GetKey<string, Types & PrimitiveTypes>, 'string'>>(true); // primitive assertion

// show that missing is detectable in the type system:
assert<IsExact<GetKey<{ c: string | undefined }, Types>, 'optional c'>>(false);
assert<IsExact<GetKey<{ c?: string | undefined }, Types>, 'optional c'>>(true);


///////////////////////////

export class AllTypeDescriptions extends BaseTypeDescriptions<Types> implements TypeDescriptionsFor<Types> {
    public readonly 'optional c' = this.create<Types['optional c']>({ c: optional('string') });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions() as TypeDescriptionsFor<Types & PrimitiveTypes>);

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, {}>>(true);


describe('missing', () => {
    it('{} is { c?: string }', () => {
        const is = typeSystem.isExact('optional c', {});
        if (!is)
            throw new Error();
    });
    it(`{ c: ''} is { c?: string }`, () => {
        const is = typeSystem.isExact('optional c', { c: '' });
        if (!is)
            throw new Error();
    });
    it(`{ c: undefined } is { c?: string }`, () => {
        const is = typeSystem.isExact('optional c', { c: undefined });
        if (!is)
            throw new Error();
    });
    it(`{ } is Partial<{ c?: string }>`, () => {
        const is = typeSystem.isPartial('optional c', {});
        if (!is)
            throw new Error();
    });
    it(`{ c: ''} is Partial<{ c?: string }>`, () => {
        const is = typeSystem.isPartial('optional c', { c: '' });
        if (!is)
            throw new Error();
    });
    it(`{ c: undefined } is Partial<{ c?: string }>`, () => {
        const is = typeSystem.isPartial('optional c', { c: undefined });
        if (!is)
            throw new Error();
    });
});