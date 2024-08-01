import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  // export declare function Matches(pattern: RegExp, validationOptions?: ValidationOptions): PropertyDecorator;
  @Matches(/^[a-zA-Z0-9_]*$/, {
    message: 'Username must contain letters, numbers or underscores only',
  })
  @MaxLength(16)
  username: string;
}
