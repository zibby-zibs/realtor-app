import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(() => {
  return {
    id: 2,
    name: 'Laith',
  };
});
