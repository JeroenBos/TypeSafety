import {  createCreateFunction, DescriptionKeys, GetKey } from ".";
import { IsExact, assert, OptionalToMissing, MyRequired } from "./typeHelper";
import { PrimitiveTypes } from "./built-ins";

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


export type DDD<K extends keyof Types, Types> = { [u in keyof Types[K]]: GetKey<Types[K][u], Types> }


type resultDescriptionsC = DDD<GetKey<C, allCheckableTypes>, allCheckableTypes>;
// assert<IsExact<resultDescriptionsC, expectedDescriptionsC>>(true); TODO




export type checkableTypes = OptionalToMissing<{
    'C': C
}>
export type allCheckableTypes = MyRequired<checkableTypes> & PrimitiveTypes;


const create = <T extends object & allCheckableTypes[keyof allCheckableTypes]>() => createCreateFunction<allCheckableTypes, T>();
type dk<K extends keyof Types, Types> = MyRequired<{ [u in keyof Types[K]]: Types[K][u] }>
type dkc = dk<keyof checkableTypes, checkableTypes>;
assert<IsExact<{ c: number | undefined; d: undefined; e: number }, dkc>>(true);
type dks = DescriptionKeys<GetKey<C, allCheckableTypes>, allCheckableTypes>;
// assert<IsExact<{ c: number | undefined; d: undefined; e: number }, dks>>(true);

// type descriptions = TypeDescriptionsFor<allCheckableTypes>;

// export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
//     public readonly C = create<C>()({ c: p});
// }


// export const typeSystem = new TypeSystem(new AllTypeDescriptions());