export class Person {
  constructor(name: string, lastName: string, age: number) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  name: string;
  lastName: string;
  age: number;
  city: City;
  SetCity(city: City): void {
    this.city = city;
  }
  IsAnAdult(): boolean {
    return this.age >= 10 ? true : false;
  }
}

export class City {
  constructor(name: string, country: string) {
    this.name = name;
    this.country = country;
  }
  name: string;
  country: string;
}
