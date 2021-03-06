import { ILogger, Variance, ITypeDescriptions, DescriptionGetter, INamedTypeDescriptions } from './ITypeDescription';
import { DisposableStackElement } from './DisposableStackElement';
import { DescriptionKeys, isMissing, explicitlyMissing, DescriptionKeysOrObjects } from './missingHelper';

/**
 * This class describes an interface, `Types[K]`, with key `K`.
 * The names of the properties are `keyof Types[K]`, and each property has the value of another key, i.e. of type `keyof Types`.
 * More specifically, given the name of a property `p` of interface `Types[K]` where `p extends string & keyof Types[K]`,
 * the key for this property is `Types[K][p]` and its type is `Types[Types[K][p]]`.
 */
export class TypeDescription<K extends keyof Types, Types, T> implements ITypeDescriptions<Types[K]> {
    public static create<Types, K extends keyof Types, T>(propertyDescriptions: DescriptionKeysOrObjects<K, Types, T>): ITypeDescriptions<Types[K]> {
        return new TypeDescription(propertyDescriptions);
    }
    public static compose<K1 extends keyof Types, K2 extends keyof Types, Types>(description1: TypeDescription<any, any, any>, description2: TypeDescription<any, any, any>): TypeDescription<K1 & K2, Types, any> {
        // TODO: check for overlap, in which case this is never going to work anyway?
        return new TypeDescription({ ...description1.propertyDescriptions, ...description2.propertyDescriptions } as any);
    }
    public static isObjectDescription(description: ITypeDescriptions<any>): description is TypeDescription<any, any, any> {
        return Object.getPrototypeOf(description) == TypeDescription.prototype;
    }

