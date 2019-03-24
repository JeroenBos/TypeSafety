import { missing } from "./built-ins";
import { ITypeDescription } from "./ITypeDescription";
import { DescriptionKeys } from "./typesystem";
import { DisposableStackElement } from "./DisposableStackElement";

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
            return false; // this type handles composite types, so this is never a primitive type, so false
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
            const isOfPropertyType = this.checkProperty(obj, propertyName, getSubdescription);
            if (!isOfPropertyType) {
                return false;
            }
        }
        for (const missingPropertyName in expectedProperties) {
            console.debug(`'${missingPropertyName}' is missing from object of type ${DisposableStackElement.print(' in type ')}`);
            return false; // throw new Error(`${missingPropertyName} is missing`);
        }
        return true;
    }
    isPartial(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is Partial<Types[K]> {
        if (obj === undefined || obj === null || obj === missing) {
            return false; // this type handles composite types, so this is never a primitive type, so false
        }
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                return false;
            }
            const isOfPropertyType = this.checkProperty(obj, propertyName, getSubdescription);
            if (!isOfPropertyType) {
                return false;
            }
        }
        return true;
    }
    private isValidKey(propertyName: string | keyof Types[K]): propertyName is keyof Types[K] {
        const propertyDescriptions: object = this.propertyDescriptions;
        return propertyDescriptions.hasOwnProperty(propertyName);
    }
    private checkProperty(obj: any, propertyName: string & keyof Types[K], getSubdescription: (key: any) => ITypeDescription<any>): boolean {
        const property = obj[propertyName];
        const propertyKey = this.propertyDescriptions[propertyName];
        const propertyDescription = getSubdescription(propertyKey);
        const stackElem = DisposableStackElement.create(propertyName);
        try {
            const isOfPropertyType = propertyDescription.is(property, getSubdescription);
            return isOfPropertyType;
        }
        finally {
            stackElem.dispose();
        }
    }
}
