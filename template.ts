assert<undefined extends string ? false : true>(true); // strict mode must be enabled
import { OptionalToMissing, assert, IsExact } from './typeHelper';
import { PrimitiveTypes, BaseTypeDescriptions } from './built-ins';
import { TypeSystem, DebugTypeSystem } from './typeSystem';
import { TypeDescriptionsFor, ITypeDescriptions } from './ITypeDescription';

interface D {
}

//////////////////

export type checkableTypes = OptionalToMissing<{
    'D': D
}>

class AllTypeDescriptions extends BaseTypeDescriptions<checkableTypes> implements TypeDescriptionsFor<checkableTypes> {
    public readonly 'D' = this.create<D>({});
}
export default new TypeSystem(new AllTypeDescriptions() as TypeDescriptionsFor<checkableTypes & PrimitiveTypes>);

type erroneousTypes = DebugTypeSystem<checkableTypes>
assert<IsExact<erroneousTypes, {}>>(true);

type d = TypeDescriptionsFor<checkableTypes>;