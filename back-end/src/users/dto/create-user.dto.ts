import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({
    message: "Nome é obrigatório!"
  })
  @MaxLength(30, {
    message: "O nome deve ter no maximo 30 caracteres"
  })
  @MinLength(3, {
    message: "O nome deve ter no minimo 3 caracteres"
  })
  name: string;
  
  @IsNotEmpty({
    message: "O ID da conta é obrigatório!"
  })
  account: string;
}
