export class CreateUserDto {
  firstName: string;

  lastName: string;

  email: string;

  password: string;

  preferences?: Record<string, any>;
}
