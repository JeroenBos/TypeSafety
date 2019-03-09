import { TypeSystem } from "./tests/test";

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 * @param expectTrue - True if the passed in type argument resolved to true.
 */
export function assert<T extends true | false>(expectTrue: T) {
}

/**
 * Asserts at compile time that the provided type argument's type resolves to true.
 */
export type AssertTrue<T extends true> = never;

/**
 * Asserts at compile time that the provided type argument's type resolves to false.
 */
export type AssertFalse<T extends false> = never;

/**
 * Asserts at compile time that the provided type argument's type resolves to the expected boolean literal type.
 */
export type Assert<T extends true | false, Expected extends T> = never;

/**
 * Checks if the type `T` has the specified type `U`.
 */
export type Has<T, U> = IsAny<T> extends true ? true
    : IsAny<U> extends true ? false
    : Extract<T, U> extends never ? false : true;

/**
 * Checks if the type `T` does not have the specified type `U`.
 */
export type NotHas<T, U> = Has<T, U> extends true ? false : true;

/**
 * Checks if the type `T` is possibly null or undefined.
 */
export type IsNullable<T> = Extract<T, null | undefined> extends never ? false : true;

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
 * Checks it the type `T` is the `never` type.
 */
export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * Checks it the type `T` is the `unknown` type.
 */
export type IsUnknown<T> = IsNever<T> extends true ? false
    : (T extends unknown ? unknown extends T ? /* catch any type */ T extends string ? false : true : false : false);

/**
 * Checks if the type `T` exactly matches type `U`, or whether `T` or `U` are exactly `any`.
 */
export type IsExactOrAny<T, U> = [T] extends [U] ? [U] extends [T] ? true : false : false;



export type MapType<T extends { [property in keyof T]: T[property] }> = T;
export type ExcludeKeysFromMapType<T extends { [property in keyof T]: T[property] }, TKeysToExclude extends keyof T>
    = { [property in Exclude<keyof T, TKeysToExclude>]: T[property] }
export type ExcludePrimitiveTypes<T extends { [property in (keyof primitiveTypes | keyof T)]: T[property] }>
    = ExcludeKeysFromMapType<T, keyof primitiveTypes>;

type Filter<T, U> = T extends U ? T : never;  // Remove types from T that are not assignable to U
type error = 'no such type';
export type K<T, Types extends Russell> = T extends undefined | null ? T
    : Exclude<T, undefined | null> extends { key: infer k; } ? k extends keyof Types ? k | Filter<T, undefined | null> : error
    : error;

type withOptionalParameter<R> = (obj: any, optional?: undefined) => R;
type withMandatoryParameter<R> = (obj: any, no_description_was_defined_for_the_generic_type_specified_to_getKey: undefined) => R;
type withParameterIf<B extends boolean, R> = B extends true ? withMandatoryParameter<R> : withOptionalParameter<R>;
type KIsError<T, Types extends Russell> = K<T, Types> extends error ? true : false;
type withParameterIfError<T, Types extends Russell> = withParameterIf<KIsError<T, Types>, T>;



export type primitiveTypes = {
    'null': null,
    'undefined': undefined,
    'number': number,
    'string': string,
    // 'boolean': boolean,
    // 'number?': number | undefined,
    // 'number|null': number | null,
    // 'number?|null': number | undefined | null,
}

export class BaseTypeDescriptions implements TypeDescriptionsFor<primitiveTypes> {

    'null' = nullDescription;
    'undefined' = undefinedDescription
    'number' = numberDescription;
    'string' = stringDescription;
}
function createPrimitiveDescription<p extends keyof primitiveTypes>(s: p): ITypeDescription<primitiveTypes[p]> {
    return ({
        is(obj: any): obj is primitiveTypes[p] {
            return typeof obj === s;
        },
    });
}
export function composeDescriptions<K1, K2>(description1: ITypeDescription<K1>, description2: ITypeDescription<K2>): ITypeDescription<K1 | K2> {
    return ({
        is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is K1 | K2 {
            return description1.is(obj, getSubdescription) || description2.is(obj, getSubdescription);
        },
    });
}
export const undefinedDescription: ITypeDescription<undefined> = ({ is(obj: any): obj is undefined { return obj === undefined; } })
export const nullDescription: ITypeDescription<null> = ({ is(obj: any): obj is null { return obj === null; } })
export const stringDescription = createPrimitiveDescription('string');
export const numberDescription = createPrimitiveDescription('number');
// export const booleanDescription = createPrimitiveDescription('boolean');

type primitiveTypeDescriptions = { [K in keyof primitiveTypes]: ITypeDescription<primitiveTypes[K]> };
export interface Russell {
    readonly 'number': ITypeDescription<number>,
    readonly 'string': ITypeDescription<string>,
    readonly 'boolean': ITypeDescription<boolean>,
};
type SelectTypeDescriptionsFor<
    Types extends { [K in keyof Types]: Types[K] },
    Keys extends keyof Types>
    = { [K in Keys]: ITypeDescription<Types[K]> }
export type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescription<Types[K]> }

type TypeDescriptionsForNonPrimitives<Types extends { [K in (keyof Types | keyof primitiveTypes)]: Types[K] }> =
    SelectTypeDescriptionsFor<Types, Exclude<keyof Types, keyof primitiveTypes>>;

type tes123t = TypeDescriptionsForNonPrimitives<
    primitiveTypes & {
        'x': object
    }>;
