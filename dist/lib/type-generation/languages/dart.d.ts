import { LanguageMeta, Attribute, Collection } from "./language.js";
export declare class Dart extends LanguageMeta {
    getPackageName(): string;
    getType(attribute: Attribute, collections?: Collection[], collectionName?: string): string;
    getTemplate(): string;
    getFileName(collection: Collection): string;
}
//# sourceMappingURL=dart.d.ts.map