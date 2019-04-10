import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typesystem";
import { PrimitiveTypes, BaseTypeDescriptions, possiblyUndefined, possiblyNullOrUndefined, nullable, optional, ExcludePrimitives, anyDescription } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, IsExact, assert, IsExactOrAny, IsNotNever, IsNever, Or, ValuesOf, ContainsExactValue, ContainsExactValues, NotNeverValues } from "../typeHelper";

export class A {
    x: string = 'a';
    // note that 'b: B | undefined' could result in an error, because that's equivalent to `A` missing the property 'b'
    // and tsc does not distuinguish between missing and type undefined
    b: B | undefined = undefined;
    // c?: number;    missing properties aren't supported yet
}
export class B {
    a: A = new A();
}

export class C {
    s: string[] = []
}

export class AnyContainer {
    x: any;
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'a': A,
    'b': B,
    'b?': B | undefined,
    'nullable b': B | null,
    'nullable b?': B | undefined | null,
    'optional b'?: B,
    'C': C,
    'AnyContainer': AnyContainer,
    'Any': any
}>

const create = <T extends object>() => createCreateFunction<CheckableTypes, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<CheckableTypes> {
    public readonly a = create<A>()({ x: 'string', b: 'b?' });
    public readonly b = create<B>()({ a: 'a' });
    public readonly C = create<C>()({ s: 'string[]' });
    public readonly 'b?' = possiblyUndefined(this.b);
    public readonly 'nullable b' = nullable(this.b);
    public readonly 'nullable b?' = possiblyNullOrUndefined(this.b);
    public readonly 'optional b' = optional(this.b);
    public readonly 'Any' = anyDescription;
    public readonly 'AnyContainer' = create<AnyContainer>()({ x: 'any' });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<CheckableTypes>
assert<IsExact<erroneousTypes, {}>>(true);