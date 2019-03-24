
import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typesystem";
import { PrimitiveTypes, possiblyUndefined, nullable, possiblyNullOrUndefined, optional, BaseTypeDescriptions } from "../built-ins";
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
const create = <T extends object>() => createCreateFunction<Types, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 'c' = create<C>()({ s: 'string', d: 'd', e: 'hi', n: 'string?' } as any);
    public readonly 'd' = create<D>()({ x: 'c' });
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, { c: { e: string | number } }>>(true); 