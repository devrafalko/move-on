<h1>Description</h1>
<code>move-on</code> is a module that:
<ul>
  <li>executes the chosen functions
    <em>(synchronous and | or asynchronous)</em> in the chain <a href="#sample-sync-async">[sample]</a></li>
  <li>can be a
    <em>(really, really great)</em> alternative for
    <strong>Promises</strong>
  </li>
  <li>supports
    <strong>
      <a href="#config-timeout">timeout</a>
    </strong>
    <a href="#sample-all">[sample]</a> <a href="#sample-first">[sample]</a>
  </li>
  <li>contains
    <a href="#moveon-all-behaviour">four methods</a> that immitate the Promises'
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">
      <code>.all</code>
    </a> and
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race">
      <code>.race</code>
    </a> methods <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a> <a href="#sample-first">[sample]</a></li>
  <li>allows to set the
    <code>this</code> reference
    <strong>
      <a href="#config-context">inner context</a>
    </strong> for all functions in the chain to transmit data between functions <a href="#sample-context-arguments">[sample]</a> <a href="#sample-each-inner">[sample]</a> <a href="#sample-class-methods">[sample]</a></li>
</ul>
<p>Any bugs found? Give me to know on
  <a href="https://github.com/devrafalko/move-on">GitHub</a>.</p>
<h1>Usage</h1>
<h4>Node</h4>
<code>npm install move-on</code><br/><br/>

```javascript
const moveOn = require('move-on');
```

<h4>Browsers</h4>
<p>
  Add the <code>move-on.js</code> library to the HTML file.<br/>
  The library is located in <code>./dist/move-on.js</code> directory.<br/>
  It is a webpack&babel bundled cross-browser library version.<br/>
  The library is accessible as <code>moveOn</code> variable in the global <em>(window)</em> scope.<br/>

```html
<script src='move-on.js'></script>
<script>
  moveOn(list, config, onDone, onCatch);
</script>
```

<h1>Tests</h1>
<code>npm test</code>

```cmd
> git clone https://github.com/devrafalko/move-on.git
> cd move-on
> npm install
> npm test        //run tests in node
> npm test err    //run tests in node with failed specs shown
> npm test deep   //run tests in node with errors' descriptions shown
```

<h1>Simple sample</h1>

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

