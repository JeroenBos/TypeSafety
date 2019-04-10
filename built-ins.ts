import { TypeDescriptionsFor, ITypeDescription } from "./ITypeDescription";

export type PrimitiveTypes = {
    'any': any,
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

    'string[]': string[],
    'number[]': number[],
    'boolean[]': boolean[],

    'string[]?': string[] | undefined,
    'number[]?': number[] | undefined,
    'boolean[]?': boolean[] | undefined,

    'nullable string[]': string[] | null,
    'nullable number[]': number[] | null,
    'nullable boolean[]': boolean[] | null,

    'nullable string[]?': string[] | null | undefined,
    'nullable number[]?': number[] | null | undefined,
    'nullable boolean[]?': boolean[] | null | undefined,

    '(nullable string)[]': (string | null)[],
    '(nullable number)[]': (number | null)[],
    '(nullable boolean)[]': (boolean | null)[],
}

export type ExcludePrimitives<T> = Exclude<T, string | number | boolean>

export class BaseTypeDescriptions implements TypeDescriptionsFor<PrimitiveTypes> {
    'any' = anyDescription;
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


    'string[]' = stringArrayDescription;
    'number[]' = numberArrayDescription;
    'boolean[]' = booleanArrayDescription;

    'string[]?' = possiblyUndefined(stringArrayDescription);
    'number[]?' = possiblyUndefined(numberArrayDescription);
    'boolean[]?' = possiblyUndefined(booleanArrayDescription);

    'nullable string[]' = nullable(stringArrayDescription);
    'nullable number[]' = nullable(numberArrayDescription);
    'nullable boolean[]' = nullable(booleanArrayDescription);

    'nullable string[]?' = possiblyNullOrUndefined(stringArrayDescription);
    'nullable number[]?' = possiblyNullOrUndefined(numberArrayDescription);
    'nullable boolean[]?' = possiblyNullOrUndefined(booleanArrayDescription);

    '(nullable string)[]' = array(this['nullable string']);
    '(nullable number)[]' = array(this['nullable number']);
    '(nullable boolean)[]' = array(this['nullable boolean']);
}


const missingDescription: ITypeDescription<Missing> = noPartial(function is(obj: any): obj is Missing { return obj === undefined || obj === missing; });
const missingOrNullDescription: ITypeDescription<Missing | null> = noPartial(function is(obj: any): obj is Missing | null { return obj === missing || obj === undefined || obj === null; })
const undefinedOrNullDescription: ITypeDescription<undefined | null> = noPartial(function is(obj: any): obj is undefined | null { return obj === undefined || obj === null; });
const undefinedDescription: ITypeDescription<undefined> = noPartial(function is(obj: any): obj is undefined { return obj === undefined; })
const nullDescription: ITypeDescription<null> = noPartial(function is(obj: any): obj is null { return obj === null; })
export const anyDescription: ITypeDescription<null> = noPartial(function is(obj: any): obj is null { return obj !== missing; })

export const stringDescription = createPrimitiveDescription('string');
export const numberDescription = createPrimitiveDescription('number');
export const booleanDescription = createPrimitiveDescription('boolean');
export const stringArrayDescription = array(stringDescription);
export const numberArrayDescription = array(numberDescription);
export const booleanArrayDescription = array(booleanDescription);

function createPrimitiveDescription<p extends keyof PrimitiveTypes>(s: p): ITypeDescription<PrimitiveTypes[p]> {
    function is(obj: any): obj is PrimitiveTypes[p] {
        return typeof obj === s;
    };
    return noPartial(is);
}


export class missingType { }
export const missing = Object.freeze(new missingType());
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
export function array<TElement>(elementDescription: ITypeDescription<TElement>): ITypeDescription<TElement[]> {
    function is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is TElement[] {
        if (!Array.isArray(obj))
            return false;
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            if (!elementDescription.is(element, getSubdescription))
                return false;
        }
        return true;
    }
    return noPartial(is);
}
export function noPartial<T>(is: ITypeDescription<T>['is']): ITypeDescription<T> {
    return { is, isPartial: is };
}

export function composeDescriptions<K1, K2>(description1: ITypeDescription<K1>, description2: ITypeDescription<K2>): ITypeDescription<K1 | K2> {
    function is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is K1 | K2 {
        return description1.is(obj, getSubdescription) || description2.is(obj, getSubdescription);
    };

    return { is, isPartial: is };
}