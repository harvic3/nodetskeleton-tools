# Result tool 🧰

ResultJs tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## Using Result

`Result` is a `tool` that helps us `control the flow` of our `use cases` and allows us to `manage the response`, be it an `object`, an `array` of objects, a `message` or an `error` as follows:

```ts
import { IResultT, ResultT } from "result-tsk";

export class UseCaseProductGet extends BaseUseCase {
	constructor(private productQueryService: IProductQueryService) {
		super();
	}

	async Execute(idMask: string): Promise<IResultT<ProductDto>> {
		// We create the instance of our type of result at the beginning of the use case.
		const result = new ResultT<ProductDto>();
		// With the resulting object we can control validations within other functions.
		if (!this.validator.isValidEntry(result, { productMaskId: idMask })) {
			return result;
		}
		const product: Product = await this.productQueryService.getByMaskId(idMask);
		if (!product) {
			// The result object helps us with the error response and the code.
			result.setError(
				this.resources.get(this.resourceKeys.PRODUCT_DOES_NOT_EXIST),
				this.resultCodes.NOT_FOUND,
			);
			return result;
		}
		// Or
		if (result.hasError()) return result;

		const productDto = this.mapper.mapObject<Product, ProductDto>(product, new ProductDto());
		// The result object also helps you with the response data.
		result.setData(productDto, this.resultCodes.SUCCESS);
		// And finally you give it back.
		return result;
	}
}
```

The `result` object may or may not have a `type` of `response`, it fits your needs, and the `result instance without type` cannot be assigned `data`.

```ts
const resultWithType = new ResultT<ProductDto>();
// or
const resultWithoutType = new Result();
```

The `result object` can help you in `unit tests` as shown below:

```ts
it("should return a 400 error if quantity is null or zero", async () => {
	itemDto.quantity = null;
	const result = await addUseCase.execute(userUid, itemDto);
	expect(result.success).toBeFalsy();
	expect(result.error).toBe(
		resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
			missingParams: "quantity",
		}),
	);
	expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
	// Or you can create a ResultMock builder to do the following
	expect(result).toEqual(resultBuilder);
});
```
The `result object` has a method named `ToResultDto`, you must `call this method to reconstruct the result` that will be returned to the client, normally this must be done in the `request handler` (controller).

The recommendation is to `build a base controller class` where the request handling is done, something like this:

```ts
export default class BaseController {
  constructor() {
    this.router = Router();
  }
  router: RouterType;
  handleResult(res: Response, result: IResult): void {
    if (result.success) {
      res
        .status(result.statusCode)
        .json(result.message ? result.toResultDto() : result.toResultDto().data);
    } else {
      res.status(result.statusCode).json(result.toResultDto());
    }
  }
}

// In some controller you will have lines like this:
/*...*/
	const textDto: TextDto = req.body;
	this.handleResult(res, await getLowestFeelingSentenceUseCase.execute(textDto));
/*...*/
```
The result obtained from this function is something like this:

```js
// For result with type (ResultT)
{
	data: "your response data",
	message: "your message",
	error: "your error message"
}
// For result without type (Result)
{
	message: "your message",
	error: "your error message"
}
```
## Observation

Only properties that `are not NULL or UNDEFINED` will be considered when resolving the result.

## Metadata

In some cases you may need to add metadata as part of the result to use in the adapter layer as part of the response or for special purposes, so you have the following functions.

```ts
// Metadata is a Record<string, any> type like { [key: string]: any }
// Method for add object metadata 
setMetadata(headers: Metadata): void
// Method for add a key value pair metadata
addMetadata(key: string, value: string | number): void;
// Get object metadata
getMetadata(): Metadata;
// Verify if has metadata
hasMetadata(): boolean;
```

It is important to note that the metadata will not be resolved as part of the response when executing the `toResultDto` method.

```ts
// The result object also helps you with the metadata for use in adapter layer.
result.setData(productDto, this.resultCodes.SUCCESS);
result.addMetadata("keyOne", "valueOne");
result.addMetadata("keyTwo", 100);
// Or set an object
result.setMetadata({ keyOne: "valueOne", keyTwo: 100, keyN: "valueN" });
```

## RunKit demo

Go to this <a href="https://runkit.com/harvic3/demo-result-tsk" target="_blank" >Link</a> or click in `Try on RunKit button` on the right side of the page.

## Warning 💀

> Use this resource at your own risk.
