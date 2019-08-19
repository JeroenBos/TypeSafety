assert<undefined extends string ? false : true>(true); // strict mode must be enabled
import { OptionalToMissing, assert, IsExact } from './typeHelper';
import { PrimitiveTypes, BaseTypeDescriptions, nullable, optional, optionalNullable, possiblyUndefined, possiblyNullOrUndefined, composeAlternativeDescriptions } from './built-ins';
import { createCreateFunction, TypeSystem, DebugTypeSystem } from './typesystem';
import { TypeDescriptionsFor } from './ITypeDescription';

interface D {
}

//////////////////

export type checkableTypes = OptionalToMissing<{
    'D': D
}>

const create = <T extends object>() => createCreateFunction<checkableTypes & PrimitiveTypes, T>();

class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    public readonly 'D' = create<D>()({});
}

export default new TypeSystem(new AllTypeDescriptions());

type erroneousTypes = DebugTypeSystem<checkableTypes>
assert<IsExact<erroneousTypes, {}>>(true);