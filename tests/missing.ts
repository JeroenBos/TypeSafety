
import { createCreateFunction, TypeSystem, DebugTypeSystem, possiblyMissing, optional } from "../typesystem";
import { BaseTypeDescriptions, compose, nullable, PrimitiveTypes, Missing } from "../built-ins";
import { TypeDescriptionsFor, ITypeDescriptions } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact, GetKey, Optionals } from "../typeHelper";

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



export type GetKey2<T /*extends TLookup[keyof TLookup]*/, TLookup> =
    {
        [K in keyof TLookup]:
        TLookup[K] extends Missing ? IsExact<T, Exclude<TLookup[K], Missing> | undefined> extends true ? K : never : 
        IsExact<T, TLookup[K]> extends true ? K : never
    }[keyof TLookup];


type r = { c?: string };
type r2 = Required<{ c?: string | undefined }>;
type r3 = { c?: string | undefined };

// reproduce base cases:    
assert<IsExact<GetKey<r, Types>, 'optional c'>>(true);
assert<IsExact<GetKey<r2, Types>, 'optional c'>>(false);
assert<IsExact<GetKey<r3, Types>, 'optional c'>>(true);


// continue exceptional case:
type exptected = ITypeDescriptions<possiblyMissing<'string'>>;
assert<IsExact<GetKey<r, Types>, exptected>>(true);


type lookup = GetKey<r, Types>;
assert<IsExact<GetKey<r2, Types>, 'optional c'>>(true);

assert<IsExact<GetKey<r2, Types>, 'optional c'>>(false);






///////////////////////////
export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 'optional c' = create<Types['optional c']>()({ c: optional('string?') });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, {}>>(true);


describe('missing', () => {
    
});