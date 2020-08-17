var result_tsk = require("result-tsk");

var Person = (function () {
  function Person(name, lastName, age) {
    this.name = name;
    this.lastName = lastName;
    this.age = age;
  }
  Person.prototype.IsAnAdult = function () {
    return this.age >= 18 ? true : false;
  };
  return Person;
})();

const person = new Person("Carl", "Sagan", new Date().getFullYear() - 1934);

const resultSuccess = new result_tsk.Result();
resultSuccess.SetMessage("Your success message", 200);

const resultTSuccess = new result_tsk.ResultT();
resultTSuccess.SetData(person, 201);

const resultNotSuccess = new result_tsk.Result();
resultNotSuccess.SetError("Your error message", 400);

const resultTNotSuccess = new result_tsk.ResultT();
resultTNotSuccess.SetError("Your error message", 400);

console.log("Result Success", resultSuccess);
console.log("ResultT Success", resultTSuccess);
console.log("Result Success calling to ToResultDto", resultSuccess.ToResultDto());
console.log("ResultT Success calling to ToResultDto", resultTSuccess.ToResultDto());

console.log("Result Not Success", resultNotSuccess);
console.log("ResultT Not Success", resultTNotSuccess);
console.log("Result Not Success calling to ToResultDto", resultNotSuccess.ToResultDto());
console.log(
  "ResultT Not Success calling to ToResultDto",
  resultTNotSuccess.ToResultDto(),
);
