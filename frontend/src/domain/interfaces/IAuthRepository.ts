export interface IAuthRepository {
  login(username: string, password: string): Promise<any>;
  logout(): Promise<void>;
  refreshToken(): Promise<any>;
  getUserInfo(): Promise<any>;
  getRole(): Promise<string>;
}