    protected constructor(
        private readonly propertyDescriptions: DescriptionKeysOrObjects<K, Types, T>) {
    }
    is(obj: any, variance: Variance, getSubdescription: DescriptionGetter, log: ILogger): obj is Types[K] {
        if (obj === undefined || obj === null || isMissing(obj) || typeof obj !== 'object') {
            return false; // this type handles composite types, so this is never a primitive type, so false
        }
        let result = true; // depending on whether a log is provided, we log everything we can find that's wrong, or we return immediately
        const expectedProperties: Record<string, ITypeDescriptions<any> | string> = Object.assign({} as any, this.propertyDescriptions);
        if ((variance & Variance.Partial) == 0) {
            // remove properties that are allowed to be missing:
            for (const possiblyOptionalPropertyName in expectedProperties) {
                const x = expectedProperties[possiblyOptionalPropertyName]; // x can be just the key, a missing key, or the description itself
                const description = typeof x == 'string' || isMissing(x) ? getSubdescription(x) : (x as ITypeDescriptions<any>);
                // if the property is actually missing
                if (!(possiblyOptionalPropertyName in obj)) {
                    // if missing is allowed
                    if (description.is(explicitlyMissing, Variance.Exact, getSubdescription, log)) {
                        delete expectedProperties[possiblyOptionalPropertyName];
                    } else {
                        log(stackErrorMessage_Missing(possiblyOptionalPropertyName));
                        result = false; if (log === undefined) { return result; }
                    }
                } else { // it's not missing
                    // then omit the part of the description that said it could be missing (it is was described as such)
                    if (isMissing(x)) {
                        expectedProperties[possiblyOptionalPropertyName] = x.key;
                    }
                }

                if (isMissing(x) && !(possiblyOptionalPropertyName in obj)) {
                    delete expectedProperties[possiblyOptionalPropertyName];
                }
            }
        }
        for (const propertyName in obj) {
            if (!this.isValidKey(propertyName)) {
                if ((variance & Variance.Extends) == 0) {
                    log(stackErrorMessage_Extra(propertyName));
                    result = false; if (log === undefined) { return result; }
                }
                continue;
            }
            delete expectedProperties[propertyName];
            const isOfPropertyType = this.checkProperty(obj, propertyName, getSubdescription, log);
            if (!isOfPropertyType) {
                result = false; if (log === undefined) return result; // TODO: this is never the case so the optimization is never reached
                // logging is done in this.checkProperty
            }
        }
        return result;
    }
    protected isValidKey(propertyName: string | keyof Types[K]): propertyName is keyof Types[K] & keyof T {
        const propertyDescriptions: object = this.propertyDescriptions;
        return propertyDescriptions.hasOwnProperty(propertyName);
    }
    /** Helper function to extract name and description given the property name and possibly overriding propertyKey. */
    private getProperty<S>(
        propertyName: string & keyof T,
        getSubdescription: DescriptionGetter,
        propertyKey: string | undefined
    ): {
        name: string,
        description: ITypeDescriptions<S>
    } {
        let name: string;
        let description: ITypeDescriptions<S>;
        if (propertyKey != undefined) {
            name = propertyKey;
            description = getSubdescription(propertyKey);
        } else {
            const descriptionOrKey = this.propertyDescriptions[propertyName];

            if (typeof descriptionOrKey == 'string') {
                description = getSubdescription(descriptionOrKey);
                name = descriptionOrKey;
            } else if (isMissing(descriptionOrKey)) {
                description = getSubdescription(descriptionOrKey);
                name = descriptionOrKey.key;
            }
            else {
                const namedDescription = descriptionOrKey as any as INamedTypeDescriptions<S>;
                description = namedDescription;
                if (typeof namedDescription.typeName == 'string')
                    name = namedDescription.typeName;
                else
                    name = '?';
            }
        }

        return { name, description };
    }
    protected checkProperty(
        obj: any,
        propertyName: string & keyof T,
        getSubdescription: DescriptionGetter,
        log: ILogger,
        propertyKey?: DescriptionKeys<K, Types>[string & keyof Types[K]]
    ): boolean {
        const property = obj[propertyName];
        const { name: loggedName, description } = this.getProperty(propertyName, getSubdescription, propertyKey as any);
        const stackElem = DisposableStackElement.enter(propertyName, loggedName);
        let isOfPropertyType;

        let loggedError = false; // this boolean indicates whether checking this property has already resulted in logging errors, in which case we won't add anything here
        function _log(s: string): void {
            loggedError = true;
            log(s);
        }
        try {
            isOfPropertyType = description.is(property, Variance.Extends, getSubdescription, _log);
        }
        finally {
            stackElem.dispose();
        }

        if (!isOfPropertyType && !loggedError) {
            log(stackErrorMessage_Wrong(propertyName, loggedName, property));
        }
        return isOfPropertyType;
    }
}
function stackErrorMessage_Missing(missingPropertyName: string): string {
    const { path, type } = DisposableStackElement.toString();
    return errorMessage_Missing(path, missingPropertyName, type);
}
function stackErrorMessage_Wrong(missingPropertyName: string, type: string, property: any): string {
    const { path } = DisposableStackElement.toString();
    return errorMessage_Wrong(path, missingPropertyName, type, property);
}
function stackErrorMessage_Extra(extraPropertyName: string): string {
    const { path, type } = DisposableStackElement.toString();
    return errorMessage_Extra(path, extraPropertyName, type);
}

export const rootName = 'arg';
export function errorMessage_Missing(path: string, missingPropertyName: string, type: string): string {
    const extraDot = path == '' ? '' : '.';
    return `'${path}${extraDot}${missingPropertyName}' is missing ${type == '' ? '' : `(type = ${type})`}`;
}
export function errorMessage_Wrong(path: string, missingPropertyName: string, type: string, property: any): string {
    const extraDot = path == '' ? '' : '.';
    return `'${path}${extraDot}${missingPropertyName}' has an invalid value '${property}'${type == '' ? '' : `: it must be of type ${type}`}`;
}

export function errorMessage_Extra(path: string, extraPropertyName: string, type: string): string {
    const extraDot = path == '' ? '' : '.';
    return `'${path}${extraDot}${extraPropertyName}' is not an accepted property${type == '' ? '' : ` (on type ${type})`}`;
}