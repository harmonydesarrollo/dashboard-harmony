export interface Services {
  _id: string;
  img: string;
  title: string;
  description: string;
  idBranch: string;
}

export interface UpdateServices {
  _id: string;
  img: string;
  title: string;
  description: string;
  idBranch: string;
}

export interface CreateServices {
  img: string;
  title: string;
  description: string;
  idBranch: string;
}

export interface ResponseCreateService {
  status: string;
  message: string;
  items: Services[];
}
