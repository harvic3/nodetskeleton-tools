import { Person, City, Country } from "./Person";
import { PersonDto } from "./PersonDto";
import mapper from "../src/index";
import {
  PersonFromService,
  CountryFromService,
  CityFromService,
} from "./PersonFromService";

const cityName = "Medellín";
const countryName = "Colombia";
const weather = "Temperate";

const city = new City(cityName, weather);
const country = new Country(countryName, city);
const personOne = new Person("John", "Doe", 30, true);
personOne.SetCountry(country);
const personTwo = new Person("Nikola", "Tesla", 76, false);
personTwo.SetCountry(country);

const cityFromService = new CityFromService(cityName, weather);
const countryFromService = new CountryFromService(countryName, cityFromService);
const servicePersonOne = new PersonFromService(
  personOne.name,
  personOne.lastName,
  personOne.age,
  personOne.isActive,
);
servicePersonOne.SetCountry(countryFromService);
const servicePersonTwo = new PersonFromService(
  personTwo.name,
  personTwo.lastName,
  personOne.age,
  personTwo.isActive,
);
servicePersonTwo.SetCountry(countryFromService);

describe("when use a mapper", () => {
  it("should be return a object when map a another object", () => {
    const personDto: PersonDto = mapper.MapObject<Person, PersonDto>(
      personOne,
      new PersonDto(),
    );
    expect(personDto.name).toBe(personOne.name);
    expect(personDto.lastName).toBe(personOne.lastName);
    expect(personDto.age).toBe(personOne.age);
    expect(personDto.isActive).toBe(personOne.isActive);
  });
  it("should be return a array object when map a another array object", () => {
    const personsDto: PersonDto[] = mapper.MapArray<Person, PersonDto>(
      [personOne, personTwo],
      () => mapper.Activator(PersonDto),
    );
    expect(personsDto[0].name).toBe(personOne.name);
    expect(personsDto[0].lastName).toBe(personOne.lastName);
    expect(personsDto[0].age).toBe(personOne.age);
    expect(personsDto[0].isActive).toBe(personOne.isActive);

    expect(personsDto[1].name).toBe(personTwo.name);
    expect(personsDto[1].lastName).toBe(personTwo.lastName);
    expect(personsDto[1].age).toBe(personTwo.age);
    expect(personsDto[1].isActive).toBe(personTwo.isActive);

    expect(personsDto.length).toBe(2);
  });
  it("should be return a object when map a another object with profile", () => {
    const profile = {
      Name: "name",
      LastName: "lastName",
      Age: "age",
      IsActive: "isActive",
      "Country.Name": "country.name",
      "Country.City": {
        destinationKey: "country.city",
        mappingFunction: CityFromService.MapToCityDomain,
      },
    };
    const personDto: PersonDto = mapper.MapObject<PersonFromService, PersonDto>(
      servicePersonOne,
      new PersonDto(),
      profile,
    );
    expect(personDto.name).toBe(servicePersonOne.Name);
    expect(personDto.lastName).toBe(servicePersonOne.LastName);
    expect(personDto.age).toBe(servicePersonOne.Age);
    expect(personDto.isActive).toBe(servicePersonOne.IsActive);
    expect(personDto.country.name).toBe(servicePersonOne.Country.Name);
    expect(personDto.country.city.name).toBe(servicePersonOne.Country.City.Name);
    expect(personDto.country.city.weather).toBe(servicePersonOne.Country.City.Weather);
  });
  it("should be return a array object when map a another array object with profile", () => {
    const profile = {
      Name: "name",
      LastName: "lastName",
      Age: "age",
      IsActive: "isActive",
      Country: {
        destinationKey: "country",
        mappingFunction: CountryFromService.MapToCountryDomain,
      },
      "Country.City": {
        destinationKey: "country.city",
        mappingFunction: CityFromService.MapToCityDomain,
      },
    };
    const personsDto: PersonDto[] = mapper.MapArray<PersonFromService, PersonDto>(
      [servicePersonOne, servicePersonTwo],
      () => mapper.Activator(PersonDto),
      profile,
    );

    expect(personsDto[0].name).toBe(servicePersonOne.Name);
    expect(personsDto[0].lastName).toBe(servicePersonOne.LastName);
    expect(personsDto[0].age).toBe(servicePersonOne.Age);
    expect(personsDto[0].isActive).toBe(servicePersonOne.IsActive);
    expect(personsDto[0].country.name).toBe(servicePersonOne.Country.Name);
    expect(personsDto[0].country.city.name).toBe(servicePersonOne.Country.City.Name);
    expect(personsDto[0].country.city.weather).toBe(
      servicePersonOne.Country.City.Weather,
    );

    expect(personsDto[1].name).toBe(servicePersonTwo.Name);
    expect(personsDto[1].lastName).toBe(servicePersonTwo.LastName);
    expect(personsDto[1].age).toBe(servicePersonTwo.Age);
    expect(personsDto[1].isActive).toBe(servicePersonTwo.IsActive);
    expect(personsDto[1].country.name).toBe(servicePersonTwo.Country.Name);
    expect(personsDto[1].country.city.name).toBe(servicePersonTwo.Country.City.Name);
    expect(personsDto[1].country.city.weather).toBe(
      servicePersonTwo.Country.City.Weather,
    );

    expect(personsDto.length).toBe(2);
  });
});
