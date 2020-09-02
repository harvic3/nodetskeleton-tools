import { City } from "./Person";

export class OtherPerson {
  constructor(name: string, lastName: string, age: number) {
    this.Name = name;
    this.LastName = lastName;
    this.Age = age;
  }
  Name: string;
  LastName: string;
  Age: number;
  City: City;
  SetCity(city: City): void {
    this.City = city;
  }
  IsAnAdult(): boolean {
    return this.Age >= 10 ? true : false;
  }
}
