import { TypeDescriptionsFor, OptionalToMissing, createCreateFunction, primitiveTypes, DescriptionKeys, getKey, MyRequired } from ".";
import { IsExact, assert } from "./typeHelper";

export class C {
    c?: number = 0;
    d: undefined;
    e: number = 0;
}


type expectedDescriptionsC = {
    c: 'missing number';
    d: 'undefined';
    e: 'number';
}


export type DDD<K extends keyof Types, Types> = { [u in keyof Types[K]]: getKey<Types[K][u], Types> }


type resultDescriptionsC = DDD<getKey<C, allCheckableTypes>, allCheckableTypes>;
// assert<IsExact<resultDescriptionsC, expectedDescriptionsC>>(true); TODO




export type checkableTypes = OptionalToMissing<{
    'C': C
}>
export type allCheckableTypes = MyRequired<checkableTypes> & primitiveTypes;


const create = <T extends object & allCheckableTypes[keyof allCheckableTypes]>() => createCreateFunction<allCheckableTypes, T>();
type dk<K extends keyof Types, Types> = MyRequired<{ [u in keyof Types[K]]: Types[K][u] }>
type dkc = dk<keyof checkableTypes, checkableTypes>;
assert<IsExact<{ c: number | undefined; d: undefined; e: number }, dkc>>(true);
type dks = DescriptionKeys<getKey<C, allCheckableTypes>, allCheckableTypes>;
// assert<IsExact<{ c: number | undefined; d: undefined; e: number }, dks>>(true);

type descriptions = TypeDescriptionsFor<allCheckableTypes>;

// export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
//     public readonly C = create<C>()({ c: p});
// }


// export const typeSystem = new TypeSystem(new AllTypeDescriptions());