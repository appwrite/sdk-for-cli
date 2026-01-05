export interface Attribute {
    key: string;
    type: string;
    required?: boolean;
    array?: boolean;
    default?: any;
    format?: string;
    elements?: string[];
    relatedCollection?: string;
    relationType?: string;
    side?: string;
}
export interface Collection {
    $id: string;
    name: string;
    attributes: Attribute[];
}
export declare abstract class LanguageMeta {
    constructor();
    static toKebabCase(string: string): string;
    static toSnakeCase(string: string): string;
    static toUpperSnakeCase(string: string): string;
    static toCamelCase(string: string): string;
    static toPascalCase(string: string): string;
    /**
     * Get the type literal of the given attribute.
     */
    abstract getType(attribute: Attribute, collections?: Collection[], collectionName?: string): string;
    /**
     * Returns true if the language uses a single file for all types.
     */
    isSingleFile(): boolean;
    /**
     * Get the EJS template used to generate the types for this language.
     */
    abstract getTemplate(): string;
    /**
     * Get the file extension used by files of this language.
     */
    abstract getFileName(collection?: Collection): string;
}
export declare function detectLanguage(): string;
//# sourceMappingURL=language.d.ts.map