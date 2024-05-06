import { CreateUsers, UpdateUsers, Users } from '../../components/types/users';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createUser(data: CreateUsers, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };
    // Asegúrate de que photo pueda ser un objeto o undefined
    if (typeof modifiedUserInfo.photo === 'object' && modifiedUserInfo.photo !== null) {
      const photoObject = modifiedUserInfo.photo as { fileUrl: string };
      if (photoObject.fileUrl) {
        modifiedUserInfo.photo = photoObject.fileUrl;
      }
    }

    console.log(JSON.stringify(modifiedUserInfo));
    const response = await HarmonyApi.post<any>('users/', modifiedUserInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    console.log(response);
    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateUsers, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'users/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllUsers(idCompany: string, token: string, page: number, perPage: number): Promise<Users[]> {
  try {
    const params = {
      page: page,
      perPage: perPage,
    };

    const response = await HarmonyApi.get<any>('users', {
      params,
      headers: { Authorization: 'Bearer ' + token },
    });

    const formattedData = response.data.map((item: any) => ({
      user: {
        _id: item.user._id,
        firstName: item.user.firstName,
        lastName: item.user.lastName,
        middleName: item.user.middleName,
        gender: item.user.gender,
        birthday: item.user.birthday,
        fullName: item.user.fullName,
        idSpecialty: item.user.idSpecialty,
        idBranch: item.user.idBranch,
        idRol: item.user.idRol,
        photo: item.user.photo,
        specialty: item.specialtyName,
      },
    }));
    // console.log(JSON.stringify(formattedData));
    const transformedResponse = formattedData.map((item: { user: any }) => item.user);

    return transformedResponse;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteUser(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('users/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const userServices = {
  getAllUsers,
  createUser,
  updateById,
  deleteUser,
};
