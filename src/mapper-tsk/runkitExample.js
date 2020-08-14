var mapper_tsk = require("mapper-tsk");

var PersonDto = (function () {
  function PersonDto() {
    this.name = null;
    this.lastName = null;
    this.age = null;
  }
  return PersonDto;
})();

var Person = (function () {
  function Person(name, lastName, age) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  Person.prototype.IsAnAdult = function () {
    return this.age >= 10 ? true : false;
  };
  return Person;
})();

var personOne = new Person("Jhon", "Doe", 30);
var personTwo = new Person("Carl", "Sagan", 86);

var personDto = mapper_tsk.default.MapObject(personOne, new PersonDto());
var personsDto = mapper_tsk.default.MapArray([personOne, personTwo], function () {
  return mapper_tsk.default.Activator(PersonDto);
});

console.log("Object", personDto);
console.log("Array", personsDto);
