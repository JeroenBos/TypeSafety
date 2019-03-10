export interface ITypeDescription<T> {
    is(obj: any, getSubdescription: (key: any) => ITypeDescription<any>): obj is T;
}

export type TypeDescriptionsFor<Types extends { [K in keyof Types]: Types[K] }> = { [K in keyof Types]: ITypeDescription<Types[K]> }


