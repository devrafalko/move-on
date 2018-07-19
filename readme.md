<h1>Description</h1>

<code>move-on</code> is a module that:
<ul>
  <li>executes the chosen functions <em>(synchronous and | or asynchronous)</em> in the chain</li>
  <li>can be a <em>(really, really great)</em> alternative for <strong>Promises</strong></li>
  <li>supports <strong><a href="#configtimeout">timeout</a></strong></li>
  <li>contains <a href="#moveonalllist-config-done-catch">four methods</a> that immitate the Promises' <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"><code>.all</code></a> and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race"><code>.race</code></a> methods</li> 
  <li>allows to set the <code>this</code> reference <strong><a href="#configcontext">inner context</a></strong> for all functions in the chain to transmit data between functions </li>
</ul>

<p>Any bugs found? Give me to know on <a href="https://github.com/devrafalko/move-on">GitHub</a>.</p>

<h1>Usage</h1>
<h4>Node</h4>

`npm install move-on`

<h4>Browsers</h4>
Load the `move-on.min.js` file from the `src` folder in your `.html` file.  
The module is accessible as `moveOn` in the global scope.  
It is a `babel` converted and `webpack` bundled module version.
```html
<script src="./src/move-on.min.js"></script>
<script>
  moveOn(list, config, onDone, onCatch);
</script>
```

# Tests
`npm test`  

# Simple sample
```javascript
const moveOn = require('move-on');
/* [Function] moveOn(list, config, onDone, onCatch)
   [Function] moveOn.all(list, config, onDone, onCatch)
   [Function] moveOn.each(list, config, onDone, onCatch)
   [Function] moveOn.first(list, config, onDone, onCatch) */
   
const list = [retrieveData, computeData, displayData];
const config = { timeout: 5000 };

moveOn(list, config, onDone, onCatch);

function retrieveData(resolve, reject, context){
  setTimeout(resolve, 1000); //asynchronous resolve
}
function computeData(resolve, reject, context){
  resolve(); //synchronous resolve
}
function displayData(resolve, reject, context){
  resolve();
}
function onDone(reject, context){ }
function onCatch(context){ }
```


