import { Missing } from "./built-ins";

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 * @param expectTrue - True if the passed in type argument resolved to true.
 */
export function assert<T extends true | false>(expectTrue: T) {
}

/**
 * Checks if the type `T` has the specified type `U`.
 */
export type Has<T, U> = IsAny<T> extends true ? true
    : IsAny<U> extends true ? false
    : Extract<T, U> extends never ? false : true;

/**
 * Checks if the type `T` exactly matches type `U`.
 * @remarks This is useful for checking if two union types match exactly.
 */
export type IsExact<T, U> = IsAny<T> extends true ? IsAny<U> extends true ? true : false
    : IsAny<U> extends true ? false
    : [T] extends [U] ? [U] extends [T] ? true : false : false;

/**
 * Checks if the type `T` is the `any` type.
 */
export type IsAny<T> = IsUnknown<T> extends true ? false
    : IsNever<T> extends true ? false
    : T extends any ? any extends T ? true : false : false;

/**
 * Checks if the type `T` exactly matches type `U`, or whether `T` or `U` are exactly `any`.
 */
export type IsExactOrAny<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;

/**
 * Checks if the type `T` is the `never` type.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Checks if the type `T` is not the `never` type.
 */
export type IsNotNever<T> = [T] extends [never] ? false : true;

/**
 * Checks if the type `T` is the `unknown` type.
 */
export type IsUnknown<T> = IsNever<T> extends true ? false
    : (T extends unknown ? unknown extends T ? /* catch any type */ T extends string ? false : true : false : false);

/**
 * Gets the keys of `T` that are optional, i.e. those that are of the form `name? : type`. 
 * Properties that are assignable to undefined are not considered optional in this respect.
 */
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];

/**
 * Gets the keys of `T` that are optional, i.e. those that are not of the form `name? : type`. 
 * Properties that are assignable to undefined do not influences whether they are considered to be required in this respect.
 */
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];
assert<IsExact<OptionalKeys<{}>, never>>(true);
assert<IsExact<OptionalKeys<{ a?: string }>, 'a'>>(true);
assert<IsExact<OptionalKeys<{ a: undefined }>, never>>(true);
assert<IsExact<OptionalKeys<{ a: string | undefined }>, never>>(true);

/**
 * Gets the subtype of `T` whose keys are optional.
 */
export type Optionals<T> = { [K in OptionalKeys<T>]: T[K] }
assert<IsExact<Optionals<{}>, {}>>(true);
assert<IsExact<Optionals<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<Optionals<{ a: undefined }>, {}>>(true);
assert<IsExact<Optionals<{ a: string | undefined }>, {}>>(true);

/**
 * Gets the subtype of `T` whose properties are optional, and where all properties of the form `name?: type` are replaced by `name: type | undefined`.
 */
type OptionalsWithUndefined<T> = { [K in OptionalKeys<T>]: T[K] | undefined }
assert<IsExact<OptionalsWithUndefined<{}>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<OptionalsWithUndefined<{ a: undefined }>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ a: string | undefined }>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ c?: number; e: number; }>, { c: number | undefined; }>>(true);


/**
 * Gets the subtype of `T` whose properties are optional, and where all properties of the form `name?: type` are replaced by `name: type | Missing`.
 */
type OptionalsWithMissing<T> = { [K in OptionalKeys<T>]: T[K] | Missing }
assert<IsExact<OptionalsWithMissing<{}>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a?: string }>, { a: string | Missing }>>(true);
assert<IsExact<OptionalsWithMissing<{ a: undefined }>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a: string | undefined }>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a?: { c: number } }>, { a: Missing | { c: number } }>>(true);
assert<IsExact<OptionalsWithMissing<{ a?: { c?: 0, d: number } }>, { a: { c: 0 | Missing } | Missing }>>(true);

/**
 * Gets the subtype of `T` whose properties are required.
 */
type Requireds<T> = { [K in RequiredKeys<T>]: T[K] }
assert<IsExact<Requireds<{}>, {}>>(true);
assert<IsExact<Requireds<{ a?: string }>, {}>>(true);
assert<IsExact<Requireds<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<Requireds<{ a: string | undefined }>, { a: string | undefined }>>(true);

/**
 * Gets a type similar to `T`, but where all properties of the form `name?: type` are replaced by `name: type | Missing`.
 */
export type OptionalToMissing<T> = OptionalsWithMissing<T> & Requireds<T>
assert<IsExact<OptionalToMissing<{}>, {}>>(true);
assert<IsExact<OptionalToMissing<{ a?: string }>, { a: string | Missing }>>(true);
assert<IsExact<OptionalToMissing<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<OptionalToMissing<{ a: string | undefined }>, { a: string | undefined }>>(true);

/**
 * Gets a type similar to `T`, but where all properties of the form `name?: type` are replaced by `name: type | undefined`.
 * I.e. this is 'required' in the sense that `undefined` also indicates 'present', but only a missing property does not.
 * This is in contrast with the type `Required` from the standard library, 
 * which return a type whose properties of the form `name?: type` are replaced `name: Exclude<type, undefined>`.
 */
