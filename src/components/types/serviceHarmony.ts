export interface Services {
  _id: string;
  img: string;
  title: string;
  description: string;
}

export interface UpdateServices {
  img: string;
  title: string;
  description: string;
}

export interface CreateServices {
  img: string;
  title: string;
  description: string;
}

export interface ResponseCreateService {
  status: string;
  message: string;
  items: Services[];
}
