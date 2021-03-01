# Resources tool 🧰

Resources tool (Locals) y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## Using Resources

`Resources` is a basic `internationalization` tool that will allow you to manage and administer the local messages of your application, even with enriched messages, for example:

## Using Resources

The first thing to note is that your resource files must be in json or js format as shown in an example below:

```js
// ./locals/resources/en.local.json
// Resource file for english.
{
  "SOMETHING_WENT_WRONG": "Oh sorry, something went wrong with current action!",
  "SOME_PARAMETERS_ARE_MISSING": "Some parameters are missing: {{missingParams}}.",
  "YOUR_OWN_NEED": "You are the user {{name}}, your last name is {{lastName}} and you are {{age}} years old."
}
// ./locals/resources/es.local.json
// Resource file for spanish.
{
  "SOMETHING_WENT_WRONG": "Oh lo sentimos, algo salió mal con esta acción!",
  "SOME_PARAMETERS_ARE_MISSING": "Faltan algunos parámetros: {{missingParams}}.",
  "YOUR_OWN_NEED": "Usted es {{name}}, su apellido es {{lastName}} y su edad es {{age}} años."
}
/* others as you needed */
```

### Important note

The parameters to be replaced in the messages should be in brackets like this, `{{paramName}}`.

As a second step you must have the file that corresponds to the mapping of the keys containing your resource files as shown below:

```js
// ./locals/resources/keys.json
{
  "SOMETHING_WENT_WRONG": "SOMETHING_WENT_WRONG",
  "SOME_PARAMETERS_ARE_MISSING": "SOME_PARAMETERS_ARE_MISSING",
  "YOUR_OWN_NEED": "YOUR_OWN_NEED"
}
```
So now we can set up our index file which we will use to manage our internationalization resources:

```ts
// ./locals/index.ts
import { Resources } from "resources-tsk";
import * as esLocal from "./resources/es.local.json";
import * as enLocal from "./resources/en.local.json";
/* others as you needed */

import * as localKeys from "./resources/keys.json";

const locals = {
	es: esLocal,
	en: enLocal,
	/* others as you needed */
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const resources = new Resources(locals, localKeys, defaultLanguage);

/*
This line is recommended so that intellisence can suggest existing keys, however the keys will also be available from the same resources object through the resourceKeys member (resources.resourceKeys.KEY_NAME). 
*/
export { resourceKeys };

export default resources
```

Okay, so now you can use your resources where you need them, an example would be this:

```ts
import resources, { resourceKeys } from "../locals/index";

const simpleMessage = resources.get(resourceKeys.ITEM_PRODUCT_DOES_NOT_EXIST);

const enrichedMessage = resources.getWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
	missingParams: keysNotFound.join(", "),
});

// You can add enriched messages according to your own needs, for example:
const yourEnrichedMessage = resources.getWithParams(resourceKeys.YOUR_OWN_NEED, {
	name: firstName, lastName, age: userAge
});
/*
	Output:
	You are the user Jhon, your last name is Doe and you are 24 yeard old.
*/
```
And you can add all the parameters you need with as many messages in your application as required.

> The resource files can be local files in JSON format or you can get them from an external service.

## Important

> Don't forget to perform the language initialization for your resource manager in the localization middleware as following:

```ts
import resources from "../locals/index";

// add this line into your localization function considering the web framework you're using
resources.init(req.headers["accept-language"] || defaultLang);
```
But if you prefer, applying the concept of `pure function`, you have the option to pass the `optional language parameter` in the functions to get the parameters as shown below:

```ts
const message = resources.get(localKeys.SOMETHING_WENT_WRONG, user.language);
// Or
const enrichedMessage = resources.getWithParams(
	localKeys.NOT_VALID_EMAIL,
	{ email: user.email },
	user.language,
);
```

## RunKit demo

Go to this <a href="https://runkit.com/harvic3/demo-resources-tsk" target="_blank" >Link</a> or click in `Try on RunKit button` on the right side of the page.

## Warning 💀

> Use this resource at your own risk.
