import { createCreateFunction, TypeSystem, DebugTypeSystem } from ".";
import { PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined, possiblyNullOrUndefined, nullable, optional, ExcludePrimitives } from "./built-ins";
import { TypeDescriptionsFor } from "./ITypeDescription";
import { OptionalToMissing, IsExact, assert, IsExactOrAny, IsNotNever, IsNever, Or, ValuesOf, ContainsExactValue, ContainsExactValues, NotNeverValues } from "./typeHelper";

export class A {
    x: string = 'a';
    // note that 'b: B | undefined' could result in an error, because that's equivalent to `A` missing the property 'b'
    // and tsc does not distuinguish between missing and type undefined
    b: B | undefined = undefined;
    // c?: number;    missing properties aren't supported yet
}
export class B {
    a: A = new A();
}

///////////////////////////

type checkableTypes = OptionalToMissing<{
    'a': A,
    'b': B,
    'b?': B | undefined,
    'nullable b': B | null,
    'nullable b?': B | undefined | null,
    'optional b'?: B
}>
export type allCheckableTypes = checkableTypes & PrimitiveTypes;

const create = <T extends object>() => createCreateFunction<allCheckableTypes, T>();

class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    public readonly a = create<A>()({ x: 'string', b: 'b?' });
    public readonly b = create<B>()({ a: 'a' });
    public readonly 'b?' = possiblyUndefined(this.b);
    public readonly 'nullable b' = nullable(this.b);
    public readonly 'nullable b?' = possiblyNullOrUndefined(this.b);
    public readonly 'optional b' = optional(this.b);
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, {}>>(true);




export type Types = {
    'c': C,
    'd': D,
    'g': number | string,
    'b': E,
    'f': F,
    'bool or 4': boolean | 4
}
interface C {
    s: string,
    d: D,
    n: string | undefined
    e: number | string,
    // r: D | string
}
interface D {
    x: C
}
interface E {
    d: string
}
interface F {

    b: boolean | 1;
    c: boolean | 4;
}






type s1 = ContainsExactValues<C, Types>

class error { }
type allAcceptedTypes = Types[keyof Types][keyof Types[keyof Types]];


type GetKey<T, TLookup> = { [K in keyof TLookup]: TLookup[K] extends T ? IsExactOrAny<T, TLookup[K]> extends true ? K : never : never }[keyof TLookup];
assert<IsExact<GetKey<C, Types>, 'c'>>(true);
assert<IsExact<GetKey<D, Types>, 'd'>>(true);
assert<IsExact<GetKey<C | D, Types>, never>>(true);
assert<IsExact<GetKey<{}, Types>, never>>(true); // assumes there is no empty type in Types
assert<IsExact<GetKey<keyof Types, Types>, never>>(true);


type TypeOfGetKey<T, TLookup> = TLookup[GetKey<T, TLookup>]
assert<IsExact<TypeOfGetKey<C, Types>, C>>(true);
assert<IsExact<TypeOfGetKey<D, Types>, D>>(true);
assert<IsExact<TypeOfGetKey<C | D, Types>, never>>(true);
assert<IsExact<TypeOfGetKey<{}, Types>, never>>(true);  // assumes there is no empty type in Types
assert<IsExact<TypeOfGetKey<keyof Types, Types>, never>>(true);