function onDone(reject, context){}
function onCatch(context){}
```
<h1>Methods short description</h1>
<p>The module's methods expect the [Array]
<a href="#list-argument">
  <code>list</code></a> of functions to be passed as the first argument. Each function in the chain has the
<a href="#chained-functions">
  <code>resolve</code>
</a> and
<a href="#chained-functions">
  <code>reject</code>
</a> parameter, that should be called when ready
<em>(or failed)</em> in order to move the functions execution forward. When the functions chain is successfully executed, the
<a href="#done-argument">
  <code>done</code>
</a> callback function is called finally, otherwise the
<a href="#catch-argument">
  <code>catch</code>
</a> callback function is called.</p>
<h4>1.
  <code>moveOn</code>
</h4>
<p>The chained functions are executed sequentially
<em>(one after another)</em>. Each function is expected to be
<a href="#chained-functions">
  <code>resolved</code>
</a>, so that the next chained function was executed. The
<a href="#done-argument">
  <code>done</code>
</a> function is called as the last one, when all previous chained functions resolved. The
<a href="#catch-argument">
  <code>catch</code>
</a> function is called instead of
<a href="#done-argument">
  <code>done</code>
</a> function, when at least one chained function failed
<em>(<a href="#chained-functions">rejected</a>)</em>.<br/>
<a href="#moveon-behaviour">See the full description below</a>.<br/>See the samples: <a href="#sample-sync-async">[sample]</a> <a href="#sample-context-arguments">[sample]</a> <a href="#sample-reject">[sample]</a> <a href="#sample-return-resolve">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a> <a href="#sample-class-methods">[sample]</a> <a href="#sample-email-validation">[sample]</a></p>
<h4>2.
  <code>moveOn.all</code>
</h4>
<p>The
<code>all</code> static method of
<code>move-on</code> module executes all chosen functions at the same time
<em>(similarly to Promises'
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">
    <code>.all</code>
  </a> method)</em>. All chained functions are expected to be
<a href="#chained-functions">
  <code>resolved</code>
</a> so that the final
<a href="#done-argument">
  <code>done</code>
</a> function was called. The
<a href="#catch-argument">
  <code>catch</code>
</a> function is called instead of
<a href="#done-argument">
  <code>done</code>
</a> function, when at least one chained function failed
<em>(<a href="#chained-functions">rejected</a>)</em>.<br/>
<a href="#moveon-all-behaviour">See the full description below</a>.<br/>See the samples: <a href="#sample-all">[sample]</a></p>
<h4>3.
  <code>moveOn.each</code>
</h4>
<p>The
<code>each</code> static method of
<code>move-on</code> module executes all chosen functions at the same time. Each chained function is expected to be either
<a href="#chained-functions">
  <code>resolved</code>
</a> or
<a href="#chained-functions">
  <code>rejected</code>
</a>, so that the final
<a href="#done-argument">
  <code>done</code>
</a> function was called. The failed
<em>(<a href="#chained-functions">rejected</a>)</em> function
<strong>does not stop</strong> the further functions execution. It can be used
<em>eg.</em> to log the warnings in the
<a href="#catch-argument">
  <code>catch</code>
</a> callback function.<br/>
<a href="#moveon-each-behaviour">See the full description below</a>.<br/>See the samples: <a href="#sample-each-inner">[sample]</a></p>
<h4>4.
  <code>moveOn.first</code>
</h4>
<p>The
<code>first</code> static method of
<code>move-on</code> module executes all chained functions at the same time. It expects the first
<em>(fastest)</em> function to be
<a href="#chained-functions">
  <code>resolved</code>
</a>, so that the
<a href="#done-argument">
  <code>done</code>
</a> function was called
<em>(similarly to Promises'
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race">
    <code>.race</code>
  </a> method)</em>. When
<strong>all</strong> functions failed
<em>(<a href="#chained-functions">rejected</a>)</em>, the
<a href="#catch-argument">
  <code>catch</code>
</a> function is called instead.<br/>
<a href="#moveon-first-behaviour">See the full description below</a>.<br/>See the samples: <a href="#sample-first">[sample]</a></p>
<h1>Methods behaviour</h1>
<h3 id="moveon-behaviour">moveOn(
  <a href="#list-argument">
    <code>list</code>
  </a>,
  <a href="#config-argument">
    <code>config</code>
  </a>,
  <a href="#done-argument">
    <code>done</code>
  </a>,
  <a href="#catch-argument">
    <code>catch</code>
  </a>)
</h3>
<ul>
  <li>The
    <code>move-on</code> module function executes the
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>sequentially</strong>
    <em>(one after another)</em> in the chain</li>
  <li>When one
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">resolves</a>
    </strong>, the next
    <a href="#list-argument">
      <code>list</code>
    </a> function is called,
    <em>and so on...</em>
  </li>
  <li>When the
    <strong>last</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">resolves</a>
    </strong>, the
    <a href="#done-argument">
      <code>done</code>
    </a> function is called
    <strong>once</strong>
    <em>(it
      <strong>ends up</strong> the module execution)</em>
  </li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">rejects</a>
    </strong>, the farther
    <a href="#list-argument">
      <code>list</code>
    </a> functions and the
    <a href="#done-argument">
      <code>done</code>
    </a> function are
    <strong>not called</strong> in the end</li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">rejects</a>
    </strong>, the
    <a href="#catch-argument">
      <code>catch</code>
    </a> function is called instead
    <strong>once</strong>
    <em>(it
      <strong>ends up</strong> the module execution)</em>
  </li>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function can be
    <strong>
      <a href="#chained-functions">resolved</a>
    </strong> and | or
    <strong>
      <a href="#chained-functions">rejected</a>
    </strong>
    <strong>multiple times</strong>. The forks of chain are created and executed then
    <a href="#multiple-calls">[read more]</a>
  </li>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function can execute the inner
    <code>move-on</code> module
    <a href="#inner-moveon-module">[read more]</a>
  </li>
  <li>
    Samples: <a href="#sample-sync-async">[sample]</a> <a href="#sample-context-arguments">[sample]</a> <a href="#sample-reject">[sample]</a> <a href="#sample-return-resolve">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a> <a href="#sample-class-methods">[sample]</a> <a href="#sample-email-validation">[sample]</a>
  </li>
</ul>
<h3 id="moveon-all-behaviour">moveOn.all(
  <a href="#list-argument">
    <code>list</code>
  </a>,
  <a href="#config-argument">
    <code>config</code>
  </a>,
  <a href="#done-argument">
    <code>done</code>
  </a>,
  <a href="#catch-argument">
    <code>catch</code>
  </a>)
</h3>
<ul>
  <li>
    <code>move-on</code>.<code>all</code> static method executes all the
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>simultaneously</strong>
    <em>(at the same time)</em>
  </li>
  <li>When one
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">resolves</a>
    </strong>, the
    <a href="#done-argument">
      <code>done</code>
    </a> is
    <strong>not called</strong> immediately</li>
  <li>The
    <a href="#done-argument">
      <code>done</code>
    </a> waits, till
    <strong>all</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> functions are
    <strong>
      <a href="#chained-functions">resolved</a>
    </strong>, to be called
    <em>(it
      <strong>ends up</strong> the module execution - after that, all
      <a href="#chained-functions">resolve</a> and
      <a href="#chained-functions">reject</a> calls are ignored)</em>
  </li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">rejects</a>
    </strong>, the
    <a href="#done-argument">
      <code>done</code>
    </a> function is
    <strong>not called</strong> in the end</li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">rejects</a>
    </strong>, the
    <a href="#catch-argument">
      <code>catch</code>
    </a> function is called instead
    <strong>once</strong>
    <em>(it
      <strong>ends up</strong> the module execution - after that, all
      <a href="#chained-functions">resolve</a> and
      <a href="#chained-functions">reject</a> calls are ignored)</em>
  </li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <a href="#chained-functions">resolves</a> and | or
    <a href="#chained-functions">rejects</a>
    <strong>multiple times</strong>, only the
    <strong>first</strong> call is respected
    <a href="#multiple-calls">[read more]</a>
  </li>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function can execute the inner
    <code>move-on</code> module
    <a href="#inner-moveon-module">[read more]</a>
  </li>
  <li>
    Samples: <a href="#sample-all">[sample]</a>
  </li>
</ul>
<h3 id="moveon-each-behaviour">moveOn.each(
  <a href="#list-argument">
    <code>list</code>
  </a>,
  <a href="#config-argument">
    <code>config</code>
  </a>,
  <a href="#done-argument">
    <code>done</code>
  </a>,
  <a href="#catch-argument">
    <code>catch</code>
  </a>)
</h3>
<ul>
  <li>
    <code>move-on</code>.<code>each</code> static method executes all the
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>simultaneously</strong>
    <em>(at the same time)</em>
  </li>
  <li>When one
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">resolves</a>
    </strong>, the
    <a href="#done-argument">
      <code>done</code>
    </a> is
    <strong>not called</strong> immediately</li>
  <li>The
    <code>done</code> waits, till
    <strong>each</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function is either
    <strong>
      <a href="#chained-functions">resolved</a>
    </strong> or
    <strong>
      <a href="#chained-functions">rejected</a>
    </strong>, to be called
    <em>(it
      <strong>ends up</strong> the module execution - after that, all
      <a href="#chained-functions">resolve</a> and
      <a href="#chained-functions">reject</a> calls are ignored)</em>
  </li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <strong>
      <a href="#chained-functions">rejects</a>
    </strong> and the
    <a href="#catch-argument">
      <code>catch</code>
    </a> is called, it
    <strong>does not end up</strong> the module execution</li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <a href="#chained-functions">resolves</a> and | or
    <a href="#chained-functions">rejects</a>
    <strong>multiple times</strong>, only the
    <strong>first</strong> call is respected
    <a href="#multiple-calls">[read more]</a>
  </li>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function can execute the inner
    <code>move-on</code> module
    <a href="#inner-moveon-module">[read more]</a>
  </li>
  <li>
    Samples: <a href="#sample-each-inner">[sample]</a>
  </li>
</ul>
<h3 id="moveon-first-behaviour">moveOn.first(
  <a href="#list-argument">
    <code>list</code>
  </a>,
  <a href="#config-argument">
    <code>config</code>
  </a>,
  <a href="#done-argument">
    <code>done</code>
  </a>,
  <a href="#catch-argument">
    <code>catch</code>
  </a>)
</h3>
<ul>
  </li>
  <li>
    <code>move-on</code>.<code>first</code> static method executes all the
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>simultaneously</strong>
    <em>(at the same time)</em>
  </li>
  <li>The
    <a href="#done-argument">
      <code>done</code>
    </a> waits, till
    <strong>the first</strong>
    <em>(fastest)</em>
    <a href="#list-argument">
      <code>list</code>
    </a> function is
    <strong>
      <a href="#chained-functions">resolved</a>
    </strong>, to be called
    <em>(it
      <strong>ends up</strong> the module execution - after that, all
      <a href="#chained-functions">resolve</a> and
      <a href="#chained-functions">reject</a> calls are ignored)</em>
  </li>
  <li>When
    <strong>all</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>
      <a href="#chained-functions">reject</a>
    </strong>, the
    <a href="#done-argument">
      <code>done</code>
    </a> function is
    <strong>not called</strong> in the end</li>
  <li>When
    <strong>all</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> functions
    <strong>
      <a href="#chained-functions">reject</a>
    </strong>, the
    <a href="#catch-argument">
      <code>catch</code>
    </a> function is called instead
    <strong>once</strong>
    <em>(it
      <strong>ends up</strong> the module execution - after that, all
      <a href="#chained-functions">resolve</a> and
      <a href="#chained-functions">reject</a> calls are ignored)</em>
  </li>
  <li>When
    <strong>whichever</strong>
    <a href="#list-argument">
      <code>list</code>
    </a> function
    <a href="#chained-functions">resolves</a> and | or
    <a href="#chained-functions">rejects</a>
    <strong>multiple times</strong>, only the
    <strong>first</strong> call is respected
    <a href="#multiple-calls">[read more]</a>
  </li>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function can execute the inner
    <code>move-on</code> module
    <a href="#inner-moveon-module">[read more]</a>
  </li>
  <li>
    Samples: <a href="#sample-first">[sample]</a>
  </li>
</ul>
<h1>Arguments</h1>
<ol>
  <li>
    <a href="#list-argument">
      <code>list</code>
    </a>
  </li>
  <li>
    <a href="#config-argument">
      <code>config</code>
    </a>
  </li>
  <li>
    <a href="#done-argument">
      <code>done</code>
    </a>
  </li>
  <li>
    <a href="#catch-argument">
      <code>catch</code>
    </a>
  </li>
</ol>
<h3 id="list-argument">
  <code>list</code>
  <strong>[Array: function | array]</strong>
</h3>
The [Array]
<code>list</code> stores the list of functions, that should be called. It can contain:
<ul>
  <li>[Function] items
    <a href="#list-mode-a">[see below]</a> <a href="#sample-sync-async">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a> <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a>
    <br/>
    <code>const list = [fnA, fnB, fnC];</code>
  </li>
  <li>or [Array] items that store the [Function] items
    <a href="#list-mode-b">[see below]</a>
    <br/>
    <code>const list = [fnA, [obj, fnB, fnC], fnD]</code>
  </li>
  <li>or [Array] items that store the [String] names of methods
    <a href="#list-mode-c">[see below]</a> <a href="#sample-email-validation">[sample]</a>
    <br/>
    <code>const list = [fnA, [obj, 'fnB', 'fnC'], fnD]</code>
  </li>
</ul>
<h4 id="list-mode-a">1. [Function] items</h4>
<ul>
  <li>The [Array]
    <code>list</code> can contain [Function] items. It may be function, arrow function or object's method</li>
  <li>All functions are
    <a href="#config-bind">bound</a> by default to the
    <a href="#config-context">
      <code>config.context</code>
    </a> reference
    <em>(except arrow functions and already bound functions
      <a href="#config-bind">[read more]</a>)</em>
  </li>
  <li>
    Samples: <a href="#sample-sync-async">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a> <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a>
  </li>
</ul>

```javascript
const retrieveData = function(){};
const computeData = ()=>{};
const displayData = { display:()=>{} };
const list = [retrieveData, computeData, displayData.display];
```
<p></p>
<h4 id="list-mode-b">2. [Array: function] items for individual binding</h4>
<ul>
  <li>All chained functions are
    <a href="#config-bind">bound</a> by default to the
    <a href="#config-context">
      <code>config.context</code>
    </a> reference</li>
  <li>You can set the
    <strong>individual</strong>
    <code>this</code> reference for the chosen functions
    <em>(except arrow functions and already bound functions
      <a href="#config-bind">[read more]</a>)</em>
  </li>
  <li>In order to bind the chained functions individually, push [Array] item into the
    <a href="#list-argument">
      <code>list</code>
    </a>:
    <ul>
      <li>The
        <code>[0]</code> item should indicate the
        <strong>object</strong> or value to be the
        <code>this</code> reference for the functions</li>
      <li>The
        <code>[1]</code>,
        <code>[2]</code>
        <em>, etc...</em> item(s) should indicate the
        <strong>function(s)</strong>, that will be bound to the
        <code>[0]</code> object or value</li>
    </ul>
  </li>
  <li>The [Array] item's functions are bound to the given
    <code>[0]</code> object or value instead of the
    <a href="#config-context">
      <code>config.context</code>
    </a>
  </li>
  <li>The
    <a href="#config-bind">
      <code>config.bind</code>
    </a> setting does not affect the individual
    <code>this</code> reference setting</li>
  <li>The [Array] item's functions still have the access to the
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <a href="#config-passcontext">parameter</a>
  </li>
  <li>the
    <a href="#list-argument">
      <code>list</code>
    </a> can still contain the
    <a href="#list-mode-a">[Function] items</a> next to this [Array] item</li>
</ul>

```javascript
const workers = {}, earnings = {}, tasks = {};
const config = {context: tasks}; //the default this reference
const list = [
  functionA, //this === tasks
  [workers, functionB], //this === workers
  [earnings, functionC] //this === earnings
];
moveOn(list, config, onDone, onCatch));
```
<p></p>
<h4 id="list-mode-c">3. [Array: string] items for methods</h4>
The methods passed to the
<a href="#list-argument">
  <code>list</code>
</a> loses their
<code>this</code> reference to the object, they were declared in, what may be undesirable.

```javascript
const workers = {
  addWorker: function(){},
  listEarnings: function(){}
};
const list = [
  workers.addWorker, //this !== workers
  workers.listEarnings //this !== workers
];
```

<ul>
  <li>to retain the
    <code>this</code> reference to the object, that the methods are declared in, push [Array] item with methods' [String] names into the
    <a
      href="#list-argument">
      <code>list</code>
    </a>:
    <ul>
      <li>The
        <code>[0]</code> item should indicate the
        <strong>object</strong>, that the methods are declared in</li>
      <li>The
        <code>[1]</code>,
        <code>[2]</code>
        <em>, etc...</em> item(s) should indicate the [String]
        <strong>name(s)</strong> of the method(s) declared in the
        <code>[0]</code> object</li>
    </ul>
  </li>
  <li>These methods retain the
    <code>this</code> reference to the
    <code>[0]</code> object and are not
    <a href="#config-bind">bound</a> to the
    <a href="#config-context">
      <code>config.context</code>
    </a>
  </li>
  <li>The
    <a href="#config-bind">
      <code>config.bind</code>
    </a> setting does not affect the
    <code>this</code> reference</li>
  <li>The [Array] item functions still have the access to the
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <a href="#config-passcontext">parameter</a>
  </li>
  <li>the
    <a href="#list-argument">
      <code>list</code>
    </a> can still contain the
    <a href="#list-mode-a">[Function] items</a> or
    <a href="#list-mode-b">[Array] items with functions</a> next to this [Array] item with [String] method's names</li>
  <li>Samples: <a href="#sample-email-validation">[sample]</a></li>
</ul>

```javascript
const displayData = function(){};
const workers = {
  addWorker: function(){},
  listEarnings: function(){}
};
const list = [ [workers, 'addWorker', 'listEarnings'], displayData ];

