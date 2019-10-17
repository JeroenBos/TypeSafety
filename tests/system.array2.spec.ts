import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typeSystem";
import { PrimitiveTypes, BaseTypeDescriptions,  array } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, IsExact, assert, IsExactOrAny, IsNotNever, IsNever, Or, ValuesOf, ContainsExactValue, ContainsExactValues, NotNeverValues } from "../typeHelper";

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

const create = <T extends object>() => createCreateFunction<allCheckableTypes, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {

    public readonly a = create<A>()({ d: 'D[]' } as any);
    public readonly d = create<D>()({});
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<checkableTypes>
assert<IsExact<erroneousTypes, { a: { d: D[] } }>>(true); // this represents the error