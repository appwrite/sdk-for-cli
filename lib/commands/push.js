const chalk = require('chalk');
const inquirer = require("inquirer");
const JSONbig = require("json-bigint")({ storeAsString: false });
const { Command } = require("commander");
const { localConfig, globalConfig } = require("../config");
const { Spinner, SPINNER_ARC, SPINNER_DOTS } = require('../spinner');
const { paginate } = require('../paginate');
const { questionsPushBuckets, questionsPushTeams, questionsPushFunctions, questionsGetEntrypoint, questionsPushCollections, questionsConfirmPushCollections, questionsPushMessagingTopics, questionsPushResources } = require("../questions");
const { cliConfig, actionRunner, success, log, error, commandDescriptions, drawTable } = require("../parser");
const { proxyListRules } = require('./proxy');
const { functionsGet, functionsCreate, functionsUpdate, functionsCreateDeployment, functionsUpdateDeployment, functionsGetDeployment, functionsListVariables, functionsDeleteVariable, functionsCreateVariable } = require('./functions');
const {
    databasesGet,
    databasesCreate,
    databasesUpdate,
    databasesCreateBooleanAttribute,
    databasesGetCollection,
    databasesCreateCollection,
    databasesCreateStringAttribute,
    databasesCreateIntegerAttribute,
    databasesCreateFloatAttribute,
    databasesCreateEmailAttribute,
    databasesCreateDatetimeAttribute,
    databasesCreateIndex,
    databasesCreateUrlAttribute,
    databasesCreateIpAttribute,
    databasesCreateEnumAttribute,
    databasesUpdateBooleanAttribute,
    databasesUpdateStringAttribute,
    databasesUpdateIntegerAttribute,
    databasesUpdateFloatAttribute,
    databasesUpdateEmailAttribute,
    databasesUpdateDatetimeAttribute,
    databasesUpdateUrlAttribute,
    databasesUpdateIpAttribute,
    databasesUpdateEnumAttribute,
    databasesUpdateRelationshipAttribute,
    databasesCreateRelationshipAttribute,
    databasesDeleteAttribute,
    databasesListAttributes,
    databasesListIndexes,
    databasesUpdateCollection
} = require("./databases");
const {
    storageGetBucket, storageUpdateBucket, storageCreateBucket
} = require("./storage");
const {
    messagingGetTopic, messagingUpdateTopic, messagingCreateTopic
} = require("./messaging");
const {
    teamsGet,
    teamsUpdateName,
    teamsCreate
} = require("./teams");
const {
    projectsUpdate,
    projectsUpdateServiceStatus,
    projectsUpdateAuthStatus,
    projectsUpdateAuthDuration,
    projectsUpdateAuthLimit,
    projectsUpdateAuthSessionsLimit,
    projectsUpdateAuthPasswordDictionary,
    projectsUpdateAuthPasswordHistory,
    projectsUpdatePersonalDataCheck,
} = require("./projects");
const { checkDeployConditions } = require('../utils');

const STEP_SIZE = 100;      // Resources
const POLL_DEBOUNCE = 2000; // Milliseconds
const POLL_MAX_DEBOUNCE = 30; // Times

let pollMaxDebounces = 30;

const changeableKeys = ['status', 'required', 'xdefault', 'elements', 'min', 'max', 'default', 'error'];

