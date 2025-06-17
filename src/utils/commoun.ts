import { SortOrder } from "../models/sortOrder.model";

export const sortListByKey = (list: any[], key: any, order? : SortOrder ): any[] => {
       
    return [...list].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if(typeof aValue === 'string' && typeof bValue === 'string') {
            if(order === SortOrder.ASC || order === SortOrder.NONE) {
                return aValue.localeCompare(bValue);
            }
           return bValue.localeCompare(aValue);
        }

        else if (typeof aValue === 'number' && typeof bValue === 'number') {
            if(order === SortOrder.ASC || order === SortOrder.NONE) {
                return aValue - bValue;
            }
            return bValue - aValue;
        }
      });
}