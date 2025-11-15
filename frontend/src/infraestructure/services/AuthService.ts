import {type AuthMockRepository } from "../repositories/AuthRepository";
import { authMockRepository } from "../repositories/AuthRepository";

export class AuthService {
  private repository: AuthMockRepository;

  constructor() {
    this.repository = authMockRepository;
  }

  async login(username: string, password: string): Promise<any> {
    return this.repository.login(username, password);
  }

  async logout(): Promise<void> {
    return this.repository.logout();
  }

  async refreshToken(): Promise<any> {
    return this.repository.refreshToken();}} 