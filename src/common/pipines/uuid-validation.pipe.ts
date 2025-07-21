import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe implements PipeTransform<string> {
  async transform(value: string) {
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(value)) {
      throw new BadRequestException('Invalid UUID parameter');
    }

    return value;
  }
}
