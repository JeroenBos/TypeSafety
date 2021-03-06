import { assert, IsExact, GetKey } from '../typeHelper';
import { TypeDescriptionsFor, ITypeDescriptions, Variance } from '../ITypeDescription';
import { BaseTypeDescriptions, PrimitiveTypes, nonnullNorUndefinedDescription, nonnullDescription, definedDescription } from '../built-ins';
import { CheckableTypes, typeSystem, AllTypeDescriptions, A, B } from './system.spec';
import { typesystem, X } from '../example/example';

type allCheckableTypes = CheckableTypes & PrimitiveTypes;

assert<IsExact<A['b'], B | undefined>>(true);



//
// test getKey
//

assert<IsExact<'string', GetKey<string, allCheckableTypes>>>(true);
assert<IsExact<'a', GetKey<A, allCheckableTypes>>>(true);
assert<IsExact<'b', GetKey<B, allCheckableTypes>>>(true);
assert<IsExact<'b?', GetKey<B | undefined, allCheckableTypes>>>(true);
type t = GetKey<B | undefined, allCheckableTypes>;

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
assert<IsExact<ITypeDescriptions<null>, TypeDescriptionsFor<allCheckableTypes>['null']>>(true);
assert<IsExact<ITypeDescriptions<string>, TypeDescriptionsFor<allCheckableTypes>['string']>>(true);
assert<IsExact<ITypeDescriptions<B>, TypeDescriptionsFor<allCheckableTypes>['b']>>(true);
assert<IsExact<ITypeDescriptions<B | undefined>, TypeDescriptionsFor<allCheckableTypes>['b?']>>(true);

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

export type real<K extends keyof Types, Types> = { [u in keyof Types[K]]: GetKey<Types[K][u], allCheckableTypes> }



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

type almostAllTypeDescriptions = { [K in Exclude<keyof AllTypeDescriptions, keyof BaseTypeDescriptions<PrimitiveTypes>>]: AllTypeDescriptions[K] };
type differenceBetweenExpected = Diff<almostAllTypeDescriptions, TypeDescriptionsFor<CheckableTypes>>;
type differencePart1 = almostAllTypeDescriptions[differenceBetweenExpected];
type differencePart2 = TypeDescriptionsFor<CheckableTypes>[differenceBetweenExpected];
assert<IsExact<TypeDescriptionsFor<CheckableTypes>, almostAllTypeDescriptions>>(true);


