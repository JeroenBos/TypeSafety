import { IsAny, IsExact, assert, IsExactOrAny, Has, IsNotNever } from "./typeHelper";



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
    'boolean': boolean,

    'optional string': string | Missing,
    'optional number': number | Missing,
    'optional boolean': boolean | Missing,

    'string?': string | undefined,
    'number?': number | undefined,
    'boolean?': boolean | undefined,

    'nullable string': string | null,
    'nullable number': number | null,
    'nullable boolean': boolean | null,

    'nullable string?': string | null | undefined,
    'nullable number?': number | null | undefined,
    'nullable boolean?': boolean | null | undefined,
}

export class BaseTypeDescriptions implements TypeDescriptionsFor<primitiveTypes> {

    'null' = nullDescription;
    'undefined' = undefinedDescription

    'number' = numberDescription;
    'string' = stringDescription;
    'boolean' = booleanDescription;

    'optional string' = optional(numberDescription);
    'optional number' = optional(numberDescription);
    'optional boolean' = optional(booleanDescription);

    'string?' = possiblyUndefined(stringDescription);
    'number?' = possiblyUndefined(numberDescription);
    'boolean?' = possiblyUndefined(booleanDescription);

    'nullable string' = nullable(stringDescription);
    'nullable number' = nullable(numberDescription);
    'nullable boolean' = nullable(booleanDescription);

    'nullable string?' = possiblyNullOrUndefined(stringDescription);
    'nullable number?' = possiblyNullOrUndefined(numberDescription);
    'nullable boolean?' = possiblyNullOrUndefined(booleanDescription);
}
function createPrimitiveDescription<p extends keyof primitiveTypes>(s: p): ITypeDescription<primitiveTypes[p]> {
    return ({
        is(obj: any): obj is primitiveTypes[p] {
            return typeof obj === s;
        },
    });
}
class missingType { }
const missing = Object.freeze(new missingType());
export type Missing = missingType | undefined
export function nullable<TBase>(description1: ITypeDescription<TBase>): ITypeDescription<TBase | null> {
    return composeDescriptions(nullDescription, description1);
}
export function optional<TBase>(description1: ITypeDescription<TBase>): ITypeDescription<TBase | Missing> {
    return composeDescriptions(missingDescription, description1);
}
export function optionalNullable<TBase>(description1: ITypeDescription<TBase>): ITypeDescription<TBase | Missing | null> {
    return composeDescriptions(missingOrNullDescription, description1);
}
export function possiblyUndefined<TBase>(description1: ITypeDescription<TBase>): ITypeDescription<TBase | undefined> {
    return composeDescriptions(undefinedDescription, description1);
}
export function possiblyNullOrUndefined<TBase>(description1: ITypeDescription<TBase>): ITypeDescription<TBase | undefined | null> {
    return composeDescriptions(undefinedOrNullDescription, description1);
}

export function composeDescriptions<K1, K2>(description1: ITypeDescription<K1>, description2: ITypeDescription<K2>): ITypeDescription<K1 | K2> {
    return ({
        is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is K1 | K2 {
            return description1.is(obj, getSubdescription) || description2.is(obj, getSubdescription);
        },
    });
}

const missingDescription: ITypeDescription<Missing> = ({ is(obj: any): obj is Missing { return obj === undefined || obj === missing; } });
const missingOrNullDescription: ITypeDescription<Missing | null> = ({ is(obj: any): obj is Missing | null { return obj === missing || obj === undefined || obj === null; } })
const undefinedOrNullDescription: ITypeDescription<undefined | null> = ({ is(obj: any): obj is undefined | null { return obj === undefined || obj === null; } })
const undefinedDescription: ITypeDescription<undefined> = ({ is(obj: any): obj is undefined { return obj === undefined; } })
const nullDescription: ITypeDescription<null> = ({ is(obj: any): obj is null { return obj === null; } })
export const stringDescription = createPrimitiveDescription('string');
export const numberDescription = createPrimitiveDescription('number');
export const booleanDescription = createPrimitiveDescription('boolean');

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
export class TypeSystem<Types extends TypeConstraint<Types>> {
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
    // only difference with 
    assert<K extends keyof Types>(key: K): (arg: Types[K]) => arg is Types[K] {
        return this.check(key);
        //const f: castArg<(obj: any) => obj is Types[K], Types[K]> = this.check(key);
        //return f as any;
    }

