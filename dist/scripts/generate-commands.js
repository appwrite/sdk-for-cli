import * as fs from "fs";
import * as path from "path";
import * as https from "https";
// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function camelToKebab(str) {
    return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function getParamName(name) {
    return camelToKebab(name);
}
function getParamVarName(name) {
    // Convert kebab-case or snake_case to camelCase
    let varName = name.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
    // Handle reserved keywords
    const reservedKeywords = [
        "default",
        "const",
        "let",
        "var",
        "function",
        "class",
        "interface",
        "type",
        "enum",
        "export",
        "import",
        "return",
        "if",
        "else",
        "for",
        "while",
        "do",
        "switch",
        "case",
        "break",
        "continue",
        "throw",
        "try",
        "catch",
        "finally",
        "new",
        "this",
        "super",
        "extends",
        "implements",
        "static",
        "private",
        "public",
        "protected",
        "readonly",
        "async",
        "await",
    ];
    if (reservedKeywords.includes(varName)) {
        return `x${capitalizeFirst(varName)}`;
    }
    return varName;
}
// Unused but kept for future extension
// function getTypeScriptType(param: SpecParameter): string {
//   if (param.type === "array") {
//     return "string[]";
//   }
//   if (param.type === "boolean") {
//     return "boolean";
//   }
//   if (param.type === "integer" || param.type === "number") {
//     return "number";
//   }
//   if (param.type === "object") {
//     return "string"; // JSON string
//   }
//   return "string";
// }
function needsParser(param) {
    if (param.type === "boolean") {
        return "parseBool";
    }
    if (param.type === "integer" || param.type === "number") {
        return "parseInteger";
    }
    if (param.type === "object") {
        return "JSON.parse";
    }
    return null;
}
function getEnumTypesFromParams(params) {
    const enumTypes = new Set();
    for (const param of params) {
        // Use x-enum-name from the spec to determine enum type
        if (param["x-enum-name"]) {
            enumTypes.add(param["x-enum-name"]);
        }
    }
    return enumTypes;
}
function generateCommand(commandName, endpoint, serviceName, clientGetterName = `get${capitalizeFirst(serviceName)}Client`) {
    const methodName = endpoint["x-appwrite"].method;
    const deprecated = endpoint.deprecated;
    const deprecationNote = deprecated
        ? `[**DEPRECATED** - This command is deprecated. Please use '${serviceName} ${methodName}' instead] `
        : "";
    let code = `\n${serviceName}\n`;
    code += `  .command(\`${commandName}\`)\n`;
    code += `  .description(\n`;
    code += `    \`${deprecationNote}${endpoint.description.replace(/`/g, "\\`")}\`,\n`;
    code += `  )\n`;
    // Get all parameters (both query and body)
    const allParams = [];
    if (endpoint.parameters) {
        for (const param of endpoint.parameters) {
            if (param.in === "body" && param.schema?.properties) {
                // Extract body parameters
                const required = param.schema.required || [];
                for (const [propName, propDef] of Object.entries(param.schema.properties)) {
                    allParams.push({
                        name: propName,
                        description: propDef.description || "",
                        required: required.includes(propName),
                        type: propDef.type || "string",
                        in: "body",
                        default: propDef.default,
                        "x-enum-name": propDef["x-enum-name"],
                        "x-enum-keys": propDef["x-enum-keys"],
                    });
                }
            }
            else {
                // Query or path parameters
                allParams.push(param);
            }
        }
    }
    // Filter parameters based on method definition if x-appwrite.methods exists
    let filteredParams = allParams;
    const xAppwriteMethods = endpoint["x-appwrite"].methods;
    if (xAppwriteMethods && Array.isArray(xAppwriteMethods)) {
        const methodDef = xAppwriteMethods.find((m) => m.name === methodName);
        if (methodDef) {
            const allowedParams = new Set(methodDef.parameters);
            const requiredParams = new Set(methodDef.required || []);
            filteredParams = allParams.filter((param) => allowedParams.has(param.name));
            // Update required status based on method definition
            filteredParams = filteredParams.map((param) => ({
                ...param,
                required: requiredParams.has(param.name),
            }));
        }
    }
    // Generate options
    for (const param of filteredParams) {
        const paramName = getParamName(param.name);
        const isArray = param.type === "array" || param.collectionFormat === "multi";
        const isBool = param.type === "boolean";
        let paramFlag;
        if (isArray) {
            paramFlag = `[${paramName}...]`;
        }
        else if (isBool && !param.required) {
            paramFlag = `[value]`;
        }
        else {
            paramFlag = `<${paramName}>`;
        }
        const optionMethod = param.required ? "requiredOption" : "option";
        code += `  .${optionMethod}(\n`;
        code += `    \`--${paramName} ${paramFlag}\`,\n`;
        code += `    \`${param.description.replace(/`/g, "\\`")}\`,\n`;
        // Add parser if needed
        const parser = needsParser(param);
        if (parser === "parseBool" && !param.required) {
            // Special handling for optional boolean flags
            code += `    (value: string | undefined) =>\n`;
            code += `      value === undefined ? true : parseBool(value),\n`;
        }
        else if (parser && parser !== "JSON.parse") {
            code += `    ${parser},\n`;
        }
        code += `  )\n`;
    }
    // Generate action
    const paramVars = filteredParams.map((p) => getParamVarName(p.name));
    const paramVarsStr = paramVars.length > 0 ? `{ ${paramVars.join(", ")} }` : "";
    code += `  .action(\n`;
    code += `    actionRunner(\n`;
    if (paramVars.length === 0) {
        code += `      async () => await (await ${clientGetterName}()).${methodName}(),\n`;
    }
    else {
        code += `      async (${paramVarsStr}) =>\n`;
        // Build arguments list
        const args = [];
        for (const param of filteredParams) {
            const varName = getParamVarName(param.name);
            if (needsParser(param) === "JSON.parse") {
                args.push(`JSON.parse(${varName})`);
            }
            else if (param["x-enum-name"]) {
                args.push(`${varName} as ${param["x-enum-name"]}`);
            }
            else {
                args.push(varName);
            }
        }
        const argsStr = args.join(", ");
        if (args.length <= 3) {
            code += `        await (\n`;
            code += `          await ${clientGetterName}()\n`;
            code += `        ).${methodName}(${argsStr}),\n`;
        }
        else {
            code += `        await (\n`;
            code += `          await ${clientGetterName}()\n`;
            code += `        ).${methodName}(\n`;
            for (let i = 0; i < args.length; i++) {
                code += `          ${args[i]}${i < args.length - 1 ? "," : ""}\n`;
            }
            code += `        ),\n`;
        }
    }
    code += `    ),\n`;
    code += `  );\n`;
    return code;
}
function generateCommandFile(serviceName, endpoints, serviceClassName, methodToServiceClassMap) {
    // Map method names to their actual service class names
    const actualServiceClassMap = methodToServiceClassMap || {};
    // Collect all enum types needed
    const enumTypes = new Set();
    const serviceClassesNeeded = new Set([serviceClassName]);
    for (const endpoint of Object.values(endpoints)) {
        const methodName = endpoint["x-appwrite"].method;
        const actualServiceClass = actualServiceClassMap[methodName] || serviceClassName;
        serviceClassesNeeded.add(actualServiceClass);
        const params = [];
        if (endpoint.parameters) {
            for (const param of endpoint.parameters) {
                if (param.in === "body" && param.schema?.properties) {
                    const required = param.schema.required || [];
                    for (const [propName, propDef] of Object.entries(param.schema.properties)) {
                        params.push({
                            name: propName,
                            description: propDef.description || "",
                            required: required.includes(propName),
                            type: propDef.type || "string",
                            in: "body",
                            "x-enum-name": propDef["x-enum-name"],
                            "x-enum-keys": propDef["x-enum-keys"],
                        });
                    }
                }
                else {
                    params.push(param);
                }
            }
        }
        getEnumTypesFromParams(params).forEach((type) => enumTypes.add(type));
    }
    // Generate imports
    let code = `import { Command } from "commander";\n`;
    code += `import { sdkForProject } from "../../sdks.js";\n`;
    code += `import { actionRunner, commandDescriptions, parseBool, parseInteger } from "../../parser.js";\n`;
    const imports = [];
    serviceClassesNeeded.forEach((className) => imports.push(className));
    enumTypes.forEach((type) => imports.push(type));
    code += `import {\n`;
    for (const imp of imports) {
        code += `  ${imp},\n`;
    }
    code += `} from "@appwrite.io/console";\n\n`;
    // Generate client singletons for all needed service classes
    const clientGetters = {};
    for (const className of serviceClassesNeeded) {
        const clientVarName = className === serviceClassName
            ? `${serviceName}Client`
            : `${className.charAt(0).toLowerCase() + className.slice(1)}Client`;
        const getterName = `get${className}Client`;
        clientGetters[className] = getterName;
        code += `let ${clientVarName}: ${className} | null = null;\n\n`;
        code += `const ${getterName} = async (): Promise<${className}> => {\n`;
        code += `  if (!${clientVarName}) {\n`;
        code += `    const sdkClient = await sdkForProject();\n`;
        code += `    ${clientVarName} = new ${className}(sdkClient);\n`;
        code += `  }\n`;
        code += `  return ${clientVarName};\n`;
        code += `};\n\n`;
    }
    // Generate main command
    code += `export const ${serviceName} = new Command("${serviceName}")\n`;
    code += `  .description(commandDescriptions["${serviceName}"] ?? "")\n`;
    code += `  .configureHelp({\n`;
    code += `    helpWidth: process.stdout.columns || 80,\n`;
    code += `  });\n`;
    // Generate all commands
    for (const [path, endpoint] of Object.entries(endpoints)) {
        const commandName = camelToKebab(endpoint["x-appwrite"].method);
        const methodName = endpoint["x-appwrite"].method;
        const actualServiceClass = actualServiceClassMap[methodName] || serviceClassName;
        const clientGetterName = clientGetters[actualServiceClass];
        code += generateCommand(commandName, endpoint, serviceName, clientGetterName);
    }
    return code;
}
async function downloadSpec(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                resolve(data);
            });
        })
            .on("error", (err) => {
            reject(err);
        });
    });
}
async function main() {
    const branch = "1.8.x";
    const version = "1.8.x";
    const platform = "console";
    const specUrl = `https://raw.githubusercontent.com/appwrite/appwrite/${branch}/app/config/specs/swagger2-${version}-${platform}.json`;
    console.log("Downloading spec from:", specUrl);
    const specContent = await downloadSpec(specUrl);
    const spec = JSON.parse(specContent);
    console.log("Parsing spec...");
    // Group endpoints by service based on path prefix
    const services = {};
    const serviceClassNames = {
        account: "Account",
        users: "Users",
        teams: "Teams",
        databases: "Databases",
        storage: "Storage",
        functions: "Functions",
        messaging: "Messaging",
        locale: "Locale",
        health: "Health",
        projects: "Projects",
        proxy: "Proxy",
        vcs: "Vcs",
        migrations: "Migrations",
        console: "Console",
        graphql: "Graphql",
        organizations: "Organizations",
        sites: "Sites",
        tokens: "Tokens",
        tablesdb: "TablesDB",
        avatars: "Avatars",
    };
    for (const [pathStr, methods] of Object.entries(spec.paths)) {
        // Determine service name from path prefix
        const pathParts = pathStr.split("/").filter((p) => p);
        const serviceName = pathParts[0];
        for (const [method, endpoint] of Object.entries(methods)) {
            if (endpoint && endpoint["x-appwrite"]) {
                if (!services[serviceName]) {
                    services[serviceName] = {};
                }
                const key = `${method}:${pathStr}`;
                services[serviceName][key] = endpoint;
            }
        }
    }
    // Generate command files
    const outputDir = path.join(process.cwd(), "lib", "commands", "services");
    // Create services directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log("Generating command files...");
    // Map methods to their actual service classes (for methods that belong to different services)
    const methodToServiceClassMaps = {
        console: {
            chat: "Assistant",
        },
    };
    for (const [serviceName, endpoints] of Object.entries(services)) {
        const serviceClassName = serviceClassNames[serviceName] || capitalizeFirst(serviceName);
        const methodToServiceClassMap = methodToServiceClassMaps[serviceName];
        const content = generateCommandFile(serviceName, endpoints, serviceClassName, methodToServiceClassMap);
        const outputPath = path.join(outputDir, `${serviceName}.ts`);
        fs.writeFileSync(outputPath, content);
        console.log(`Generated: ${outputPath}`);
    }
    console.log("\nDone! Generated", Object.keys(services).length, "command files.");
}
main().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
//# sourceMappingURL=generate-commands.js.map