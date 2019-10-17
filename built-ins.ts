import { TypeDescriptionsFor, ITypeDescription, ILogger, ITypeDescriptions, Variance, RemainingParametersWithVar, DescriptionGetter } from './ITypeDescription';
import { TypeDescription } from './TypeDescription';
import { Missing, isMissing } from './missingHelper';

export type PrimitiveTypes = {
    'any': any,
    'null': null,
    'undefined': undefined,

    '!null': any,
    '!undefined': any,
    'any!': any,

    'number': number,
    'string': string,
    'boolean': boolean,

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

export class BaseTypeDescriptions implements TypeDescriptionsFor<PrimitiveTypes> {
    'any' = anyDescription;
    'null' = nullDescription;
    'undefined' = undefinedDescription

    /** Describes a type being anything but `null`. */
    '!null' = nonnullDescription;
    /** Describes a type being anything but `undefined`. */
    '!undefined' = definedDescription;
    /** Describes a type being anything but `null` or `undefined`. */
    'any!' = nonnullNorUndefinedDescription;

    'number' = numberDescription;
    'string' = stringDescription;
    'boolean' = booleanDescription;

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


export const missingOrUndefinedDescription = noVariance<Missing | undefined>(function is(obj: any): obj is Missing | undefined { return isMissing(obj) || obj === undefined; })
const missingOrUndefinedOrNullDescription = noVariance<Missing | undefined | null>(function is(obj: any): obj is Missing | undefined | null { return isMissing(obj) || obj === undefined || obj === null; })
const undefinedOrNullDescription = noVariance<null | undefined>(function is(obj: any): obj is undefined | null { return obj === undefined || obj === null; });
const undefinedDescription = noVariance<undefined>(function is(obj: any): obj is undefined { return obj === undefined; })
const nullDescription = noVariance<null>(function is(obj: any): obj is null { return obj === null; })
export const anyDescription: ITypeDescriptions<null> = { is: (obj: any): obj is null => !isMissing(obj) };
export const nonnullDescription: ITypeDescriptions<null> = { is: (obj: any): obj is null => obj !== null && !isMissing(obj) }
export const definedDescription: ITypeDescriptions<null> = { is: (obj: any): obj is null => obj !== undefined && !isMissing(obj) }
export const nonnullNorUndefinedDescription = { is: (obj: any): obj is null => obj !== undefined && obj !== null && !isMissing(obj) }

export const stringDescription = createPrimitiveDescription('string');
export const numberDescription = createPrimitiveDescription('number');
export const booleanDescription = createPrimitiveDescription('boolean');
export const stringArrayDescription = array(stringDescription);
export const numberArrayDescription = array(numberDescription);
export const booleanArrayDescription = array(booleanDescription);

function createPrimitiveDescription<p extends keyof PrimitiveTypes>(s: p): ITypeDescriptions<PrimitiveTypes[p]> {
    function is(obj: any): obj is PrimitiveTypes[p] {
        return typeof obj === s;
    };
    return noVariance(is);
}


export function nullable<TBase>(description1: ITypeDescriptions<TBase>): ITypeDescriptions<TBase | null> {
    return composeAlternativeDescriptions(nullDescription, description1);
}
export function optionalNullable<TBase>(description1: ITypeDescriptions<TBase>): ITypeDescriptions<TBase | Missing | null> {
    return composeAlternativeDescriptions(missingOrUndefinedOrNullDescription, description1);
}
export function possiblyUndefined<TBase>(description1: ITypeDescriptions<TBase>): ITypeDescriptions<TBase | undefined> {
    return composeAlternativeDescriptions(undefinedDescription, description1);
}
export function possiblyNullOrUndefined<TBase>(description1: ITypeDescriptions<TBase>): ITypeDescriptions<TBase | undefined | null> {
    return composeAlternativeDescriptions(undefinedOrNullDescription, description1);
}
export function array<TElement>(elementDescription: ITypeDescriptions<TElement>): ITypeDescriptions<TElement[]> {
    function is(obj: any, getSubdescription: DescriptionGetter, log: ILogger): obj is TElement[] {
        if (!Array.isArray(obj))
            return false;
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            if (!elementDescription.is(element, Variance.Extends, getSubdescription, log))
                return false;
        }
        return true;
    }
    return noVariance(is);
}
export function noVariance<T>(is: ITypeDescription<T>['is']): ITypeDescriptions<T> {
    const _is = function (obj: any, ...args: RemainingParametersWithVar<T>): obj is T {
        return is(obj, args[1], args[2]);
    };
    return { is: _is };
}


export function composeAlternativeDescriptions<K1, K2>(description1: ITypeDescriptions<K1>, description2: ITypeDescriptions<K2>): ITypeDescriptions<K1 | K2> {
    const is = function (obj: any, ...args: RemainingParametersWithVar<K1 | K2>): obj is K1 | K2 {
        return description1.is(obj, ...args) || description2.is(obj, ...args);
    };
    return { is };
}

export function composeConjunctDescriptions<K1, K2>(description1: ITypeDescriptions<K1>, description2: ITypeDescriptions<K2>): ITypeDescriptions<K1 & K2> {
    if (TypeDescription.isObjectDescription<any, any>(description1) && TypeDescription.isObjectDescription<any, any>(description2)) {
        return TypeDescription.compose(description1, description2);
    }

    const is = function (obj: any, ...args: RemainingParametersWithVar<K1 | K2>): obj is K1 & K2 {
        return description1.is(obj, ...args) && description2.is(obj, ...args);
    };
    return { is };
}

export const compose = composeConjunctDescriptions;