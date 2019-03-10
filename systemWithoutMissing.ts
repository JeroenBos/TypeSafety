import { OptionalToMissing, primitiveTypes, getKey, MyRequired, DescriptionKeys } from ".";
import { IsExact, assert } from "./typeHelper";

export class C {
    c: number | undefined = 0;
    d: undefined;
    e: string ='';
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type checkableTypes = OptionalToMissing<{
    'C': C
}>
export type allCheckableTypes = MyRequired<checkableTypes> & primitiveTypes;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type expectedDescriptionsC = {
    c: 'number?';
    d: 'undefined';
    e: 'string';
}
type key = getKey<C, allCheckableTypes>;
type resultDescriptionsC = DescriptionKeys<getKey<C, allCheckableTypes>, allCheckableTypes>;
assert<IsExact<resultDescriptionsC, expectedDescriptionsC>>(true);


