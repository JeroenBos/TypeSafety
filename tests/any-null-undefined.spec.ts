
import { PrimitiveTypes } from "../built-ins";
import { OptionalToMissing, assert, IsExact } from "../typeHelper";
import { DescriptionKeys } from "../missingHelper";

class A { }
interface C {
    a: string,
    b: string | null,
    c: string | undefined,
    d: string | null | undefined,
    e: A,
    f: A | null,
    g: A | undefined,
    h: A | null | undefined,
    i: null,
    j: undefined,
    k: null | undefined,
    l: any
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'C': C,
}>
type cDescription = DescriptionKeys<'C', CheckableTypes & PrimitiveTypes>;

assert<IsExact<cDescription['a'], 'string'>>(true);
assert<IsExact<cDescription['b'], 'nullable string'>>(true);
assert<IsExact<cDescription['c'], 'string?'>>(true);
assert<IsExact<cDescription['d'], 'nullable string?'>>(true);
assert<IsExact<cDescription['e'], 'any!'>>(true);
assert<IsExact<cDescription['f'], '!undefined'>>(true);
assert<IsExact<cDescription['g'], '!null'>>(true);
assert<IsExact<cDescription['h'], 'any'>>(true);
assert<IsExact<cDescription['i'], 'null'>>(true);
assert<IsExact<cDescription['j'], 'undefined'>>(true);
assert<IsExact<cDescription['k'], 'any'>>(true);
assert<IsExact<cDescription['l'], 'any' | '!null' | '!undefined' | 'any!'>>(true);