moveOn(list, config, onDone, onCatch));
```
<p></p>
<h3 id="config-argument">
  <code>config</code>
  <strong>[Object | null]</strong>
</h3>
<ul>
  <li>the [Object]
    <code>config</code> argument allows to set the following
    <strong>config properties</strong>:
    <a href="#config-timeout">
      <code>timeout</code>
    </a>,
    <a href="#config-bind">
      <code>bind</code>
    </a>,
    <a href="#config-context">
      <code>context</code>
    </a>,
    <a href="#config-passcontext">
      <code>passContext</code>
    </a>
  </li>
  <li>when the
    <code>config</code> is set to
    <code>null</code> or when it does not define the particular config property or when it defines the config property
    <strong>incorrectly</strong>, the
    <strong>default value</strong> is used for this config property
    <strong>instead</strong> <a href="#sample-reject">[sample]</a> <a href="#sample-return-resolve">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a>
  </li>
  <li>any error is thrown when any config property is defined incorrectly
    <em>(the default value is used instead)</em>
  </li>
</ul>
<h4 id="config-timeout">
  <code>config.timeout</code>
</h4>
<strong>Type:</strong> [Number | null | Infinity]</br>
<strong>Default:</strong>
<code>10000</code>
<br/>
<strong>Description:</strong>
<br/>
<ul>
  <li>It must be a [Number] integer, equal or bigger than
    <code>0</code>, that indicates the
    <strong>milliseconds</strong>
  </li>
  <li>it behaves different for each method:
    <ol>
      <li>
        <a href="#moveon-behaviour">
          <code>moveOn</code>
        </a>:<br/>The
        <code>config.timeout</code> starts out counting down
        <strong>individually</strong> for each chained function immediately after it is called.<br/>It expects
        <strong>each function</strong> to be
        <a href="#chained-functions">resolved</a> or
        <a href="#chained-functions">rejected</a>
        <strong>before timeout</strong> pass,<br/>otherwise it calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function with the
        <strong>
          <a href="#timeout-error">timeout error</a>
        </strong> argument passed</li>
      <li>
        <a href="#moveon-all-behaviour">
          <code>moveOn.all</code>
        </a>:<br/>The
        <code>config.timeout</code> starts out counting down
        <strong>once for all</strong> chained functions when the module is fired.<br/>It expects
        <strong>all functions</strong> to be
        <a href="#chained-functions">resolved</a> or
        <strong>any function</strong> to be
        <a href="#chained-functions">rejected</a>
        <strong>before timeout</strong> pass,<br/>otherwise it calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function with the
        <strong>
          <a href="#timeout-error">timeout error</a>
        </strong> argument passed</li>
      <li>
        <a href="#moveon-each-behaviour">
          <code>moveOn.each</code>
        </a>:<br/>The
        <code>config.timeout</code> starts out counting down
        <strong>once for all</strong> chained functions when the module is fired.<br/>It expects
        <strong>all functions</strong> to be
        <strong>either
          <a href="#chained-functions">resolved</a> or
          <a href="#chained-functions">rejected</a>
        </strong>
        <strong>before timeout</strong> pass,<br/>otherwise it calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function with the
        <strong>
          <a href="#timeout-error">timeout error</a>
        </strong> argument passed</li>
      <li>
        <a href="#moveon-first-behaviour">
          <code>moveOn.first</code>
        </a>:<br/>The
        <code>config.timeout</code> starts out counting down
        <strong>once for all</strong> chained functions when the module is fired.<br/>It expects
        <strong>at least one</strong> function to be
        <a href="#chained-functions">resolved</a> or
        <strong>all functions</strong> to be
        <a href="#chained-functions">rejected</a>
        <strong>before timeout</strong> pass,<br/>otherwise it calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function with the
        <strong>
          <a href="#timeout-error">timeout error</a>
        </strong> argument passed</li>
    </ol>
  </li>
  <li>All
    <a href="#chained-functions">
      <code>resolves</code>
    </a>s and
    <a href="#chained-functions">
      <code>reject</code>
    </a>s that are called
    <strong>after</strong> the
    <code>config.timeout</code> pass
    <strong>are ignored</strong>
  </li>
  <li>When the
    <code>config.timeout</code> is set to
    <code>null</code> or
    <code>Infinity</code>, the timeout is
    <strong>not set at all</strong>. If any of the chained function does not
    <a href="#chained-functions">resolve</a>
    <em>(or <a href="#chained-functions">reject</a>)</em>, anything happen then and the
    <a href="#done-argument">
      <code>done</code>
    </a> or
    <a href="#catch-argument">
      <code>catch</code>
    </a> function is never called in the end</li>
  <li>When the
    <code>config.timeout</code> is not defined, or if it is defined with
    <strong>incorrect</strong> value, the
    <strong>default</strong> value is set instead</li>
  <li>Samples: <a href="#sample-all">[sample]</a> <a href="#sample-first">[sample]</a></li>
</ul>
<h5 id="timeout-error">Timeout error</h5>
It is an [Error] object with the following properties, that allow to distinguish, that the
<strong>timeout</strong> error has been passed:
<ul>
  <li>
    <code>message</code>:
    <em>eg.</em>
    <code>"Timeout. The chained function did not respond in the expected time of 10000 ms."</code>
  </li>
  <li>
    <code>info</code>:
    <code>"timeout"</code>
  </li>
  <li>
    <code>code</code>:
    <code>"ETIMEDOUT"</code>
  </li>
</ul>
<h4 id="config-context">
  <code>config.context</code>
</h4>
<strong>Type:</strong> [any]
<br/>
<strong>Default:</strong>
<code>{}</code>
<br/>
<strong>Description:</strong>
<br/>

<ul>
  <li>The
    <code>config.context</code> refers to the object
    <em>(or value)</em>, that will be used as the
    <code>this</code> reference in all
    <a href="#list-argument">
      <code>list</code>
    </a> functions,
    <a href="#done-argument">
      <code>done</code>
    </a> and
    <a href="#catch-argument">
      <code>catch</code>
    </a>
  </li>
  <li>It is usefull to transmit data between functions; <em>eg. the [Object]
    <code>config.context</code>'s properties can be defined and got in any function</em></li>
  <li>The
    <code>config.context</code> can be
    <strong>any value</strong>, as any value can be used as the
    <code>this</code> reference in
    <code>Function.prototype.bind</code>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">[read more]</a>
  </li>
  <li>The
    <code>config.context</code> is used as the
    <code>this</code> reference by default, unless you set
    <a href="#config-bind">
      <code>config.bind</code>
    </a> to false</li>
  <li>The
    <code>config.context</code> is also accessible as the parameter, unless you set
    <a href="#config-passcontext">
      <code>config.passContext</code>
    </a> to false</li>
  <li>Samples: <a href="#sample-context-arguments">[sample]</a> <a href="#sample-each-inner">[sample]</a> <a href="#sample-class-methods">[sample]</a></li>
</ul>
<h4 id="config-passcontext">
  <code>config.passContext</code>
</h4>
<strong>Type:</strong> [Boolean]
<br/>
<strong>Default:</strong>
<code>true</code>
<br/>
<strong>Description:</strong>

<ul>
  <li>By default, the
    <code>config.context</code> object
    <em>(or value)</em> is passed through each
    <a href="#list-argument">
      <code>list</code>
    </a> function, the
    <a href="#done-argument">
      <code>done</code>
    </a> and
    <a href="#catch-argument">
      <code>catch</code>
    </a> as the
    <strong>argument</strong>:
    <ul>
      <li>arguments passed through
        <a href="#list-argument">
          <code>list</code>
        </a> functions: {
        <code>0</code>:
        <a href="#chained-functions">
          <code>resolve</code>
        </a>,
        <code>1</code>:
        <a href="#chained-functions">
          <code>reject</code>
        </a>,
        <code>2</code>:
        <a href="#config-context">
          <code>context</code>
        </a>}</li>
      <li>arguments passed through
        <a href="#done-argument">
          <code>done</code>
        </a> function: {
        <code>0</code>:
        <a href="#chained-functions">
          <code>reject</code>
        </a>,
        <code>1</code>:
        <a href="#config-context">
          <code>context</code>
        </a>}</li>
      <li>arguments passed through
        <a href="#catch-argument">
          <code>catch</code>
        </a> function: {
        <code>0</code>:
        <a href="#config-context">
          <code>context</code>
        </a>}</li>
    </ul>
  </li>
  <li>In order not to pass the
    <a href="#config-context">
      <code>config.context</code>
    </a> as the argument, set
    <code>config.passContext</code> to
    <code>false</code>
  </li>
  <li>The
    <a href="#config-context">
      <code>config.context</code>
    </a> accessible as the parameter is usefull:
    <ul>
      <li>if the
        <a href="#list-argument">
          <code>list</code>
        </a> functions,
        <a href="#done-argument">
          <code>done</code>
        </a> or
        <a href="#catch-argument">
          <code>catch</code>
        </a> are
        <strong>arrow functions</strong>, that are non-binding and cannot refer to the
        <a href="#config-context">
          <code>config.context</code>
        </a> via
        <code>this</code> keyword</li>
      <li>if you compose the
        <a href="#list-argument">
          <code>list</code>
        </a> with
        <strong>
          <a href="#list-mode-b">individually bound</a>
        </strong> functions or
        <strong>
          <a href="#list-mode-c">methods names</a>
        </strong>, that do not refer to the
        <a href="#config-context">
          <code>config.context</code>
        </a> via
        <code>this</code> keyword</li>
      <li>if
        <a href="#list-argument">
          <code>list</code>
        </a> functions,
        <a href="#done-argument">
          <code>done</code>
        </a> or
        <a href="#catch-argument">
          <code>catch</code>
        </a> are
        <strong>already</strong> bound</li>
    </ul>
  </li>
  <li>Samples: <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a></li>
</ul>
<h4 id="config-bind">
  <code>config.bind</code>
</h4>
<strong>Type:</strong> [Boolean]
<br/>
<strong>Default:</strong>
<code>true</code>
<br/>
<strong>Description:</strong>
<ul>
  <li>By default, each
    <a href="#list-argument">
      <code>list</code>
    </a> function,
    <a href="#done-argument">
      <code>done</code>
    </a> and
    <a href="#catch-argument">
      <code>catch</code>
    </a> are bound to the
    <a href="#config-context">
      <code>config.context</code>
    </a> object
    <em>(or value)</em>, thus the
    <code>this</code> keyword refers to the
    <a href="#config-context">
      <code>config.context</code>
    </a>
  </li>
  <li>In order to retain the former
    <code>this</code> reference of all functions, set the
    <code>config.bind</code> to
    <code>false</code>
  </li>
  <li>In order to set the individual
    <code>this</code> reference for chosen functions, see the
    <a href="#list-argument">
      <code>list</code>
    </a>
    <a href="#list-mode-b">constructing options</a>
  </li>
  <li>
    <strong>keep in mind</strong>, that arrow functions are non-binding and that already bound functions cannot have the
    <code>this</code> reference changed anymore</li>
</ul>
<h3 id="done-argument">done(
  <a href="#chained-functions">
    <code>reject</code>
  </a>,
  <a href="#config-context">
    <code>context</code>
  </a>)
  <strong>[Function]</strong>
</h3>
The
<code>done</code> is a callback function, that
<em>(in general)</em> is called as the last one, when the
<a href="#list-argument">
  <code>list</code>
</a> functions have been successfully executed. The
<code>done</code> is called in a different way and time, depending on which method is called:
<ol>
  <li>
    <a href="#moveon-behaviour">
      <code>moveOn</code>
    </a> The
    <code>done</code> is called, when the last function from the
    <a href="#list-argument">
      <code>list</code>
    </a> collection is resolved.
    <br/> The arguments passed through
    <code>done</code>:
    <br/>
    <code>[0]</code>
    <a href="#chained-functions">
      <code>reject</code>
    </a>
    <br/>
    <code>[1]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[2]</code>,
    <code>[3]</code>
    <em>, etc...</em> The arguments passed by the last resolved
    <a href="#list-argument">
      <code>list</code>
    </a> function </li>
  <li>
    <a href="#moveon-all-behaviour">
      <code>moveOn.all</code>
    </a> The
    <code>done</code> is called, when all
    <a href="#list-argument">
      <code>list</code>
    </a> functions are resolved.
    <br/> The arguments passed through
    <code>done</code>:
    <br/>
    <code>[0]</code>
    <a href="#chained-functions">
      <code>reject</code>
    </a>
    <br/>
    <code>[1]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[2]</code>
    <a href="#resolvemap">
      <code>resolveMap</code>
    </a>
  </li>
  <li>
    <a href="#moveon-each-behaviour">
      <code>moveOn.each</code>
    </a> The
    <code>done</code> is called, when all
    <a href="#list-argument">
      <code>list</code>
    </a> functions are either resolved or rejected.
    <br/> The arguments passed through
    <code>done</code>:
    <br/>
    <code>[0]</code>
    <a href="#chained-functions">
      <code>reject</code>
    </a>
    <br/>
    <code>[1]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[2]</code>
    <a href="#resolvemap">
      <code>resolveMap</code>
    </a>
  </li>
  <li>
    <a href="#moveon-first-behaviour">
      <code>moveOn.first</code>
    </a> The
    <code>done</code> is called, when the first
    <em>(fastest)</em>
    <a href="#list-argument">
      <code>list</code>
    </a> function is resolved.
    <br/> The arguments passed through
    <code>done</code>:
    <br/>
    <code>[0]</code>
    <a href="#chained-functions">
      <code>reject</code>
    </a>
    <br/>
    <code>[1]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[2]</code>,
    <code>[3]</code>
    <em>, etc...</em> The arguments passed by the first
    <em>(fastest)</em> resolved
    <a href="#list-argument">
      <code>list</code>
    </a> function </li>
</ol>
<h4 id="resolvemap">
  <code>resolveMap</code> object</h4>
<ul>
  <li>The
    <code>resolveMap</code> object is passed through
    <a href="#done-argument">
      <code>done</code>
    </a> callback when the
    <a href="#moveon-all-behaviour">
      <code>moveOn.all</code>
    </a> and
    <a href="#moveon-each-behaviour">
      <code>moveOn.each</code>
    </a> method is executed. It stores all arguments that have been passed by each
    <a href="#list-argument">
      <code>list</code>
    </a> function's
    <a href="#chained-functions">
      <code>resolve</code>
    </a> call.</li>
  <li>The
    <code>resolveMap</code> contains all
    <strong>
      <code>arguments</code>
    </strong> objects at the
    <strong>indeces</strong> that correspond to the order of
    <a href="#list-argument">
      <code>list</code>
    </a> functions calling;
    <em>the third
      <a href="#list-argument">
        <code>list</code>
      </a> function's arguments are accessible via
      <code>resolveMap[2]</code>, and so on...</em>
  </li>
  <li>The
    <code>resolveMap</code> properties:
    <ul>
      <li>
        <code>missing</code> It returns the [Array] list of those
        <a href="#list-argument">
          <code>list</code>
        </a> functions' indeces
        <em>(due to the order of calling)</em> that have not been resolved</li>
    </ul>
  </li>
  <li>The
    <code>resolveMap</code> methods:
    <ul>
      <li>
        <code>forEach</code>
        <br/> It loops through
        <strong>each
          <code>arguments</code> object</strong>.
        <br/> It expects the
        <code>[0]</code> parameter to be the [Function] callback.
        <br/> The [Function] callback is called for
        <strong>each
          <code>arguments</code> object</strong>.
        <br/> The callback parameters:
        <code>{0: arguments, 1: argumentsIndex, 2: resolveMap}</code>
        <br/> Usage:
        <code>resolveMap.forEach((arguments, argumentsIndex, resolveMap) => {} );</code>
      </li>
      <li>
        <code>forAll</code>
        <br/> It loops through
        <strong>each item</strong>
        <em>(argument)</em> of
        <strong>each
          <code>arguments</code> object</strong>.
        <br/> It expects the
        <code>[0]</code> parameter to be the [Function] callback.
        <br/> The [Function] callback is called for
        <strong>each item</strong>
        <em>(argument)</em>.
        <br/> The callback parameters:
        <code>{0: argument, 1: argumentsIndex, 2: itemIndex, 3: resolveMap}</code>
        <br/> Usage:
        <code>resolveMap.forAll((argument, argumentsIndex, itemIndex, resolveMap) => {} );</code>
      </li>
    </ul>
  </li>
  <li>Samples: <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a></li>
</ul>
<h3 id="catch-argument">catch(
  <a href="#config-context">
    <code>context</code>
  </a>)
  <strong>[Function]</strong>
</h3>
The
<code>catch</code> is a callback function, that
<em>(in general)</em> is called as the last one, when the
<a href="#list-argument">
  <code>list</code>
</a> function(s) have failed. The
<code>catch</code> is called in a different way and time, depending on which method is called:
<ol>
  <li>
    <a href="#moveon-behaviour">
      <code>moveOn</code>
    </a> The
    <code>catch</code> is called, when any
    <a href="#list-argument">
      <code>list</code>
    </a> function rejects.
    <br/> The arguments passed through
    <code>catch</code>:
    <br/>
    <code>[0]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[1]</code>,
    <code>[2]</code>
    <em>, etc...</em> The arguments passed by the rejected
    <a href="#list-argument">
      <code>list</code>
    </a> function</li>
  <li>
    <a href="#moveon-all-behaviour">
      <code>moveOn.all</code>
    </a> The
    <code>catch</code> is called, when any
    <a href="#list-argument">
      <code>list</code>
    </a> function rejects.
    <br/> The arguments passed through
    <code>catch</code>:
    <br/>
    <code>[0]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[1]</code>,
    <code>[2]</code>
    <em>, etc...</em> The arguments passed by the rejected
    <a href="#list-argument">
      <code>list</code>
    </a> function</li>
  <li>
    <a href="#moveon-each-behaviour">
      <code>moveOn.each</code>
    </a> The
    <code>catch</code> is called for each
    <a href="#list-argument">
      <code>list</code>
    </a> function rejection.
    <br/> The arguments passed through
    <code>catch</code>:
    <br/>
    <code>[0]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[1]</code>,
    <code>[2]</code>
    <em>, etc...</em> The arguments passed by the rejected
    <a href="#list-argument">
      <code>list</code>
    </a> function</li>
  <li>
    <a href="#moveon-first-behaviour">
      <code>moveOn.first</code>
    </a> The
    <code>catch</code> is called, when all
    <a href="#list-argument">
      <code>list</code>
    </a> function rejected.
    <br/> The arguments passed through
    <code>catch</code>:
    <br/>
    <code>[0]</code>
    <a href="#config-context">
      <code>config.context</code>
    </a>
    <br/>
    <code>[1]</code>
    <a href="#rejectmap">
      <code>rejectMap</code>
    </a>
  </li>
</ol>
<h4 id="rejectmap">
  <code>rejectMap</code> object</h4>
<ul>
  <li>The
    <code>rejectMap</code> object is passed through
    <a href="#catch-argument">
      <code>catch</code>
    </a> callback when the
    <a href="#moveon-first-behaviour">
      <code>moveOn.first</code>
    </a> method is executed. It stores all arguments that have been passed by all
    <a href="#list-argument">
      <code>list</code>
    </a> functions'
    <a href="#chained-functions">
      <code>reject</code>
    </a> calls</li>
  <li>The
    <code>rejectMap</code> contains all
    <strong>
      <code>arguments</code>
    </strong> objects at the
    <strong>indeces</strong> that correspond to the order of
    <a href="#list-argument">
      <code>list</code>
    </a> functions calling;
    <em>the third
      <a href="#list-argument">
        <code>list</code>
      </a> function's arguments are accessible via
      <code>rejectMap[2]</code>, and so on...</em>
  </li>
  <li>The
    <code>rejectMap</code> methods:
    <ul>
      <li>
        <code>forEach</code>
        <br/> It loops through
        <strong>each
          <code>arguments</code> object</strong>.
        <br/> It expects the
        <code>[0]</code> parameter to be the [Function] callback.</br>
        The [Function] callback is called for
        <strong>each
          <code>arguments</code> object</strong>.
        <br/> The callback parameters:
        <code>{0: arguments, 1: argumentsIndex, 2: rejectMap}</code>
        <br/> Usage:
        <code>rejectMap.forEach((arguments, argumentsIndex, rejectMap) => {} );</code>
      </li>
      <li>
        <code>forAll</code>
        <br/> It loops through
        <strong>each item</strong>
        <em>(argument)</em> of
        <strong>each
          <code>arguments</code> object</strong>.</br>
        It expects the
        <code>[0]</code> parameter to be the [Function] callback.
        <br/> The [Function] callback is called for
        <strong>each item</strong>
        <em>(argument)</em>.
        <br/> The callback parameters:
        <code>{0: argument, 1: argumentsIndex, 2: itemIndex, 3: rejectMap}</code>
        <br/> Usage:
        <code>rejectMap.forAll((argument, argumentsIndex, itemIndex, rejectMap) => {} );</code>
      </li>
    </ul>
  </li>
</ul>
<h1 id="chained-functions">Chained functions</h1>
<ul>
  <li>Each
    <a href="#list-argument">
      <code>list</code>
    </a> function is called with the following arguments passed:
    <ul>
      <li>
        <code>[0]</code>
        <code>resolve</code> callback function</li>
      <li>
        <code>[1]</code>
        <code>reject</code> callback function</li>
      <li>
        <code>[2]</code>
        <a href="#config-context">
          <code>config.context</code>
        </a> object
        <em>(or value)</em>
      </li>
      <li>
        <code>[3]</code>,
        <code>[4]</code>
        <em>, etc...</em>
        <em>(for
          <a href="#moveon-behaviour">
            <code>moveOn</code>
          </a> method only)</em> The arguments passed by the
        <strong>previous</strong>
        <a href="#list-argument">
          <code>list</code>
        </a> function</li>
    </ul>
  </li>
  <li>Both
    <code>resolve</code> and
    <code>reject</code> can be called with any number of arguments <a href="#sample-context-arguments">[sample]</a> <a href="#sample-all">[sample]</a> <a href="#sample-each-inner">[sample]</a> <a href="#sample-first">[sample]</a>
  </li>
  <li>When the
    <code>resolve</code> is called with arguments, these arguments will be passed:
    <ul>
      <li>
        <a href="#moveon-behaviour">
          <code>moveOn</code>
        </a>: for the further
        <a href="#list-argument">
          <code>list</code>
        </a> function
        <em>(or for the
          <a href="#done-argument">
            <code>done</code>
          </a> function, when the last
          <a href="#list-argument">
            <code>list</code>
          </a> function resolves)</em>
      </li>
      <li>
        <a href="#moveon-first-behaviour">
          <code>moveOn.first</code>
        </a>: for the
        <a href="#done-argument">
          <code>done</code>
        </a> function</li>
      <li>
        <a href="#moveon-all-behaviour">
          <code>moveOn.all</code>
        </a>,
        <a href="#moveon-each-behaviour">
          <code>moveOn.each</code>
        </a>: for the
        <a href="#done-argument">
          <code>done</code>
        </a> function in the
        <a href="#resolvemap">
          <code>resolveMap</code>
        </a> object</li>
    </ul>
  </li>
  <li>When the
    <code>reject</code> is called with arguments, these arguments will be passed:
    <ul>
      <li>
        <a href="#moveon-behaviour">
          <code>moveOn</code>
        </a>,
        <a href="#moveon-all-behaviour">
          <code>moveOn.all</code>
        </a>,
        <a href="#moveon-each-behaviour">
          <code>moveOn.each</code>
        </a>: for the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function</li>
      <li>
        <a href="#moveon-first-behaviour">
          <code>moveOn.first</code>
        </a>: for the
        <a href="#catch-argument">
          <code>catch</code>
        </a> function in the
        <a href="#rejectmap">
          <code>rejectMap</code>
        </a> object</li>
    </ul>
  </li>
</ul>

```javascript
function fetchData(resolve, reject, context){
  this.someAsyncAjaxHere((err, data) => {
    if(err) return reject(new Error('Could not read the data.'));
    this.data = data;
    return resolve();
  });
}
```
<p></p>
<h1 id="multiple-calls">Multiple
  <a href="#chained-functions">
    <code>resolve</code>
  </a> |
  <a href="#chained-functions">
    <code>reject</code>
  </a> calls</h1>
<ul>
  <li>
    <strong>keep in mind</strong> that both
    <a href="#chained-functions">
      <code>resolve</code>
    </a> and
    <a href="#chained-functions">
      <code>reject</code>
    </a> do not end function execution. In order to end function execution, use
    <code>return resolve();</code> or
    <code>return reject();</code>
  </li>
  <li>the
    <a href="#moveon-all-behaviour">
      <code>moveOn.all</code>
    </a>,
    <a href="#moveon-each-behaviour">
      <code>moveOn.each</code>
    </a> and
    <a href="#moveon-first-behaviour">
      <code>moveOn.first</code>
    </a> methods expect the
    <a href="#list-argument">
      <code>list</code>
    </a> functions to call
    <a href="#chained-functions">
      <code>resolve</code>
    </a> or
    <a href="#chained-functions">
      <code>reject</code>
    </a>
    <strong>once</strong>
  </li>
  <li>the
    <strong>
      <a href="#moveon-behaviour">
        <code>moveOn</code>
      </a>
    </strong> method, as it calls the
    <a href="#list-argument">
      <code>list</code>
    </a> functions sequentially, accepts the multiple
    <a href="#chained-functions">
      <code>resolve</code>
    </a> and
    <a href="#chained-functions">
      <code>reject</code>
    </a> calls:
    <ul>
      <li>when the
        <a href="#list-argument">
          <code>list</code>
        </a> function calls the
        <a href="#chained-functions">
          <code>resolve</code>
        </a> twice, it runs the further
        <a href="#list-argument">
          <code>list</code>
        </a> functions twice
        <em>(the forks are created)</em>;
        <em>the
          <a href="#chained-functions">
            <code>resolve</code>
          </a> can be called eg. with different arguments</em>
      </li>
      <li>when the
        <a href="#list-argument">
          <code>list</code>
        </a> function calls the
        <a href="#chained-functions">
          <code>reject</code>
        </a> twice, it calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a> twice;
        <em>the
          <a href="#chained-functions">
            <code>reject</code>
          </a> can be called eg. with different [Error] objects</em>
      </li>
      <li>when the
        <a href="#list-argument">
          <code>list</code>
        </a> function calls both
        <a href="#chained-functions">
          <code>resolve</code>
        </a> and
        <a href="#chained-functions">
          <code>reject</code>
        </a>, it both runs the further
        <a href="#list-argument">
          <code>list</code>
        </a> functions and calls the
        <a href="#catch-argument">
          <code>catch</code>
        </a>
      </li>
    </ul>
  </li>
  <li>Samples: <a href="#sample-return-resolve">[sample]</a> <a href="#sample-multiple-resolve">[sample]</a></li>
</ul>
<h4 id="inner-moveon-module">inner
  <code>move-on</code> module</h4>
<ul>
  <li>the
    <a href="#list-argument">
      <code>list</code>
    </a> function can also contain the
    <strong>inner</strong>
    <code>move-on</code> module execution, that has the
    <a href="#done-argument">
      <code>done</code>
    </a> argument set to the
    <a href="#chained-functions">
      <code>resolve</code>
    </a> callback of this
    <a href="#list-argument">
      <code>list</code>
    </a> function</li>
  <li>Samples: <a href="#sample-multiple-resolve">[sample]</a> <a href="#sample-each-inner">[sample]</a></li>
</ul>
<h1>Code examples</h1>
<h4 id="sample-sync-async">1. The <code>move-on</code> chain of synchronous and asynchronous functions</h4>

```javascript
const moveOn = require('move-on');
const list = [requestData, parseData, displayData];
const config = {
  context:{
    table: document.getElementById('list') //accessible in all functions as this.table
  }
};

