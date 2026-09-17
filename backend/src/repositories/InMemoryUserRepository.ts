import { v4 as uuidv4 } from 'uuid';
import type { User, UserRepository } from './interfaces.js';

// In-memory user repository. When Azure SQL is connected, this maps to a
// Users table with password_hash, email (unique), etc.
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }
}
