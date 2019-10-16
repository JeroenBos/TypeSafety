
import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typesystem";
import { BaseTypeDescriptions, compose, nullable, PrimitiveTypes, Missing } from "../built-ins";
import { TypeDescriptionsFor, ITypeDescriptions } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact, GetKey, Optionals } from "../typeHelper";
import { optional } from "../missingHelper";

type C = { s: string } & { n: string };

///////////////////////////

export type Types = OptionalToMissing<{
    'optional c': { c?: string },
}>
const create = <T extends object>() => createCreateFunction<Types, T>();




///////////////////////////
// Type tests:

assert<IsExact<GetKey<string, Types & PrimitiveTypes>, 'string'>>(true); // primitive assertion

// show that missing is detectable in the type system:
assert<IsExact<GetKey<{ c: string | undefined }, Types>, 'optional c'>>(false);
assert<IsExact<GetKey<{ c?: string | undefined }, Types>, 'optional c'>>(true);


///////////////////////////

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 'optional c' = create<Types['optional c']>()({ c: optional('string') });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, {}>>(true);


describe('missing', () => {
    it('{} is { c?: string }', () => {
        debugger;
        const x = {};
        const is = typeSystem.isExact('optional c', x);
        if (!is)
            throw new Error();
    });
    it(`{ c: ''} is { c?: string }`, () => {
    });
    it(`{ c: undefined } is { c?: string }`, () => {
    });
    it(`{ } is Partial<{ c?: string }>`, () => {
    });
    it(`{ c: ''} is Partial<{ c?: string }>`, () => {
    });
    it(`{ c: undefined } is Partial<{ c?: string }>`, () => {
    });
});