import { GetKey, IsNever, IsAny, IsOptional } from './typeHelper';

export type DescriptionKeys<K extends keyof Types, Types> = {
    [u in keyof Types[K]]-?: (
        IsOptional<Types[K], u> extends false
        ? descriptionKey<Types[K][u], GetKey<Types[K][u], Types>>
        :
        Exclude<
            possiblyMissing<
                descriptionKey<
                    Types[K][u],
                    GetKey<Types[K][u], Types> | GetKey<Exclude<Types[K][u], undefined>, Types>
                >
            >,
            undefined>

    )
};

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