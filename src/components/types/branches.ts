
  export interface Branches {
    _id: string;
    name: string;
    number: string;
    city: string;
    municipality: string;
    state: string;
    phone: string;
  }
  
  export interface UpdateBranches {
    _id: string;
    name: string;
    number: string;
    city: string;
    municipality: string;
    state: string;
    phone: string;
  }
  
  export interface CreateBranches {
    name: string;
    number: string;
    city: string;
    municipality: string;
    state: string;
    phone: string;
  }
  
  export interface ResponseCreateBranch {
    status: string;
    message: string;
    items: Branches[];
  }
  