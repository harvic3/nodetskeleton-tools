# Validator tool 🧰

Validator tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## Using Validator

`Validator` is a `very basic` but `dynamic tool` and with it you will be able to `validate any type of object and/or parameters` that your use case `requires as input`, and with it you will be able to `return enriched messages` to the `client` regarding the `errors` or necessary parameters not identified in the `input requirements`, for example:

```ts
import { Validator } from "validator-tsk";
import resources from "../../locals/index";

const resourceKey = "SOME_PARAMETERS_ARE_MISSING";
/*
 english local key for validator:
 "SOME_PARAMETERS_ARE_MISSING": "Some parameters are missing or not valid: {{missingParams}}.",
 Note: You can change the message, but not the key `{{missingParams}}` 
*/

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

Suppose that in the above example the itemDto object has no `orderId` and no `quantity`, then the `result of the error` in the `object result` based on the message of the `SOME_PARAMETERS_ARE_MISSING` for `english local file` would be something like this:

`Some parameters are missing or not valid: Order_Id, Quantity.`

### Important note

In the `validation process` the result of messages obtained will be inserted in the `{{missingParams}}` key of the local message.
> You can change the message, but not the key `{{missingParams}}`.

### Validations functions (New Feature 🤩)

The `validation functions` extend the `IsValidEntry` method to inject `small functions` created for `your own needs`.

The philosophy of this tool is that `it adapts to your own needs` and not that you adapt to it.

To do this the `IsValidEntry function` input value key pair also accepts `array of small functions` that must perform a specific task with the parameter to be validated.

### Observation

If you are going to use the `validation functions` feature, you must send as a parameter an array `even if it is only a function`.

### Important note

The validation function should return `NULL` if the parameter for validate `is valid` and a `string message` indicating the reason why the parameter `is not valid`.

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

// Input in any use case
const person = new Person("Jhon", "Doe", 21, "myemail@orion.com");
/*...*/
const result = new Result();
if(!validator.IsValidEntry(result, {
	Name: person.name,
	Last_Name: person.lastName,
	Age: [
		() => GreaterThan("Age", 25, person.age),
		() => EvenNumber("Age", person.age),
	],
	Email: [() => ValidateEmail(person.email)],
})) {
	return result;
}
/* 
	result.error would have the following message
	"Some parameters are missing or not valid: The number Age must be greater than 25, The Age param should be even."
*/
```

## Params for constructor

- resources: you need install and initialize `npm i resources-tsk`.
- resourceKey: resource message to search the local archive collection.
- defaultErrorCode: code error for result, by default is 400 (BAD_REQUEST), `it's optional`.

## RunKit demo

Go to this <a href="https://runkit.com/harvic3/demo-validator-tsk" target="_blank" >Link</a> or click in `Try on RunKit button` on the right side of the page.

## Warning 💀

> Use this resource at your own risk.
