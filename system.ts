import { createCreateFunction, TypeSystem } from ".";
import { PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined, possiblyNullOrUndefined, nullable, optional } from "./built-ins";
import { TypeDescriptionsFor } from "./ITypeDescription";
import { OptionalToMissing, IsExact, assert, IsExactOrAny, IsNotNever, IsNever, Or, ValuesOf, ContainsExactValue, ContainsExactValues } from "./typeHelper";

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




export type checkableTypes = OptionalToMissing<{
    'a': A,
    'b': B,
    'b?': B | undefined,
    'nullable b': B | null,
    'nullable b?': B | undefined | null,
    'optional b'?: B
}>
export type allCheckableTypes = checkableTypes & PrimitiveTypes;


const create = <T extends object>() => createCreateFunction<allCheckableTypes, T>();


export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    public readonly a = create<A>()({ x: 'string', b: 'b?' });
    public readonly b = create<B>()({ a: 'a' });
    public readonly 'b?' = possiblyUndefined(this.b);
    public readonly 'nullable b' = nullable(this.b);
    public readonly 'nullable b?' = possiblyNullOrUndefined(this.b);
    public readonly 'optional b' = optional(this.b);
}



export const typeSystem = new TypeSystem(new AllTypeDescriptions());




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





type NotNeverValues<TLookup> = { [U in { [K in keyof TLookup]: IsNever<TLookup[K]> extends true ? never : K }[keyof TLookup]]: TLookup[U] }
type nn = NotNeverValues<{ a: never, b: string }>

type AllSPINTDebug<T, S> = { [K in keyof T]: ContainsExactValues<Exclude<T[K], string | number>, S> extends false ? [T[K], K] : never }[keyof T]
type allSPINTDebug = AllSPINTDebug<Types, Types & PrimitiveTypes>[0]

type l1Debug<T, S> = NotNeverValues<{ [K in keyof T]: ContainsExactValue<T[K], S> extends true ? never : T[K] }>
type debug3 = l1Debug<C, Types & PrimitiveTypes>

type ExcludePrimitive<T> = Exclude<T, string | number | boolean>

type AllSPINT<T, S> = { [K in keyof T]: [l1Debug<ExcludePrimitive<T[K]>, S>, ExcludePrimitive<T[K]>, ContainsExactValues<ExcludePrimitive<T[K]>, S>] }
type debug = AllSPINT<Types, Types & PrimitiveTypes>;
type debugc = debug['c'][0]
type debugd = debug['d'][0]
type debugf = debug['f'][0]
type debug2 = AllSPINT<Types, Types & PrimitiveTypes>;
type debugbool4 = debug2['bool or 4']

type DEBUG<T, S> = NotNeverValues<{ [K in keyof T]: ContainsExactValues<T[K], S> extends false ? l1Debug<T[K], S> : never }>
type finalDebug = DEBUG<Types, Types & PrimitiveTypes> // also add e.g. `r: D | string` to `C` and see it pop up
// only down side is that it isn't perfectly filtered yet, there are too many nevers not contracted by NotNeverValues yet
assert<IsExact<finalDebug, {}>>(true); // if you remove 'f' from Types it'll work

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
