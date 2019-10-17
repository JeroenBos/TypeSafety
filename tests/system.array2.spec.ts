import { TypeSystem, DebugTypeSystem } from "../typeSystem";
import { PrimitiveTypes, BaseTypeDescriptions } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, IsExact, assert } from "../typeHelper";

export class A {
    d: D[] = []; // D is included in checkableTypes, but D[] is explicitly not, and we check an error occurs below
}
export class D {
}

///////////////////////////

export type checkableTypes = OptionalToMissing<{
    a: A,
    d: D
}>
export type allCheckableTypes = checkableTypes & PrimitiveTypes;

export class AllTypeDescriptions extends BaseTypeDescriptions<checkableTypes> implements TypeDescriptionsFor<checkableTypes> {

    public readonly a = this.create<A>({ d: 'D[]' } as any);
    public readonly d = this.create<D>({});
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions() as TypeDescriptionsFor<checkableTypes & PrimitiveTypes>);

///////////////////////////

type erroneousTypes = DebugTypeSystem<checkableTypes>
assert<IsExact<erroneousTypes, { a: { d: D[] } }>>(true); // this represents the error