    check<K extends keyof Types>(key: K): (obj: any) => obj is Types[K] {
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
type notAny<T> = IsAny<T> extends true ? never : T
export type nonAnyFunction<T, K extends keyof T> = IsAny<K> extends true ? never : IsAny<T[K]> extends true ? never : (arg: T[K]) => arg is T[K];
assert<IsExact<nonAnyFunction<string, any>, never>>(true);
type replaceAnyByNever<T> = IsAny<T> extends true ? never : T;
type castArg<F extends (arg: any) => any, TArgResult> = F extends (arg: any) => infer TResult ? (arg: TArgResult) => TResult : never;
assert<IsExact<castArg<(i: number) => 4, string>, (s: string) => 4>>(true);

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



export type getKey<T, Types extends { [k in keyof Types]: Types[k] }> =
    { [K in keyof Types]: Types[K] extends T ? IsExactOrAny<T, Types[K]> extends true ? K : never : never }[keyof Types];

type asfaddfs = t[keyof t];
type asdf2 = getKey<string, t>;
type adfsasdfasdf2 = t[getKey<string, t>];


export type lookupValueContains<Types extends { [k in keyof Types]: Types[k] }, T> =
    { [K in keyof Types]: Types[K] extends T ? IsExact<T, Types[K]> extends true ? Types : never : never }[keyof Types];

type t0 = lookupValueContains<t, IsNotNever<number>>;
type t1 = lookupValueContains<t, 'undefined'>;
type t2 = lookupValueContains<t, undefined>;
type t3 = lookupValueContains<t, string>;
type t4 = lookupValueContains<t, string | number>;
type t5 = lookupValueContains<t, any>;
assert<IsExact<t0, never>>(true);
assert<IsExact<t1, never>>(true);
assert<IsExact<t2, t>>(true);
assert<IsExact<t3, t>>(true);
assert<IsExact<t4, never>>(true);
assert<IsExact<t5, never>>(true);

export type ToNeverIfContainsUndefinedToNullPart1<Types>
    = { [K in keyof Types]: undefined extends Types[K] ? {} : null extends Types[K] ? {} : never }
type t12 = ToNeverIfContainsUndefinedToNullPart1<{ 'a': number | undefined, 'b': undefined, 'ok': string }>;

export type ToNeverIfContainsUndefinedToNull<Types extends { [K in keyof Types]: Types[K] }>
    = [{ [K in keyof Types]: undefined extends Types[K] ? {} : null extends Types[K] ? {} : never }[keyof Types]] extends [never] ? Types : never;
type t1234 = ToNeverIfContainsUndefinedToNull<{ 'a': number | undefined, 'b': undefined }>;

assert<IsExact<never, ToNeverIfContainsUndefinedToNull<t>>>(true); // t contains a property that is undefined or null, so `never` is expected
assert<IsExact<{}, ToNeverIfContainsUndefinedToNull<{}>>>(true);   // {} does not contain a property that is undefined, so `{}` is expected
assert<IsExact<never, ToNeverIfContainsUndefinedToNull<{ 'a': undefined }>>>(true); // a contains a property that is undefined, so `never` is expected
assert<IsExact<ToNeverIfContainsUndefinedToNull<{ 'a': null }>, never>>(true); // a contains a property that is null, so `never` is expected
assert<IsExact<never, ToNeverIfContainsUndefinedToNull<{ 'a': number | undefined }>>>(true); // a contains a property that is sometimes undefined, so `never` is expected
assert<IsExact<{ 'a': number }, ToNeverIfContainsUndefinedToNull<{ 'a': number }>>>(true);
assert<IsExact<never, ToNeverIfContainsUndefinedToNull<{ 'a'?: number }>>>(true);

type LookupValues<TLookup> = { [K in keyof TLookup]: TLookup[K] }[keyof TLookup];
assert<IsExact<never, LookupValues<{}>>>(true);
assert<IsExact<'a', LookupValues<{ x: 'a' }>>>(true);
assert<IsExact<undefined, LookupValues<{ x: undefined }>>>(true);
assert<IsExact<undefined | string, LookupValues<{ x: undefined, a: string }>>>(true);
assert<IsExact<0 | string, LookupValues<{ x: 0, s: string }>>>(true);
type ToNeverIfNullOrUndefined<T> = undefined extends T ? never : null extends T ? never : T;


type NonNullableLookup<Types> = Has<undefined, Types[keyof Types]> extends true ? never :
    Has<null, Types[keyof Types]> extends true ? never : Types;

// [undefined extends LookupValues<Types> ? never : null extends LookupValues<Types> ? never : {}] extends [never] ? never : Types;
type a1 = NonNullableLookup<{ 'a': 'a' }>;
type a2 = NonNullableLookup<{ 'a': 'a' | null }>;
type t663 = NonNullableLookup<{ 'a': 'a' | null, 'b': 'b' }>;
assert<IsExact<never, NonNullableLookup<{ 'a': 'a' }>>>(false);
assert<IsExact<never, NonNullableLookup<{ 'a': 'a' | null }>>>(true);
assert<IsExact<never, NonNullableLookup<{ 'a': 'a' | null, 'b': 'b' }>>>(true);
assert<IsExact<never, NonNullableLookup<{ 'a'?: 'a' }>>>(true);
assert<IsExact<never, NonNullableLookup<{ 'a': 'a', 'b': number }>>>(false);
assert<IsExact<never, NonNullableLookup<{ 'a': 'a' | null, 'b': 'b' }>>>(true);

export type NonNullableValuesContraint<T> = { [K in keyof T]: string | number | boolean | object }

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
        if (obj === undefined || obj === null || obj === missing) {
            return false;
        }
        const expectedProperties = Object.assign({}, this.propertyDescriptions);

        // remove properties that are allowed to be missing:
        for (const possiblyOptionalPropertyName in expectedProperties) {
            const possiblyOptionalTypeKey = expectedProperties[possiblyOptionalPropertyName];
            const possiblyOptionalDescription = getSubdescription(possiblyOptionalTypeKey);
            if (possiblyOptionalDescription.is(missing, getSubdescription)) {
                throw new Error('missing properties arent supported yet');
                delete expectedProperties[possiblyOptionalPropertyName];
            }
        }

        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                continue; // throw new Error(`The object has an extra property '${propertyName}'`);
            }
            delete expectedProperties[propertyName];
            const property = obj[propertyName];
            const propertyKey = this.propertyDescriptions[propertyName];
            const propertyDescription = getSubdescription(propertyKey);
            const _isOfPropertyType = propertyDescription.is(property, getSubdescription)
            if (!_isOfPropertyType) {
                return false;
            }
        }
        for (const missingPropertyName in expectedProperties) {
            return false; // throw new Error(`${missingPropertyName} is missing`);
        }
        return true;
    }
    private isValidKey(propertyName: string | keyof Types[K]): propertyName is keyof Types[K] {
        const propertyDescriptions: object = this.propertyDescriptions;
        return propertyDescriptions.hasOwnProperty(propertyName);
    }
}
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

