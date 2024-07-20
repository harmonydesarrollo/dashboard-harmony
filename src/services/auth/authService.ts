// authService.ts
import HarmonyApi from '../config';
export interface LoginResponse {
    code: number;
    message: string;
    items: {
      _id: string;
      fullName: string;
      photo: string;
      username: string;
    }[];
  }

  export interface dtoLogin {
    username: string;
    password: string;
  }
  
  async function Auth(data: dtoLogin, token: string): Promise<any> {
    try {
      const modifiedLoginInfo = { ...data };
      // console.log({modifiedLoginInfo})
  
      // console.log(JSON.stringify(modifiedLoginInfo));
      const response = await HarmonyApi.post<any>('users/login', modifiedLoginInfo, {
        headers: { Authorization: 'Bearer ' + token },
      });
  
      // console.log('******BEGIN********')
      // console.log(response); 
      // console.log('******END********')
      return response.data;
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  }

  export const authServices = {
    Auth
  };