export interface HeaderTable {
    id: string;
    title: string;
    active: boolean;
    icon?: JSX.Element;
    sortBy?: (a: any, b: any) => number;
}