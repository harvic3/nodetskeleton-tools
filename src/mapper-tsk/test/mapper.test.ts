import mapper from "../src/index";
import { Person, City } from "./Person";
import { PersonDto } from "./PersonDto";
import { OtherPerson } from "./OtherPerson";

const city = new City("Medellín", "Colombia");
const personOne = new Person("John", "Doe", 30);
personOne.SetCity(city);
const personTwo = new Person("Nikola", "Tesla", 76);
personTwo.SetCity(city);
const otherPersonOne = new OtherPerson("John", "Doe", 30);
otherPersonOne.SetCity(city);
const otherPersonTwo = new OtherPerson("Nikola", "Tesla", 76);
otherPersonTwo.SetCity(city);

describe("when use a mapper", () => {
  it("should be return a object when map a another object", () => {
    const personDto: PersonDto = mapper.MapObject<Person, PersonDto>(
      personOne,
      new PersonDto(),
    );
    expect(personDto.name).toBe(personOne.name);
    expect(personDto.lastName).toBe(personOne.lastName);
    expect(personDto.age).toBe(personOne.age);
  });
  it("should be return a array object when map a another array object", () => {
    const personsDto: PersonDto[] = mapper.MapArray<Person, PersonDto>(
      [personOne, personTwo],
      () => mapper.Activator(PersonDto),
    );
    expect(personsDto[0].name).toBe(personOne.name);
    expect(personsDto[0].lastName).toBe(personOne.lastName);
    expect(personsDto[0].age).toBe(personOne.age);
    expect(personsDto[1].name).toBe(personTwo.name);
    expect(personsDto[1].lastName).toBe(personTwo.lastName);
    expect(personsDto[1].age).toBe(personTwo.age);
    expect(personsDto.length).toBe(2);
  });
  it("should be return a object when map a another object with dictionary", () => {
    const profile = { Name: "name", LastName: "lastName", Age: "age", City: "city" };
    const personDto: PersonDto = mapper.MapObject<OtherPerson, PersonDto>(
      otherPersonOne,
      new PersonDto(),
      profile,
    );
    expect(personDto.name).toBe(otherPersonOne.Name);
    expect(personDto.lastName).toBe(otherPersonOne.LastName);
    expect(personDto.age).toBe(otherPersonOne.Age);
  });
  it("should be return a array object when map a another array object with dictionary", () => {
    const profile = { Name: "name", LastName: "lastName", Age: "age", City: "city" };
    const personsDto: PersonDto[] = mapper.MapArray<OtherPerson, PersonDto>(
      [otherPersonOne, otherPersonTwo],
      () => mapper.Activator(PersonDto),
      profile,
    );
    expect(personsDto[0].name).toBe(otherPersonOne.Name);
    expect(personsDto[0].lastName).toBe(otherPersonOne.LastName);
    expect(personsDto[0].age).toBe(otherPersonOne.Age);
    expect(personsDto[1].name).toBe(otherPersonTwo.Name);
    expect(personsDto[1].lastName).toBe(otherPersonTwo.LastName);
    expect(personsDto[1].age).toBe(otherPersonTwo.Age);
    expect(personsDto.length).toBe(2);
  });
});
