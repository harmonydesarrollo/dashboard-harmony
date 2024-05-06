import { Specialties } from '../../components/types/specialties';
import HarmonyApi from '../config';

async function getAllSpecialties(token: string): Promise<Specialties[]> {
  try {
    const response = await HarmonyApi.get<any>('specialties', {
      headers: { Authorization: 'Bearer ' + token },
    });

    return response.data;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

export const specialtiesServices = {
  getAllSpecialties,
};
