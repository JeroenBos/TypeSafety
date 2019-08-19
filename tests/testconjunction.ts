
import { createCreateFunction, TypeSystem, DebugTypeSystem } from "../typesystem";
import { PrimitiveTypes, possiblyUndefined, nullable, possiblyNullOrUndefined, optional, BaseTypeDescriptions, compose } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing, assert, IsExact } from "../typeHelper";

type C = { s: string } & { n: string };

///////////////////////////

export type Types = OptionalToMissing<{
    'c': C,
    's': { s: string },
    'n': { n: string },
}>
const create = <T extends object>() => createCreateFunction<Types, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<Types> {
    public readonly 's' = create<Types['s']>()({ s: 'string' });
    public readonly 'n' = create<Types['n']>()({ n: 'string' });
    public readonly 'c' = compose(this.s, this.n);
}

export const typeSystem = new TypeSystem(new AllTypeDescriptions());

///////////////////////////

type erroneousTypes = DebugTypeSystem<Types>
assert<IsExact<erroneousTypes, { }>>(true); 