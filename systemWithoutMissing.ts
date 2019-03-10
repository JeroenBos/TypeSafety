import { OptionalToMissing, primitiveTypes, getKey, assert, IsExact, DescriptionKeyspart, MyRequired } from ".";

export class C {
    c: number | undefined = 0;
    d: undefined;
    e: number = 0;
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
    e: 'number';
}
type resultDescriptionsC = DescriptionKeyspart<getKey<C, allCheckableTypes>, allCheckableTypes>;
assert<IsExact<resultDescriptionsC, expectedDescriptionsC>>(true);


