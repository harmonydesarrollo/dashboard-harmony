export interface Questions {
    _id: string;
    question: string;
    answer: string;
  }
  
  export interface UpdateQuestions {
    _id: string;
    question: string;
    answer: string;
  }
  
  export interface CreateQuestions {
    question: string;
    answer: string;
  }
  
  export interface ResponseCreateQuestion {
    status: string;
    message: string;
    items: Questions[];
  }
  