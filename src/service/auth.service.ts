import { Injectable, Inject } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MongoRepository } from 'typeorm';
import { Users } from './../entity/user.entity';
import { LoginReq } from '../dto/request/user.req';
import { ApiException } from './../infrastructure/exception/api.exception';
import { LoginUserInfoVO } from './../dto/response/user.vo';

@Injectable()
export class AuthService {
  constructor(
    private readonly JwtService: JwtService,

    @Inject('UserRepository')
    private readonly userRepository: MongoRepository<Users>,
  ) {}

  async login(data: LoginReq) {
    const { name, password } = data;
    const entity = await this.userRepository.findOne({
      username: name,
      password: password,
    });

    if (!entity) {
      throw new ApiException('用户名或密码错误!');
    }

    const id = entity._id;
    const payload = { id, name };
    const token = this.signToken(payload);

    const result: LoginUserInfoVO = {
      userId: id.toString(),
      name,
      token,
    };

    return result;
  }

  signToken(data: JwtModule) {
    return this.JwtService.sign(data);
  }
}
