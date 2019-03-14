import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typesystem";
import { PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined, possiblyNullOrUndefined, nullable, optional, ExcludePrimitives, array, numberDescription } from "../built-ins";
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

export type checkableTypes = OptionalToMissing<{
    'a': A,
    'D': D,
    'D[]': D[]
}>
export type allCheckableTypes = checkableTypes & PrimitiveTypes;

const create = <T extends object>() => createCreateFunction<allCheckableTypes, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {

    public readonly a = create<A>()({ s: 'string[]', d: 'D[]' });
    public readonly D = create<D>()({ n: 'number' });
    public readonly 'D[]' = array(this['D']);
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<checkableTypes>
assert<IsExact<erroneousTypes, {}>>(true);