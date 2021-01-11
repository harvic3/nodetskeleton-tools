export class Person {
  constructor(name: string, lastName: string, age: number, active: boolean) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.isActive = active;
  }
  name: string;
  lastName: string;
  age: number;
  country: Country;
  isActive: boolean;

  SetCountry(country: Country): void {
    this.country = country;
  }
  IsAnAdult(): boolean {
    return this.age >= 10 ? true : false;
  }
}

export class City {
  constructor(name: string, weather: string) {
    this.name = name;
    this.weather = weather;
  }
  name: string;
  weather: string;
}

export class Country {
  constructor(name: string, city: City) {
    this.name = name;
    this.city = city;
  }
  name: string;
  city: City;
}