moveOn(list, config, onDone, onCatch);

//asynchronous
function requestData(resolve, reject, context) {
  getAjaxData((err, json) => {  
    if (err) return reject(err);
    this.json = json;
    resolve();
  });
}

//synchronous
function parseData(resolve, reject, context) {
  this.data = parseJSON(this.json);
  this.employees = getEmployeesList(this.data);
  this.earnings = getEarningsList(this.data);
  resolve();
}

function displayData(resolve, reject, context) {
  table.innerHTML = parseTableContent(this.employees, this.earnings);
  resolve();
}

function onDone(reject, context) {
  this.table.style.display = "table";
}

function onCatch(context, err) {
  throw new Error(`Could not get the data: ${err}`);
}
```
<h4 id="sample-context-arguments">2. The <code>move-on</code> module with the user <code>config.context</code> and the arguments passed through the <code>resolve</code> and <code>reject</code> arrow callback functions</h4>

```javascript
const moveOn = require('move-on');

function check(resolve, reject) {
  console.log(this.name); //Jessica
  console.log(this.age); //25
  //the [String] argument passed through the catch callback function
  if (!this.name || !this.age) return reject('The person was not defined.');
  return resolve();
}

const config = {
  context: {
    name: 'Jessica',
    age: 25
  }
};

moveOn([check], config, (reject, context) => {
  //the arrow function could not be bound to the context reference
  //but the context is still accessible as the parameter
  console.log(`New person added: ${context.name} (${context.age})yo.`);
}, (context, err) => {
  console.error(err); //The [String] argument passed through the reject callback function
});
```
<h4 id="sample-reject">3. The <code>move-on</code> module that rejects</h4>
<blockquote>
  Mind that the second <strong>rejected</strong> function ends up the execution of further chained functions.<br/>
</blockquote>

```javascript
const moveOn = require('move-on');

