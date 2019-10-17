// TS:

export { OptionalToMissing, IsExact } from './typeHelper';
export { PrimitiveTypes } from './built-ins';
export { DebugTypeSystem, PrimitiveTypeSystem } from './typeSystem';
export { TypeDescriptionsFor } from './ITypeDescription';
export { Missing } from './missingHelper';

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
    createHelperFunction,
    TypeSystem,
} from './typeSystem';
import { optional, isMissing } from './missingHelper';

export {
    assert,
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeAlternativeDescriptions,
    createHelperFunction as createCreateFunction,
    TypeSystem,
    array,
    composeConjunctDescriptions,
    optional,
    isMissing,
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
    createCreateFunction: createHelperFunction,
    TypeSystem,
    optional,
    isMissing,
};