const awaitPools = {
    wipeAttributes: async (databaseId, collectionId, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        const { total } = await databasesListAttributes({
            databaseId,
            collectionId,
            queries: [JSON.stringify({ method: 'limit', values: [1] })],
            parseOutput: false
        });

        if (total === 0) {
            return true;
        }

        let steps = Math.max(1, Math.ceil(total / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Found a large number of attributes, increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.wipeAttributes(
            databaseId,
            collectionId,
            iteration + 1
        );
    },
    wipeIndexes: async (databaseId, collectionId, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        const { total } = await databasesListIndexes({
            databaseId,
            collectionId,
            queries: [JSON.stringify({ method: 'limit', values: [1] })],
            parseOutput: false
        });

        if (total === 0) {
            return true;
        }

        let steps = Math.max(1, Math.ceil(total / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Found a large number of indexes, increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.wipeIndexes(
            databaseId,
            collectionId,
            iteration + 1
        );
    },
    wipeVariables: async (functionId, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        const { total } = await functionsListVariables({
            functionId,
            queries: ['limit(1)'],
            parseOutput: false
        });

        if (total === 0) {
            return true;
        }

        let steps = Math.max(1, Math.ceil(total / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Found a large number of variables, increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.wipeVariables(
            functionId,
            iteration + 1
        );
    },
    deleteAttributes: async (databaseId, collectionId, attributeKeys, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        let steps = Math.max(1, Math.ceil(attributeKeys.length / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Found a large number of attributes to be deleted. Increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        const { attributes } = await paginate(databasesListAttributes, {
            databaseId,
            collectionId,
            parseOutput: false
        }, 100, 'attributes');

        const ready = attributeKeys.filter(attribute => attributes.includes(attribute.key));

        if (ready.length === 0) {
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.expectAttributes(
            databaseId,
            collectionId,
            attributeKeys,
            iteration + 1
        );
    },
    expectAttributes: async (databaseId, collectionId, attributeKeys, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        let steps = Math.max(1, Math.ceil(attributeKeys.length / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Creating a large number of attributes, increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        const { attributes } = await paginate(databasesListAttributes, {
            databaseId,
            collectionId,
            parseOutput: false
        }, 100, 'attributes');

        const ready = attributes
            .filter(attribute => {
                if (attributeKeys.includes(attribute.key)) {
                    if (['stuck', 'failed'].includes(attribute.status)) {
                        throw new Error(`Attribute '${attribute.key}' failed!`);
                    }

                    return attribute.status === 'available';
                }

                return false;
            })
            .map(attribute => attribute.key);

        if (ready.length === attributeKeys.length) {
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.expectAttributes(
            databaseId,
            collectionId,
            attributeKeys,
            iteration + 1
        );
    },
    expectIndexes: async (databaseId, collectionId, indexKeys, iteration = 1) => {
        if (iteration > pollMaxDebounces) {
            return false;
        }

        let steps = Math.max(1, Math.ceil(indexKeys.length / STEP_SIZE));
        if (steps > 1 && iteration === 1) {
            pollMaxDebounces *= steps;

            log('Creating a large number of indexes, increasing timeout to ' + (pollMaxDebounces * POLL_DEBOUNCE / 1000 / 60) + ' minutes')
        }

        const { indexes } = await paginate(databasesListIndexes, {
            databaseId,
            collectionId,
            parseOutput: false
        }, 100, 'indexes');

        const ready = indexes
            .filter((index) => {
                if (indexKeys.includes(index.key)) {
                    if (['stuck', 'failed'].includes(index.status)) {
                        throw new Error(`Index '${index.key}' failed!`);
                    }

                    return index.status === 'available';
                }

                return false;
            })
            .map(index => index.key);

        if (ready.length >= indexKeys.length) {
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));

        return await awaitPools.expectIndexes(
            databaseId,
            collectionId,
            indexKeys,
            iteration + 1
        );
    },
}

const createAttribute = async (databaseId, collectionId, attribute) => {
    switch (attribute.type) {
        case 'string':
            switch (attribute.format) {
                case 'email':
                    return await databasesCreateEmailAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'url':
                    return await databasesCreateUrlAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'ip':
                    return await databasesCreateIpAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'enum':
                    return await databasesCreateEnumAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        elements: attribute.elements,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                default:
                    return await databasesCreateStringAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        size: attribute.size,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })

            }
        case 'integer':
            return await databasesCreateIntegerAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                min: parseInt(attribute.min.toString()),
                max: parseInt(attribute.max.toString()),
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'double':
            return databasesCreateFloatAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                min: parseFloat(attribute.min.toString()),
                max: parseFloat(attribute.max.toString()),
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'boolean':
            return databasesCreateBooleanAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'datetime':
            return databasesCreateDatetimeAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'relationship':
            return databasesCreateRelationshipAttribute({
                databaseId,
                collectionId,
                relatedCollectionId: attribute.relatedCollection,
                type: attribute.relationType,
                twoWay: attribute.twoWay,
                key: attribute.key,
                twoWayKey: attribute.twoWayKey,
                onDelete: attribute.onDelete,
                parseOutput: false
            })
    }
}

const updateAttribute = async (databaseId, collectionId, attribute) => {
    switch (attribute.type) {
        case 'string':
            switch (attribute.format) {
                case 'email':
                    return await databasesUpdateEmailAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'url':
                    return await databasesUpdateUrlAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'ip':
                    return await databasesUpdateIpAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                case 'enum':
                    return await databasesUpdateEnumAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        elements: attribute.elements,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })
                default:
                    return await databasesUpdateStringAttribute({
                        databaseId,
                        collectionId,
                        key: attribute.key,
                        size: attribute.size,
                        required: attribute.required,
                        xdefault: attribute.default,
                        array: attribute.array,
                        parseOutput: false
                    })

            }
        case 'integer':
            return await databasesUpdateIntegerAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                min: parseInt(attribute.min.toString()),
                max: parseInt(attribute.max.toString()),
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'double':
            return databasesUpdateFloatAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                min: parseFloat(attribute.min.toString()),
                max: parseFloat(attribute.max.toString()),
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'boolean':
            return databasesUpdateBooleanAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'datetime':
            return databasesUpdateDatetimeAttribute({
                databaseId,
                collectionId,
                key: attribute.key,
                required: attribute.required,
                xdefault: attribute.default,
                array: attribute.array,
                parseOutput: false
            })
        case 'relationship':
            return databasesUpdateRelationshipAttribute({
                databaseId,
                collectionId,
                relatedCollectionId: attribute.relatedCollection,
                type: attribute.relationType,
                twoWay: attribute.twoWay,
                key: attribute.key,
                twoWayKey: attribute.twoWayKey,
                onDelete: attribute.onDelete,
                parseOutput: false
            })
    }
}
const deleteAttribute = async (collection, attribute) => {
    log(`Deleting attribute ${attribute.key} of ${collection.name} ( ${collection['$id']} )`);

    await databasesDeleteAttribute({
        databaseId: collection['databaseId'],
        collectionId: collection['$id'],
        key: attribute.key,
        parseOutput: false
    });
}


/**
 * Check if attribute non-changeable fields has been changed
 * If so return the differences as an object.
 * @param remote
 * @param local
 * @param collection
 * @param recraeting when true will check only non-changeable keys
 * @returns {undefined|{reason: string, action: *, attribute, key: string}}
 */
const checkAttributeChanges = (remote, local, collection, recraeting = true) => {
    if (local === undefined) {
        return undefined;
    }

    const keyName = `${chalk.yellow(local.key)} in ${collection.name} (${collection['$id']})`;
    const action = chalk.cyan(recraeting ? 'recreating' : 'changing');
    let reason = '';
    let attribute = remote;

    for (let key of Object.keys(remote)) {
        if (changeableKeys.includes(key)) {
            if (!recraeting) {
                if (remote[key] !== local[key]) {
                    const bol = reason === '' ? '' : '\n';
                    reason += `${bol}${key} changed from ${chalk.red(remote[key])} to ${chalk.green(local[key])}`;
                    attribute = local;
                }
            }
            continue;
        }

        if (!recraeting) {
            continue;
        }

        if (remote[key] !== local[key]) {
            const bol = reason === '' ? '' : '\n';
            reason += `${bol}${key} changed from ${chalk.red(remote[key])} to ${chalk.green(local[key])}`;
        }
    }

    return reason === '' ? undefined : { key: keyName, attribute, reason, action };
}

/**
 * Check if attributes contain the given attribute
 * @param attribute
 * @param attributes
 * @returns {*}
 */
const attributesContains = (attribute, attributes) => attributes.find((attr) => attr.key === attribute.key);
const generateChangesObject = (attribute, collection, isAdding) => {
    return {
        key: `${chalk.yellow(attribute.key)} in ${collection.name} (${collection['$id']})`,
        attribute: attribute,
        reason: isAdding ? 'Field doesn\'t exist on the remote server' : 'Field doesn\'t exist in appwrite.json file',
        action: isAdding ? chalk.green('adding') : chalk.red('deleting')
    };

};

/**
 * Filter deleted and recreated attributes,
 * return list of attributes to create
 * @param remoteAttributes
 * @param localAttributes
 * @param collection
 * @returns {Promise<*|*[]>}
 */
const attributesToCreate = async (remoteAttributes, localAttributes, collection) => {

    const deleting = remoteAttributes.filter((attribute) => !attributesContains(attribute, localAttributes)).map((attr) => generateChangesObject(attr, collection, false));
    const adding = localAttributes.filter((attribute) => !attributesContains(attribute, remoteAttributes)).map((attr) => generateChangesObject(attr, collection, true));
    const conflicts = remoteAttributes.map((attribute) => checkAttributeChanges(attribute, attributesContains(attribute, localAttributes), collection)).filter(attribute => attribute !== undefined);
    const changes = remoteAttributes.map((attribute) => checkAttributeChanges(attribute, attributesContains(attribute, localAttributes), collection, false))
        .filter(attribute => attribute !== undefined)
        .filter(attribute => conflicts.filter(attr => attribute.key === attr.key).length !== 1);

    let changedAttributes = [];
    const changing = [...deleting, ...adding, ...conflicts, ...changes]
    if (changing.length === 0) {
        return changedAttributes;
    }

    log(!cliConfig.force ? 'There are pending changes in your collection deployment' : 'List of applied changes');

    drawTable(changing.map((change) => {
        return { Key: change.key, Action: change.action, Reason: change.reason, };
    }));

    if (!cliConfig.force) {
        if (deleting.length > 0) {
            log(`Attribute deletion will cause ${chalk.red('loss of data')}`);
        }
        if (conflicts.length > 0) {
            log(`Attribute recreation will cause ${chalk.red('loss of data')}`);
        }

        const answers = await inquirer.prompt(questionsPushCollections[1]);

        if (answers.changes.toLowerCase() !== 'yes') {
            return changedAttributes;
        }
    }

    if (conflicts.length > 0) {
        changedAttributes = conflicts.map((change) => change.attribute);
        await Promise.all(changedAttributes.map((changed) => deleteAttribute(collection, changed)));
        remoteAttributes = remoteAttributes.filter((attribute) => !attributesContains(attribute, changedAttributes))
    }

    if (changes.length > 0) {
        changedAttributes = changes.map((change) => change.attribute);
        await Promise.all(changedAttributes.map((changed) => updateAttribute(collection['databaseId'],collection['$id'], changed)));
    }

    const deletingAttributes = deleting.map((change) => change.attribute);
    await Promise.all(deletingAttributes.map((attribute) => deleteAttribute(collection, attribute)));
    const attributeKeys = [...remoteAttributes.map(attribute => attribute.key), ...deletingAttributes.map(attribute => attribute.key)]

    if (attributeKeys.length) {
        const deleteAttributesPoolStatus = await awaitPools.deleteAttributes(collection['databaseId'], collection['$id'], attributeKeys);

        if (!deleteAttributesPoolStatus) {
            throw new Error("Attribute deletion timed out.");
        }
    }

    return localAttributes.filter((attribute) => !attributesContains(attribute, remoteAttributes));
}
const createIndexes = async (indexes, collection) => {
    log(`Creating indexes ...`)

    for (let index of indexes) {
        await databasesCreateIndex({
            databaseId: collection['databaseId'],
            collectionId: collection['$id'],
            key: index.key,
            type: index.type,
            attributes: index.attributes,
            orders: index.orders,
            parseOutput: false
        });
    }

    const result = await awaitPools.expectIndexes(
        collection['databaseId'],
        collection['$id'],
        indexes.map(index => index.key)
    );

    if (!result) {
        throw new Error("Index creation timed out.");
    }

    success(`Created ${indexes.length} indexes`);
}
const createAttributes = async (attributes, collection) => {
    for (let attribute of attributes) {
        if (attribute.side !== 'child') {
            await createAttribute(collection['databaseId'], collection['$id'], attribute);
        }
    }

    const result = await awaitPools.expectAttributes(
        collection['databaseId'],
        collection['$id'],
        collection.attributes.map(attribute => attribute.key)
    );

    if (!result) {
        throw new Error(`Attribute creation timed out.`);
    }

    success(`Created ${attributes.length} attributes`);
}

const pushResources = async () => {
    const actions = {
        project: pushProject,
        functions: pushFunction,
        collections: pushCollection,
        buckets: pushBucket,
        teams: pushTeam,
        messages: pushMessagingTopic
    }

    if (cliConfig.all) {
        for (let action of Object.values(actions)) {
            await action({ returnOnZero: true });
        }
    } else {
        const answers = await inquirer.prompt(questionsPushResources[0]);

        const action = actions[answers.resource];
        if (action !== undefined) {
            await action({ returnOnZero: true });
        }
    }
};

const pushProject = async () => {
    try {
        const projectId = localConfig.getProject().projectId;
        const projectName = localConfig.getProject().projectName;
        const settings = localConfig.getProject().projectSettings ?? {};

        log(`Updating project ${projectId}`);

        if (projectName) {
            await projectsUpdate({
                projectId,
                name: projectName,
                parseOutput: false
            });
        }

        if (settings.services) {
            log('Updating service statuses');
            for (let [service, status] of Object.entries(settings.services)) {
                await projectsUpdateServiceStatus({
                    projectId,
                    service,
                    status,
                    parseOutput: false
                });
            }
        }

        if (settings.auth) {
            if (settings.auth.security) {
                log('Updating auth security settings');
                await projectsUpdateAuthDuration({ projectId, duration: settings.auth.security.duration, parseOutput: false });
                await projectsUpdateAuthLimit({ projectId, limit: settings.auth.security.limit, parseOutput: false });
                await projectsUpdateAuthSessionsLimit({ projectId, limit: settings.auth.security.sessionsLimit, parseOutput: false });
                await projectsUpdateAuthPasswordDictionary({ projectId, enabled: settings.auth.security.passwordDictionary, parseOutput: false });
                await projectsUpdateAuthPasswordHistory({ projectId, limit: settings.auth.security.passwordHistory, parseOutput: false });
                await projectsUpdatePersonalDataCheck({ projectId, enabled: settings.auth.security.personalDataCheck, parseOutput: false });
            }

            if (settings.auth.methods) {
                log('Updating auth login methods');

                for (let [method, status] of Object.entries(settings.auth.methods)) {
                    await projectsUpdateAuthStatus({
                        projectId,
                        method,
                        status,
                        parseOutput: false
                    });
                }
            }
        }

        success("Project configuration updated.");
    } catch (e) {
        throw e;
    }
}

const pushFunction = async ({ functionId, async, returnOnZero } = { returnOnZero: false }) => {
    let response = {};

    const functionIds = [];

    if (functionId) {
        functionIds.push(functionId);
    } else if (cliConfig.all) {
        checkDeployConditions(localConfig);
        const functions = localConfig.getFunctions();
        if (functions.length === 0) {
            if (returnOnZero) {
                log('No functions found, skipping');
                return;
            }
            throw new Error("No functions found in the current directory. Use 'appwrite pull functions' to synchronize existing one, or use 'appwrite init function' to create a new one.");
        }
        functionIds.push(...functions.map((func) => {
            return func.$id;
        }));
    }

    if (functionIds.length <= 0) {
        const answers = await inquirer.prompt(questionsPushFunctions[0]);
        functionIds.push(...answers.functions);
    }

    let functions = functionIds.map((id) => {
        const functions = localConfig.getFunctions();
        const func = functions.find((f) => f.$id === id);

        if (!func) {
            throw new Error("Function '" + id + "' not found.")
        }

        return func;
    });

    log('Validating functions');
    // Validation is done BEFORE pushing so the deployment process can be run in async with progress update
    for (let func of functions) {

        if (!func.entrypoint) {
            log(`Function ${func.name} does not have an endpoint`);
            const answers = await inquirer.prompt(questionsGetEntrypoint)
            func.entrypoint = answers.entrypoint;
            localConfig.updateFunction(func['$id'], func);
        }

        if (func.variables) {
            func.pushVariables = cliConfig.force;

            try {
                const { total } = await functionsListVariables({
                    functionId: func['$id'],
                    queries: [JSON.stringify({ method: 'limit', values: [1] })],
                    parseOutput: false
                });

                if (total === 0) {
                    func.pushVariables = true;
                } else if (total > 0 && !func.pushVariables) {
                    log(`The function ${func.name} has remote variables setup`);
                    const variableAnswers = await inquirer.prompt(questionsPushFunctions[1])
                    func.pushVariables = variableAnswers.override.toLowerCase() === "yes";
                }
            } catch (e) {
                if (e.code != 404) {
                    throw e.message;
                }
            }
        }
    }


    log('All functions are validated');
    log('Pushing functions\n');

    Spinner.start(false);
    let successfullyPushed = 0;
    let successfullyDeployed = 0;
    const failedDeployments = [];

    await Promise.all(functions.map(async (func) => {
        const ignore = func.ignore ? 'appwrite.json' : '.gitignore';
        let functionExists = false;
        let deploymentCreated = false;

        const updaterRow = new Spinner({ status: '', resource: func.name, id: func['$id'], end: `Ignoring using: ${ignore}` });

        updaterRow.update({ status: 'Getting' }).startSpinner(SPINNER_DOTS);

        try {
            response = await functionsGet({
                functionId: func['$id'],
                parseOutput: false,
            });
            functionExists = true;
            if (response.runtime !== func.runtime) {
                updaterRow.fail({ errorMessage: `Runtime mismatch! (local=${func.runtime},remote=${response.runtime}) Please delete remote function or update your appwrite.json` })
                return;
            }

            updaterRow.update({ status: 'Updating' }).replaceSpinner(SPINNER_ARC);

            response = await functionsUpdate({
                functionId: func['$id'],
                name: func.name,
                execute: func.execute,
                events: func.events,
                schedule: func.schedule,
                timeout: func.timeout,
                enabled: func.enabled,
                logging: func.logging,
                entrypoint: func.entrypoint,
                commands: func.commands,
                providerRepositoryId: func.providerRepositoryId ?? "",
                installationId: func.installationId ?? '',
                providerBranch: func.providerBranch ?? '',
                providerRootDirectory: func.providerRootDirectory ?? '',
                providerSilentMode: func.providerSilentMode ?? false,
                vars: JSON.stringify(response.vars),
                parseOutput: false
            });
        } catch (e) {

            if (Number(e.code) === 404) {
                functionExists = false;
            } else {
                updaterRow.fail({ errorMessage: e.message ?? 'General error occurs please try again' });
                return;
            }
        }

        if (!functionExists) {
            updaterRow.update({ status: 'Creating' }).replaceSpinner(SPINNER_DOTS);

            try {
                response = await functionsCreate({
                    functionId: func.$id || 'unique()',
                    name: func.name,
                    runtime: func.runtime,
                    execute: func.execute,
                    events: func.events,
                    schedule: func.schedule,
                    timeout: func.timeout,
                    enabled: func.enabled,
                    logging: func.logging,
                    entrypoint: func.entrypoint,
                    commands: func.commands,
                    vars: JSON.stringify(func.vars),
                    parseOutput: false
                });

                localConfig.updateFunction(func['$id'], {
                    "$id": response['$id'],
                });
                func["$id"] = response['$id'];
                updaterRow.update({ status: 'Created' });
            } catch (e) {
                updaterRow.fail({ errorMessage: e.message ?? 'General error occurs please try again' });
                return;
            }
        }

        if (func.variables) {
            if (!func.pushVariables) {
                updaterRow.update({ end: 'Skipping variables' });
            } else {
                updaterRow.update({ end: 'Pushing variables' });

                const { variables } = await paginate(functionsListVariables, {
                    functionId: func['$id'],
                    parseOutput: false
                }, 100, 'variables');

                await Promise.all(variables.map(async variable => {
                    await functionsDeleteVariable({
                        functionId: func['$id'],
                        variableId: variable['$id'],
                        parseOutput: false
                    });
                }));

                let result = await awaitPools.wipeVariables(func['$id']);
                if (!result) {
                    updaterRow.fail({ errorMessage: 'Variable deletion timed out' })
                    return;
                }

                // Push local variables
                await Promise.all(Object.keys(func.variables).map(async localVariableKey => {
                    await functionsCreateVariable({
                        functionId: func['$id'],
                        key: localVariableKey,
                        value: func.variables[localVariableKey],
                        parseOutput: false
                    });
                }));
            }
        }

        try {
            updaterRow.update({ status: 'Pushing' }).replaceSpinner(SPINNER_ARC);
            response = await functionsCreateDeployment({
                functionId: func['$id'],
                entrypoint: func.entrypoint,
                commands: func.commands,
                code: func.path,
                activate: true,
                parseOutput: false
            })

            updaterRow.update({ status: 'Pushed' });
            deploymentCreated = true;
            successfullyPushed++;
        } catch (e) {
            switch (e.code) {
                case 'ENOENT':
                    updaterRow.fail({ errorMessage: 'Not found in the current directory. Skipping...' })
                    break;
                default:
                    updaterRow.fail({ errorMessage: e.message ?? 'An unknown error occurred. Please try again.' })
            }
        }

        if (deploymentCreated && !async) {
            try {
                const deploymentId = response['$id'];
                updaterRow.update({ status: 'Deploying', end: 'Checking deployment status...' })
                let pollChecks = 0;

                while (true) {
                    if (pollChecks >= POLL_MAX_DEBOUNCE) {
                        updaterRow.update({ end: 'Deployment is taking too long. Please check the console for more details.' })
                        break;
                    }

                    response = await functionsGetDeployment({
                        functionId: func['$id'],
                        deploymentId: deploymentId,
                        parseOutput: false
                    });


                    const status = response['status'];
                    if (status === 'ready') {
                        successfullyDeployed++;

                        let url = '';
                        const res = await proxyListRules({
                            parseOutput: false,
                            queries: [
                                JSON.stringify({ method: 'limit', values: [1] }),
                                JSON.stringify({ method: 'equal', "attribute": "resourceType", "values": ["function"] }),
                                JSON.stringify({ method: 'equal', "attribute": "resourceId", "values": [func['$id']] })
                            ],
                        });

                        if (Number(res.total) === 1) {
                            url = res.rules[0].domain;
                        }

                        updaterRow.update({ status: 'Deployed', end: url });

                        break;
                    } else if (status === 'failed') {
                        failedDeployments.push({ name: func['name'], $id: func['$id'], deployment: response['$id'] });
                        updaterRow.fail({ errorMessage: `Failed to deploy` });

                        break;
                    } else {
                        updaterRow.update({ status: 'Deploying', end: `Current status: ${status}` })
                    }

                    pollChecks++;
                    await new Promise(resolve => setTimeout(resolve, POLL_DEBOUNCE));
                }
            } catch (e) {
                updaterRow.fail({ errorMessage: e.message ?? 'Unknown error occurred. Please try again' })
            }
        }

        updaterRow.stopSpinner();
    }));

    Spinner.stop();
    console.log('\n');

    failedDeployments.forEach((failed) => {
        const { name, deployment, $id } = failed;
        const failUrl = `${globalConfig.getEndpoint().replace('/v1', '')}/console/project-${localConfig.getProject().projectId}/functions/function-${$id}/deployment-${deployment}`;

        error(`Deployment of ${name} has failed. Check at ${failUrl} for more details\n`);
    })

    let message = chalk.green(`Pushed and deployed ${successfullyPushed} functions`);

    if (!async) {
        if (successfullyDeployed < successfullyPushed) {
            message = `${chalk.green(`Pushed and deployed ${successfullyPushed} functions.`)} ${chalk.red(`${successfullyPushed - successfullyDeployed}  failed to deploy`)}`;
        } else {
            if (successfullyPushed === 0) {
                message = chalk.red(`Error pushing ${functions.length} functions`)
            }
        }
    }
    log(message);
}

const pushCollection = async ({ returnOnZero } = { returnOnZero: false }) => {
    const collections = [];

    if (cliConfig.all) {
        checkDeployConditions(localConfig);
        if (localConfig.getCollections().length === 0) {
            if (returnOnZero) {
                log('No collections found, skipping');
                return;
            }

            throw new Error("No collections found in the current directory. Use 'appwrite pull collections' to synchronize existing one, or use 'appwrite init collection' to create a new one.");
        }
        collections.push(...localConfig.getCollections());
    } else {
        const answers = await inquirer.prompt(questionsPushCollections[0])
        const configCollections = new Map();
        localConfig.getCollections().forEach((c) => {
            configCollections.set(`${c['databaseId']}|${c['$id']}`, c);
        });
        answers.collections.forEach((a) => {
            const collection = configCollections.get(a);
            collections.push(collection);
        })
    }
    const databases = Array.from(new Set(collections.map(collection => collection['databaseId'])));
    log('Checking for databases and collection changes');

    // Parallel db actions
    await Promise.all(databases.map(async (databaseId) => {
        const localDatabase = localConfig.getDatabase(databaseId);

        try {
            const database = await databasesGet({
                databaseId: databaseId,
                parseOutput: false,
            });

            if (database.name !== (localDatabase.name ?? databaseId)) {
                await databasesUpdate({
                    databaseId: databaseId,
                    name: localDatabase.name ?? databaseId,
                    parseOutput: false
                })

                success(`Updated ${localDatabase.name} ( ${databaseId} ) name`);
            }
        } catch (err) {
            log(`Database ${databaseId} not found. Creating it now...`);

            await databasesCreate({
                databaseId: databaseId,
                name: localDatabase.name ?? databaseId,
                parseOutput: false,
            });
        }
    }));

    // Parallel collection actions
    await Promise.all(collections.map(async (collection) => {
        try {
            const remoteCollection = await databasesGetCollection({
                databaseId: collection['databaseId'],
                collectionId: collection['$id'],
                parseOutput: false,
            });

            if (remoteCollection.name !== collection.name) {
                await databasesUpdateCollection({
                    databaseId: collection['databaseId'],
                    collectionId: collection['$id'],
                    name: collection.name,
                    name: collection.name,
                    parseOutput: false
                })

                success(`Updated ${collection.name} ( ${collection['$id']} ) name`);
            }
            collection.remoteVersion = remoteCollection;

            collection.isExisted = true;
        } catch
            (e) {
            if (Number(e.code) === 404) {
                log(`Collection ${collection.name} does not exist in the project. Creating ... `);
                await databasesCreateCollection({
                    databaseId: collection['databaseId'],
                    collectionId: collection['$id'],
                    name: collection.name,
                    documentSecurity: collection.documentSecurity,
                    permissions: collection['$permissions'],
                    parseOutput: false
                })
            } else {
                throw e;
            }
        }
    }))

    // Serialize attribute actions
    for (let collection of collections) {
        let attributes = collection.attributes;

        if (collection.isExisted) {
            attributes = await attributesToCreate(collection.remoteVersion.attributes, collection.attributes, collection);

            if (Array.isArray(attributes) && attributes.length <= 0) {
                continue;
            }
        }

        log(`Pushing collection ${collection.name} ( ${collection['databaseId']} - ${collection['$id']} ) attributes`)

        try {
            await createAttributes(attributes, collection)
        } catch (e) {
            throw e;
        }

        try {
            await createIndexes(collection.indexes, collection);
        } catch (e) {
            throw e;
        }

        success(`Pushed ${collection.name} ( ${collection['$id']} )`);
    }
}

const pushBucket = async ({ returnOnZero } = { returnOnZero: false }) => {
    let response = {};

    let bucketIds = [];
    const configBuckets = localConfig.getBuckets();

    if (cliConfig.all) {
        checkDeployConditions(localConfig);
        if (configBuckets.length === 0) {
            if (returnOnZero) {
                log('No buckets found, skipping');
                return;
            }
            throw new Error("No buckets found in the current directory. Use 'appwrite pull buckets' to synchronize existing one, or use 'appwrite init bucket' to create a new one.");
        }
        bucketIds.push(...configBuckets.map((b) => b.$id));
    }

    if (bucketIds.length === 0) {
        const answers = await inquirer.prompt(questionsPushBuckets[0])
        bucketIds.push(...answers.buckets);
    }

    let buckets = [];

    for (const bucketId of bucketIds) {
        const idBuckets = configBuckets.filter((b) => b.$id === bucketId);
        buckets.push(...idBuckets);
    }

    for (let bucket of buckets) {
        log(`Pushing bucket ${bucket.name} ( ${bucket['$id']} )`)

        try {
            response = await storageGetBucket({
                bucketId: bucket['$id'],
                parseOutput: false,
            })

            log(`Updating bucket ...`)

            await storageUpdateBucket({
                bucketId: bucket['$id'],
                name: bucket.name,
                permissions: bucket['$permissions'],
                fileSecurity: bucket.fileSecurity,
                enabled: bucket.enabled,
                maximumFileSize: bucket.maximumFileSize,
                allowedFileExtensions: bucket.allowedFileExtensions,
                encryption: bucket.encryption,
                antivirus: bucket.antivirus,
                compression: bucket.compression,
                parseOutput: false
            });

            success(`Pushed ${bucket.name} ( ${bucket['$id']} )`);
        } catch (e) {
            if (Number(e.code) === 404) {
                log(`Bucket ${bucket.name} does not exist in the project. Creating ... `);

                response = await storageCreateBucket({
                    bucketId: bucket['$id'],
                    name: bucket.name,
                    permissions: bucket['$permissions'],
                    fileSecurity: bucket.fileSecurity,
                    enabled: bucket.enabled,
                    maximumFileSize: bucket.maximumFileSize,
                    allowedFileExtensions: bucket.allowedFileExtensions,
                    compression: bucket.compression,
                    encryption: bucket.encryption,
                    antivirus: bucket.antivirus,
                    parseOutput: false
                })

                success(`Pushed ${bucket.name} ( ${bucket['$id']} )`);
            } else {
                throw e;
            }
        }
    }
}

const pushTeam = async ({ returnOnZero } = { returnOnZero: false }) => {
    let response = {};

    let teamIds = [];
    const configTeams = localConfig.getTeams();

    if (cliConfig.all) {
        checkDeployConditions(localConfig);
        if (configTeams.length === 0) {
            if (returnOnZero) {
                log('No teams found, skipping');
                return;
            }
            throw new Error("No teams found in the current directory. Use 'appwrite pull teams' to synchronize existing one, or use 'appwrite init team' to create a new one.");
        }
        teamIds.push(...configTeams.map((t) => t.$id));
    }

    if (teamIds.length === 0) {
        const answers = await inquirer.prompt(questionsPushTeams[0])
        teamIds.push(...answers.teams);
    }

    let teams = [];

    for (const teamId of teamIds) {
        const idTeams = configTeams.filter((t) => t.$id === teamId);
        teams.push(...idTeams);
    }

    for (let team of teams) {
        log(`Pushing team ${team.name} ( ${team['$id']} )`)

        try {
            response = await teamsGet({
                teamId: team['$id'],
                parseOutput: false,
            })

            log(`Updating team ...`)

            await teamsUpdateName({
                teamId: team['$id'],
                name: team.name,
                parseOutput: false
            });

            success(`Pushed ${team.name} ( ${team['$id']} )`);
        } catch (e) {
            if (Number(e.code) === 404) {
                log(`Team ${team.name} does not exist in the project. Creating ... `);

                response = await teamsCreate({
                    teamId: team['$id'],
                    name: team.name,
                    parseOutput: false
                })

                success(`Pushed ${team.name} ( ${team['$id']} )`);
            } else {
                throw e;
            }
        }
    }
}

const pushMessagingTopic = async ({ returnOnZero } = { returnOnZero: false }) => {
    let response = {};

    let topicsIds = [];
    const configTopics = localConfig.getMessagingTopics();
    let overrideExisting = cliConfig.force;

    if (cliConfig.all) {
        checkDeployConditions(localConfig);
        if (configTopics.length === 0) {
            if (returnOnZero) {
                log('No topics found, skipping');
                return;
            }
            throw new Error("No topics found in the current directory. Use 'appwrite pull topics' to synchronize existing one, or use 'appwrite init topic' to create a new one.");
        }
        topicsIds.push(...configTopics.map((b) => b.$id));
    }

    if (topicsIds.length === 0) {
        const answers = await inquirer.prompt(questionsPushMessagingTopics[0])
        topicsIds.push(...answers.topics);
    }

    let topics = [];

    for (const topicId of topicsIds) {
        const idTopic = configTopics.filter((b) => b.$id === topicId);
        topics.push(...idTopic);
    }

    if (!cliConfig.force) {
        const answers = await inquirer.prompt(questionsPushMessagingTopics[1])
        if (answers.override.toLowerCase() === "yes") {
            overrideExisting = true;
        }
    }

    for (let topic of topics) {
        log(`Pushing topic ${topic.name} ( ${topic['$id']} )`)

        try {
            response = await messagingGetTopic({
                topicId: topic['$id'],
                parseOutput: false
            })
            log(`Topic ${topic.name} ( ${topic['$id']} ) already exists.`);

            if (!overrideExisting) {
                log(`Skipping ${topic.name} ( ${topic['$id']} )`);
                continue;
            }

            log(`Updating Topic ...`)

            await messagingUpdateTopic({
                topicId: topic['$id'],
                name: topic.name,
                subscribe: topic.subscribe,
                parseOutput: false
            });

            success(`Pushed ${topic.name} ( ${topic['$id']} )`);
        } catch (e) {
            if (Number(e.code) === 404) {
                log(`Topic ${topic.name} does not exist in the project. Creating ... `);

                response = await messagingCreateTopic({
                    topicId: topic['$id'],
                    name: topic.name,
                    subscribe: topic.subscribe,
                    parseOutput: false
                })

                success(`Created ${topic.name} ( ${topic['$id']} )`);
            } else {
                throw e;
            }
        }
    }
}

const push = new Command("push")
    .description(commandDescriptions['push'])
    .action(actionRunner(pushResources));

push
    .command("all")
    .description("Push all resource.")
    .action(actionRunner(() => {
        cliConfig.all = true;
        return pushResources();
    }));

push
    .command("project")
    .description("Push project name, services and auth settings")
    .action(actionRunner(pushProject));

push
    .command("function")
    .alias("functions")
    .description("Push functions in the current directory.")
    .option(`-f, --functionId <functionId>`, `Function ID`)
    .option(`-A, --async`, `Don't wait for functions deployments status`)
    .action(actionRunner(pushFunction));

push
    .command("collection")
    .alias("collections")
    .description("Push collections in the current project.")
    .action(actionRunner(pushCollection));

push
    .command("bucket")
    .alias("buckets")
    .description("Push buckets in the current project.")
    .action(actionRunner(pushBucket));

push
    .command("team")
    .alias("teams")
    .description("Push teams in the current project.")
    .action(actionRunner(pushTeam));

push
    .command("topic")
    .alias("topics")
    .description("Push messaging topics in the current project.")
    .action(actionRunner(pushMessagingTopic));

module.exports = {
    push
}
