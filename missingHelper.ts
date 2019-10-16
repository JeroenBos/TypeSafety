import { GetKey, assert, IsNever, IsAny } from "./typeHelper";
import { Missing } from "./built-ins";


type OptionalPropertyOf<T> = Exclude<{
    [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>

type IsOptional<T, K extends keyof T> = K extends OptionalPropertyOf<T> ? true : false;
assert<IsOptional<{ c: string }, 'c'>>(false);
assert<IsOptional<{ c?: string }, 'c'>>(true);
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
    return true;
}
export class possiblyMissing<T> { constructor(public readonly key: string) { } }
export function optional<T extends string>(s: T): possiblyMissing<T> {
    return new possiblyMissing<T>(s);
}
export type MissingMap<T> = Missing extends T ? possiblyMissing<Exclude<T, Missing>> : false;
type t = MissingMap<Missing | string>;
type t1 = Exclude<string | Missing, Missing>;
type t2 = possiblyMissing<t1>;
type t3 = possiblyMissing<Exclude<string | Missing, Missing>>;
