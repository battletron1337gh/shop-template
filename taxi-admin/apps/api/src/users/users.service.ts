import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto & { passwordHash: string }) {
    const { password, ...userData } = createUserDto as any;
    
    return this.prisma.user.create({
      data: userData,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Gebruiker niet gevonden');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: true,
        vehicles: {
          where: { isActive: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Gebruiker niet gevonden');
    }

    const { passwordHash, ...profile } = user;
    return profile;
  }

  async completeOnboarding(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
    });
  }
}
