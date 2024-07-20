export interface Appointments {
    _id: string;
    fullName: string;     // jorge montiel salguero
    telephone: string;    // 7711129510
    service: string; // 662b108dd25ce70194ea5974
    date: string;         // 1 de julio
    hour:string;          // 4:30 pm
    status: string;       // pagado - pendiente de pago - cancelado - reagendado - cerrado
    idService: string;
  }
  
  export interface UpdateAppointments {
    _id: string;
    fullName: string;     // jorge montiel salguero
    telephone: string;    // 7711129510
    idService?: string; // 662b108dd25ce70194ea5974
    date: string;         // 1 de julio
    hour:string;          // 4:30 pm
    status: string;       // pagado - pendiente de pago - cancelado - reagendado - cerrado
  }
  
  export interface CreateAppointments {
    // _id?: string;
    fullName: string;     // jorge montiel salguero
    telephone: string;    // 7711129510
    idService: string; // 662b108dd25ce70194ea5974
    date: string;         // 1 de julio
    hour:string;          // 4:30 pm
    status: string;       // pagado - pendiente de pago - cancelado - reagendado - cerrado
  }
  
  export interface ResponseCreateAppointment {
    status: string;
    message: string;
    items: Appointments[];
  }
  