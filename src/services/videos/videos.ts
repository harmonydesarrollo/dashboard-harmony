import { CreateVideos, Videos, UpdateVideos } from '../../components/types/videos';
import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear
async function createVideo(data: CreateVideos, token: string): Promise<any> {
  try {
    const modifiedVideoInfo = { ...data };

    
    const response = await HarmonyApi.post<any>('videos/', modifiedVideoInfo, {
      headers: { Authorization: 'Bearer ' + token },
    });

    
    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateVideos, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'videos/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllVideos(token: string): Promise<Videos[]> {
  try {
    const response = await HarmonyApi.get<any>('videos', {
      headers: { Authorization: 'Bearer ' + token },
    });
    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteVideo(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('videos/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const videoServices = {
  getAllVideos,
  createVideo,
  updateById,
  deleteVideo,
};
