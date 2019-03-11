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
export type GetKey<T/* extends TLookup[keyof TLookup]*/, TLookup> =
    {
        [K in keyof TLookup]: TLookup[K] extends T ? IsExactOrAny<T, TLookup[K]> extends true ? K : never : never
    }[keyof TLookup];