import { LanguageMeta, Attribute, Collection } from "./language.js";
export declare class PHP extends LanguageMeta {
    getType(attribute: Attribute, collections?: Collection[], collectionName?: string): string;
    getTemplate(): string;
    getFileName(collection: Collection): string;
}
//# sourceMappingURL=php.d.ts.map