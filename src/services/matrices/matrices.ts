// import { CreateReviews, Reviews, UpdateReviews } from '../../components/types/reviews';
import { CreateMatrices, Matrices, UpdateMatrices } from '../../components/types/matrices';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createMatrices(data: CreateMatrices, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };
    // Asegúrate de que photo pueda ser un objeto o undefined
    if (typeof modifiedUserInfo.img === 'object' && modifiedUserInfo.img !== null) {
      const photoObject = modifiedUserInfo.img as { fileUrl: string };
      if (photoObject.fileUrl) {
        modifiedUserInfo.img = photoObject.fileUrl;
      }
    }

    
    const response = await HarmonyApi.post<any>('matrices/', modifiedUserInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    
    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateMatrices, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'matrices/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllMatrices(token: string): Promise<Matrices[]> {
  try {
    const response = await HarmonyApi.get<any>('matrices', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteMatrices(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('matrices/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const matricesServices = {
  getAllMatrices,
  createMatrices,
  updateById,
  deleteMatrices,
};
