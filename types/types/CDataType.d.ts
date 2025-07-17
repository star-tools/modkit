export declare class CDataType {
    name: string;
    static isValue: boolean;
    constructor(name: string);

    /**
     * Validate the given value.
     * Default implementation always returns true.
     */
    static validate(val: any, json?: any): boolean;

    /**
     * Parse a string value into the internal format.
     */
    static parse(str: string, json?: any): any;
}

export declare class CEnum extends CDataType {
    static enum: string[];

    constructor();

    /**
     * Validate that value is in the enum list.
     */
    static validate(val: string): boolean;
}

export declare class CList extends CDataType {
    static separator: RegExp;
    static subType: typeof CDataType;

    /**
     * Validate a list of values.
     */
    static validate(val: string): boolean;
}

export declare class EUnknown extends CEnum {
    /**
     * Always returns true but logs unknown enum value.
     */
    static validate(val: string): boolean;
}

export declare class CUnknown extends CDataType {
    // No additional members
}
