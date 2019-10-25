import { PrimitiveTypes, BaseTypeDescriptions, missingOrUndefinedDescription, disjunct } from "./built-ins";
import { TypeDescriptionsFor, ILogger, ITypeDescriptions, Variance } from "./ITypeDescription";
import { ContainsExactValues, NotNeverValues, ContainsExactValue } from "./typeHelper";
import { DisposableStackElement } from "./DisposableStackElement";
import { isMissing } from "./missingHelper";
import { rootName } from "./TypeDescription";

export class TypeSystem<Types extends PrimitiveTypes> {
    private readonly typeDescriptions = new Map<keyof Types, ITypeDescriptions<Types[keyof Types]>>();
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
     * Verifies compile time and runtime whether `obj` is assignable to `Types[K]`; throws otherwise.
     */
    verify<K extends string & keyof Types>(key: K, obj: Types[K]): void {
        this.assert(key, obj);
    }
    /**
     * Verifies compile time and runtime whether `obj` is assignable to `Types[K]` 
     * and at runtime that `obj` has no extraneous properties; throws otherwise.
     */
    verifyExact<K extends string & keyof Types>(key: K, obj: Types[K]): void {
        this.assertExact(key, obj);
    }
    /**
     * Verifies compile time and runtime whether `obj` is assignable to `Partial<Types[K]>`; throws otherwise.
     */
    verifyPartial<K extends string & keyof Types>(key: K, obj: Partial<Types[K]>): void {
        this.assertPartial(key, obj);
    }
    /**
     * Verifies compile time whether `obj` is assignable to `Partial<Types[K]>` 
     * and runtime whether all properties on `obj` that are properties on `Types[K]` are valid.
     */
    verifyNonStrictPartial<K extends string & keyof Types>(key: K, obj: Partial<Types[K]>): void {
        this.assertNonStrictPartial(key, obj);
    }

