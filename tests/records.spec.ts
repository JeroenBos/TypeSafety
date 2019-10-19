import { TypeSystem, DebugTypeSystem } from "../typeSystem";
import { BaseTypeDescriptions, possiblyUndefined, possiblyNullOrUndefined, nullable, anyDescription, PrimitiveTypes } from "../built-ins";
import { TypeDescriptionsFor, ITypeDescriptions } from "../ITypeDescription";
import { OptionalToMissing, IsExact, assert, GetKey, } from "../typeHelper";
import { RecordTypeDescription } from "../record.typedescription";

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
    'record': Record<string, A>
}>

export class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly a = this.create<A>({ x: 'string', b: '!null' });
    public readonly record = this.createRecord<A>('a');
}

export const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());

///////////////////////////


describe('RecordTypeDescription', () => {
    it('empty record is a record', () => {
        const is = typesystem.isExact('record', {});
        if (!is) throw new Error();
    });
});