assert<IsExact<OptionalKeys<{}>, never>>(true);
assert<IsExact<OptionalKeys<{ a?: string }>, 'a'>>(true);
assert<IsExact<OptionalKeys<{ a: undefined }>, never>>(true);
assert<IsExact<OptionalKeys<{ a: string | undefined }>, never>>(true);

type Optionals<T> = { [K in OptionalKeys<T>]: T[K] }

assert<IsExact<Optionals<{}>, {}>>(true);
assert<IsExact<Optionals<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<Optionals<{ a: undefined }>, {}>>(true);
assert<IsExact<Optionals<{ a: string | undefined }>, {}>>(true);


export type OptionalsWithUndefined<T> = { [K in OptionalKeys<T>]: T[K] | undefined }

assert<IsExact<OptionalsWithUndefined<{}>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<OptionalsWithUndefined<{ a: undefined }>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ a: string | undefined }>, {}>>(true);
assert<IsExact<OptionalsWithUndefined<{ c?: number; e: number; }>, { c: number | undefined; }>>(true);



type OptionalsWithMissing<T> = { [K in OptionalKeys<T>]: T[K] | Missing }

assert<IsExact<OptionalsWithMissing<{}>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a?: string }>, { a: string | Missing }>>(true);
assert<IsExact<OptionalsWithMissing<{ a: undefined }>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a: string | undefined }>, {}>>(true);
assert<IsExact<OptionalsWithMissing<{ a?: { c: number } }>, { a: Missing | { c: number } }>>(true);


