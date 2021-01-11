import { Country } from "./Person";

export class PersonDto {
  name: string = null;
  lastName: string = null;
  age: number = null;
  isActive = false;
  country: Country = null;
}