# Methods short description
The module's methods expect the [Array] [`list`](#list-array-function--array) of functions to be passed as the first argument. Each function in the chain has the [`resolve`](#chained-functions) and [`reject`](#chained-functions) parameter, that should be called when ready *(or failed)* in order to move the functions execution forward. When the functions chain is successfully executed, the [`done`](#donereject-context-function) callback function is called finally, otherwise the [`catch`](#catchcontext-function) callback function is called.
#### 1. `moveOn`
The chained functions are executed sequentially *(one after another)*. Each function is expected to be [`resolved`](#chained-functions), so that the next chained function was executed. The [`done`](#donereject-context-function) function is called as the last one, when all previous chained functions resolved. The [`catch`](#catchcontext-function) function is called instead of [`done`](#donereject-context-function) function, when at least one chained function failed *([rejected](#chained-functions))*. [See the full description below](#moveonlist-config-done-catch).
#### 2. `moveOn.all`
The `all` static method of `move-on` module executes all chosen functions at the same time *(similarly to Promises' [`.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) method)*. All chained functions are expected to be [`resolved`](#chained-functions) so that the final [`done`](#donereject-context-function) function was called. The [`catch`](#catchcontext-function) function is called instead of [`done`](#donereject-context-function) function, when at least one chained function failed *([rejected](#chained-functions))*. [See the full description below](#moveonalllist-config-done-catch).
#### 3. `moveOn.each`
The `each` static method of `move-on` module executes all chosen functions at the same time. Each chained function is expected to be either [`resolved`](#chained-functions) or [`rejected`](#chained-functions), so that the final [`done`](#donereject-context-function) function was called. The failed *([rejected](#chained-functions))* function **does not stop** the further functions execution. It can be used *eg.* to log the warnings in the [`catch`](#catchcontext-function) callback function. [See the full description below](#moveoneachlist-config-done-catch).
#### 4. `moveOn.first`
The `first` static method of `move-on` module executes all chained functions at the same time. It expects the first *(fastest)* function to be [`resolved`](#chained-functions), so that the [`done`](#donereject-context-function) function was called *(similarly to Promises' [`.race`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) method)*. When **all** functions failed *([rejected](#chained-functions))*, the [`catch`](#catchcontext-function) function is called instead. [See the full description below](#moveonfirstlist-config-done-catch).

# Methods behaviour
### moveOn([`list`](#list-array-function--array), [`config`](#config-object--null), [`done`](#donereject-context-function), [`catch`](#catchcontext-function))
* The `move-on` module function executes the [`list`](#list-array-function--array) functions **sequentially** *(one after another)* in the chain
* When one [`list`](#list-array-function--array) function **[resolves](#chained-functions)**, the next [`list`](#list-array-function--array) function is called, *and so on...*
* When the **last** [`list`](#list-array-function--array) function **[resolves](#chained-functions)**, the [`done`](#donereject-context-function) function is called **once** *(it **ends up** the module execution)*
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)**, the farther [`list`](#list-array-function--array) functions and the [`done`](#donereject-context-function) function are **not called** in the end
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)**, the [`catch`](#catchcontext-function) function is called instead **once** *(it **ends up** the module execution)*
* Each [`list`](#list-array-function--array) function can be **[resolved](#chained-functions)** and | or **[rejected](#chained-functions)** **multiple times**. The forks of chain are created and executed then [\[read more\]](#multiple-resolve--reject-calls)
* Each [`list`](#list-array-function--array) function can execute the inner `move-on` module [\[read more\]](#inner-move-on-module)
### moveOn.all([`list`](#list-array-function--array), [`config`](#config-object--null), [`done`](#donereject-context-function), [`catch`](#catchcontext-function))
* `move-on`.`all` static method executes all the [`list`](#list-array-function--array) functions **simultaneously** *(at the same time)*
* When one [`list`](#list-array-function--array) function **[resolves](#chained-functions)**, the [`done`](#donereject-context-function) is **not called** immediately
* The [`done`](#donereject-context-function) waits, till **all** [`list`](#list-array-function--array) functions are **[resolved](#chained-functions)**, to be called *(it **ends up** the module execution - after that, all [resolve](#chained-functions) and [reject](#chained-functions) calls are ignored)*
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)**, the [`done`](#donereject-context-function) function is **not called** in the end
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)**, the [`catch`](#catchcontext-function) function is called instead **once** *(it **ends up** the module execution - after that, all [resolve](#chained-functions) and [reject](#chained-functions) calls are ignored)*
* When **whichever** [`list`](#list-array-function--array) function [resolves](#chained-functions) and | or [rejects](#chained-functions) **multiple times**, only the **first** call is respected [\[read more\]](#multiple-resolve--reject-calls)
* Each [`list`](#list-array-function--array) function can execute the inner `move-on` module [\[read more\]](#inner-move-on-module)

### moveOn.each([`list`](#list-array-function--array), [`config`](#config-object--null), [`done`](#donereject-context-function), [`catch`](#catchcontext-function))
* `move-on`.`each` static method executes all the [`list`](#list-array-function--array) functions **simultaneously** *(at the same time)*
* When one [`list`](#list-array-function--array) function **[resolves](#chained-functions)**, the [`done`](#donereject-context-function) is **not called** immediately
* The `done` waits, till **each** [`list`](#list-array-function--array) function is either **[resolved](#chained-functions)** or **[rejected](#chained-functions)**, to be called *(it **ends up** the module execution - after that, all [resolve](#chained-functions) and [reject](#chained-functions) calls are ignored)*
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)**, the [`catch`](#catchcontext-function) function is called **for each function** individually
* When **whichever** [`list`](#list-array-function--array) function **[rejects](#chained-functions)** and the [`catch`](#catchcontext-function) is called, it **does not end up** the module execution
* When **whichever** [`list`](#list-array-function--array) function [resolves](#chained-functions) and | or [rejects](#chained-functions) **multiple times**, only the **first** call is respected [\[read more\]](#multiple-resolve--reject-calls)
* Each [`list`](#list-array-function--array) function can execute the inner `move-on` module [\[read more\]](#inner-move-on-module)

### moveOn.first([`list`](#list-array-function--array), [`config`](#config-object--null), [`done`](#donereject-context-function), [`catch`](#catchcontext-function))
* `move-on`.`first` static method executes all the [`list`](#list-array-function--array) functions **simultaneously** *(at the same time)*
* The [`done`](#donereject-context-function) waits, till **the first** *(fastest)* [`list`](#list-array-function--array) function is **[resolved](#chained-functions)**, to be called *(it **ends up** the module execution - after that, all [resolve](#chained-functions) and [reject](#chained-functions) calls are ignored)*
* When **all** [`list`](#list-array-function--array) functions **[reject](#chained-functions)**, the [`done`](#donereject-context-function) function is **not called** in the end
* When **all** [`list`](#list-array-function--array) functions **[reject](#chained-functions)**, the [`catch`](#catchcontext-function) function is called instead **once** *(it **ends up** the module execution - after that, all [resolve](#chained-functions) and [reject](#chained-functions) calls are ignored)*
* When **whichever** [`list`](#list-array-function--array) function [resolves](#chained-functions) and | or [rejects](#chained-functions) **multiple times**, only the **first** call is respected [\[read more\]](#multiple-resolve--reject-calls)
* Each [`list`](#list-array-function--array) function can execute the inner `move-on` module [\[read more\]](#inner-move-on-module)

# Arguments
1. [`list`](#list-array-function--array)
2. [`config`](#config-object--null)
3. [`done`](#donereject-context-function)
4. [`catch`](#catchcontext-function)

### `list` **[Array: function | array]**
The [Array] `list` stores the list of functions, that should be called. It can contain:
* [Function] items [\[see below\]](#1-function-items)  
  `const list = [fnA, fnB, fnC];`
* or [Array] items that store the [Function] items [\[see below\]](#2-array-function-items-for-individual-binding)  
  `const list = [fnA, [obj, fnB, fnC], fnD]`
* or [Array] items that store the [String] names of methods [\[see below\]](#3-array-string-items-for-methods)  
  `const list = [fnA, [obj, 'fnB', 'fnC'], fnD]`

#### 1. [Function] items
* The [Array] `list` can contain [Function] items. It may be function, arrow function or object's method
* All functions are [bound](#configbind) by default to the [`config.context`](#configcontext) reference *(except arrow functions and already bound functions [\[read more\]](#configbind))*
```javascript
const retrieveData = function(){};
const computeData = ()=>{};
const displayData = { display:()=>{} };

const list = [retrieveData, computeData, displayData.display];
```

#### 2. [Array: function] items for individual binding
* All chained functions are [bound](#configbind) by default to the [`config.context`](#configcontext) reference
* You can set the **individual** `this` reference for the chosen functions *(except arrow functions and already bound functions [\[read more\]](#configbind))*
* In order to bind the chained functions individually, push [Array] items into the [`list`](#list-array-function--array):
  * The `[0]` item should indicate the **object** or value to be the `this` reference for the functions
  * The `[1]`, `[2]`*, etc...* item(s) should indicate the **function(s)**, that will be bound to the `[0]` object or value
* The [Array] item functions are bound to the given `[0]` object or value instead of the [`config.context`](#configcontext)
* The [`config.bind`](#configbind) setting does not affect the individual `this` reference setting
* The [Array] item functions still have the access to the [`config.context`](#configcontext) [parameter](#configpasscontext)
* the [`list`](#list-array-function--array) can still contain the [[Function] items](#1-function-items) next to this [Array] item

```javascript
const workers = {}, earnings = {}, tasks = {};
const config = {context: tasks}; //the default this reference
const list = [
  functionA,  //this === tasks
  [workers, functionB],  //this === workers
  [earnings, functionC]  //this === earnings
];
moveOn(list, config, onDone, onCatch));
```

#### 3. [Array: string] items for methods
The methods passed to the [`list`](#list-array-function--array) loses their `this` reference to the object, they were declared in, what may be undesirable.
```javascript
const workers = {
  addWorker: function(){},
  listEarnings: function(){}
;
const list = [
  workers.addWorker,    //this !== workers
  workers.listEarnings  //this !== workers
];
```
* to retain the `this` reference to the object, that the methods are declared in, push [Array] item with methods' [String] names into the [`list`](#list-array-function--array):
  * The `[0]` item should indicate the **object**, that the methods are declared in
  * The `[1]`, `[2]`*, etc...* item(s) should indicate the [String] **name(s)** of the method(s) declared in the `[0]` object
* These methods retain the `this` reference to the `[0]` object and are not [bound](#configbind) to the [`config.context`](#configcontext) 
* The [`config.bind`](#configbind) setting does not affect the `this` reference
* The [Array] item functions still have the access to the [`config.context`](#configcontext) [parameter](#configpasscontext)
* the [`list`](#list-array-function--array) can still contain the [[Function] items](#1-function-items) or [[Array] items with functions](#2-array-function-items-for-individual-binding) next to this [Array] item with [String] method's names

```javascript
const displayData = function(){};
const workers = {
  addWorker: function(){},
  listEarnings: function(){}
};
const list = [ [workers, 'addWorker', 'listEarnings'], displayData ];
moveOn(list, config, onDone, onCatch));
```

### `config` **[Object | null]**
* the [Object] `config` argument allows to set the following **config properties**: <a href="#configtimeout">timeout</a>, [`bind`](#configbind), [`context`](#configcontext), [`passContext`](#configpasscontext)
* when the `config` is set to `null` or when it does not define the particular config property or when it defines the config property **incorrectly**, the **default value** is used for this config property **instead**
* any error is thrown when any config property is defined incorrectly *(the default value is used instead)*

<h4 name="configtimeout"><code>config.timeout</code></h4>

**Type:** [Number | null | Infinity]  
**Default:** `10000`  
**Description:**
* It must be a [Number] integer, equal or bigger than `0`, that indicates the **milliseconds**
* it behaves different for each method:
  1. [`moveOn`](#moveonlist-config-done-catch): The `config.timeout` starts out counting down **individually** for each chained function immediately after it is called. It expects **each function** to be [resolved](#chained-functions) or [rejected](#chained-functions) **before timeout** pass, otherwise it calls the [`catch`](#catchcontext-function) function with the **[timeout error](#timeout-error)** argument passed
  2. [`moveOn.all`](#moveonalllist-config-done-catch): The `config.timeout` starts out counting down **once for all** chained functions when the module is fired. It expects **all functions** to be [resolved](#chained-functions) or **any function** to be [rejected](#chained-functions) **before timeout** pass, otherwise it calls the [`catch`](#catchcontext-function) function with the **[timeout error](#timeout-error)** argument passed
  3. [`moveOn.each`](#moveoneachlist-config-done-catch): The `config.timeout` starts out counting down **once for all** chained functions when the module is fired. It expects **all functions** to be **either [resolved](#chained-functions) or [rejected](#chained-functions)** **before timeout** pass, otherwise it calls the [`catch`](#catchcontext-function) function with the **[timeout error](#timeout-error)** argument passed
  4. [`moveOn.first`](#moveonfirstlist-config-done-catch): The `config.timeout` starts out counting down **once for all** chained functions when the module is fired. It expects **at least one** function to be [resolved](#chained-functions) or **all functions** to be [rejected](#chained-functions) **before timeout** pass, otherwise it calls the [`catch`](#catchcontext-function) function with the **[timeout error](#timeout-error)** argument passed
* All [`resolves`](#chained-functions)s and [`reject`](#chained-functions)s that are called **after** the `config.timeout` pass **are ignored**
* When the `config.timeout` is set to `null` or `Infinity`, the timeout is **not set at all**. If any of the chained function does not [resolve](#chained-functions) *(or [reject](#chained-functions))*, anything happen then and the [`done`](#donereject-context-function) or [`catch`](#catchcontext-function) function is never called in the end
* When the `config.timeout` is not defined, or if it is defined with **incorrect** value, the **default** value is set instead

##### Timeout error
It is an [Error] object with the following properties, that allow to distinguish, that the **timeout** error has been passed:
  * `message`: *eg.* `"Timeout. The chained function did not respond in the expected time of 10000 ms."`
  * `info`: `"timeout"`
  * `code`: `"ETIMEDOUT"`


#### `config.context`  
**Type:** [any]  
**Default:** `{}`  
**Description:**
* The `config.context` refers to the object *(or value)*, that will be used as the `this` reference in all [`list`](#list-array-function--array) functions, [`done`](#donereject-context-function) and [`catch`](#catchcontext-function)
* It is usefull to transmit data between functions; eg. the [Object] `config.context`'s properties can be defined and got in any function
* The `config.context` can be **any value**, as any value can be used as the `this` reference in `Function.prototype.bind` [\[read more\]](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
* The `config.context` is used as the `this` reference by default, unless you set [`config.bind`](#configbind) to false
* The `config.context` is also accessible as the parameter, unless you set [`config.passContext`](#configpasscontext) to false

#### `config.passContext`
**Type:** [Boolean]  
**Default:** `true`  
**Description:**
* By default, the `config.context` object *(or value)* is passed through each [`list`](#list-array-function--array) function, the [`done`](#donereject-context-function) and [`catch`](#catchcontext-function) as the **argument**:
  * arguments passed through [`list`](#list-array-function--array) functions: {`0`: [`resolve`](#chained-functions), `1`: [`reject`](#chained-functions), `2`: [`context`](#configcontext)}
  * arguments passed through [`done`](#donereject-context-function) function: {`0`: [`reject`](#chained-functions), `1`: [`context`](#configcontext)}
  * arguments passed through [`catch`](#catchcontext-function) function: {`0`: [`context`](#configcontext)}
* In order not to pass the [`config.context`](#configcontext) as the argument, set `config.passContext` to `false`
* The [`config.context`](#configcontext) accessible as the parameter is usefull:
  * if the [`list`](#list-array-function--array) functions, [`done`](#donereject-context-function) or [`catch`](#catchcontext-function) are **arrow functions**, that are non-binding and cannot refer to the [`config.context`](#configcontext) via `this` keyword
  * if you compose the [`list`](#list-array-function--array) with **[individually bound](#2-array-function-items-for-individual-binding)** functions or **[methods names](#3-array-string-items-for-methods)**, that do not refer to the [`config.context`](#configcontext) via `this` keyword
  * if [`list`](#list-array-function--array) functions, [`done`](#donereject-context-function) or [`catch`](#catchcontext-function) are **already** bound

#### `config.bind`
**Type:** [Boolean]  
**Default:** `true`  
**Description:**
  * By default, each [`list`](#list-array-function--array) function, [`done`](#donereject-context-function) and [`catch`](#catchcontext-function) are bound to the [`config.context`](#configcontext) object *(or value)*, thus the `this` keyword refers to the [`config.context`](#configcontext)
  * In order to retain the former `this` reference of all functions, set the `config.bind` to `false`
  * In order to set the individual `this` reference for chosen functions, see the [`list`](#list-array-function--array) [constructing options](#2-array-function-items-for-individual-binding)
  * **keep in mind**, that arrow functions are non-binding and that already bound functions cannot have the `this` reference changed anymore

### done([`reject`](#chained-functions), [`context`](#configcontext)) **[Function]**
The `done` is a callback function, that *(in general)* is called as the last one, when the [`list`](#list-array-function--array) functions have been successfully executed. The `done` is called in a different way and time, depending on which method is called:
1. [`moveOn`](#moveonlist-config-done-catch) The `done` is called, when the last function from the [`list`](#list-array-function--array) collection is resolved.  
  The arguments passed through `done`:  
  `[0]` [`reject`](#chained-functions)  
  `[1]` [`config.context`](#configcontext)  
  `[2]`, `[3]`*, etc...* The arguments passed by the last resolved [`list`](#list-array-function--array) function 
2. [`moveOn.all`](#moveonalllist-config-done-catch) The `done` is called, when all [`list`](#list-array-function--array) functions are resolved.  
  The arguments passed through `done`:  
  `[0]` [`reject`](#chained-functions)  
  `[1]` [`config.context`](#configcontext)  
  `[2]` [`resolveMap`](#resolvemap-object)
3. [`moveOn.each`](#moveoneachlist-config-done-catch) The `done` is called, when all [`list`](#list-array-function--array) functions are either resolved or rejected.  
  The arguments passed through `done`:  
  `[0]` [`reject`](#chained-functions)  
  `[1]` [`config.context`](#configcontext)  
  `[2]` [`resolveMap`](#resolvemap-object)
4. [`moveOn.first`](#moveonfirstlist-config-done-catch) The `done` is called, when the first *(fastest)* [`list`](#list-array-function--array) function is resolved.  
  The arguments passed through `done`:  
  `[0]` [`reject`](#chained-functions)  
  `[1]` [`config.context`](#configcontext)  
  `[2]`, `[3]`*, etc...* The arguments passed by the first *(fastest)* resolved [`list`](#list-array-function--array) function 

#### `resolveMap` object
* The `resolveMap` object is passed through [`done`](#donereject-context-function) callback when the [`moveOn.all`](#moveonalllist-config-done-catch) and [`moveOn.each`](#moveoneachlist-config-done-catch) method is executed. It stores all arguments that have been passed by each [`list`](#list-array-function--array) function's [`resolve`](#chained-functions)  call.
* The `resolveMap` contains all **`arguments`** objects at the **indeces** that correspond to the order of [`list`](#list-array-function--array) functions calling; *the third [`list`](#list-array-function--array) function's arguments are accessible via `resolveMap[2]`, and so on...*
* The `resolveMap` properties:
  * `missing` It returns the [Array] list of those [`list`](#list-array-function--array) functions' indeces *(due to the order of calling)* that have not been resolved
* The `resolveMap` methods:
  * `forEach`  
    It loops through **each `arguments` object**.  
    It expects the `[0]` parameter to be the [Function] callback.  
    The [Function] callback is called for **each `arguments` object**.  
    The callback parameters: `{0: arguments, 1: argumentsIndex, 2: resolveMap}`  
    Usage: `resolveMap.forEach((arguments, argumentsIndex, resolveMap) => { } );`
  * `forAll`  
    It loops through **each item** *(argument)* of **each `arguments` object**.  
    It expects the `[0]` parameter to be the [Function] callback.  
    The [Function] callback is called for **each item** *(argument)*.  
    The callback parameters: `{0: argument, 1: argumentsIndex, 2: itemIndex, 3: resolveMap}`  
    Usage: `resolveMap.forAll((argument, argumentsIndex, itemIndex, resolveMap) => { } );`

### catch([`context`](#configcontext)) **[Function]**
The `catch` is a callback function, that *(in general)* is called as the last one, when the [`list`](#list-array-function--array) function(s) have failed. The `catch` is called in a different way and time, depending on which method is called:
1. [`moveOn`](#moveonlist-config-done-catch) The `catch` is called, when any [`list`](#list-array-function--array) function rejects.  
  The arguments passed through `catch`:  
  `[0]` [`config.context`](#configcontext)  
  `[1]`, `[2]`*, etc...* The arguments passed by the rejected [`list`](#list-array-function--array) function
2. [`moveOn.all`](#moveonalllist-config-done-catch) The `catch` is called, when any [`list`](#list-array-function--array) function rejects.  
  The arguments passed through `catch`:  
  `[0]` [`config.context`](#configcontext)  
  `[1]`, `[2]`*, etc...* The arguments passed by the rejected [`list`](#list-array-function--array) function
3. [`moveOn.each`](#moveoneachlist-config-done-catch) The `catch` is called for each [`list`](#list-array-function--array) function rejection.  
  The arguments passed through `catch`:  
  `[0]` [`config.context`](#configcontext)  
  `[1]`, `[2]`*, etc...* The arguments passed by the rejected [`list`](#list-array-function--array) function
4. [`moveOn.first`](#moveonfirstlist-config-done-catch) The `catch` is called, when all [`list`](#list-array-function--array) function rejected.  
  The arguments passed through `catch`:  
  `[0]` [`config.context`](#configcontext)  
  `[1]` [`rejectMap`](#rejectmap-object)

#### `rejectMap` object
* The `rejectMap` object is passed through [`catch`](#catchcontext-function) callback when the [`moveOn.first`](#moveonfirstlist-config-done-catch) method is executed. It stores all arguments that have been passed by all [`list`](#list-array-function--array) functions' [`reject`](#chained-functions) calls
* The `rejectMap` contains all **`arguments`** objects at the **indeces** that correspond to the order of [`list`](#list-array-function--array) functions calling; *the third [`list`](#list-array-function--array) function's arguments are accessible via `rejectMap[2]`, and so on...*
* The `rejectMap` methods:
  * `forEach`  
    It loops through **each `arguments` object**.  
    It expects the `[0]` parameter to be the [Function] callback.  
    The [Function] callback is called for **each `arguments` object**.  
    The callback parameters: `{0: arguments, 1: argumentsIndex, 2: rejectMap}`  
    Usage: `rejectMap.forEach((arguments, argumentsIndex, rejectMap) => { } );`
  * `forAll`  
    It loops through **each item** *(argument)* of **each `arguments` object**.  
    It expects the `[0]` parameter to be the [Function] callback.  
    The [Function] callback is called for **each item** *(argument)*.  
    The callback parameters: `{0: argument, 1: argumentsIndex, 2: itemIndex, 3: rejectMap}`  
    Usage: `rejectMap.forAll((argument, argumentsIndex, itemIndex, rejectMap) => { } );`


# Chained functions
* Each [`list`](#list-array-function--array) function is called with the following arguments passed:
  * `[0]` `resolve` callback function
  * `[1]` `reject` callback function
  * `[2]` [`config.context`](#configcontext) object *(or value)*
  * `[3]`, `[4]`*, etc...* *(for [`moveOn`](#moveonlist-config-done-catch) method only)* The arguments passed by the **previous** [`list`](#list-array-function--array) function
* Both `resolve` and `reject` can be called with any number of arguments
* When the `resolve` is called with arguments, these arguments will be passed:
  * [`moveOn`](#moveonlist-config-done-catch): for the further [`list`](#list-array-function--array) function *(or for the [`done`](#donereject-context-function) function, when the last [`list`](#list-array-function--array) function resolves)*
  * [`moveOn.first`](#moveonfirstlist-config-done-catch): for the [`done`](#donereject-context-function) function
  * [`moveOn.all`](#moveonalllist-config-done-catch), [`moveOn.each`](#moveoneachlist-config-done-catch): for the [`done`](#donereject-context-function) function in the [`resolveMap`](#resolvemap-object) object
* When the `reject` is called with arguments, these arguments will be passed:
  * [`moveOn`](#moveonlist-config-done-catch), [`moveOn.all`](#moveonalllist-config-done-catch), [`moveOn.each`](#moveoneachlist-config-done-catch): for the [`catch`](#catchcontext-function) function
  * [`moveOn.first`](#moveonfirstlist-config-done-catch): for the [`catch`](#catchcontext-function) function in the [`rejectMap`](#rejectmap-object) object

```javascript
function fetchData(resolve, reject, context){
  this.someAsyncAjaxHere((err, data) => {
    if(err) return reject(new Error('Could not read the data.'));
    this.data = data;
    return resolve();
  });
}
```

# Multiple [`resolve`](#chained-functions) | [`reject`](#chained-functions) calls
* **keep in mind** that both [`resolve`](#chained-functions) and [`reject`](#chained-functions) do not end function execution. In order to end function execution, use `return resolve();` or `return reject();`
* the [`moveOn.all`](#moveonalllist-config-done-catch), [`moveOn.each`](#moveoneachlist-config-done-catch) and [`moveOn.first`](#moveonfirstlist-config-done-catch) methods expect the [`list`](#list-array-function--array) functions to call [`resolve`](#chained-functions) or [`reject`](#chained-functions) **once**
* the **[`moveOn`](#moveonlist-config-done-catch)** method, as it calls the [`list`](#list-array-function--array) functions sequentially, accepts the multiple [`resolve`](#chained-functions) and [`reject`](#chained-functions) calls:
  * when the [`list`](#list-array-function--array) function calls the [`resolve`](#chained-functions) twice, it runs the further [`list`](#list-array-function--array) functions twice *(the forks are created)*; *the [`resolve`](#chained-functions) can be called eg. with different arguments*
  * when the [`list`](#list-array-function--array) function calls the [`reject`](#chained-functions) twice, it calls the [`catch`](#catchcontext-function) twice; *the [`reject`](#chained-functions) can be called eg. with different [Error] objects* 
  * when the [`list`](#list-array-function--array) function calls both [`resolve`](#chained-functions) and [`reject`](#chained-functions), it both runs the further [`list`](#list-array-function--array) functions and calls the [`catch`](#catchcontext-function)
#### inner `move-on` module
* the [`list`](#list-array-function--array) function can also contain the **inner** `move-on` module execution, that has the [`done`](#donereject-context-function) argument set to the [`resolve`](#chained-functions) callback of this [`list`](#list-array-function--array) function