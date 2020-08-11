# Validator tool 🧰

Validator tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
### Validator

The `validator` is a `very basic` but `dynamic tool` and with it you will be able to `validate any type of object and/or parameters` that your use case `requires as input`, and with it you will be able to `return enriched messages` to the `client` regarding the `errors` or necessary parameters not identified in the `input requirements`, for example:

```ts
import { Validator } from "validator-tsk";
import resources from "../../locals/index";

const resourceKey = "SOME_PARAMETERS_ARE_MISSING";
const validator = new Validator(resources, resourceKey);

/*...*/
async Execute(userUid: string, itemDto: CarItemDto): Promise<IResult<CarItemDto>> {
	const result = new Result<CarItemDto>();
	if (
		!validator.IsValidEntry(result, {
			User_Identifier: userUid,
			Car_Item: itemDto,
			Order_Id: itemDto?.orderId,
			Product_Detail_Id: itemDto?.productDetailId,
			Quantity: itemDto?.quantity,
		})
	) {
		/* 
		The error message on the result object will include a base message and will add to 
		it all the parameter names that were passed on the object that do not have a valid value.
		*/
		return result;
	}
	/*...*/
	return result;
}
/*...*/
```

## Validations functions

The validation functions extend the `IsValidEntry` method to inject `small functions` created for your `own needs`.

The philosophy of this tool is that it adapts to your own needs and not that you adapt to it.

To do this the `IsValidEntry function` input value key pair also accepts `array of small functions` that must perform a specific task with the parameter to be validated.

### Observation

If you are going to use the `validation functions` feature, you must send as a parameter an array even if it is only a function.

### Important note

The validation functions should return `NULL` if the parameter for validate `is valid` and a `string message` indicating the reason why the parameter `is not valid`.

```ts
// Validator functions created to meet your own needs
function ValidateEmail(email: string): string {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.NOT_VALID_EMAIL, { email });
}

function GreaterThan(numberName: string, base: number, evaluate: number): string {
  if (evaluate && evaluate > base) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.NUMBER_GREATER_THAN, {
    name: numberName,
    baseNumber: base.toString(),
  });
}

function EvenNumber(numberName: string, evaluate: number): string {
  if (evaluate && evaluate % 2 === 0) {
    return null;
  }
  return resources.GetWithParams(resourceKeys.MUST_BE_EVEN_NUMBER, {
    numberName,
  });
}

// In any use case
const result = new Result();
const person = new Person("Jhon", "Doe", 21);
const validEmail = "myemail@orion.com";
person.SetEmail(validEmail);
const isValid = validator.IsValidEntry(result, {
	Name: person.name,
	Last_Name: person.lastName,
	Age: [
		() => GreaterThan("Age", 25, person.age),
		() => EvenNumber("Age", person.age),
	],
	Email: [() => ValidateEmail(person.email)],
});
// result.error would have the following message
// "Some parameters are missing or not valid: The number Age must be greater than 25, The Age param should be even."
```

## Params for constructor

- resources: you need install and initialize `npm i resources-tsk`.
- resourceKey: resource message to search the local archive collection.
- defaultErrorCode: code error for result, by default is 400 (BAD_REQUEST), `it's optional`.

## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`
