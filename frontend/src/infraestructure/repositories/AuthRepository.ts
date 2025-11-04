import {type IAuthRepository } from '@/domain/repositories/IAuthRepository';
export class AuthMockRepository implements IAuthRepository {
  async login(username: string, password: string): Promise<any> {
    return { token: 'mock-token', user: { id: 1, name: 'John Doe' } };
  }

  async logout(): Promise<void> {
    return;
  }

  async refreshToken(): Promise<any> {
    return { token: 'mock-token', user: { id: 1, name: 'John Doe' } };
  }

  async getUserInfo(): Promise<any> {
    return { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  }

  async getRole(): Promise<string> {
    return 'admin';
  }
}
export const authMockRepository = new AuthMockRepository();