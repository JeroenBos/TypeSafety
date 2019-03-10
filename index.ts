import { IsAny, IsExact, assert, IsExactOrAny, Has, IsNotNever } from "./typeHelper";
import { PrimitiveTypes, missing, Missing } from "./built-ins";
import { ITypeDescription, TypeDescriptionsFor } from "./ITypeDescription";

type TypeDescriptions<Types> = ITypeDescription<Types[keyof Types]>;
export class TypeSystem<Types extends PrimitiveTypes> {
    // private readonly typeDescriptions = new mapToTypeDescriptions<Types>();
    private readonly typeDescriptions = new Map<keyof Types, TypeDescriptions<Types>>();

    constructor(description: TypeDescriptionsFor<Types>) {
        for (const k in description) {
            const key = k as keyof TypeDescriptionsFor<Types>;
            const value = description[key];
            this.add(key, value);
        }
    }


    // only difference with 
    assert<K extends keyof Types>(key: K): (arg: Types[K]) => arg is Types[K] {
        return this.check(key);
        //const f: castArg<(obj: any) => obj is Types[K], Types[K]> = this.check(key);
        //return f as any;
    }

    check<K extends keyof Types>(key: K): (obj: any) => obj is Types[K] {
        return ((obj: any) => this._check(obj, key)) as any;
    }
    private _check<K extends keyof Types>(obj: any, key: K): obj is Types[K] {
        const description = this.getDescription(key);
        return description.is(obj, key => this.getDescription(key));
    }
    getDescription<K extends keyof Types>(key: K): TypeDescriptions<Types> {
        const description = this.typeDescriptions.get(key);
        if (description === undefined)
            throw new Error('description missing for key ' + key);
        return description;
    }

    private add<TKey extends keyof Types>(key: TKey, typeDescription: ITypeDescription<Types[TKey]>) {
        this.typeDescriptions.set(key, typeDescription);
    }
}

export type GetKey<T, Types> = { [K in keyof Types]: Types[K] extends T ? IsExactOrAny<T, Types[K]> extends true ? K : never : never }[keyof Types];


/**
 * This class describes an interface, `Types[K]`, with key `K`.
 * The names of the properties are `keyof Types[K]`, and each property has the value of another key, i.e. of type `keyof Types`. 
 * More specifically, given the name of a property `p` of interface `Types[K]` where `p extends string & keyof Types[K]`, 
 * the key for this property is `Types[K][p]` and its type is `Types[Types[K][p]]`. 
 */
export class TypeDescription<K extends keyof Types, Types> implements ITypeDescription<Types[K]> {
    public static create<Types, K extends keyof Types>(
        propertyDescriptions: DescriptionKeys<K, Types>): ITypeDescription<Types[K]> {
        return new TypeDescription(propertyDescriptions);
    }
    private constructor(
        private readonly propertyDescriptions: DescriptionKeys<K, Types>
    ) {
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
            const _isOfPropertyType = propertyDescription.is(property, getSubdescription)
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



//  assert<IsExact<dkpHelper<object, dkp1e>, { a: ITypeDescription<object> }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a?: string }>, { a: ITypeDescription<string | Missing> }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a: undefined }>, { a: undefined }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { a: string | undefined }>, { a: string | undefined }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { c?: number; e: number; }>, { c: number | undefined, e: number }>>(true);
// assert<IsExact<DescriptionKeyspart<never, { c?: number; d: undefined; e: number }>, { c: number | undefined; d: undefined; e: number }>>(true);


export type DescriptionKeys<K extends keyof Types, Types> = { [u in keyof Types[K]]: GetKey<Types[K][u], Types> };





export function createCreateFunction<Types, T extends object & Types[keyof Types]>()
    : (propertyDescriptions: DescriptionKeys<GetKey<T, Types>, Types>) => ITypeDescription<Types[GetKey<T, Types>]> {
    {
        return (propertyDescriptions: DescriptionKeys<GetKey<T, Types>, Types>) =>
            TypeDescription.create<Types, GetKey<T, Types>>(propertyDescriptions);
    }
}