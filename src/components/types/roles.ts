export interface Roles {
    _id: string;
    type: string;
    // idPermission: string;
  }
  
  export interface UpdateRoles {
    _id: string;
    type: string;
    // idPermission: string;
  }
  
  export interface CreateRoles {
    type: string;
  // idPermission: string;
}
  
  export interface ResponseCreateRol {
    status: string;
    message: string;
    items: Roles[];
  }
  