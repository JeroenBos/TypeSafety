
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

export interface INamedTypeDescriptions<T> extends ITypeDescriptions<T> {
    readonly typeName?: string;
}

export type DescriptionGetter = (key: any) => ITypeDescriptions<any>;

export enum Variance {
    Exact = 0,
    Partial = 1,
    Extends = 2,
    PartialExtends = Partial + Extends
}

type Tail<T extends any[]> =
    T extends [any, infer B] ? [B] :
    T extends [any, infer B, infer C] ? [B, C] :
    T extends [any, infer B, infer C, infer D] ? [B, C, D] : never;

export type RemainingParametersWithVar<T> = Tail<Parameters<ITypeDescriptions<T>['is']>>;


export type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescriptions<Types[K]> }
export type ILogger = (logStatement: string) => void;


