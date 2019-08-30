import { anyDescription, BaseTypeDescriptions, possiblyUndefined } from "../built-ins";
import { errorMessage_Missing } from "../TypeDescription";
import { OptionalToMissing } from "../typeHelper";
import { createCreateFunction, TypeSystem } from "../typesystem";
import { TypeDescriptionsFor } from "../ITypeDescription";

interface L1 {
    x: string;
    b: L2;
}
interface L2 {
    c: L1 | undefined;
    s: string;
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'L1': L1,
    'L2': L2,
    'L1?': L1 | undefined,
    'L2?': L2 | undefined,
}>

const create = <T extends object>() => createCreateFunction<CheckableTypes, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<CheckableTypes> {
    public readonly L1 = create<L1>()({ x: 'string', b: 'L2' });
    public readonly L2 = create<L2>()({ c: 'L1?', s: 'string' });
    public readonly 'L1?' = possiblyUndefined(this.L1);
    public readonly 'L2?' = possiblyUndefined(this.L2);
}

///////////////////////////
function assertSequenceEquals(result: string[], expectation: string[]): void {
    if (expectation.length != result.length)
        throw new Error(`Length differ: expected: ${expectation.length}, got ${result.length}`);

    for (let i = 0; i < expectation.length; i++) {
        if (expectation[i] != result[i])
            throw new Error(`Elements ${i} don't match: expected '${expectation[i]}', got '${result[i]}'`);
    }
}

describe('Test logging', () => {
    it('{} ∈ a', () => {
        // arrange
        const logStatements: string[] = [];
        const typesystem = new TypeSystem(new AllTypeDescriptions(), logStatements.push.bind(logStatements));
        const expectedLogStatements: string[] = [errorMessage_Missing('x', 'obj', 'L1')];

        // act
        typesystem.is('L1', {});

        // assert
        assertSequenceEquals(logStatements, expectedLogStatements);
    });

    it(`{ x: '', b: {} } ∈ a`, () => {
        // arrange
        const logStatements: string[] = [];
        const typesystem = new TypeSystem(new AllTypeDescriptions(), logStatements.push.bind(logStatements));
        const expectedLogStatements: string[] = [errorMessage_Missing('c', 'obj.b', 'L2')];

        // act
        typesystem.is('L1', { x: '', b: {} });

        // assert
        assertSequenceEquals(logStatements, expectedLogStatements);
    });
});