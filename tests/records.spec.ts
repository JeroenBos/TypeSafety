import { TypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, PrimitiveTypes } from "../built-ins";
import { TypeDescriptionsFor } from "../ITypeDescription";
import { OptionalToMissing } from "../typeHelper";

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

export class C {
    s: string[] = []
}

export class AnyContainer {
    x: any;
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'a': A,
    'record': Record<string, A>,
}>

export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly a = this.create<A>({ x: 'string', b: '!null' });
    public readonly record = this.createRecord<A>('a');
}

export const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());

///////////////////////////


describe('RecordTypeDescription', () => {
    it('empty record is a exactly a record', () => {
        const is = typesystem.isExact('record', {});
        if (!is) throw new Error();
    });
    it('empty record is a partial record', () => {
        const is = typesystem.isPartial('record', {});
        if (!is) throw new Error();
    });
    it('empty record extends a record', () => {
        const is = typesystem.extends('record', {});
        if (!is) throw new Error();
    });

    it('record with single element is exactly a record', () => {
        const is2 = typesystem.isExact('record', { _: { x: '', b: undefined } });
        if (!is2) throw new Error();
    });
    it('record with single element is partial record', () => {
        const is2 = typesystem.isPartial('record', { _: { x: '', b: undefined } });
        if (!is2) throw new Error();
    });
    it('record with single element extends record', () => {
        const is2 = typesystem.extends('record', { _: { x: '', b: undefined } });
        if (!is2) throw new Error();
    });

    it('record with two elements is exactly a record', () => {
        const is2 = typesystem.isExact('record', { _: { x: '', b: undefined }, __: { x: '', b: undefined } });
        if (!is2) throw new Error();
    });
    it('.is(non-object) returns false', () => {
        const is2 = typesystem.isExact('record', 0);
        if (is2) throw new Error();
    });
});
