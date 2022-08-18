# dic tool 🧰

dic tool y part of the `NodeTskeleton` template project.

`NodeTskeleton` is a `Clean Architecture` based `template project` for `NodeJs` using `TypeScript` to implement with any `web server framework` or even any user interface.

<a href="https://github.com/harvic3/nodetskeleton" target="_blank" >Go to NodeTskeleton</a>
 
## Using dic

The `dic` is a tool that will allow us to manage the class instance for your software solution in scoped or singleton way.

### Initializing

If you are using **Clean Architecture** you should create a directory in adapter layer path `adapters/shared/kernel" and into this directory create a index file with the next content: 

```ts
import applicationStatus from "../../../application/shared/status/applicationStatus";
import appMessages, { localKeys } from "../../../application/shared/locals/messages";
import tsKernel, { IServiceContainer } from "dic-tsk";

// This method for
tsKernel.init({
  internalErrorCode: applicationStatus.INTERNAL_ERROR,
  classNameBase: "",
  interfaceBaseName: "",
  appMessages,
  appErrorMessageKey: localKeys.DEPENDENCY_NOT_FOUNT,
  applicationStatus,
  applicationStatusCodeKey: "INTERNAL_ERROR",
});

export { IServiceContainer };
export default tsKernel;
```

### Important note

**init** method is optional, you don't need use it but is better for your customization because the kernel has the minimum resources to works, so the internal default values that it use are:

```ts
internalErrorCode = "FF";
classNameBase = "KeyClassName";
interfaceBaseName = "IKeyClassName";
appErrorMessageKey = "DEPENDENCY_NOT_FOUNT";
applicationStatusCodeKey = "INTERNAL_ERROR";
```
Probably the only configuration you need to do in your software solution is to have mapped the internal value for **internalErrorCode = "FF"** in your error code dictionary.


## In action

dic kernel has two ways to manage our class instances, scoped and singleton

### Scoped way

Scoped way return a new instance for each call to get method like following:

```ts
import { LoginUseCase } from "../../../../application/modules/auth/useCases/login";
import { AuthProvider, LogProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = `AuthControllerContainer`;

kernel.addScoped(
  LoginUseCase.name,
  () =>
    new LoginUseCase(
      kernel.get<LogProvider>(CONTEXT, LogProvider.name),
      kernel.get<AuthProvider>(CONTEXT, AuthProvider.name),
    ),
);

export { LoginUseCase };
export default kernel;

// In another module
import container, { LoginUseCase } from "./container";

const useCase = this.servicesContainer.get<LoginUseCase>(this.CONTEXT, LoginUseCase.name);
useCase.execute(params);
```

### Singleton way

Singleton way return the same instance for each call to get method like following:

```ts
import { AuthProvider } from "../../../providers/container";
import kernel from "../../../shared/kernel";

const CONTEXT = `ProviderContainer`;

kernel.addSingleton(
  AuthProvider.name,
  new AuthProvider(
    kernel.get<LogProvider>(CONTEXT, LogProvider.name),
  ),
);

export { AuthProvider };
export default kernel;

// In another module
import container, { LogProvider } from "./container";

const logProvider = this.servicesContainer.get<LogProvider>(this.CONTEXT, LogProvider.name);
```

#### Important note

Note that the **singleton pattern** can become very useful, but mishandling this pattern can end up in **mutation problems**, a very common mistake in JavaScript that can cause you a lot of headaches. 


## RunKit demo

Go to this <a href="https://runkit.com/harvic3/demo-dic-tsk" target="_blank" >Link</a> or click in `Try on RunKit button` on the right side of the page.

## Warning 💀

> Use this resource at your own risk.
