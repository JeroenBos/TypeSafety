import { PrimitiveTypes, Missing, ExcludePrimitives } from "./built-ins";
import { ITypeDescription, TypeDescriptionsFor, ILogger } from "./ITypeDescription";
import { GetKey, ContainsExactValues, NotNeverValues, ContainsExactValue, IsExact, IsNever, IsAny } from "./typeHelper";
import { TypeDescription } from "./TypeDescription";
import { DisposableStackElement } from "./DisposableStackElement";

type TypeDescriptions<Types> = ITypeDescription<Types[keyof Types]>;
export class TypeSystem<Types extends PrimitiveTypes> {
    private readonly typeDescriptions = new Map<keyof Types, TypeDescriptions<Types>>();
    private readonly log: ILogger;
    constructor(description: TypeDescriptionsFor<Types>, logger?: ILogger) {
        this.log = logger || (() => { });
        for (const k in description) {
            const key = k as keyof TypeDescriptionsFor<Types>;
            const value = description[key];
            this.add(key, value);
        }
    }

    /**
     * Verifies compile time and runtime whether `obj` is assignable to `Types[K]`.
     * At runtime, throws if `obj` is not assignable to `Types[K]`.
     */
    verify<K extends string & keyof Types>(key: K, obj: Types[K]): void | never {
        this.assert(key, obj);
    }
    /**
     * Gets a function that verifies at compile time and runtime whether its argument is assignable to `Types[K]`.
     * The returned function throws at runtime if its argument is not assignable to `Types[K]`.
     */
    verifyF<K extends string & keyof Types>(key: K): (obj: Types[K]) => void | never {
        return obj => this.assert(key, obj);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Types[K]`.
     * Throws if `obj` is not assignable to `Types[K]`.
     */
    assert<K extends string & keyof Types>(key: K, obj: any): void | never {
        if (!this.is(key, obj))
            throw new Error(`The specified object was not of type '${key}'`);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]`.
     */
    assertF<K extends string & keyof Types>(key: K): (obj: any) => void | never {
        return obj => this.assert(key, obj);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Types[K]`.
     * Throws if `obj` is not assignable to `Types[K]`.
     */
    assertPartial<K extends string & keyof Types>(key: K, obj: any): void | never {
        if (!this.isPartial(key, obj))
            throw new Error(`The specified object was not of type '${key}'`);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]`.
     */
    assertPartialF<K extends string & keyof Types>(key: K): (obj: any) => void | never {
        return obj => this.assertPartial(key, obj);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Types[K]` and that `obj` has no extraneous properties.
     * Throws if `obj` is not assignable to `Types[K]`.
     */
    assertExact<K extends string & keyof Types>(key: K, obj: any): void | never {
        if (!this.isExact(key, obj))
            throw new Error(`The specified object was not exactly of type '${key}'`);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]` and has no extraneous properties.
     */
    assertExactF<K extends string & keyof Types>(key: K): (obj: any) => void | never {
        return obj => this.assertExact(key, obj);
    }

    /**
     * Returns a boolean indicating whether `obj` is assignable to `Types[K]`.
     */
    is<K extends string & keyof Types>(key: K, obj: any): obj is Types[K] {
        return this.isImpl(key, obj, (description, obj, getSubdescription) => description.is(obj, getSubdescription, this.log));
    }
    /**
     * Returns a boolean indicating whether all properties on `obj` are properties on `Types[K]`; throws otherwise.
     */
    isPartial<K extends string & keyof Types>(key: K, obj: any): obj is Partial<Types[K]> {
        return this.isImpl(key, obj, (description, obj, getSubdescription) => description.isPartial(obj, getSubdescription, this.log));
    }
    /**
     * Returns a boolean indicating whether all properties on `obj` are properties on `Types[K]`
     * and all properties on `Types[K]` are present; throws otherwise.
     */
    isExact<K extends string & keyof Types>(key: K, obj: any): obj is Partial<Types[K]> {
        return this.isPartial(key, obj) && this.is(key, obj);
    }

    private isImpl<K extends string & keyof Types>(
        key: K,
        obj: any,
        _is: (description: TypeDescriptions<Types>, obj: any, getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger) => boolean
    ): boolean {
        if (typeof key !== 'string') throw new Error('only string keys are supported');

        const description = this.getDescription(key);
        const stackElem = DisposableStackElement.create(key);
        try {
            return _is(description, obj, key => this.getDescription(key), this.log);
        }
        finally {
            stackElem.dispose();
        }
    }

    /**
     * Returns a function that returns a boolean indicating whether its argument is assignable to `Types[K]`.
     */
    isF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.is(key, obj);
        return f as any;
    }
    /**
     * Returns a function that returns a boolean indicating whether the argument contains only properties that are on `Types[K]` as well.
     */
    isPartialF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.isPartial(key, obj);
        return f as any;
    }

    getDescription<K extends keyof Types>(key: K): TypeDescriptions<Types> {
        const description = this.typeDescriptions.get(key!);
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
type debugTypeSystem<T, S> = NotNeverValues<{ [K in keyof T]: T[K] extends any[] ? never : ContainsExactValues<T[K], S> extends true ? never : debugTypeSystemType<T[K], S> }>



export type DescriptionKeys<K extends keyof Types, Types> = {
    [u in keyof Types[K]]: (
        IsNever<GetKey<Types[K][u], Types>> extends false ? GetKey<Types[K][u], Types> :
        (
            IsAny<Types[K][u]> extends true ? 'any' | '!null' | '!undefined' | 'any!' :
            (
                null extends Types[K][u] ?
                undefined extends Types[K][u] ? 'any' : '!undefined'
                :
                undefined extends Types[K][u] ? '!null' : 'any!'
            )
        )
    )
};
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

