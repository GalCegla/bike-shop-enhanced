import { Injectable } from '@nestjs/common';
import isEmpty from 'lodash/isEmpty';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userArray = await this.userService.users({
      where: { email },
      take: 1,
    });
    if (isEmpty(userArray)) {
      return null;
    }
    const user = userArray[0];
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
  }
}
