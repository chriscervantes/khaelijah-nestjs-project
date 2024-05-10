import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'apps/auth/src/users/model/user.schema';

const getCurrentUserByContext = (context: ExecutionContext): UserDocument => {
  const user = context.switchToHttp().getRequest().user;
  console.log('current user', user);
  return user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
