import { TypeDescription } from "./TypeDescription";
import { DescriptionGetter, ILogger } from "./ITypeDescription";
import { DescriptionKeys } from "./missingHelper";
import { GetKey } from "./typeHelper";

export class RecordTypeDescription<
    Types,
    V,
    TRecord extends Record<string, V> = Record<string, V>,
    K extends keyof Types & GetKey<TRecord, Types> = GetKey<TRecord, Types>
    >
    extends TypeDescription<K, Types, TRecord> {
    constructor(elementDescriptionKey: GetKey<V, Types>, ...mandatoryNames: string[]) {
        super(RecordTypeDescription.toSuperCtorArg(mandatoryNames, elementDescriptionKey) as any);
        this.elementDescriptionKey = elementDescriptionKey as any;
    }
    private static toSuperCtorArg<K extends keyof Types, Types>(names: string[], elementDescription: any): DescriptionKeys<K, Types> {
        const result: any = {};
        for (const name of names) {
            result[name] = elementDescription;
        }
        return result;
    }

    private readonly elementDescriptionKey: DescriptionKeys<K, Types>[string & keyof Types[K]];

    protected isValidKey(_propertyName: any): _propertyName is keyof Types[K] {
        return true; // all property names are considered valid for a record type
    }

    protected checkProperty(
        obj: any,
        propertyName: string & keyof Types[K],
        getSubdescription: DescriptionGetter,
        log: ILogger,
        propertyKey?: DescriptionKeys<K, Types>[string & keyof Types[K]]
    ): boolean {
        // fills the propertyKey with the element description key, if no other key was provided
        return super.checkProperty(obj, propertyName, getSubdescription, log, propertyKey || this.elementDescriptionKey);
    }
}