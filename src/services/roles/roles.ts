import { CreateRoles, Roles, UpdateRoles } from '../../components/types/roles';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createRol(data: CreateRoles, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };

    
    const response = await HarmonyApi.post<any>('roles/', modifiedUserInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateRoles, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'roles/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllRoles(token: string): Promise<Roles[]> {
  try {
    const response = await HarmonyApi.get<any>('roles', {
      headers: { Authorization: 'Bearer ' + token },
    });

    
    
    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteRol(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('roles/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const rolServices = {
  getAllRoles,
  createRol,
  updateById,
  deleteRol,
};
