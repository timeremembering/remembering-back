import { PartialType } from '@nestjs/swagger';

import { CreateTreeTypeDto } from './create-tree-type.dto';

export class UpdateTreeTypeDto extends PartialType(CreateTreeTypeDto) {}
