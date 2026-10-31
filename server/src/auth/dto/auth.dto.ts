import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

const PASSWORD_RULE = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,128}$/;
const PASSWORD_MESSAGE =
  'Пароль: от 8 символов, хотя бы одна буква и одна цифра';

export class RegisterDTO {
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @Matches(PASSWORD_RULE, { message: PASSWORD_MESSAGE })
  readonly password: string;

  @IsString()
  @Length(2, 64, { message: 'Имя: от 2 до 64 символов' })
  readonly displayName: string;
}

export class LoginDTO {
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @IsString()
  @Length(1, 128)
  readonly password: string;
}

export class CodeDTO {
  // 6 цифр из приложения или резервный код
  @IsString()
  @Length(6, 16)
  readonly code: string;
}

export class TokenDTO {
  @IsString()
  @Length(10, 200)
  readonly token: string;
}

export class EmailDTO {
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;
}

export class ResetPasswordDTO {
  @IsString()
  @Length(10, 200)
  readonly token: string;

  @Matches(PASSWORD_RULE, { message: PASSWORD_MESSAGE })
  readonly password: string;
}

export class ChangePasswordDTO {
  @IsString()
  @Length(1, 128)
  readonly currentPassword: string;

  @Matches(PASSWORD_RULE, { message: PASSWORD_MESSAGE })
  readonly newPassword: string;
}

export class DisableTotpDTO {
  @IsString()
  @Length(1, 128)
  readonly password: string;

  @IsString()
  @Length(6, 16)
  readonly code: string;
}

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  @Length(2, 64, { message: 'Имя: от 2 до 64 символов' })
  readonly displayName?: string;
}

export class LogoutDTO {
  @IsOptional()
  @IsBoolean()
  readonly everywhere?: boolean;
}
