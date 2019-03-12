import 'mocha';
import { assert, IsExact, IsExactOrAny, GetKey } from '../typeHelper';
import { ITypeDescription, TypeDescriptionsFor } from '../ITypeDescription';
import { BaseTypeDescriptions, PrimitiveTypes } from '../built-ins';
import { checkableTypes, typeSystem, AllTypeDescriptions, A, B } from './testsystem';

type allCheckableTypes = checkableTypes & PrimitiveTypes;

assert<IsExact<A['b'], B | undefined>>(true);



//
// test getKey
//

assert<IsExact<'string', GetKey<string, allCheckableTypes>>>(true);
assert<IsExact<'a', GetKey<A, allCheckableTypes>>>(true);
assert<IsExact<'b', GetKey<B, allCheckableTypes>>>(true);
assert<IsExact<'b?', GetKey<B | undefined, allCheckableTypes>>>(true);

//
// test allCheckableTypes[getKey]
//

assert<IsExact<string, allCheckableTypes[GetKey<string, allCheckableTypes>]>>(true);
assert<IsExact<A, allCheckableTypes[GetKey<A, allCheckableTypes>]>>(true);
assert<IsExact<B, allCheckableTypes[GetKey<B, allCheckableTypes>]>>(true);
assert<IsExact<B | undefined, allCheckableTypes[GetKey<B | undefined, allCheckableTypes>]>>(true);

//
// test type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescription<Types[K]> }
//
assert<IsExact<ITypeDescription<null>, TypeDescriptionsFor<allCheckableTypes>['null']>>(true);
assert<IsExact<ITypeDescription<string>, TypeDescriptionsFor<allCheckableTypes>['string']>>(true);
assert<IsExact<ITypeDescription<B>, TypeDescriptionsFor<allCheckableTypes>['b']>>(true);
assert<IsExact<ITypeDescription<B | undefined>, TypeDescriptionsFor<allCheckableTypes>['b?']>>(true);

//
// test type descriptionDebug
//
type descriptionDebugwrapper<K extends keyof allCheckableTypes, T extends allCheckableTypes[K], U extends keyof T> = descriptionDebug<K, T, allCheckableTypes, U>;
type debugWrappera = descriptionDebugwrapper<'a', A, 'x' | 'b'>;
assert<IsExact<{ x: A['x'], b: A['b'] }, debugWrappera>>(true);

export type descriptionDebug<K extends keyof Types, T extends Types[K], Types, U extends keyof T> = { [u in U]: T[u] }

//
// test type real
//
type realwrapper<K extends keyof allCheckableTypes> = real<K, allCheckableTypes>;
type reala = realwrapper<'a'>;
assert<IsExact<{ x: 'string', b: 'b?' }, reala>>(true);
type realb = realwrapper<'b'>;
assert<IsExact<{ a: 'a' }, realb>>(true);

export type real<K extends keyof Types, Types> = { [u in keyof Types[K]]: getKeyL<Types[K][u], allCheckableTypes> }
export type getKeyL<T, Types extends { [k in keyof Types]: Types[k] }> =
    { [K in keyof Types]: Types[K] extends T ? IsExactOrAny<T, Types[K]> extends true ? K : never : never }[keyof Types];



// is called like create<getKey<B, allCheckableTypes>>(...)
// function create<K extends keyof allCheckableTypes>(
//     propertyDescriptions: DescriptionKeys<K, allCheckableTypes>): ITypeDescription<allCheckableTypes[K]> 
// {
//     return TypeDescription.create<allCheckableTypes, K>(propertyDescriptions);
// }


// function create<T extends object & allCheckableTypes[keyof allCheckableTypes]>(
//     propertyDescriptions: DescriptionKeys<getKey<T, allCheckableTypes>, allCheckableTypes>
// ): ITypeDescription<allCheckableTypes[getKey<T, allCheckableTypes>]> {
//     return TypeDescription.create<allCheckableTypes, getKey<T, allCheckableTypes>>(propertyDescriptions);
// }


type Diff1<T, U> = { [k in keyof T]: k extends keyof U ? IsExact<T[k], U[k]> extends true ? never : k : k };
type Diff<T, U> = { [k in keyof T]: k extends keyof U ? IsExact<T[k], U[k]> extends true ? never : k : k }[keyof T]
    | { [k in keyof U]: k extends keyof T ? never : k }[keyof U]
type x = Diff<{ a: 0, b: 0, c: 0 }, { a: 0, c: 1, d: 0 }>
type sdfafd = { a: 0, b: 0, c: 0 } | { a: 0, c: 1, d: 0 }

type almostAllTypeDescriptions = { [K in Exclude<keyof AllTypeDescriptions, keyof BaseTypeDescriptions>]: AllTypeDescriptions[K] };
type differenceBetweenExpected = Diff<almostAllTypeDescriptions, TypeDescriptionsFor<checkableTypes>>;
type differencePart1 = almostAllTypeDescriptions[differenceBetweenExpected];
type differencePart2 = TypeDescriptionsFor<checkableTypes>[differenceBetweenExpected];
assert<IsExact<TypeDescriptionsFor<checkableTypes>, almostAllTypeDescriptions>>(true);


describe('tests', () => {
    it('null is not b?', () => {
        const nullIsBQ = typeSystem.check('b?')(null);
        if (nullIsBQ)
            throw new Error();
    });
    it('null is nullable b', () => {
        const nullIsBQQ = typeSystem.assert('nullable b')(null);
        if (!nullIsBQQ)
            throw new Error();
    });
    it('null is nullable b?', () => {
        const nullIsBQQQ = typeSystem.assert('nullable b?')(null);
        if (!nullIsBQQQ)
            throw new Error();
    });
    it('undefined is b?', () => {
        const undefinedIsBQ = typeSystem.check('b?')(undefined);
        if (!undefinedIsBQ)
            throw new Error();
    });
    it('undefined is not nullable b', () => {
        const undefinedIsBQQ = typeSystem.check('nullable b')(undefined);
        if (undefinedIsBQQ)
            throw new Error();
    });
    it('undefined is nullable b?', () => {
        const undefinedIsBQQQ = typeSystem.assert('nullable b?')(undefined);
        if (!undefinedIsBQQQ)
            throw new Error();
    });
    it('{ x: "s", b: undefined } is a', () => {
        const isA = typeSystem.assert('a')({ x: "s", b: undefined });
        if (!isA)
            throw new Error();
    });
    it('{ x: "s", b: undefined } is a', () => {
        const isA = typeSystem.assert('a')({ x: "s", b: undefined });
        if (!isA)
            throw new Error();
    });
    it('{ x: "s", b: new B() } is a', () => {
        debugger;
        const isA = typeSystem.assert('a')({ x: "s", b: new B() });
        if (!isA)
            throw new Error();
    });
    it('{ x: "s" } is not a', () => {
        const isA = typeSystem.check('a')({ x: "s" });
        if (isA) // because the property b? is missing
            throw new Error();
    });
});