moveOn([a, b, c], null, onDone, onCatch);

function a(resolve, reject) {
  resolve();
}
function b(resolve, reject) {
  reject('oops!');
}
function c(resolve, reject) {
  //it's been never called!
  resolve();
}

function onDone(reject, context) {
  //it's been never called!
}

function onCatch(context, message) {
  console.log(message); //oops!
}
```
<h4 id="sample-return-resolve">4. The <code>move-on</code> instructions after <code>resolve</code> call</h4>
<blockquote>
  In order to end up the chained function's execution, call <code>return resolve();</code>
</blockquote>

```javascript
const moveOn = require('move-on');

moveOn([a, b, c], null, onDone, onCatch);

/* logs order:
  A before
  B before
  C before
  Done!
  C after
  B after
  A after
*/

function a(resolve) {
  console.log('A before');
  resolve();
  console.log('A after');
}
function b(resolve) {
  console.log('B before');
  resolve();
  console.log('B after');
}
function c(resolve) {
  console.log('C before');
  resolve();
  console.log('C after');
}

function onDone(reject, context) {
  console.log('Done!');
}

function onCatch(context, msg) {
  console.log(msg); //oops!
}
```
<h4 id="sample-multiple-resolve">5. The inner <code>move-on</code> module and multiple <code>resolve</code> and <code>reject</code> calls</h4>
<blockquote>
  <strong>Mind</strong> how <em>X</em>, <em>Y</em> and <em>Z</em> functions of the inner module execute between <em>A</em>, <em>B</em> and <em>C</em> chained functions.<br/>
  <strong>Mind</strong> how the <em>B</em> and <em>C</em> chained functions are executed twice, by double <code>resolve</code> call in <em>A</em> chained function.
</blockquote>

```javascript
const moveOn = require('move-on');
moveOn([a, b, c], null, onDone, onCatch);
/* The order of functions execution:
   A, X, Y, Z, B, C, Done, Catch, B, C, Done, Catch */

