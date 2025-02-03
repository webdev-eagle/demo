export enum WarsStage {
    Loading,
    Error,
    Lobby,
    Matchmaking,
    Sign,
    Starting,
    Battle,
    Result,
}

export enum WarsResponseMessage {
    AlreadyTaken = 'AlreadyTaken',
    AnotherRented = 'AnotherRented',
    DuckNotFound = 'DuckNotFound',
    DuckFoundButNotUpdated = 'DuckFoundButNotUpdated',
    DuckFoundAndUpdated = 'DuckFoundAndUpdated',
    UndefinedIssue = 'UndefinedIssue',
}

export enum WarsSignError {
    Timeout,
    NotSigned,
}
