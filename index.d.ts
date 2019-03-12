import { assert, OptionalToMissing, IsExact } from './typeHelper';
import { PrimitiveTypes, BaseTypeDescriptions, nullable, optional, optionalNullable, possiblyUndefined, possiblyNullOrUndefined, composeDescriptions } from './built-ins';
import { createCreateFunction, TypeSystem, DebugTypeSystem } from './typesystem';
import { TypeDescriptionsFor } from './ITypeDescription';

export type OptionalToMissing<T> = OptionalToMissing<T>;
export type IsExact<T, U> = IsExact<T, U>;
export type PrimitiveTypes = PrimitiveTypes;
export type DebugTypeSystem<T> = DebugTypeSystem<T>;
export type TypeDescriptionsFor<T extends { [K in keyof T]: T[K] }> = TypeDescriptionsFor<T>;