function a(resolve, reject) {
  console.log('A');
  moveOn([x, y, z], null, () => resolve(), () => reject);
  resolve();
}
function b(resolve) {
  console.log('B');
  resolve();
}
function c(resolve, reject) {
  console.log('C');
  resolve();
  reject();
}
function x(resolve) {
  console.log('X');
  resolve();
}
function y(resolve) {
  console.log('Y');
  resolve();
}
function z(resolve) {
  console.log('Z');
  resolve();
}
function onDone() {
  console.log('Done');
}
function onCatch() {
  console.log('Catch');
}
```
<h4 id="sample-all">6. The <code>move-on</code>.<code>all</code> chain</h4>
<blockquote>
  It calls <code>done</code> callback function right after <strong>all</strong> chained functions are resolved.<br/>
  The user's shorter <code>config.timeout</code> is set.<br/>
  The <code>reject</code> callback functions are not used. In case of error, the <code>catch</code> callback function will still be called with <code>config.timeout</code> error.<br/>
  All retrieved data is passed through the <code>resolve</code> callback and accessible in the <code>ResolveMap</code> <code>done</code> callback function.
  </blockquote>

```javascript
const moveOn = require('move-on');

const list = [getArticle, getTagList, getCommentSection];

moveOn.all(list, { timeout: 5000, passContext: false }, onDone, onCatch);

