import { LanguageMeta, Attribute, Collection } from "./language.js";
export declare class TypeScript extends LanguageMeta {
    getType(attribute: Attribute, collections?: Collection[], collectionName?: string): string;
    isSingleFile(): boolean;
    private _getAppwriteDependency;
    getTemplate(): string;
    getFileName(_: Collection | undefined): string;
}
//# sourceMappingURL=typescript.d.ts.map