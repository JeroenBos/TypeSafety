import { PrimitiveTypes, Missing, ExcludePrimitives } from "./built-ins";
import { ITypeDescription, TypeDescriptionsFor } from "./ITypeDescription";
import { GetKey, ContainsExactValues, NotNeverValues, ContainsExactValue, IsExact } from "./typeHelper";
import { TypeDescription } from "./TypeDescription";

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

    /**
     * Checks compile time and runtime whether `arg` is assignable to `Types[K]`.
     */
    assert<K extends keyof Types>(key: K): (arg: Types[K]) => arg is Types[K] {
        return this.check(key);
        //const f: castArg<(obj: any) => obj is Types[K], Types[K]> = this.check(key);
        //return f as any;
    }
    /**
     * Checks only at runtime whether `arg` is assignable to `Types[K]`.
     */
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


/**
 * Tells you compile time which types don't adhere to the assumptions underlying the type system.
 * Example usage: 
 * 
 * type erroneousTypes = DebugTypeSystem<T_Without_Primitives>
 * assert<IsExact<erroneousTypes, {}>>(true);
 */
export type DebugTypeSystem<T>
    = T extends PrimitiveTypes ? "The generic type argument to DebugTypeSystem shouldn't contain the primitive types"
    : debugTypeSystem<T, T & PrimitiveTypes>

// these types help construct DebugTypeSystem<T>:
type debugTypeSystemType<T, S> = NotNeverValues<{ [K in keyof T]: ContainsExactValue<T[K], S> extends true ? never : T[K] }>
type debugTypeSystem<T, S> = NotNeverValues<{ [K in keyof T]: ContainsExactValues<T[K], S> extends true ? never : debugTypeSystemType<T[K], S> }>



export type DescriptionKeys<K extends keyof Types, Types> = { [u in keyof Types[K]]: GetKey<Types[K][u], Types> };
type P<T> = T & PrimitiveTypes;

/**
 * This constructs a helper function to create type descriptions for custom interfaces/classes.
 */
export function createCreateFunction<Types, T extends object & P<Types>[keyof P<Types>]>()
    : (propertyDescriptions: DescriptionKeys<GetKey<T, P<Types>>, P<Types>>) => ITypeDescription<P<Types>[GetKey<T, P<Types>>]> {
    {
        return (propertyDescriptions: DescriptionKeys<GetKey<T, P<Types>>, P<Types>>) =>
            TypeDescription.create<P<Types>, GetKey<T, P<Types>>>(propertyDescriptions);
    }
}

