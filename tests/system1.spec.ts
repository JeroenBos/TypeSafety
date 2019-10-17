
import { createHelperFunction, TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, PrimitiveTypes } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact } from "../typeHelper";

interface C {
    s: string,
    d: D,
    n: string | undefined,
    // below it is asserted that `e` is mentioned in the erroneous types, because `string | number` is not present in `AllTypeDescriptions`
    e: number | string,
}
interface D {
    x: C
}

///////////////////////////

export type Types = OptionalToMissing<{
    'c': C,
    'd': D,
}>
const create = <T extends object>() => createHelperFunction<Types, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions<Types> implements TypeDescriptionsFor<Types> {
    public readonly 'c' = create<C>()({ s: 'string', d: 'd', e: 'hi', n: 'string?' } as any);
    public readonly 'd' = create<D>()({ x: 'c' });
}

const descriptions: TypeDescriptionsFor<Types & PrimitiveTypes> = new AllTypeDescriptions();
export const typeSystem = new TypeSystem(descriptions);

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, { c: { e: string | number } }>>(true); 