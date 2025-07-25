import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateSectionDto {
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
    message: "O userId do criador da section é obrigatório!"
  })
  userId: number;
  
  @IsNotEmpty({
    message: "A accountId do criador da section é obrigatório!"
  })
  accountId: string;

  @IsNotEmpty({
    message: "A privateKey do criador da section é obrigatório!"
  })
  privateKey: string;
}
