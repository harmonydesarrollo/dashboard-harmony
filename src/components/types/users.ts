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
}
export interface CreateUsers {
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  idSpecialty: string;
  photo: string;
  specialty: string;
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
}
export interface ResponseCreateUser {
  status: string;
  message: string;
  items: Users[];
}
