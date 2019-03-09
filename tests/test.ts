import 'mocha';
import { is, ITypeDescription, BaseTypeDescriptions, stringDescription, BaseTypeSystem, primitiveTypes, TypeDescriptionsFor, TypeDescription, numberDescription, composeDescriptions, undefinedDescription, getKey, DescriptionKeys, assert, IsExact, IsExactOrAny, NonNullableValuesContraint } from '..';


export class A {
    x: string = 'a';
    b: B | undefined;
}
export class B {
    a: A = new A();
}



type checkableTypes = {
    'a': A,
    'b': B,
    // 'b?': B | undefined
}
//
// test getKey
//

assert<IsExact<'string', getKey<string, allCheckableTypes>>>(true);
assert<IsExact<'a', getKey<A, allCheckableTypes>>>(true);
assert<IsExact<'b', getKey<B, allCheckableTypes>>>(true);
// assert<IsExact<'b?', getKey<B | undefined, allCheckableTypes>>>(true);

//
// test allCheckableTypes[getKey]
//

assert<IsExact<string, allCheckableTypes[getKey<string, allCheckableTypes>]>>(true);
assert<IsExact<A, allCheckableTypes[getKey<A, allCheckableTypes>]>>(true);
assert<IsExact<B, allCheckableTypes[getKey<B, allCheckableTypes>]>>(true);
// assert<IsExact<B | undefined, allCheckableTypes[getKey<B | undefined, allCheckableTypes>]>>(true);

//
// test type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescription<Types[K]> }
//
// assert<IsExact<ITypeDescription<null>, TypeDescriptionsFor<allCheckableTypes>['null']>>(true);
assert<IsExact<ITypeDescription<string>, TypeDescriptionsFor<allCheckableTypes>['string']>>(true);
assert<IsExact<ITypeDescription<B>, TypeDescriptionsFor<allCheckableTypes>['b']>>(true);
// assert<IsExact<ITypeDescription<B | undefined>, TypeDescriptionsFor<allCheckableTypes>['b?']>>(true);

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
// assert<IsExact<{ x: 'string', b: 'b?' }, reala>>(true);
type realb = realwrapper<'b'>;
assert<IsExact<{ a: 'a' }, realb>>(true);

export type real<K extends keyof Types, Types> = { [u in keyof Types[K]]: getKeyL<Types[K][u], allCheckableTypes> }
export type getKeyL<T, Types extends { [k in keyof Types]: Types[k] }> =
    { [K in keyof Types]: Types[K] extends T ? IsExactOrAny<T, Types[K]> extends true ? K : never : never }[keyof Types];


type allCheckableTypes = checkableTypes & primitiveTypes;

// is called like create<getKey<B, allCheckableTypes>>(...)
// function create<K extends keyof allCheckableTypes>(
//     propertyDescriptions: DescriptionKeys<K, allCheckableTypes>): ITypeDescription<allCheckableTypes[K]> 
// {
//     return TypeDescription.create<allCheckableTypes, K>(propertyDescriptions);
// }

function create<T extends NonNullableValuesContraint<allCheckableTypes[keyof allCheckableTypes]>>(
    propertyDescriptions: DescriptionKeys<getKey<T, allCheckableTypes>, allCheckableTypes>): ITypeDescription<allCheckableTypes[getKey<T, allCheckableTypes>]> {
    return TypeDescription.create<allCheckableTypes, getKey<T, allCheckableTypes>>(propertyDescriptions);
}

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    // public readonly a = lazy({}, AllTypeDescriptions.createA);
    // private static createA(this: AllTypeDescriptions): ITypeDescription<A> {
    //     return TypeDescription.create<A>({ x: stringDescription, b: this['b?'] });
    // }
    public readonly a: ITypeDescription<A> = create<A>({ x: 'string', b: 'b' }); // TODO: create a 'b?' something that represents b being a B or nullable
    public readonly b: ITypeDescription<B> = create<B>({ a: 'a' });
    // public readonly 'b?': ITypeDescription<B | undefined> = create<B | undefined>({ a: 'a' });// composeDescriptions(this.b, undefinedDescription);

    constructor() {
        super()
    }
}
export class TypeSystem extends BaseTypeSystem<checkableTypes & primitiveTypes> {
    constructor() {
        super(new AllTypeDescriptions())
    }
}

describe('tests', () => {
    it('test number', () => {
        debugger;
        const typeSystem = new TypeSystem();
        typeSystem.assert('a')(null);

    })
});