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
    a: L1 | undefined;
}

///////////////////////////

export type CheckableTypes = OptionalToMissing<{
    'a': L1,
    'b': L2,
    'a?': L1 | undefined,
    'b?': L2 | undefined,
}>

const create = <T extends object>() => createCreateFunction<CheckableTypes, T>();

export class AllTypeDescriptions extends BaseTypeDescriptions implements TypeDescriptionsFor<CheckableTypes> {
    public readonly a = create<L1>()({ x: 'string', b: 'b' });
    public readonly b = create<L2>()({ a: 'a?' });
    public readonly 'a?' = possiblyUndefined(this.a);
    public readonly 'b?' = possiblyUndefined(this.b);
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

function missing(propertyName: string): string {
    return propertyName;
}

describe('Test logging', () => {
    it('Test testing setup', () => {
        // arrange
        const logStatements: string[] = [];
        const typesystem = new TypeSystem(new AllTypeDescriptions(), logStatements.push.bind(logStatements));
        const expectedLogStatements: string[] = [];

        // act
        debugger;

        // assert
        assertSequenceEquals(logStatements, expectedLogStatements);
    });
});