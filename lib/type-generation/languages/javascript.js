/** @typedef {import('../attribute').Attribute} Attribute */
const fs = require("fs");
const path = require("path");

const { AttributeType } = require('../attribute');
const { LanguageMeta } = require("./language");

class JavaScript extends LanguageMeta {
  getType(attribute) {
    let type = ""
    switch (attribute.type) {
      case AttributeType.STRING:
      case AttributeType.EMAIL:
      case AttributeType.DATETIME:
      case AttributeType.IP:
      case AttributeType.URL:
        type = "string";
        if (attribute.format === AttributeType.ENUM) {
          type = `"${attribute.elements.join('"|"')}"`;
        }
        break;
      case AttributeType.INTEGER:
        type = "number";
        break;
      case AttributeType.FLOAT:
        type = "number";
        break;
      case AttributeType.BOOLEAN:
        type = "boolean";
        break;
      case AttributeType.RELATIONSHIP:
        type = LanguageMeta.toPascalCase(attribute.relatedCollection);
        if ((attribute.relationType === 'oneToMany' && attribute.side === 'parent') || (attribute.relationType === 'manyToOne' && attribute.side === 'child') || attribute.relationType === 'manyToMany') {
          type = `Array<${type}>`;
        }
        break;
      default:
        throw new Error(`Unknown attribute type: ${attribute.type}`);
    }
    if (attribute.array) {
      type += "[]";
    }
    if (!attribute.required) {
      type += "|null|undefined";
    }
    return type;
  }

  isSingleFile() {
    return true;
  }

  _getAppwriteDependency() {
    if (fs.existsSync(path.resolve(process.cwd(), 'package.json'))) {
      const packageJsonRaw = fs.readFileSync(path.resolve(process.cwd(), 'package.json'));
      const packageJson = JSON.parse(packageJsonRaw.toString('utf-8'));
      return packageJson.dependencies['node-appwrite'] ? 'node-appwrite' : 'appwrite';
    }

    return "appwrite";
  }

  getTemplate() {
    return `/**
 * @typedef {import('${this._getAppwriteDependency()}').Models.Document} Document
 */

<% for (const collection of collections) { %>
/**
 * @typedef {Object} <%- toPascalCase(collection.name) %>
<% for (const attribute of collection.attributes) { -%>
 * @property {<%- getType(attribute) %>} <%- toCamelCase(attribute.key) %>
<% } -%>
 */

<% } %>`;
  }

  getFileName(_) {
    return "appwrite-types.js";
  }
}

module.exports = { JavaScript }; 