function getArticle(resolve) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) return resolve(xhr.responseText);
  };
  xhr.open("GET", "article.js", true);
  xhr.send();
}

function getTagList(resolve) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) return resolve(xhr.responseText);
  };
  xhr.open("GET", "tags.js", true);
  xhr.send();
}

function getCommentSection(resolve) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) return resolve(xhr.responseText);
  };
  xhr.open("GET", "comments.js", true);
  xhr.send();
}

function onDone(reject, context, map) {
  let article = JSON.parse(map[0][0]);
  let tags = JSON.parse(map[1][0]);
  let comments = JSON.parse(map[2][0]);
}

function onCatch(err) {
  throw new Error(err);
}
```
<h4 id="sample-each-inner">7. The <code>move-on</code>.<code>each</code> inner module</h4>
<blockquote>
  The <code>move-on</code> is used to get the files list asynchronously and then to copy all files asynchronously.<br/>
  The inner <code>move-on</code>.<code>each</code> module is injected in the second chained function in order to report the success | failure message for each copied file.<br/>
  Each copying failure occurrence calls <code>reject</code> callback and logs the warning.<br/>
  When all files are (un)successfully copied, the <code>done</code> callback function is called, that indicates the end of files copying action.
</blockquote>

```javascript
const moveOn = require('move-on');
const fs = require('fs');
const path = require('path');

