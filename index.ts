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
    optional,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeDescriptions
} from './built-ins';
import {
    createCreateFunction,
    TypeSystem,
} from './typesystem';

export {
    assert,
    BaseTypeDescriptions,
    nullable,
    optional,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeDescriptions,
    createCreateFunction,
    TypeSystem,
};

export default {
    assert,
    BaseTypeDescriptions,
    nullable,
    optional,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    composeDescriptions,
    createCreateFunction,
    TypeSystem,
};