export class Person {
  constructor(name: string, lastName: string, age: number) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  name: string;
  lastName: string;
  age: number;
  email: string;
  SetEmail(email: string): void {
    this.email = email;
  }
  IsAnAdult(): boolean {
    return this.age >= 10 ? true : false;
  }
}
