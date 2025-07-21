import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from 'src/common/constants/interface/auth.interface';

export const ExtractUserId = createParamDecorator(
  (data: keyof IJwtPayload = 'userId', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!data) return request.user;

    console.log(request.user);
    return request.user.id;
  },
);
