const mapper_tsk = require("mapper-tsk");

var PersonDto = (function () {
  function PersonDto() {
    this.name = null;
    this.lastName = null;
    this.age = null;
    this.country = {
      name = null,
      city = {
        name = null,
        weather = null,
      },
    };
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

var OtherPerson = (function () {
  function OtherPerson(Name, lastName, age, countryName, cityName, weather) {
    this.Name = Name;
    this.LastName = lastName;
    this.Age = age;
    this.Country = {
      Name = countryName,
      City = {
        Name: Name = cityName,
        Weather,
      }
    }
  }
  OtherPerson.prototype.IsAnAdult = function () {
    return this.Age >= 10 ? true : false;
  };
  return OtherPerson;
})();

var personOne = new Person("Jhon", "Doe", 30);
var personTwo = new Person("Carl", "Sagan", new Date().getFullYear() - 1934);

var personDto = mapper_tsk.default.MapObject(personOne, new PersonDto());
var personsDto = mapper_tsk.default.MapArray([personOne, personTwo], function () {
  return mapper_tsk.default.Activator(PersonDto);
});

console.log("Object", personDto);
console.log("Array", personsDto);


var personThree = new OtherPerson("Jhon", "Doe", 30, "Colombia", "Medellín", "Temperate");

var profileOne = {
  Name: "name",
  LastName: "lastName",
  Age: "age",
  Country: "country",
  "Country.Name": "country.name",
  "Country.City.name": "country.city.name",
  "Country.City.weather": "country.city.weather",
}

var otherPersonDto = mapper_tsk.default.MapObject(personThree, new PersonDto());