export type Perches = {
    B: 'B';
    G: 'G';
    R: 'R';
    Y: 'Y';
};

export type Beaches = {
    D: 'D';
    G: 'G';
    R: 'R';
    S: 'S';
};

export type Dockings = {
    A: 'A';
    B: 'B';
    C: 'C';
    D: 'D';
};

export type Battlegrounds = {
    A: 'A';
    B: 'B';
    C: 'C';
    D: 'D';
};

export type Mutariums = {
    A: 'A';
    B: 'B';
    C: 'C';
    D: 'D';
    G: 'G';
};

export type ItemMap = {
    perches: Perches;
    beaches: Beaches;
    dockings: Dockings;
    battlegrounds: Battlegrounds;
    mutariums: Mutariums;
};

export type ItemName<T extends keyof ItemMap> = keyof ItemMap[T] & string;
