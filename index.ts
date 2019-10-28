// TS:

export { OptionalToMissing, IsExact, GetKey } from './typeHelper';
export { PrimitiveTypes } from './built-ins';
export { DebugTypeSystem, PrimitiveTypeSystem } from './typeSystem';
export { TypeDescriptionsFor, ITypeDescriptions } from './ITypeDescription';
export { Missing, DescriptionKeys } from './missingHelper';
export { DescriptionGetter, Variance, ILogger } from './ITypeDescription';
// JS:

import {
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    disjunct,
    array,
    conjunct
} from './built-ins';
import {
    TypeSystem,
} from './typeSystem';
import { optional, isMissing } from './missingHelper';
import { RecordTypeDescription } from './record.typedescription';
import { TypeDescription } from './TypeDescription';

export {
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    disjunct,
    TypeSystem,
    array,
    conjunct,
    optional,
    isMissing,
    TypeDescription,
    RecordTypeDescription,
};

export default {
    BaseTypeDescriptions,
    nullable,
    optionalNullable,
    possiblyUndefined,
    possiblyNullOrUndefined,
    disjunct,
    array,
    conjunct,
    TypeSystem,
    optional,
    isMissing,
    TypeDescription,
    RecordTypeDescription,
};