export class OtherPerson {
  constructor(nickName: string, fullName: string, age: number) {
    this.nickName = nickName;
    this.fullName = fullName;
    this.age = age;
  }
  nickName: string;
  fullName: string;
  age: number;
  IsAnAdult(): boolean {
    return this.age >= 10 ? true : false;
  }
}
