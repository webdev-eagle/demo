export type BinaryArgument = {
    type: 'binary';
    value: BinaryData;
};

export type BooleanArgument = {
    type: 'boolean';
    value: boolean;
};

export type IntegerArgument = {
    type: 'integer';
    value: integer;
};

export type StringArgument = {
    type: 'string';
    value: string;
};

export type ListArgument = {
    type: 'list';
    value: Argument[];
};

export type Argument = BinaryArgument | BooleanArgument | IntegerArgument | StringArgument | ListArgument;
