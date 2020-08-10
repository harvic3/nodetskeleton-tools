# Result tool 🧰

ResultJs tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
### Using Result

`Result` is a `tool` that helps us control the flow of our `use cases` and allows us to `manage the response`, be it an `object`, an `array` of objects, a `message` or an `error` as follows:

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
		if (!this.validator.IsValidEntry(result, { productMaskId: idMask })) {
			return result;
		}
		const product: Product = await this.productQueryService.GetByMaskId(idMask);
		if (!product) {
			// The result object helps us with the error response and the code.
			result.SetError(
				this.resources.Get(this.resourceKeys.PRODUCT_DOES_NOT_EXIST),
				this.resultCodes.NOT_FOUND,
			);
			return result;
		}
		const productDto = this.mapper.MapObject<Product, ProductDto>(product, new ProductDto());
		// The result object also helps you with the response data.
		result.SetData(productDto, this.resultCodes.SUCCESS);
		// And finally you give it back.
		return result;
	}
}
```

The `result` object may or may not have a `type` of `response`, it fits your needs, and the `result instance without type` cannot be assigned `data`.

```ts
const resultWithType = new Result<ProductDto>();
// or
const resultWithoutType = new Result();
```

The `result` object can help you in unit tests as shown below:

```ts
it("should return a 400 error if quantity is null or zero", async () => {
	itemDto.quantity = null;
	const result = await addUseCase.Execute(userUid, itemDto);
	expect(result.success).toBeFalsy();
	expect(result.error).toBe(
		resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
			missingParams: "quantity",
		}),
	);
	expect(result.statusCode).toBe(resultCodes.BAD_REQUEST);
});
```

## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`
