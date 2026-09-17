import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRuntimeConfig } from '../config.js';
import type { UserRepository } from '../repositories/interfaces.js';
import type { User, UserPublic, AuthToken } from '../types/index.js';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthToken> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.userRepo.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash,
    });

    return this.generateToken(user);
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    return this.generateToken(user);
  }

  async getUserById(id: string): Promise<UserPublic | null> {
    const user = await this.userRepo.findById(id);
    return user ? this.toPublic(user) : null;
  }

  private generateToken(user: User): AuthToken {
    const config = getRuntimeConfig();
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      config.jwtSecret as jwt.Secret,
      { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] },
    );
    return { token, user: this.toPublic(user) };
  }

  private toPublic(user: User): UserPublic {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
