
export interface ITypeDescription<T> {
    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger): obj is T;
    /** Gets whether all properties on any are in T, possibly with a few missing, but at least not properties not in T. */
    isPartial(obj: any, getSubdescription: (key: any) => ITypeDescription<any>, log: ILogger): obj is Partial<T>;
}

export type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescription<Types[K]> }
export type ILogger = (logStatement: string) => void;


