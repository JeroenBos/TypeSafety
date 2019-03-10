import { BaseTypeDescriptions, TypeDescriptionsFor, possiblyUndefined, OptionalToMissing, nullable, possiblyNullOrUndefined, optional, createCreateFunction, primitiveTypes, TypeSystem, Missing } from ".";

export class A {
    x: string = 'a';
    // note that 'b: B | undefined' could result in an error, because that's equivalent to `A` missing the property 'b'
    // and tsc does not distuinguish between missing and type undefined
    b: B | undefined = undefined;
    // c?: number;    missing properties aren't supported yet
}
export class B {
    a: A = new A();
}




export type checkableTypes = OptionalToMissing<{
    'a': A,
    'b': B,
    'b?': B | undefined,
    'nullable b': B | null,
    'nullable b?': B | undefined | null,
    'optional b'?: B
}>
export type allCheckableTypes = checkableTypes & primitiveTypes;


const create = <T extends object>() => createCreateFunction<allCheckableTypes, T>();


export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<checkableTypes> {
    public readonly a = create<A>()({ x: 'string', b: 'b?' });
    public readonly b = create<B>()({ a: 'a' });
    public readonly 'b?' = possiblyUndefined(this.b);
    public readonly 'nullable b' = nullable(this.b);
    public readonly 'nullable b?' = possiblyNullOrUndefined(this.b);
    public readonly 'optional b' = optional(this.b);
}



export const typeSystem = new TypeSystem(new AllTypeDescriptions());