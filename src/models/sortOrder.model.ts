
export const SortOrder = {
    ASC: 'asc',
    DESC: 'desc',
    NONE: 'none'
}

export type SortOrder = typeof SortOrder[keyof typeof SortOrder];