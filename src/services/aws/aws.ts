import HarmonyApi from '../config';

//https://develop.d2z36kd8bp7vmy.amplifyapp.com/employees - crear

async function insertImgInS3(file: File, token: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await HarmonyApi.post<string>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    throw error;
  }
}
async function updateFileInS3(fileUrl: string, file: File, token: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await HarmonyApi.post<string>(`/files/update/${encodeURIComponent(fileUrl)}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el archivo:', error);
    throw error;
  }
}

export const awsServices = {
  insertImgInS3,
  updateFileInS3,
};
