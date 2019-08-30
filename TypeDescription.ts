import { missing } from "./built-ins";
import { ITypeDescription, ILogger } from "./ITypeDescription";
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
    public static compose<K1 extends keyof Types, K2 extends keyof Types, Types>(description1: TypeDescription<any, any>, description2: TypeDescription<any, any>): TypeDescription<K1 & K2, Types> {
        // TODO: check for overlap, in which case this is never going to work anyway?
        return new TypeDescription({ ...description1.propertyDescriptions, ...description2.propertyDescriptions } as any);
    }
    public static isObjectDescription<K extends keyof Types, Types>(description: ITypeDescription<Types[K]>): description is TypeDescription<K, Types> {
        return 'is' in description && 'isPartial' in description && 'isValidKey' in description && 'checkProperty' in description;
    }

    private constructor(private readonly propertyDescriptions: DescriptionKeys<K, Types>) {
    }
    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger): obj is Types[K] {
        if (obj === undefined || obj === null || obj === missing) {
            return false; // this type handles composite types, so this is never a primitive type, so false
        }

        let result = true; // depending on whether a log is provided, we log everything we can find that's wrong, or we return immediately
        const expectedProperties = Object.assign({}, this.propertyDescriptions);
        // remove properties that are allowed to be missing:
        for (const possiblyOptionalPropertyName in expectedProperties) {
            const possiblyOptionalTypeKey = expectedProperties[possiblyOptionalPropertyName];
            const possiblyOptionalDescription = getSubdescription(possiblyOptionalTypeKey);
            if (possiblyOptionalDescription.is(missing, getSubdescription, log)) {
                throw new Error(`Missing properties aren't supported yet`); // delete expectedProperties[possiblyOptionalPropertyName];
            }
        }
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                continue;
            }
            delete expectedProperties[propertyName];
            const isOfPropertyTypeRail = this.checkProperty(obj, propertyName, getSubdescription, log);
            if (!isOfPropertyTypeRail) {
                result = false; if (log === undefined) return result; // TODO: this is never the case so the optimization is never reached
            }
        }
        for (const missingPropertyName in expectedProperties) {
            const { path, type } = DisposableStackElement.toString();
            log(errorMessage_Missing(path, missingPropertyName, type));
            result = false; if (log === undefined) { return result; }
        }
        return result;
    }
    isPartial(obj: any, getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger): obj is Partial<Types[K]> {
        if (obj === undefined || obj === null || obj === missing) {
            return false; // this type handles composite types, so this is never a primitive type, so false
        }
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                return false;
            }
            const isOfPropertyType = this.checkProperty(obj, propertyName, getSubdescription, log);
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
    private checkProperty(obj: any, propertyName: string & keyof Types[K], getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger): boolean {
        const property = obj[propertyName];
        const propertyKey = this.propertyDescriptions[propertyName];
        const propertyDescription = getSubdescription(propertyKey);
        const stackElem = DisposableStackElement.enter(propertyName, propertyKey as any);
        let isOfPropertyType;

        let loggedError = false; // this boolean indicates whether checking this property has already resulted in logging errors, in which case we won't add anything here
        function _log(s: string): void {
            loggedError = true;
            log(s);
        }
        try {
            isOfPropertyType = propertyDescription.is(property, getSubdescription, _log);
        }
        finally {
            stackElem.dispose();
        }

        if (!isOfPropertyType && !loggedError) {
            const { path, type } = DisposableStackElement.toString();
            log(errorMessage_Wrong(path, propertyName, propertyKey as any, property));
        }
        return isOfPropertyType;
    }
}

function isTypeDescription<K extends keyof Types, Types>(typeDescription: ITypeDescription<Types[K]>): typeDescription is TypeDescription<K, Types> {
    return typeDescription instanceof TypeDescription;
}

export function errorMessage_Missing(path: string, missingPropertyName: string, type: string): string {
    const extraDot = path == '' ? '' : '.';
    return `'${path}${extraDot}${missingPropertyName}' is missing ${type == '' ? '' : `(type = ${type})`}`;
}

export function errorMessage_Wrong(path: string, missingPropertyName: string, type: string, property: any): string {
    const extraDot = path == '' ? '' : '.';
    return `'${path}${extraDot}${missingPropertyName}' has an invalid value '${property}'${type == '' ? '' : `: it must be of type ${type}`}`;
}
