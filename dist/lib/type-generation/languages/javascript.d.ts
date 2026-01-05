import { LanguageMeta, Attribute, Collection } from "./language.js";
export declare class JavaScript extends LanguageMeta {
    getType(attribute: Attribute, collections?: Collection[]): string;
    isSingleFile(): boolean;
    private _getAppwriteDependency;
    getTemplate(): string;
    getFileName(_: Collection | undefined): string;
}
//# sourceMappingURL=javascript.d.ts.map