import { missing } from "./built-ins";
import { ITypeDescription } from "./ITypeDescription";
import { DescriptionKeys } from "./typesystem";

/**
 * This class describes an interface, `Types[K]`, with key `K`.
 * The names of the properties are `keyof Types[K]`, and each property has the value of another key, i.e. of type `keyof Types`.
 * More specifically, given the name of a property `p` of interface `Types[K]` where `p extends string & keyof Types[K]`,
 * the key for this property is `Types[K][p]` and its type is `Types[Types[K][p]]`.
 */
export class TypeDescription<K extends keyof Types, Types> implements ITypeDescription<Types[K]> {
    public static create<Types, K extends keyof Types>(propertyDescriptions: DescriptionKeys<K, Types>): ITypeDescription<Types[K]> {
        return new TypeDescription(propertyDescriptions);
    }
    private constructor(private readonly propertyDescriptions: DescriptionKeys<K, Types>) {
    }
    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is Types[K] {
        if (obj === undefined || obj === null || obj === missing) {
            return false;
        }
        const expectedProperties = Object.assign({}, this.propertyDescriptions);
        // remove properties that are allowed to be missing:
        for (const possiblyOptionalPropertyName in expectedProperties) {
            const possiblyOptionalTypeKey = expectedProperties[possiblyOptionalPropertyName];
            const possiblyOptionalDescription = getSubdescription(possiblyOptionalTypeKey);
            if (possiblyOptionalDescription.is(missing, getSubdescription)) {
                throw new Error('missing properties arent supported yet');
                delete expectedProperties[possiblyOptionalPropertyName];
            }
        }
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                continue; // throw new Error(`The object has an extra property '${propertyName}'`);
            }
            delete expectedProperties[propertyName];
            const property = obj[propertyName];
            const propertyKey = this.propertyDescriptions[propertyName];
            const propertyDescription = getSubdescription(propertyKey);
            const _isOfPropertyType = propertyDescription.is(property, getSubdescription);
            if (!_isOfPropertyType) {
                return false;
            }
        }
        for (const missingPropertyName in expectedProperties) {
            return false; // throw new Error(`${missingPropertyName} is missing`);
        }
        return true;
    }
    private isValidKey(propertyName: string | keyof Types[K]): propertyName is keyof Types[K] {
        const propertyDescriptions: object = this.propertyDescriptions;
        return propertyDescriptions.hasOwnProperty(propertyName);
    }
}
