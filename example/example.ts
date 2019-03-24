import { TypeSystem, BaseTypeDescriptions, TypeDescriptionsFor, createCreateFunction } from '..';
const create = <T extends object>() => createCreateFunction<CheckableTypes, T>();


type CheckableTypes = {
    'Example': Example,
    'hasNumberL': { L: number }
}

class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<CheckableTypes> {
    public readonly Example = create<Example>()({ a: 'number[]', b: 'string?', c: 'hasNumberL' });
    public readonly hasNumberL = create<{ L: number }>()({ L: 'number' });
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