type test12341234 = TypeDescriptionsFor<primitiveTypes & { x: object }>;

type mapToTypeDescriptions<Types extends { [K in (keyof Types | keyof primitiveTypes)]: Types[K] }>
    = Map<keyof Types, Types[keyof Types]>
type withPrimitives<Types extends { [K in keyof Types]: Types[K] }>
    = { [K in keyof Types]: Types[K] } & { [K in keyof primitiveTypes]: primitiveTypes[K] }

type typeDescriptions<Types extends { [K in keyof Types]: Types[K] }> = ITypeDescription<Types[keyof Types]>;
type TypeConstraint<Types> = { [K in keyof (Types & primitiveTypes)]: (Types & primitiveTypes)[K] };
export class BaseTypeSystem<Types extends TypeConstraint<Types>> {
    // private readonly typeDescriptions = new mapToTypeDescriptions<Types>();
    private readonly typeDescriptions = new Map<keyof Types, typeDescriptions<Types>>();
    private _add(
        key: keyof Types,
        description: typeDescriptions<Types>
    ) {
        if (this.typeDescriptions.has(key))
            throw new Error('duplicate entry for key ' + key);
        this.typeDescriptions.set(key, description);
    }
    public add<TKey extends keyof Types>(key: TKey, typeDescription: ITypeDescription<Types[TKey]>) {
        this.typeDescriptions.set(key, typeDescription);
    }

    constructor(description: TypeDescriptionsFor<Types>) {
        for (const k in description) {
            const key = k as keyof TypeDescriptionsFor<Types>;
            const value = description[key];
            this.add(key, value);
        }
    }

    assert<K extends keyof Types>(key: K): (obj: any) => obj is Types[K] {
        return ((obj: any) => this._check(obj, key)) as any;
    }
    private _check<K extends keyof Types>(obj: any, key: K): obj is Types[K] {
        const description = this.getDescription(key);
        return description.is(obj, key => this.getDescription(key));
    }
    getDescription<K extends keyof Types>(key: K): typeDescriptions<Types> {
        const description = this.typeDescriptions.get(key);
        if (description === undefined)
            throw new Error('description missing for key ' + key);
        return description;
    }
}

type TypeDescriptions<T, K extends keyof T> = ITypeDescription<T[K]>

interface X {
    key: 3;
}
interface subX {
    key: 4;
}
interface NoKey {
    key: 3;
}
export function is<T extends { key: K } | undefined | null | string | number, K>(arg: T, key: K): arg is T {
    throw new Error('not implemented');
}

export interface ITypeDescription<T> {
    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is T;
}
export type getK<T, Types extends { [k in keyof Types]: Types[k] }> =
    { [K in keyof Types]: Types[K] extends T ? K : never };

type t = {
    'u': undefined,
    '0': null,
    's': string,
    'n': number,
    'x': {
        g: 'u'
    }
};
type asdf = getK<string, t>;



export type getKey<T, Types extends { [k in keyof Types]: Types[k] }> =
    { [K in keyof Types]: Types[K] extends T ? IsExactOrAny<T, Types[K]> extends true ? K : never : never }[keyof Types];

type asfaddfs = t[keyof t];
type asdf2 = getKey<string, t>;
type adfsasdfasdf2 = t[getKey<string, t>];
/// this is a type from T to 
export type DescriptionKeys<K extends keyof Types, Types> = { [u in keyof Types[K]]: getKey<Types[K][u], Types> }

/**
 * This class describes an interface, `Types[K]`, with key `K`.
 * The names of the properties are `keyof Types[K]`, and each property has the value of another key, i.e. of type `keyof Types`. 
 * More specifically, given the name of a property `p` of interface `Types[K]` where `p extends string & keyof Types[K]`, 
 * the key for this property is `Types[K][p]` and its type is `Types[Types[K][p]]`. 
 */
export class TypeDescription<K extends keyof Types, Types> implements ITypeDescription<Types[K]> {
    public static create<Types, K extends keyof Types>(
        propertyDescriptions: DescriptionKeys<K, Types>): ITypeDescription<Types[K]> {
        return new TypeDescription(propertyDescriptions);
    }
    private constructor(
        private readonly propertyDescriptions: DescriptionKeys<K, Types>
    ) {
    }

    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is Types[K] {
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                throw new Error();
            }
            const property = obj[propertyName];
            const propertyKey = this.propertyDescriptions[propertyName];
            const description = getSubdescription(propertyKey);
            if (!description.is(property, getSubdescription)) {
                return false;
            }
        }
        return true;
    }
    private isValidKey(propertyName: string | keyof Types[K]): propertyName is keyof Types[K] {
        const propertyDescriptions: object = this.propertyDescriptions;
        return propertyDescriptions.hasOwnProperty(propertyName);
    }
}
type TypeSystemType<Types> = BaseTypeSystem<Types & primitiveTypes>;

type asdfdfdfs<Types> = { [K in keyof Types]: Types[K] extends any ? K : never }[keyof Types];
type test = asdfdfdfs<{ a: 'b', c: 'd' }>;

type asdfdfdfs2<Types> = keyof { [K in keyof Types]: Types[K] extends any ? K : never };
type test2 = asdfdfdfs2<{ a: 'b', c: 'd' }>;

type test2134 = IsExact<asdfdfdfs<{}>, asdfdfdfs2<{}>>;
