# LocalsJs tool 

LocalsJs tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Arquitecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## locals-js 🧰

It is a basic `internationalization` tool that will allow you to manage and administer the local messages of your application, even with enriched messages, for example:

## Using LocalsJs

The first thing to note is that your resource files must be in json or js format as shown in an example below:

```js
// ./locals/resources/en.local.json
// Resource file for english.
{
  "SOMETHING_WENT_WRONG": "Oh sorry, something went wrong with current action!",
	"SOME_PARAMETERS_ARE_MISSING": "Some parameters are missing: {{missingParams}}.",
	"YOUR_OWN_NEED": "You are the user {{name}}, your last name is {{lastName}} and your age is {{age}}."
}
```

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
import { Resources } from "@tskeleton/resources-js";
import * as esLocal from "./resources/es.local.json";
import * as enLocal from "./resources/en.local.json";

import * as localKeys from "./resources/keys.json";

const locals = {
  es: esLocal,
  en: enLocal,
};

const defaultLanguage = "en";

const resourceKeys = localKeys;

const resources = new Resources(locals, localKeys, defaultLanguage);

/*
This line is recommended so that intellisence can suggest existing keys, however the keys will also be available from the same resources object through the resourceKeys member (resources.resourceKeys.KEY_NAME). 
*/
export { resourceKeys, Resources };

export default resources
```

Okay, so now you can use your resources where you need them, an example would be this:

```ts
import resources, { resourceKeys } from "../locals/index";

const simpleMessage = resources.Get(resourceKeys.ITEM_PRODUCT_DOES_NOT_EXIST);

const enrichedMessage = resources.GetWithParams(resourceKeys.SOME_PARAMETERS_ARE_MISSING, {
	missingParams: keysNotFound.join(", "),
});

// You can add enriched messages according to your own needs, for example:
const yourEnrichedMessage = resources.GetWithParams(resourceKeys.YOUR_OWN_NEED, {
	name: firstName, lastName, age: userAge
});
//
```
And you can add all the parameters you need with as many messages in your application as required.

## Important

Don't forget to perform the language initialization for your resource manager in the localization middleware:

```ts
resources.Init(req.headers["accept-language"] || defaultLang);
```

## Code of Conduct 👌

The Contributor Covenant Code of Conduct for this project is based on Covenant Contributor which you can find at the following link:

- <a href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/code_of_conduct.md" target="_blank" >Go to Code of Conduct</a>

## Warning 💀

> Use this resource at your own risk.

-`You are welcome to contribute to this project, dare to do so.`

-`If you are interested you can contact me by this means.`

- 📫 <a href="mailto:harvic3@protonmail.com" target="_blank" >Write to him</a>
