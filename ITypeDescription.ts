
export interface ITypeDescription<T> {
    is(obj: any,
        getSubdescription: DescriptionGetter,
        log: ILogger): obj is T;
}

export interface ITypeDescriptions<T> {
    is(obj: any,
        variance: Variance,
        getSubdescription: DescriptionGetter,
        log: ILogger): obj is T;
}

export type DescriptionGetter = (key: any) => ITypeDescriptions<any>;

export enum Variance {
    Exact,
    Partial,
    Extends
}

export function selectExactVariance<T>(description: ITypeDescriptions<T>): ITypeDescription<T> {
    return {
        is: (obj: any, ...args: RemainingParameters<T>) => description.is(obj, Variance.Exact, ...args)
    } as any;
}
export function selectPartialVariance<T>(description: ITypeDescriptions<T>): ITypeDescription<T> {
    return {
        is: (obj: any, ...args: RemainingParameters<T>) => description.is(obj, Variance.Partial, ...args)
    } as any;
}
export function selectExtendsVariance<T>(description: ITypeDescriptions<T>): ITypeDescription<T> {
    return {
        is: (obj: any, ...args: RemainingParameters<T>) => description.is(obj, Variance.Extends, ...args)
    } as any;
}

type Tail<T extends any[]> =
    T extends [any, infer B] ? [B] :
    T extends [any, infer B, infer C] ? [B, C] :
    T extends [any, infer B, infer C, infer D] ? [B, C, D] : never;

export type RemainingParameters<T> = Tail<Parameters<ITypeDescription<T>['is']>>;
export type RemainingParametersWithVar<T> = Tail<Parameters<ITypeDescriptions<T>['is']>>;
type e = RemainingParametersWithVar<number>;


export type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescriptions<Types[K]> }
export type ILogger = (logStatement: string) => void;


