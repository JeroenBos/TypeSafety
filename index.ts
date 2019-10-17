// TS:

export { OptionalToMissing, IsExact } from './typeHelper';
export { PrimitiveTypes, Missing } from './built-ins';
export { DebugTypeSystem, PrimitiveTypeSystem } from './typeSystem';
export { TypeDescriptionsFor } from './ITypeDescription';
// JS:

import {
    assert,
} from './typeHelper';
import {
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    array,
    composeConjunctDescriptions
} from './built-ins';
import {
    createCreateFunction,
    TypeSystem,
} from './typeSystem';
import { optional } from './missingHelper';

export {
    assert,
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    createCreateFunction,
    TypeSystem,
    array,
    composeConjunctDescriptions,
    optional,
};

export default {
    assert,
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    array,
    composeConjunctDescriptions,
    createCreateFunction,
    TypeSystem,
    optional,
};