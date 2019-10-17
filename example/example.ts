import { TypeSystem, BaseTypeDescriptions, TypeDescriptionsFor } from '..';
import { PrimitiveTypes } from '../built-ins';

class nonExistent { }
export type X = {
    x: any,
    y: nonExistent | null
    z: nonExistent | undefined
};

type CheckableTypes = {
    'Example': Example,
    'hasNumberL': { L: number },
    'X': X
}

class AllTypeDescriptions extends BaseTypeDescriptions<CheckableTypes> implements TypeDescriptionsFor<CheckableTypes> {
    public readonly Example = this.create<Example>({ a: 'number[]', b: 'string?', c: 'hasNumberL' });
    public readonly hasNumberL = this.create<{ L: number }>({ L: 'number' });
    public readonly X = this.create<X>({ x: 'any', y: '!undefined', z: '!null' });
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