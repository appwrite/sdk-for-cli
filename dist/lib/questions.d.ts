interface Answers {
    override?: boolean;
    method?: string;
    start?: string;
    organization?: string;
    [key: string]: any;
}
interface Choice {
    name: string;
    value: any;
    disabled?: boolean | string;
    current?: boolean;
}
interface Question {
    type: string;
    name: string;
    message: string;
    default?: any;
    when?: ((answers: Answers) => boolean | Promise<boolean>) | boolean;
    choices?: ((answers: Answers) => Promise<Choice[]> | Choice[]) | (() => Promise<Choice[]> | Choice[]) | Choice[] | string[];
    validate?: (value: any) => boolean | string | Promise<boolean | string>;
    mask?: string;
}
export declare const questionsInitProject: Question[];
export declare const questionsInitProjectAutopull: Question[];
export declare const questionsPullResources: Question[];
export declare const questionsPullFunctions: Question[];
export declare const questionsPullFunctionsCode: Question[];
export declare const questionsPullSites: Question[];
export declare const questionsPullSitesCode: Question[];
export declare const questionsCreateFunction: Question[];
export declare const questionsCreateFunctionSelectTemplate: (templates: string[]) => Question[];
export declare const questionsCreateBucket: Question[];
export declare const questionsCreateTeam: Question[];
export declare const questionsCreateCollection: Question[];
export declare const questionsCreateTable: Question[];
export declare const questionsCreateMessagingTopic: Question[];
export declare const questionsPullCollection: Question[];
export declare const questionsLogin: Question[];
export declare const questionGetEndpoint: Question[];
export declare const questionsLogout: Question[];
export declare const questionsPushResources: Question[];
export declare const questionsInitResources: Question[];
export declare const questionsPushSites: Question[];
export declare const questionsPushFunctions: Question[];
export declare const questionsPushCollections: Question[];
export declare const questionsPushTables: Question[];
export declare const questionPushChanges: Question[];
export declare const questionPushChangesConfirmation: Question[];
export declare const questionsPushBuckets: Question[];
export declare const questionsPushMessagingTopics: Question[];
export declare const questionsGetEntrypoint: Question[];
export declare const questionsPushTeams: Question[];
export declare const questionsListFactors: Question[];
export declare const questionsMFAChallenge: Question[];
export declare const questionsRunFunctions: Question[];
export declare const questionsCreateSite: Question[];
export {};
//# sourceMappingURL=questions.d.ts.map