const list = [getContentsList, copyFiles];
const config = {
  passContext: false,
  context: {
    copyFrom: './modules',
    copyTo: './prod/modules'
  }
};

moveOn(list, config, onDone, onCatch);


function getContentsList(resolve, reject) {
  fs.readdir(this.copyFrom, (err, files) => {
    if (err) return reject(`Could not get the access to the "${this.copyFrom}" path.`);
    resolve(files); //the files object will be passed through the second function
  });
}

function copyFiles(resolve, reject, files) {
  const list = [];
  //the moveOn.each will take the same user context to get the access to the paths
  const config = { context: this, passContext: false };
  //creating the list of chained functions for each files item:
  for (let file of files) list.push((resolve, reject) => {
    let fromPath = path.resolve(this.copyFrom, file);
    let toPath = path.resolve(this.copyTo, file);
    fs.copyFile(fromPath, toPath, (err) => {
      //the reject call does not abort the module execution in moveOn.each method
      if (err) return reject(`The file "${file}" could not be copied.`);
      resolve(file); //the file path is added to the [Resolved] map, accessible in the final done callback function
    });
  });
  //the inner moveOn.each module - as the done callback - calls the resolve callback of the second copyFiles function with [Resolved] map argument
  moveOn.each(list, config, (reject, map) => resolve(map), (err) => console.warn(err));
}


function onDone(reject, map) {
  //the [Resolved] map contains the collection of all passed files paths
  //the missing property contains the indeces of all moveOn.each chained functions that have been rejected
  let message = !map.missing.length ? 'All files have been successfully moved.' : 'The files have been moved with some errors.';
  console.log(message);
}

function onCatch(err) {
  throw new Error(err);
}
```
<h4 id="sample-first">8. The <code>move-on</code>.<code>first</code> module</h4>
<blockquote>
  It sends the request for the three urls and waits for the first <em>(fastest)</em> response.
</blockquote>

```javascript
const moveOn = require('move-on');

loadLibrary();

function loadLibrary() {
  const list = [], urls = [ 'url-a', 'url-b', 'url-c' ];
  for (let url of urls) {
    list.push((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) return resolve(this.responseText);
      };
      xhr.open("GET", url, true);
      xhr.send();
    })
  }
  
  //all list functions are called simultaneously
  //the module expects the first function to be resolved in order to call the done callback
  //if any of chained functions resolves in 2000ms, the timeout error will be passed through the catch callback function
  moveOn.first(list, { timeout: 2000 }, onDone, onCatch);

  function onDone(reject, context, data){
    //the data has been passed by the fastest resolved chained function
    //the other chained functions are ignored
  }

  function onCatch(context, err){
    throw new Error(err); //timeout error
  }
}
```
<h4 id="sample-class-methods">9. The chain of class instance's methods</h4>
<blockquote>
  The <code>config.context</code> is set to the class instance's <code>this</code> reference, thus the chained methods still have the access to all instance's properties and methods.
</blockquote>

```javascript
const moveOn = require('move-on');

class Vegetables {
  constructor() {
    const list = [retrieveData, createTable, generateDiet];
    moveOn(list, { context: this }, () => { }, () => { });
  }

  retrieveData(resolve, reject) {
    this._ajax((err, json) => {
      if (err) return reject('We have got some problems. Try again later.');
      resolve(json);
    });
  }

  createTable(resolve, reject, context, json) {
    let data = this._parseJson(json);
    this.vegetables = this._generateTable(data);
    this._displayTable(this.vegetables);
    resolve();
  }

  generateDiet(resolve, reject) {
    this._userData((err, data) => {
      if (err) return reject('Register new account first!');
      this.diet = this._addIngredients(this.vegetables, data.caloriesDemand);
      resolve();
    });

  }

  _parseJson() { }
  _generateTable() { }
  _userData() { }
  _ajax() { }
  _displayTable() { }
  _addIngredients() { }
}
```
<h4 id="sample-email-validation">10. The email validation sample</h4>
<blockquote>
  <strong>Mind</strong> that chained functions are passed as [String] methods' names to retain the access to the <code>this</code> reference to the class instance.<br/>
  The <code>done</code> and <code>catch</code> calls the same <code>callback function</code>. The <code>reject</code> is used to terminate the further chained functions and the <code>resolve</code> to continue execution. <strong>Mind</strong> that <em>isString</em> and <em>isAvailable</em> methods call <code>reject</code> to stop the module execution.<br/>
  The [Array] <code>errorMessages</code> stores all validation error messages, that will be printed out for the user.<br/>
  The <em>isAvailable</em> chained function is asynchronous and simulates the request sent to the server to check whether the email address is available.<br/>
</blockquote>

```javascript
const moveOn = require('move-on');

class EmailValidation {
  constructor({ email, callback }) {
    this.email = email;
    this.errorMessages = [];
    const list = [[this, 'isString', 'hasAtSign', 'hasMultipleAtSigns', 'hasSpecialChars',
      'hasCapitalLetters', 'hasSpaces', 'hasDoubleDots', 'isAvailable']];
    moveOn(list, null, () => callback(this.errorMessages), () => callback(this.errorMessages));
  }

  isString(resolve, reject) {
    if (typeof this.email !== 'string') {
      this.errorMessages.push('The value must be a String.');
      return reject();
    }
    resolve();
  }
  hasAtSign(resolve) {
    if (!(/@/).test(this.email)) this.errorMessages.push('The value must contain @ sign.');
    resolve();
  }
  hasMultipleAtSigns(resolve) {
    if ((/@.*@/).test(this.email)) this.errorMessages.push('The value can contain only one @ sign.');
    resolve();
  }
  hasSpecialChars(resolve) {
    if (!(/^[A-z.\-@_]+$/).test(this.email)) this.errorMessages.push('The value cannot contain special characters.');
    resolve();
  }
  hasCapitalLetters(resolve) {
    if ((/[A-Z]/).test(this.email)) this.errorMessages.push('The value cannot contain capital letters.');
    resolve();
  }

  hasSpaces(resolve) {
    if ((/\s/).test(this.email)) this.errorMessages.push('The value cannot contain spaces.');
    resolve();
  }

  hasDoubleDots(resolve) {
    if ((/\.{2,}/).test(this.email)) this.errorMessages.push('The value cannot contain double dots.');
    resolve();
  }

  isAvailable(resolve, reject) {
    if (this.errorMessages.length) return reject();
    setTimeout(() => {
      if (!Math.random() > .5) { //check the availability
        this.errorMessages.push(`The ${this.email} address is unavailable.`);
        return reject();
      }
      resolve();
    }, 500);
  }
}

const formInput = document.getElementById('email-input');
const formAlert = document.getElementById('form-alert');
formInput.addEventListener('input', (event) => {
  new EmailValidation({
    email: event.target.value,
    callback: (errorList) => {
      formAlert.innerHTML = ''; //clear before print new messages
      if (!errorList.length) formAlert.innerHTML = 'The address is OK';
      else errorList.forEach((err) => formAlert.innerHTML += `${err}<br/>`);
    }
  });
});
```