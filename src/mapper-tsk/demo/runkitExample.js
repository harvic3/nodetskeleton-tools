const mapper_tsk = require("mapper-tsk");

var PersonDto = (function () {
  function PersonDto() {
    this.name = null;
    this.lastName = null;
    this.age = null;
    this.country = {
      name: null,
      city: {
        name: null,
        weather: null,
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
  function OtherPerson(name, lastName, age, countryName, cityName, weather) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
    this.country = {
      name: countryName,
      city: {
        name: cityName,
        weather: weather,
      },
    };
  }
  OtherPerson.prototype.IsAnAdult = function () {
    return this.Age >= 10 ? true : false;
  };
  return OtherPerson;
})();

var OtherPersonTwo = (function () {
  function OtherPersonTwo(name, lastName, age, countryName, cityName, weather) {
    this.Name = name;
    this.LastName = lastName;
    this.Age = age;
    this.Country = {
      Name: countryName,
      City: {
        Name: cityName,
        Weather: weather,
      },
    };
  }
  OtherPersonTwo.prototype.IsAnAdult = function () {
    return this.Age >= 10 ? true : false;
  };
  return OtherPersonTwo;
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
  name: "name",
  lastName: "lastName",
  age: "age",
  country: "country",
  "country.name": "country.name",
  "country.city.name": "country.city.name",
  "country.city.weather": "country.city.weather",
};
var otherPersonDtoOne = mapper_tsk.default.MapObject(
  personThree,
  new PersonDto(),
  profileOne,
);

var personFour = new OtherPersonTwo(
  "Jhon",
  "Doe",
  30,
  "Colombia",
  "Medellín",
  "Temperate",
);

var profileTwo = {
  Name: "name",
  LastName: "lastName",
  Age: "age",
  "Country.Name": "country.name",
  "Country.City.Name": "country.city.name",
  "Country.City.Weather": "country.city.weather",
};
var otherPersonDtoTwo = mapper_tsk.default.MapObject(
  personFour,
  new PersonDto(),
  profileTwo,
);

console.log("Object profile mapping 1: ", otherPersonDtoOne);
console.log("Object profile mapping 2: ", otherPersonDtoTwo);
