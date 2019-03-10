import { TypeDescriptionsFor, ITypeDescription } from "./ITypeDescription";

export type PrimitiveTypes = {
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

export class BaseTypeDescriptions implements TypeDescriptionsFor<PrimitiveTypes> {

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


const missingDescription: ITypeDescription<Missing> = ({ is(obj: any): obj is Missing { return obj === undefined || obj === missing; } });
const missingOrNullDescription: ITypeDescription<Missing | null> = ({ is(obj: any): obj is Missing | null { return obj === missing || obj === undefined || obj === null; } })
const undefinedOrNullDescription: ITypeDescription<undefined | null> = ({ is(obj: any): obj is undefined | null { return obj === undefined || obj === null; } })
const undefinedDescription: ITypeDescription<undefined> = ({ is(obj: any): obj is undefined { return obj === undefined; } })
const nullDescription: ITypeDescription<null> = ({ is(obj: any): obj is null { return obj === null; } })

export const stringDescription = createPrimitiveDescription('string');
export const numberDescription = createPrimitiveDescription('number');
export const booleanDescription = createPrimitiveDescription('boolean');

function createPrimitiveDescription<p extends keyof PrimitiveTypes>(s: p): ITypeDescription<PrimitiveTypes[p]> {
    return ({
        is(obj: any): obj is PrimitiveTypes[p] {
            return typeof obj === s;
        },
    });
}


class missingType { }
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

export function composeDescriptions<K1, K2>(description1: ITypeDescription<K1>, description2: ITypeDescription<K2>): ITypeDescription<K1 | K2> {
    return ({
        is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is K1 | K2 {
            return description1.is(obj, getSubdescription) || description2.is(obj, getSubdescription);
        },
    });
}