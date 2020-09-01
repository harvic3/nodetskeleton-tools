import mapper from "../src/index";
import { Person } from "./Person";
import { PersonDto } from "./PersonDto";
import { OtherPerson } from "./OtherPerson";

const personOne = new Person("John", "Doe", 30);
const personTwo = new Person("Nikola", "Tesla", 76);
const otherPersonOne = new OtherPerson("jd", "John Doe", 30);
const otherPersonTwo = new OtherPerson("niki", "Nikola Tesla", 76);

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
    const profile = { nickName: "name", fullName: "lastName", age: "age" };
    const personDto: PersonDto = mapper.MapObject<OtherPerson, PersonDto>(
      otherPersonOne,
      new PersonDto(),
      profile,
    );
    expect(personDto.name).toBe(otherPersonOne.nickName);
    expect(personDto.lastName).toBe(otherPersonOne.fullName);
    expect(personDto.age).toBe(otherPersonOne.age);
  });
  it("should be return a array object when map a another array object with dictionary", () => {
    const profile = { nickName: "name", fullName: "lastName", age: "age" };
    const personsDto: PersonDto[] = mapper.MapArray<OtherPerson, PersonDto>(
      [otherPersonOne, otherPersonTwo],
      () => mapper.Activator(PersonDto),
      profile,
    );
    expect(personsDto[0].name).toBe(otherPersonOne.nickName);
    expect(personsDto[0].lastName).toBe(otherPersonOne.fullName);
    expect(personsDto[0].age).toBe(otherPersonOne.age);
    expect(personsDto[1].name).toBe(otherPersonTwo.nickName);
    expect(personsDto[1].lastName).toBe(otherPersonTwo.fullName);
    expect(personsDto[1].age).toBe(otherPersonTwo.age);
    expect(personsDto.length).toBe(2);
  });
});