assert<IsExact<OptionalsWithMissing<{ a?: { c?: 0, d: number } }>, { a: { c: 0 | Missing } | Missing }>>(true);


export type Requireds<T> = { [K in RequiredKeys<T>]: T[K] }

assert<IsExact<Requireds<{}>, {}>>(true);
assert<IsExact<Requireds<{ a?: string }>, {}>>(true);
assert<IsExact<Requireds<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<Requireds<{ a: string | undefined }>, { a: string | undefined }>>(true);

export type OptionalToMissing<T> = OptionalsWithMissing<T> & Requireds<T>

assert<IsExact<OptionalToMissing<{}>, {}>>(true);
type fa1 = OptionalToMissing<{ a?: string }>;
assert<IsExact<OptionalToMissing<{ a?: string }>, { a: string | Missing }>>(true);
assert<IsExact<OptionalToMissing<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<OptionalToMissing<{ a: string | undefined }>, { a: string | undefined }>>(true);



export type MyRequired<T> = OptionalsWithUndefined<T> & Requireds<T>


assert<IsExact<MyRequired<{}>, {}>>(true);
assert<IsExact<MyRequired<{ a?: string }>, { a: string | undefined }>>(true);
assert<IsExact<MyRequired<{ a: undefined }>, { a: undefined }>>(true);
assert<IsExact<MyRequired<{ a: string | undefined }>, { a: string | undefined }>>(true);
assert<IsExact<MyRequired<{ c?: number; e: number; }>, { c: number | undefined, e: number }>>(true);
assert<IsExact<MyRequired<{ c?: number; d: undefined; e: number }>, { c: number | undefined; d: undefined; e: number }>>(true);



// assert<IsExact<dkpHelper<object, dkp1e>, { a: ITypeDescription<object> }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a?: string }>, { a: ITypeDescription<string | Missing> }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a: undefined }>, { a: undefined }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a: string | undefined }>, { a: string | undefined }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { c?: number; e: number; }>, { c: number | undefined, e: number }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { c?: number; d: undefined; e: number }>, { c: number | undefined; d: undefined; e: number }>>(true);


export type DescriptionKeys<K extends keyof Types, Types> = { [u in keyof Types[K]]: getKey<Types[K][u], Types> };





export function createCreateFunction<Types, T extends object & Types[keyof Types]>()
    : (propertyDescriptions: DescriptionKeys<getKey<T, Types>, Types>) => ITypeDescription<Types[getKey<T, Types>]> {
    {
        return (propertyDescriptions: DescriptionKeys<getKey<T, Types>, Types>) =>
            TypeDescription.create<Types, getKey<T, Types>>(propertyDescriptions);
    }
}