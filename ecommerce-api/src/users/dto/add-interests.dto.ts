import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';

export class AddInterestsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  interests: string[];
}
