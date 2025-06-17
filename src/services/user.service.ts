import { User } from '../models/user.model';
import { sortListByKey } from '../../src/utils/commoun';
import { SortOrder } from '../../src/models/sortOrder.model';
const usersJson = require('../data/users.json');
const usersData = usersJson as User[];

type GetUsersParams = {
    sort?: keyof User;
    order?: SortOrder,
    page?: number;
    size?: number;
}

type GetUserResponse = {
    paging : {
        previous?: string;
        next?: string;
        totalResults: number;
    };
    data: User[];
}

const getUsers = (getUsersParams?: GetUsersParams): GetUserResponse => {
    let usersData = [...usersJson] as User[];
    const totalResults = usersData.length;
    const { page, size } = getUsersParams;

    if (getUsersParams?.sort) {
        usersData = sortListByKey(usersData, getUsersParams?.sort, getUsersParams?.order || SortOrder.NONE);
    }

    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    usersData = usersData.slice(startIndex, endIndex);

    const dataResponse: GetUserResponse = {
        data: usersData,
        paging: {
            totalResults
        }
    }

    if (page > 1) {
        dataResponse.paging.previous = `${process.env.URL_BASE}/api/users?page=${page - 1}&size=${size}`
    }

    if (endIndex < totalResults) {
        dataResponse.paging.next = `${process.env.URL_BASE}/api/users?page=${page + 1}&size=${size}`
    }

    return dataResponse;
}

const getUser = (userId: number): User => {
    const user = usersData.find((user: User) => user.id === userId);
    if (!user) {
        return null;
    }
    return user;

}

module.exports = {
    getUsers,
    getUser
}