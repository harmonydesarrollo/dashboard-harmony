export interface Reviews {
  _id: string;
  img: string;
  title: string;
  description: string;
}

export interface UpdateReviews {
  _id: string;
  img: string;
  title: string;
  description: string;
}

export interface CreateReviews {
  img: string;
  title: string;
  description: string;
}

export interface ResponseCreateUser {
  status: string;
  message: string;
  items: Reviews[];
}
