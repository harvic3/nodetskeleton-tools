import mapper from "../src/index";
import { Person } from "./Person";
import { PersonDto } from "./PersonDto";

const personOne = new Person("Jhon", "Doe", 30);
const personTwo = new Person("Mata", "Rife", 76);

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
});