describe('tests', () => {
    it('null is not b?', () => {
        const nullIsPossiblyUndefinedB = typeSystem.extends('b?', null);
        if (nullIsPossiblyUndefinedB)
            throw new Error();
    });
    it('null is nullable b', () => {
        typeSystem.assert('nullable b', null);
    });
    it('null is nullable b?', () => {
        typeSystem.assert('nullable b?', null);
    });
    it('undefined is b?', () => {
        typeSystem.assert('b?', undefined);
    });
    it('undefined is not nullable b', () => {
        const undefinedIsNullableB = typeSystem.extends('nullable b', undefined);
        if (undefinedIsNullableB)
            throw new Error();
    });
    it('undefined is nullable b?', () => {
        typeSystem.assert('nullable b?', undefined);
    });
    it('{ x: "s", b: undefined } is a', () => {
        typeSystem.assert('a', { x: "s", b: undefined });
    });
    it('{ x: "s", b: undefined } is a', () => {
        typeSystem.assert('a', { x: "s", b: undefined });
    });
    it('{ x: "s", b: new B() } is a', () => {
        typeSystem.assert('a', { x: "s", b: new B() });
    });
    it('{ x: "s" } is not a', () => {
        const isA = typeSystem.extends('a', { x: "s" });
        if (isA) // because the property b? is missing
            throw new Error();
    });
    it('{ s = [] } is { s: string[] }', () => {
        typeSystem.assert('C', { s: [] });
    });
    it('{ s = ["a"] } is { s: string[] }', () => {
        typeSystem.assert('C', { s: ['a'] });
    });

    it('assertF', () => {
        typeSystem.assertF('C')({ s: ['a'] });
    });
    it('isF', () => {
        const isC = typeSystem.extendsF('C')({ s: ['a'] });
        if (!isC) throw new Error();
    });
    it('verifyF', () => {
        typeSystem.verifyF('C')({ s: ['a'] });
    });
    it('DisposableStack logs error', () => {
        const isC = typeSystem.extends('C', {}); // I'm testing here manually, only whether the console.log method was invoked...
        if (isC) throw new Error();
    });
    it('nested DisposableStack logs nested error', () => {
        const isB = typeSystem.extends('b', { a: {} }); // I'm testing here manually, only whether the console.log method was invoked...
        if (isB) throw new Error();
    });
    it('B is partial B', () => {
        typeSystem.assertPartial('b', new B());
    });
    it('{} is partial B', () => {
        typeSystem.assertPartial('b', {});
    });
    it('partiality is not transitive over nested properties', () => {
        const isB = typeSystem.isPartial('b', { a: {} });
        if (isB) throw new Error();
    });
    it('partiality is not transitive over nested properties', () => {
        const isB = typeSystem.isPartial('b', { a: { x: '' } });
        if (isB) throw new Error();
    });
    it('full B is partial B', () => {
        typeSystem.assertPartial('b', { a: { x: '', b: undefined } });
    });
    it('null is not undefined according to isPartial', () => {
        const isB = typeSystem.isPartial('b', { a: { x: '', b: null } }); // note that 'null' is not valid here
        if (isB) throw new Error();
    });
    it('isPartial does not allow extraneous properties', () => {
        const isB = typeSystem.isPartial('b', { Y: undefined }); // note that 'Y' does not exist on B
        if (isB) throw new Error();
    });
    
    it('isPartialExtends allows extraneous properties', () => {
        const isB = typeSystem.isNonStrictPartial('b', { Y: undefined }); // note that 'Y' does not exist on B
        if (!isB) throw new Error();
    });
    it('B is exactly B', () => {
        typeSystem.assertExact('b', new B());
    });
    it('{} is not exactly B', () => {
        const isB = typeSystem.isExact('b', {});
        if (isB) throw new Error();
    });
    it('exact check requires nested properties to match', () => {
        const isB = typeSystem.isExact('b', { a: {} });
        if (isB) throw new Error();
    });
    it('exact check requires nested properties to match', () => {
        const isB = typeSystem.isExact('b', { a: { x: '' } });
        if (isB) throw new Error();
    });
    it('full B is exact B', () => {
        typeSystem.assertExact('b', { a: { x: '', b: undefined } });
    });
    it('null is not undefined according to isExact', () => {
        const isB = typeSystem.isExact('b', { a: { x: '', b: null } }); // note that 'null' is not valid here
        if (isB) throw new Error();
    });
    it('isExact does not allow extraneous properties', () => {
        const isB = typeSystem.isExact('b', { Y: undefined }); // note that 'Y' does not exist on B
        if (isB) throw new Error();
    });
    it('any description works', () => {
        const isAny = typeSystem.isExact('AnyContainer', { x: '' });
        if (!isAny)
            throw new Error();
    });
    it('undefined is allowed by anyDescription', () => {
        const isAny = typeSystem.isExact('AnyContainer', { x: undefined });
        if (!isAny)
            throw new Error();
    });
    it('undefined is not allowed by nonnullNorUndefinedDescription', () => {
        const _is = nonnullNorUndefinedDescription.is(undefined);
        if (_is)
            throw new Error();
    });
    it('null is not allowed by nonnullOrUndefinedDescription', () => {
        const _is = nonnullNorUndefinedDescription.is(null);
        if (_is)
            throw new Error();
    });
    it('non-null,defined is allowed by nonnullOrUndefinedDescription', () => {
        const _is = nonnullNorUndefinedDescription.is(0);
        if (!_is)
            throw new Error();
    });
    it('undefined is allowed by nonnullDescription', () => {
        const _is = nonnullDescription.is(undefined, Variance.Exact, null as any, () => { });
        if (!_is)
            throw new Error();
    });
    it('null is not allowed by nonnullDescription', () => {
        const _is = nonnullDescription.is(null, Variance.Exact, null as any, () => { });
        if (_is)
            throw new Error();
    });
    it('non-null,defined is allowed by nonnullDescription', () => {
        const _is = nonnullDescription.is(0, Variance.Exact, null as any, () => { });
        if (!_is)
            throw new Error();
    });

    it('undefined is not allowed by definedDescription', () => {
        const _is = definedDescription.is(undefined, Variance.Exact, null as any, () => { });
        if (_is)
            throw new Error();
    });
    it('null is allowed by definedDescription', () => {
        const _is = definedDescription.is(null, Variance.Exact, null as any, () => { });
        if (!_is)
            throw new Error();
    });
    it('non-null,defined is allowed by definedDescription', () => {
        const _is = definedDescription.is(0, Variance.Exact, null as any, () => { });
        if (!_is)
            throw new Error();
    });
    it('test X, which contains properties of type any, nonnull and nonundefined', () => {
        const x: X = {
            x: null,
            y: null,
            z: undefined
        };
        const _isX = typesystem.extends('X', x);
        if (!_isX)
            throw new Error();
    });
    it('test X, which contains properties of type any, nonnull and nonundefined', () => {
        const x: X = {
            x: null,
            y: null,
            z: null as any
        };
        const _isX = typesystem.extends('X', x);
        if (_isX)
            throw new Error();
    });
    
    it('.is(non-object) returns false', () => {
        const is2 = typesystem.isExact('X', 0);
        if (is2) throw new Error();
    });
});
