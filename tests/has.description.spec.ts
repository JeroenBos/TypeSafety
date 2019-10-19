import { typeSystem } from "./missing.spec";
import { optional } from "../missingHelper";

describe('typesystem.hasDescription', () => {
    it('returns true for primitive description', () => {
        const has = typeSystem.hasDescription('string');
        if (!has)
            throw new Error();
    });
    it('returns true for optional primitive description', () => {
        const has = typeSystem.hasDescription(optional('string'));
        if (!has)
            throw new Error();
    });
    it('returns true for non-existing primitive description', () => {
        const has = typeSystem.hasDescription('doesnt exist');
        if (has)
            throw new Error();
    });
    it('returns true for non-existing primitive description', () => {
        const has = typeSystem.hasDescription(optional('doesnt exist'));
        if (has)
            throw new Error();
    });
    it('returns true for defined description', () => {
        const has = typeSystem.hasDescription('optional c');
        if (!has)
            throw new Error();
    });
});