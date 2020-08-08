# ResultJs tool 

ResultJs tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
### locals 🧰

It is a basic `internationalization` tool that will allow you to manage and administer the local messages of your application, even with enriched messages, for example:

```ts
import resources, { resourceKeys } from "../locals/index";

const simpleMessage = resources.Get(this.resourceKeys.ITEM_PRODUCT_DOES_NOT_EXIST);

const enrichedMessage = resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
	missingParams: keysNotFound.join(", "),
});

// The contents of the local files are as follows:
/* 
// en: 
{
	...
	"SOME_PARAMETERS_ARE_MISSING": "Some parameters are missing: {{missingParams}}.",
	"YOUR_OWN_NEED": "You are the user {{name}}, your last name is {{lastName}} and your age is {{age}}.",
	...
}
// es: 
{
	...
	"SOME_PARAMETERS_ARE_MISSING": "Faltan algunos parámetros: {{missingParams}}.",
	"YOUR_OWN_NEED": "Usted es el usuario {{name}}, su apellido es {{lastName}} y su edad es {{age}}.",
	...
}
...
*/

// You can add enriched messages according to your own needs, for example:
const yourEnrichedMessage = resources.GetWithParams(resourceKeys.YOUR_OWN_NEED, {
	name: firstName, lastName, age: userAge
});
//
```

And you can add all the parameters you need with as many messages in your application as required.


## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>
