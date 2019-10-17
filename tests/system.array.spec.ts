import { TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, array, PrimitiveTypes } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, IsExact, assert, IsExactOrAny, IsNotNever, IsNever, Or, ValuesOf, ContainsExactValue, ContainsExactValues, NotNeverValues } from "../typeHelper";

export class A {
    s: string[] = [];
    d: D[] = [];
}
export class D {
    n: number = 0;
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'a': A,
    'D': D,
    'D[]': D[]
}>
export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {

    public readonly a = this.create<A>({ s: 'string[]', d: 'D[]' });
    public readonly D = this.create<D>({ n: 'number' });
    public readonly 'D[]' = array(this['D']);
}

const descriptions: TypeDescriptionsFor<CheckableTypes & PrimitiveTypes> = new AllTypeDescriptions();
export const typeSystem = new TypeSystem(descriptions);

///////////////////////////

type erroneousTypes = DebugTypeSystem<CheckableTypes>
assert<IsExact<erroneousTypes, {}>>(true);