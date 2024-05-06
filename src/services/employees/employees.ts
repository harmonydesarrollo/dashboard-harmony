import HarmonyApi from '../config';
// import {
//   createBranchType,
//   getAllBranchesItemsType,
//   getAllBranchesType,
//   responseCreateBranchType,
//   UpdateBody,
// } from '@/app/types/branches.types';

async function getAllEmployees(idCompany: string, token: string, page: number, perPage: number): Promise<any> {
  try {
    const params = {
      page: page,
      perPage: perPage,
    };

    const response = await HarmonyApi.get<any>('employees', {
      params,
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
/*

{
  "_id": "660bf22baa062a91aef57aa6",
  "specialty": "Fisioterapia General",
  "createdAt": "2024-04-02T11:55:23.267+00:00",
  "updatedAt": "2024-04-02T11:55:23.267+00:00",
  "__v": 0,
  "firstName": "José",
  "fullName": "José Pérez León",
  "id_specialty": "123",
  "lastName": "Pérez",
  "middleName": "León",
  "photo": "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
}

*/
async function createEmployee(data: any, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.post<any>('employees/', data, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

export const employeeServices = {
  getAllEmployees,
  createEmployee,
};
