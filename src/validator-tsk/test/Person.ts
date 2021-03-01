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

  setEmail(email: string): void {
    this.email = email;
  }

  isAnAdult(): boolean {
    return this.age >= 10 ? true : false;
  }
}
