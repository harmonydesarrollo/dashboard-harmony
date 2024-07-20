export interface Users {
  _id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthday: string;
  fullName: string;
  idSpecialty: string;
  idBranch: string;
  idRol: string;
  photo: string;
  specialty: string;
  username: string;
  password: string;
}
export interface dtoLogin {
username:string;
password: string;
}

export interface CreateUsers {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  idSpecialty: string;
  photo: string;
  specialty: string;
  idBranch: string;
  idRol: string;
  username: string;
  password?: string;
}

export interface UpdateUsers {
  _id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender?: string;
  birthday?: string;
  fullName: string;
  idSpecialty: string;
  idBranch?: string;
  idRol?: string;
  photo: string;
  username: string;
  password?: string;
}

export interface UsersLogin {
  _id: string;
  fullName: string;
  photo: string;
  username: string;
}
export interface ResponseCreateUser {
  code: string;
  message: string;
  items: UsersLogin[];
}
