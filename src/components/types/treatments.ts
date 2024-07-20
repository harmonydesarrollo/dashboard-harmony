export interface Treatments {
  _id: string;
  img: string;
  title: string;
  description: string;
  idBranch: string;
}

export interface UpdateTreatments {
  _id: string;
  img: string;
  title: string;
  description: string;
  idBranch: string;
}

export interface CreateTreatments {
  img: string;
  title: string;
  description: string;
  idBranch: string;
}
