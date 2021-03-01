import { City, Country, Person } from "./Person";

export class PersonFromService {
  constructor(name: string, lastName: string, age: number, active: boolean) {
    this.Name = name;
    this.LastName = lastName;
    this.Age = age;
    this.IsActive = active;
  }
  Name: string;
  LastName: string;
  Age: number;
  Country: CountryFromService;
  IsActive: boolean;

  setCountry(country: CountryFromService): void {
    this.Country = country;
  }
  ssAnAdult(): boolean {
    return this.Age >= 10 ? true : false;
  }

  static mapToPersonDomain(person: PersonFromService): Person {
    const newPerson = new Person(
      person.Name,
      person.LastName,
      person.Age,
      person.IsActive,
    );
    const city = new City(person.Country.City.Name, person.Country.City.Weather);
    newPerson.setCountry(new Country(person.Country.Name, city));
    return newPerson;
  }
}

export class CityFromService {
  constructor(name: string, weather: string) {
    this.Name = name;
    this.Weather = weather;
  }
  Name: string;
  Weather: string;

  static mapToCityDomain(city: CityFromService): City {
    return new City(city.Name, city.Weather);
  }
}

export class CountryFromService {
  constructor(name: string, city: CityFromService) {
    this.Name = name;
    this.City = city;
  }
  Name: string;
  City: CityFromService;

  static mapToCountryDomain(country: CountryFromService): Country {
    const city = CityFromService.mapToCityDomain(country.City);
    return new Country(country.Name, city);
  }
}
