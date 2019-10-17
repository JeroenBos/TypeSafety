import { GetKey, IsNever, IsAny, IsOptional } from "./typeHelper";


export type DescriptionKeys<K extends keyof Types, Types> = {
    [u in keyof Types[K]]-?: (
        IsOptional<Types[K], u> extends false ? descriptionKey<Types[K], u, GetKey<Types[K][u], Types>>
        : (Exclude<possiblyMissing<descriptionKey<Types[K], u, GetKey<Exclude<Types[K][u], undefined>, Types>>>, undefined>
            | Exclude<possiblyMissing<descriptionKey<Types[K], u, GetKey<Types[K][u], Types>>>, undefined>
        )
    )
};

type descriptionKey<V, u extends keyof V, UKey> =

    IsNever<UKey> extends false ? UKey :
    (
        IsAny<V[u]> extends true ? 'any' | '!null' | '!undefined' | 'any!' :
        (
            null extends V[u] ?
            undefined extends V[u] ? 'any' : '!undefined'
            :
            undefined extends V[u] ? '!null' : 'any!'
        )
    )

export function isMissing(o: any): o is possiblyMissing<any> {
    return o instanceof possiblyMissing;
}
export class possiblyMissing<T> { public readonly key: any; constructor(key: string) { this.key = key; } }
export function optional<T extends string>(s: T): possiblyMissing<T> {
    return new possiblyMissing<T>(s);
}

export const missing = Object.freeze(class missingType { });
export type Missing = typeof missing | undefined;