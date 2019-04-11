import { TypeSystem, BaseTypeDescriptions, TypeDescriptionsFor, createCreateFunction } from '..';
const create = <T extends object>() => createCreateFunction<CheckableTypes, T>();

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

class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<CheckableTypes> {
    public readonly Example = create<Example>()({ a: 'number[]', b: 'string?', c: 'hasNumberL' });
    public readonly hasNumberL = create<{ L: number }>()({ L: 'number' });
    public readonly X = create<X>()({ x: 'any', y: '!undefined', z: '!null' });
}

export const typesystem = new TypeSystem(new AllTypeDescriptions());


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
    if (typesystem.is('Example', obj)) {
        // ...
    }
}


// f(g)