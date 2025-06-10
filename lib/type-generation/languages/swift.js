/** @typedef {import('../attribute').Attribute} Attribute */
const { AttributeType } = require('../attribute');
const { LanguageMeta } = require("./language");

class Swift extends LanguageMeta {
  getType(attribute) {
    let type = "";
    switch (attribute.type) {
      case AttributeType.STRING:
      case AttributeType.EMAIL:
      case AttributeType.DATETIME:
        type = "String";
        if (attribute.format === AttributeType.ENUM) {
          type = LanguageMeta.toPascalCase(attribute.key);
        }
        break;
      case AttributeType.INTEGER:
        type = "Int";
        break;
      case AttributeType.FLOAT:
        type = "Double";
        break;
      case AttributeType.BOOLEAN:
        type = "Bool";
        break;
      case AttributeType.RELATIONSHIP:
        type = LanguageMeta.toPascalCase(attribute.relatedCollection);
        if ((attribute.relationType === 'oneToMany' && attribute.side === 'parent') || (attribute.relationType === 'manyToOne' && attribute.side === 'child') || attribute.relationType === 'manyToMany') {
          type = `[${type}]`;
        }
        break;
      default:
        throw new Error(`Unknown attribute type: ${attribute.type}`);
    }
    if (attribute.array) {
      type = "[" + type + "]";
    }
    if (!attribute.required) {
      type += "?";
    }
    return type;
  }

  getTemplate() {
    return `import Foundation

<% for (const attribute of collection.attributes) { -%>
<% if (attribute.format === 'enum') { -%>
public enum <%- toPascalCase(attribute.key) %>: String, Codable, CaseIterable {
<% for (const [index, element] of Object.entries(attribute.elements)) { -%>
  case <%- element %> = "<%- element %>"
<% } -%>
}

<% } -%>
<% } -%>
public class <%- toPascalCase(collection.name) %>: Codable {
<% for (const attribute of collection.attributes) { -%>
    public let <%- toCamelCase(attribute.key) %>: <%- getType(attribute) %>
<% } %>
    enum CodingKeys: String, CodingKey {
<% for (const attribute of collection.attributes) { -%>
        case <%- toCamelCase(attribute.key) %> = "<%- attribute.key %>"
<% } -%>
    }

    init(
<% for (const attribute of collection.attributes) { -%>
        <%- toCamelCase(attribute.key) %>: <%- getType(attribute) %><% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } -%>
    ) {
<% for (const attribute of collection.attributes) { -%>
        self.<%- toCamelCase(attribute.key) %> = <%- toCamelCase(attribute.key) %>
<% } -%>
    }

    public required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)

<% for (const attribute of collection.attributes) { -%>
<% if (attribute.required) { -%>
        self.<%- toCamelCase(attribute.key) %> = try container.decode(<%- getType(attribute).replace('?', '') %>.self, forKey: .<%- toCamelCase(attribute.key) %>)
<% } else { -%>
        self.<%- toCamelCase(attribute.key) %> = try container.decodeIfPresent(<%- getType(attribute).replace('?', '') %>.self, forKey: .<%- toCamelCase(attribute.key) %>)
<% } -%>
<% } -%>
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)

<% for (const attribute of collection.attributes) { -%>
<% if (attribute.required) { -%>
        try container.encode(<%- toCamelCase(attribute.key) %>, forKey: .<%- toCamelCase(attribute.key) %>)
<% } else { -%>
        try container.encodeIfPresent(<%- toCamelCase(attribute.key) %>, forKey: .<%- toCamelCase(attribute.key) %>)
<% } -%>
<% } -%>
    }

    public func toMap() -> [String: Any] {
        return [
<% for (const attribute of collection.attributes) { -%>
<% if (attribute.type === 'relationship') { -%>
            "<%- attribute.key %>": <%- toCamelCase(attribute.key) %> as Any<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.array && attribute.type !== 'string' && attribute.type !== 'integer' && attribute.type !== 'float' && attribute.type !== 'boolean') { -%>
            "<%- attribute.key %>": <%- toCamelCase(attribute.key) %>?.map { $0.toMap() } as Any<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else { -%>
            "<%- attribute.key %>": <%- toCamelCase(attribute.key) %> as Any<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } -%>
<% } -%>
        ]
    }

    public static func from(map: [String: Any]) -> <%- toPascalCase(collection.name) %> {
        return <%- toPascalCase(collection.name) %>(
<% for (const attribute of collection.attributes) { -%>
<% if (attribute.type === 'relationship') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> <%- toPascalCase(attribute.relatedCollection) %><% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.array) { -%>
<% if (attribute.type === 'string') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> [String]<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'integer') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> [Int]<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'float') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> [Double]<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'boolean') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> [Bool]<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else { -%>
            <%- toCamelCase(attribute.key) %>: (map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> [[String: Any]])<% if (!attribute.required) { %>?<% } %>.map { <%- toPascalCase(attribute.type) %>.from(map: $0) }<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } -%>
<% } else { -%>
<% if (attribute.type === 'string' || attribute.type === 'email' || attribute.type === 'datetime' || attribute.type === 'enum') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> String<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'integer') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> Int<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'float') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> Double<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else if (attribute.type === 'boolean') { -%>
            <%- toCamelCase(attribute.key) %>: map["<%- attribute.key %>"] as<% if (!attribute.required) { %>?<% } else { %>!<% } %> Bool<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } else { -%>
            <%- toCamelCase(attribute.key) %>: <%- toPascalCase(attribute.type) %>.from(map: map["<%- attribute.key %>"] as! [String: Any])<% if (attribute !== collection.attributes[collection.attributes.length - 1]) { %>,<% } %>
<% } -%>
<% } -%>
<% } -%>
        )
    }
}`;
  }

  getFileName(collection) {
    return LanguageMeta.toPascalCase(collection.name) + ".swift";
  }
}

module.exports = { Swift };
