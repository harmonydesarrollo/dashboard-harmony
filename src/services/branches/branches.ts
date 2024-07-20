import { CreateBranches, Branches, UpdateBranches } from '../../components/types/branches';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createBranch(data: CreateBranches, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };

    // console.log(JSON.stringify(modifiedUserInfo));
    const response = await HarmonyApi.post<any>('branches/', modifiedUserInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    // console.log(response);
    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateBranches, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'branches/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllBranches(token: string): Promise<Branches[]> {
  try {
    const response = await HarmonyApi.get<any>('branches', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteBranch(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('branches/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const branchServices = {
  getAllBranches,
  createBranch,
  updateById,
  deleteBranch,
};
