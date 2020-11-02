# Mapper tool 🧰

Mapper tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## Using Mapper

The `mapper` is a tool that will allow us to change the entities to the `DTOs` within our application, including entity changes between the data model and the domain and vice versa.

## Using Mapper

This tool maps `objects` or `arrays objects`, for example:

```ts
import mapper from "mapper-tsk";

// For object
const textFeelingDto = mapper.MapObject<TextFeeling, TextFeelingDto>(
	textFeeling,
	new TextFeelingDto(),
);

// For array object
const productsDto: ProductDto[] = mapper.MapArray<Product, ProductDto>(
	products,
	() => mapper.Activator(ProductDto),
);
```
`Activator` is the function responsible for returning a new instance for each call, otherwise you would have an array with the same object repeated N times. 

## Important notes

If you are using or plan to use the `DTO pattern`, you `must initialize` the properties of the entities in `NULL`, otherwise the tool will not be able to map the property because it will be `UNDEFINED`, for example:

```ts
export class PersonDto {
  name: string = null;
  lastName: string = null;
  age: number;
}
// In this case, `Age` will be `undefined`, therefore the mapper will not be able to have it in scope.
```

It is also important to know that `for efficiency` the `mapper links the entity based on the destination`, that is, it goes through the properties of the destination entity and not those of the origin entity.

## RunKit demo

Go to this <a href="https://runkit.com/harvic3/demo-mapper-tsk" target="_blank" >Link</a> or click in `Try on RunKit button` on the right side of the page.

## Warning 💀

> Use this resource at your own risk.
