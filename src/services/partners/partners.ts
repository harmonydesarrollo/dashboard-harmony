// import { CreateReviews, Reviews, UpdateReviews } from '../../components/types/reviews';
import { CreatePartners, Partners, UpdatePartners } from '../../components/types/partners';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createPartner(data: CreatePartners, token: string): Promise<any> {
  try {
    const modifiedUserInfo = { ...data };
    // Asegúrate de que photo pueda ser un objeto o undefined
    if (typeof modifiedUserInfo.img === 'object' && modifiedUserInfo.img !== null) {
      const photoObject = modifiedUserInfo.img as { fileUrl: string };
      if (photoObject.fileUrl) {
        modifiedUserInfo.img = photoObject.fileUrl;
      }
    }

    console.log(JSON.stringify(modifiedUserInfo));
    const response = await HarmonyApi.post<any>('partners/', modifiedUserInfo, {
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
async function updateById(id: string, body: UpdatePartners, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'partners/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllPartners(token: string): Promise<Partners[]> {
  try {
    const response = await HarmonyApi.get<any>('partners', {
      headers: { Authorization: 'Bearer ' + token },
    });

    console.log(response);
    // const formattedData = response.data.map((item: any) => ({
    //   user: {
    //     _id: item.user._id,
    //     firstName: item.user.firstName,
    //     lastName: item.user.lastName,
    //     middleName: item.user.middleName,
    //     gender: item.user.gender,
    //     birthday: item.user.birthday,
    //     fullName: item.user.fullName,
    //     idSpecialty: item.user.idSpecialty,
    //     idBranch: item.user.idBranch,
    //     idRol: item.user.idRol,
    //     photo: item.user.photo,
    //     specialty: item.specialtyName,
    //   },
    // }));
    // console.log(JSON.stringify(formattedData));
    // const transformedResponse = formattedData.map((item: { user: any }) => item.user);

    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deletePartner(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('partners/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const partnerServices = {
  getAllPartners,
  createPartner,
  updateById,
  deletePartner,
};
