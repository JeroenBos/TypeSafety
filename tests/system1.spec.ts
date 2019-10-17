
import { TypeSystem, DebugTypeSystem } from "../typeSystem";
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
export class AllTypeDescriptions extends BaseTypeDescriptions<Types> implements TypeDescriptionsFor<Types> {
    public readonly 'c' = this.create<C>({ s: 'string', d: 'd', e: 'hi', n: 'string?' } as any);
    public readonly 'd' = this.create<D>({ x: 'c' });
}

export const typeSystem = new TypeSystem<Types & PrimitiveTypes>(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, { c: { e: string | number } }>>(true); 