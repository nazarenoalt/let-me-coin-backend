import { BadRequestException } from '@nestjs/common';

export function cleanObject(object) {
  const cleanObject = Object.entries(object)
    .filter(([_, value]) => value !== undefined)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  if (Object.keys(cleanObject).length === 0) {
    throw new BadRequestException('There are no valid values to update');
  }

  return cleanObject;
}
