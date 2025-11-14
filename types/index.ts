// types/index.ts
export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isOwn?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}
