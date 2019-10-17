
import { TypeSystem, BaseTypeDescriptions, TypeDescriptionsFor, PrimitiveTypes } from '..';

type CheckableTypes = {
    'Example': Example,
    'hasNumberL': { L: number },
}

class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly Example = this.create<Example>({ a: 'number[]', b: 'string?', c: 'hasNumberL' });
    public readonly hasNumberL = this.create<{ L: number }>({ L: 'number' });
}

export const typesystem = new TypeSystem<CheckableTypes & PrimitiveTypes>(new AllTypeDescriptions());


//////////////// in another file: ///////////////////


interface Example {
    a: number[];
    b: string | undefined;
    c: { L: number }
}

function f(obj: Example) {
    typesystem.verify('Example', obj);
}
function g(obj: any) {
    if (typesystem.extends('Example', obj)) {
        // ...
    }
}


// f(g)