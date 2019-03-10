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

