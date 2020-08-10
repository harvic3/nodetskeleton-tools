export declare class Resources {
    private defaultLanguage;
    private language;
    private locals;
    resourceKeys: {
        [key: string]: string;
    };
    constructor(locals: {
        [key: string]: {
            [key: string]: string;
        };
    }, localKeys: {
        [key: string]: string;
    }, defaultLanguage: string);
    Init(language: string): void;
    Get(resourceName: string): string;
    GetWithParams(resourceName: string, params: {
        [key: string]: string;
    }): string;
}
