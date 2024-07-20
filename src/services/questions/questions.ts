import { CreateQuestions, Questions, UpdateQuestions } from '../../components/types/questions';
import HarmonyApi from '../config';

// update
//localhost:3000/employees/66252c0a19da4ddae3ba1eb9 -- update
async function updateById(id: string, body: UpdateQuestions, bearerToken: string): Promise<any> {
  const response = await HarmonyApi.patch<any>(
    'questions/' + id,
    { ...body },
    {
      headers: { Authorization: 'Bearer ' + bearerToken },
    }
  );
  return response;
}

async function getAllQuestions(token: string): Promise<Questions[]> {
  try {
    const response = await HarmonyApi.get<any>('questions', {
      headers: { Authorization: 'Bearer ' + token },
    });
    return response && response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

async function deleteQuestion(id: string, token: string): Promise<any> {
  try {
    const response = await HarmonyApi.delete<any>('questions/' + id, {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}
export const questionServices = {
  getAllQuestions,
  updateById,
  deleteQuestion,
};