export type MyRequired<T> = OptionalsWithUndefined<T> & Requireds<T>
assert<IsExact<MyRequired<{}>, {}>>(true);
assert<IsExact<MyRequired<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<MyRequired<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<MyRequired<{ a: string | undefined }>, { a: string | undefined }>>(true);
assert<IsExact<MyRequired<{ c?: number; e: number; }>, { c: number | undefined, e: number }>>(true);
assert<IsExact<MyRequired<{ c?: number; d: undefined; e: number }>, { c: number | undefined; d: undefined; e: number }>>(true);

/**
 * Gets the key `K` such that `L[K] === T`. If there are multiple `K`s, you get the union. TODO: restrict L to be a function, i.e. that the L[keyof L] are unique.
 * 
 * L: for TLookup
 */
export type GetKey<T /*extends TLookup[keyof TLookup]*/, TLookup> =
    {
        [K in keyof TLookup]: TLookup[K] extends T ? IsExactOrAny<T, TLookup[K]> extends true ? K : never : never
    }[keyof TLookup];


export type ValuesOf<T> = T[keyof T];

/**
 * Gets whether any of the array or lookup values in the specified type is `true`.
 */
export type Or<T extends
    { [k: string]: Boolean }
    | [boolean]
    | [boolean, boolean]
    | [boolean, boolean, boolean]
    | [boolean, boolean, boolean, boolean]
    >
    = IsNever<T> extends true ? never
    : T[0] extends true ? true
    : T[1] extends true ? true
    : T[2] extends true ? true
    : T[3] extends true ? true
    : T extends { [k: string]: Boolean } ? IsNotNever<ValuesOf<{ [k in keyof T]: T[k] extends true ? true : never }>>
    : false

assert<Or<[boolean, boolean]>>(false);
assert<Or<[false, false]>>(false);
assert<Or<[true, false]>>(true);
assert<Or<[false, true]>>(true);
assert<Or<[false, false, false]>>(false);
assert<Or<[true, false, false]>>(true);
assert<Or<[false, true, false]>>(true);
assert<Or<[false, false, true]>>(true);
assert<Or<{ a: true }>>(true);
assert<Or<{ a: false }>>(false);
assert<Or<{ a: true, b: false }>>(true);
assert<Or<{}>>(false);

/**
 * Gets whether all of the array or lookup values in the specified type are `true`.
 */
export type And<T extends
    { [k: string]: Boolean }
    | [boolean]
    | [boolean, boolean]
    | [boolean, boolean, boolean]
    | [boolean, boolean, boolean, boolean]
    >
    = IsNever<T> extends true ? never
    : IsExact<T, {}> extends true ? false
    : T[0] extends false ? false
    : T[1] extends false ? false
    : T[2] extends false ? false
    : T[3] extends false ? false
    : T extends { [k: string]: Boolean } ? IsNever<ValuesOf<{ [k in keyof T]: T[k] extends true ? never : true }>>
    : true

assert<And<[false, false]>>(false);
assert<And<[true, false]>>(false);
assert<And<[false, true]>>(false);
assert<And<[true, true]>>(true);
assert<And<[false, false, false]>>(false);
assert<And<[true, false, false]>>(false);
assert<And<[false, true, false]>>(false);
assert<And<[false, false, true]>>(false);
assert<And<[false, true, true]>>(false);
assert<And<[true, true, true]>>(true);
assert<And<{}>>(false); // I don't know whether this should ne false....
assert<And<{ a: true }>>(true);
assert<And<{ a: true, b: false }>>(false);
assert<And<{ a: true, b: true }>>(true);


/**
 * Gets whether `L` contains a value of exactly type `T`. This does not include optional values.
 * Functions are included too, because under the hood they're simply properties.
 */
export type ContainsExactValue<T, L>
    = IsExact<L, {}> extends true ? false
    : Or<{ [K in keyof L]: IsExact<L[K], T> }>

type cev1 = { a: string }
assert<ContainsExactValue<number, cev1>>(false);
assert<ContainsExactValue<string, cev1>>(true);
assert<ContainsExactValue<string | undefined, cev1>>(false);
type cev2 = { a?: string }
assert<ContainsExactValue<number, cev2>>(false);
assert<ContainsExactValue<string, cev2>>(false);
assert<IsExact<cev2['a'], string | undefined>>(true);
assert<ContainsExactValue<string | undefined, cev2>>(false); // missing properties are not included by `ContainsExactValue`
type cev3 = { f(): void }
assert<ContainsExactValue<Function, cev3>>(false);
assert<ContainsExactValue<() => void, cev3>>(true);


/**
 * Gets whether all values in the lookup type `T` are exactly contained as values in the lookup type `L`.
 */
export type ContainsExactValues<T, L>
    = IsNever<T> extends true ? true
    : IsExact<T, {}> extends true ? true
    : ValuesOf<{ [K in keyof T]: ContainsExactValue<T[K], L> }>

assert<ContainsExactValues<{}, {}>>(true);
assert<ContainsExactValues<{ _: undefined }, {}>>(false);
type ces = { s: string, f: undefined };
assert<ContainsExactValues<{}, ces>>(true);
assert<ContainsExactValues<{ _: string }, ces>>(true);
assert<ContainsExactValues<{ _: string | undefined }, ces>>(false);
assert<ContainsExactValues<{ _: string, __: undefined }, ces>>(true);
assert<ContainsExactValues<{ _: string, __: string }, ces>>(true);
