import { GetKey, IsNever, IsAny, IsOptional } from './typeHelper';
import { INamedTypeDescriptions } from './ITypeDescription';

export type PropertyWiseUnion<T, U> = {
    [K in keyof (T & U)]: (K extends keyof T ? T[K] : never) | (K extends keyof U ? U[K] : never)
};

export type DescriptionKeysOrObjects<K extends keyof Types, Types, T = Types[K]> = PropertyWiseUnion<DescriptionKeys<K, Types, T>,
    { [K in keyof T]: INamedTypeDescriptions<T[K]> }>;

export type DescriptionKeys<K extends keyof Types, Types, T = Types[K]> = {
    [u in keyof T]-?: (
        IsOptional<T, u> extends false
        ? descriptionKey<T[u], GetKey<T[u], Types>>
        :
        Exclude<
            possiblyMissing<
                descriptionKey<
                    T[u],
                    GetKey<T[u], Types> | GetKey<Exclude<T[u], undefined>, Types>
                >
            >,
            undefined>

    )
};

type ExtractStringValues<T> = { [K in keyof T]: Extract<T[K], string> };

// T for value type in (Checkable) Types of the parameter
// K for the key of the type P in CheckableTypes
type descriptionKey<T, K> =

    // if the key does not exist in checkable type, we select either one of 'any', '!null', '!undefined', 'any!'
    // depending on whether null and/or undefined are part of the type T[P]
    IsNever<K> extends false ? K :
    (
        IsAny<T> extends true ? 'any' | '!null' | '!undefined' | 'any!' :
        (
            null extends T ?
            undefined extends T ? 'any' : '!undefined'
            :
            undefined extends T ? '!null' : 'any!'
        )
    )

export function isMissing(o: any): o is possiblyMissing<any> {
    return o instanceof possiblyMissing;
}
class possiblyMissing<T> { public readonly key: any; constructor(key: string) { this.key = key; } }
export function optional<T extends string>(s: T): possiblyMissing<T> {
    return new possiblyMissing<T>(s);
}

export const explicitlyMissing = Object.freeze(new possiblyMissing('Should never be accessed'));
export type Missing = typeof possiblyMissing | undefined;