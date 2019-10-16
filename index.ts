// TS:

export { OptionalToMissing, IsExact } from './typeHelper';
export { PrimitiveTypes } from './built-ins';
export { DebugTypeSystem, PrimitiveTypeSystem } from './typesystem';
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
} from './typesystem';

export {
    assert,
    BaseTypeDescriptions,
    nullable,
    possiblyUndefined as optional,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    createCreateFunction,
    TypeSystem,
    array,
    composeConjunctDescriptions,
};

export default {
    assert,
    BaseTypeDescriptions,
    nullable,
    optional: possiblyUndefined,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    array,
    composeConjunctDescriptions,
    createCreateFunction,
    TypeSystem,
};