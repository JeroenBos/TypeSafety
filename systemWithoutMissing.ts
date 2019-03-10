import { GetKey, DescriptionKeys } from ".";
import { IsExact, assert, OptionalToMissing, MyRequired } from "./typeHelper";
import { PrimitiveTypes } from "./built-ins";

export class C {
    c: number | undefined = 0;
    d: undefined;
    e: string = '';
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type checkableTypes = OptionalToMissing<{
    'C': C
}>
export type allCheckableTypes = MyRequired<checkableTypes> & PrimitiveTypes;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type expectedDescriptionsC = {
    c: 'number?';
    d: 'undefined';
    e: 'string';
}
type key = GetKey<C, allCheckableTypes>;
type resultDescriptionsC = DescriptionKeys<GetKey<C, allCheckableTypes>, allCheckableTypes>;
assert<IsExact<resultDescriptionsC, expectedDescriptionsC>>(true);


