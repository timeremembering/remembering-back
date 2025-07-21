export interface IJwtPayload {
    userId: string;
    sub?: any;
  }
  
  export interface ITokens {
    accessToken: string;
    refreshToken: string;
  }
  