# Validator tool 🧰

Validator tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
### Validator

The `validator` is a `very basic` but `dynamic tool` and with it you will be able to `validate any type of object and/or parameters` that your use case `requires as input`, and with it you will be able to `return enriched messages` to the `client` regarding the `errors` or necessary parameters not identified in the `input requirements`, for example:

```ts
/*...*/
async Execute(userUid: string, itemDto: CarItemDto): Promise<IResult<CarItemDto>> {
	const result = new Result<CarItemDto>();
	if (
		!this.validator.IsValidEntry(result, {
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

## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>
