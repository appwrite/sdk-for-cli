export declare const AttributeType: {
    readonly STRING: "string";
    readonly INTEGER: "integer";
    readonly FLOAT: "double";
    readonly BOOLEAN: "boolean";
    readonly DATETIME: "datetime";
    readonly EMAIL: "email";
    readonly IP: "ip";
    readonly URL: "url";
    readonly ENUM: "enum";
    readonly RELATIONSHIP: "relationship";
    readonly POINT: "point";
    readonly LINESTRING: "linestring";
    readonly POLYGON: "polygon";
};
export type AttributeTypeValue = (typeof AttributeType)[keyof typeof AttributeType];
//# sourceMappingURL=attribute.d.ts.map