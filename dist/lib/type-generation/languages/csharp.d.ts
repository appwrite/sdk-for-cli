import { LanguageMeta, Attribute, Collection } from "./language.js";
export declare class CSharp extends LanguageMeta {
    getType(attribute: Attribute, collections?: Collection[], collectionName?: string): string;
    getTemplate(): string;
    getFileName(collection: Collection): string;
}
//# sourceMappingURL=csharp.d.ts.map