# Mapper tool 🧰

Mapper tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
### Mapper

The mapper is a tool that will allow us to change the entities to the DTOs within our application, including entity changes between the data model and the domain and vice versa.

## Using Locals

This tool maps objects or arrays objects, for example:

```ts
// For object
const textFeelingDto = this.mapper.MapObject<TextFeeling, TextFeelingDto>(
	textFeeling,
	new TextFeelingDto(),
);

// For array object
const productsDto: ProductDto[] = this.mapper.MapArray<Product, ProductDto>(
	products,
	() => this.mapper.Activator(ProductDto),
);
```
`Activator` is the function responsible for returning a new instance for each call, otherwise you would have an array with the same object repeated N times. 

## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>
