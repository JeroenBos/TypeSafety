
import { createHelperFunction, TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact, ContainsExactValues } from "../typeHelper";

interface C {
    e: number | string
}
interface D {
    f: string // here I try to describe a type that is smaller than its description
}

///////////////////////////

export type Types = OptionalToMissing<{
    'C': C,
    // 'D': D // I expected that when this is uncommented, it would show up in erroneousTypes. Instead it gives an error at the description of d, which is good enough
}>
const create = <T extends object>() => createHelperFunction<Types, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 'C' = create<C>()({ e: 'number' } as any);
    public readonly 'D' = create<D>()({ f: 'string?' });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////


// `C` has a property with type `number | string`. A `C` with a number is still a valid `C`.
// The point of this assertion is that even tough type of a value would be admissible, describing that property to have that value would not be,
// because that would exclude other valid options.
type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, { C: { e: string | number } }>>(true); 
