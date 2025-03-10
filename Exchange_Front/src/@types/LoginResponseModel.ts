export interface User {
    id: string;
    email: string;
  }
  
  export interface LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: User;
  }