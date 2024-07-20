export interface Videos {
    _id: string;
    title: string;
    description: string;
    urlVideo: string;
  }
  
  export interface UpdateVideos {
    _id: string;
    title: string;
    description: string;
    urlVideo: string;
  }
  
  export interface CreateVideos {
    title: string;
    description: string;
    urlVideo: string;
  }
  
  export interface ResponseCreateVideo {
    status: string;
    message: string;
    items: Videos[];
  }
  