const result_tsk = require("result-tsk");

const Person = (function () {
  function Person(name, lastName, age) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  Person.prototype.isAnAdult = function () {
    return this.age >= 18 ? true : false;
  };
  return Person;
})();

const person = new Person("Carl", "Sagan", new Date().getFullYear() - 1934);

const resultSuccess = new result_tsk.Result();
resultSuccess.setMessage("Your success message", 200);

const resultTSuccess = new result_tsk.ResultT();
resultTSuccess.setData(person, 201);

const resultNotSuccess = new result_tsk.Result();
resultNotSuccess.setError("Your error message", 400);

const resultTNotSuccess = new result_tsk.ResultT();
resultTNotSuccess.setError("Your error message", 400);

console.log("Result Success", resultSuccess);
console.log("ResultT Success", resultTSuccess);
console.log("Result Success calling to ToResultDto", resultSuccess.toResultDto());
console.log("ResultT Success calling to ToResultDto", resultTSuccess.toResultDto());

console.log("Result Not Success", resultNotSuccess);
console.log("ResultT Not Success", resultTNotSuccess);
console.log("Result Not Success calling to ToResultDto", resultNotSuccess.toResultDto());
console.log(
  "ResultT Not Success calling to ToResultDto",
  resultTNotSuccess.toResultDto(),
);
