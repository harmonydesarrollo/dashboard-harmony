// import { CreateReviews, Reviews, UpdateReviews } from '../../components/types/reviews';
import { CreateTreatments, Treatments, UpdateTreatments } from '../../components/types/treatments';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createTreatments(data: CreateTreatments, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };
    // Asegúrate de que photo pueda ser un objeto o undefined
    if (typeof modifiedUserInfo.img === 'object' && modifiedUserInfo.img !== null) {
      const photoObject = modifiedUserInfo.img as { fileUrl: string };
      if (photoObject.fileUrl) {
        modifiedUserInfo.img = photoObject.fileUrl;
      }
    }

    
    const response = await HarmonyApi.post<any>('treatments/', modifiedUserInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    
    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateTreatments, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'treatments/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllTreatments(token: string): Promise<Treatments[]> {
  try {
    const response = await HarmonyApi.get<any>('treatments', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteTreatments(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('treatments/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const treatmentsServices = {
  getAllTreatments,
  createTreatments,
  updateById,
  deleteTreatments,
};