    /**
     * Checks only at runtime whether `obj` is assignable to `Types[K]`; throws otherwise.
     */
    assert<K extends string & keyof Types>(key: K, obj: any): void {
        if (!this.extends(key, obj))
            throw new Error(`The specified object was not of type '${key}'`);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Partial<Types[K]>`; throws otherwise.
     */
    assertPartial<K extends string & keyof Types>(key: K, obj: any): void {
        if (!this.isPartial(key, obj))
            throw new Error(`The specified object was not of type 'Partial<${key}>'`);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Types[K]` and that `obj` has no extraneous properties; throws otherwise.
     */
    assertExact<K extends string & keyof Types>(key: K, obj: any): void {
        if (!this.isExact(key, obj))
            throw new Error(`The specified object was not exactly of type '${key}'`);
    }
    /**
     * Checks only at runtime whether `obj` is assignable to `Partial<Types[K]>`; throws otherwise.
     */
    assertNonStrictPartial<K extends string & keyof Types>(key: K, obj: any): void {
        if (!this.isNonStrictPartial(key, obj))
            throw new Error(`The specified object was not of type 'Partial<${key}>'`);
    }

    /**
     * Returns whether all properties on `obj` are valid properties on `Types[K]`
     * and all properties on `Types[K]` are present.
     */
    isExact<K extends string & keyof Types>(key: K, obj: any): obj is Types[K] {
        return this.isImpl(key, obj, Variance.Exact);
    }
    /**
     * Returns whether `obj` is assignable to `Types[K]`.
     */
    extends<K extends string & keyof Types>(key: K, obj: any): obj is Types[K] {
        return this.isImpl(key, obj, Variance.Extends);
    }
    /**
     * Returns whether `obj` is assignable to `Partial<Types[K]>`.
     */
    isPartial<K extends string & keyof Types>(key: K, obj: any): obj is Partial<Types[K]> {
        return this.isImpl(key, obj, Variance.Partial);
    }
    /**
     * Returns whether all properties on `obj` that are properties on `Types[K]` are valid.
     */
    isNonStrictPartial<K extends string & keyof Types>(key: K, obj: any): obj is Partial<Types[K]> {
        return this.isImpl(key, obj, Variance.PartialExtends);
    }


    private isImpl<K extends string & keyof Types>(
        key: K,
        obj: any,
        variance: Variance
    ): boolean {
        if (typeof key !== 'string') throw new Error('only string keys are supported');

        const description = this.getDescription(key);
        const stackElem = DisposableStackElement.enter(rootName, key);
        try {
            return description.is(obj, variance, key => this.getDescription(key), this.log);
        }
        finally {
            stackElem.dispose();
        }
    }

    /**
     * Gets the type description object for the specified key.
     */
    getDescription<K extends keyof Types>(key: K): ITypeDescriptions<Types[keyof Types]> {
        if (isMissing(key)) {
            if (typeof key == 'object' && 'is' in key) {
                return key as any;
            }
            return disjunct(missingOrUndefinedDescription, this.getDescription(key.key)) as any;
        }
        const description = this.typeDescriptions.get(key!);
        if (description === undefined)
            throw new Error('description missing for key ' + key);
        return description;
    }

    /**
      * Gets whether this type system has a type description object for the specified key.
      */
    hasDescription(key: any): key is keyof Types {
        if (isMissing(key)) {
            return this.hasDescription(key.key);
        }
        return this.typeDescriptions.get(key) !== undefined;
    }

    private add<TKey extends keyof Types>(key: TKey, typeDescription: ITypeDescriptions<Types[TKey]>) {
        this.typeDescriptions.set(key, typeDescription);
    }


    // Function overloads (the convention is that `xxxF` is a wrapper function with specified key for the method `xxx`)

    /**
     * Gets a function that verifies at compile time and runtime whether its argument is assignable to `Types[K]`.
     * The returned function throws at runtime if its argument is not assignable to `Types[K]`.
     */
    verifyF<K extends string & keyof Types>(key: K): (obj: Types[K]) => void {
        return obj => this.assert(key, obj);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]`.
     */
    assertF<K extends string & keyof Types>(key: K): (obj: any) => void {
        return obj => this.assert(key, obj);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Partial<Types[K]>`.
     */
    assertPartialF<K extends string & keyof Types>(key: K): (obj: any) => void {
        return obj => this.assertPartial(key, obj);
    }

    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]` and has no extraneous properties.
     */
    assertExactF<K extends string & keyof Types>(key: K): (obj: any) => void {
        return obj => this.assertExact(key, obj);
    }
    /**
     * Gets a function that verifies at runtime whether its argument is assignable to `Types[K]` and has no extraneous properties.
     */
    assertNonStrictPartialF<K extends string & keyof Types>(key: K): (obj: any) => void {
        return obj => this.assertNonStrictPartial(key, obj);
    }


    /**
     * Returns a function that returns whether its argument is assignable to `Types[K]`.
     */
    extendsF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.extends(key, obj);
        return f as any;
    }
    /**
     * Returns a function that returns whether the argument is assignable to `Partial<Types[K]>`.
     */
    isPartialF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.isPartial(key, obj);
        return f as any;
    }
    /**
     * Returns a function that returns whether its argument is assignable to `Types[K]` and has no extra properties.
     */
    isExactF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.isExact(key, obj);
        return f as any;
    }
    /**
     * Returns a function that returns whether all properties on its argument that are properties on `Partial<Types[K]>` are valid.
     */
    isNonStrictPartialF<K extends string & keyof Types>(key: K): (obj: any) => obj is Types[K] {
        const f = (obj: any) => this.isNonStrictPartial(key, obj);
        return f as any;
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

/**
 * An implementation of a type system describing only the primitive types.
 */
export const PrimitiveTypeSystem: TypeSystem<PrimitiveTypes> = new TypeSystem<PrimitiveTypes>(new BaseTypeDescriptions<PrimitiveTypes>());