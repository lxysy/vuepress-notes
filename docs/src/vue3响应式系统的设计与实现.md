---
title: vue3响应式系统的设计与实现
date: 2024-09-06
categories:
  - vue3
tags:
  - vue3
---
# vue3响应式系统的设计与实现
## 和vue2的差异

这个方法的作用就是使用`Object.defineProperty`创建响应式数据。首先根据传入的`obj`和`key`计算出`val`具体的值；如果`val`还是对象，那就使用`observe`方法进行递归创建，在递归的过程中使用`Object.defineProperty`将对象的**每一个**属性都变成响应式数据：

```js
...
data() {
  return {
    info: {
      name: 'cc',
      sex: 'man'
    } 
  }
},
mounted() {
  this.info.c = 3
}
这段代码就会有三个响应式数据：
  info, info.name, info.sex
```

这个例子中，我们对`info`上原本不存在的`c`属性进行了一个赋值，但是在`Vue2`中，这是不会触发视图的响应式更新的

这是因为`Object.defineProperty`必须对于确定的`key`值进行响应式的定义，

这就导致了如果`data`在初始化的时候没有`c`属性，那么后续对于`c`属性的赋值都不会触发`Object.defineProperty`中对于`set`的劫持,在vue2中使用`Vue.set()`解决

```js
Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      ... 收集依赖
    },
    set(newVal) {
      ... 派发更新
    }
  })
```

知识点：`Object.defineProperty`内的`get`方法，它的作用就是谁访问到当前`key`的值就用`defineReactive`内的`dep`将它收集起来，也就是依赖收集的意思。`set`方法的作用就是当前`key`的值被赋值了，就通知`dep`内收集到的依赖项，`key`的值发生了变更，视图请变更吧~

![](C:\Users\Administrator\Desktop\vue3\img\vue2响应式流程.png)



## Proxy

Proxy 可以理解成，在目标**对象**之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

```js
const raw = {}
const data = new Proxy(raw, {
    get(target, key) { },
    set(target, key, value) { }
})
```

可以看出来，Proxy在定义的时候并不用关心key值，

只要你定义了get方法，那么后续对于data上任何属性的访问（哪怕是不存在的），

都会触发`get`的劫持，`set`也是同理。

Vue3使用proxy代理替换掉了`Object.defineProperty`劫持，由于`defineProperty`的局限性无法检查对象属性的改变，同时默认递归data里面的数据做响应式。Proxy是懒递归，当我们操作数据是对象的时候才会去递归代理。

```shell
find . -name "node_modules" -type d -exec rm -rf {} +

Get-ChildItem -Path . -Recurse -Force -Directory -Filter "node_modules" | Remove-Item -Force -Recurse
```

## 实现思路

1. 定义某个数据为**响应式数据**，它会拥有收集**访问它的函数**的能力。

2. 定义观察函数，在这个函数内部去访问**响应式数据**，访问到**响应式数据**的某个`key`的时候，会建立一个依赖关系`key -> reaction观察函数`。

3. 检测到**响应式数据**的`key`的值更新的时候，会去重新执行一遍它所收集的所有`reaction观察函数`

### 副作用函数

副作用函数指的是会产生副作用的函数

```js
function effect() { 
    document.body.innerText = 'hello vue3' 
}
```

effect 函数的执行会直接或间接影响其他函数的执行，这时 我们说 effect 函数产生了副作用,

### 基本实现

```js
// 存储副作用函数的桶 
const bucket = new Set() 

// 原始数据 
const data = { text: 'hello world' } 
// 对原始数据的代理 
const obj = new Proxy(data, { 
    // 拦截读取操作 
    get(target, key) { 
        // 将副作用函数 effect 添加到存储副作用函数的桶中 
        bucket.add(effect) 
        // 返回属性值 
        return target[key] 
    }, 
    // 拦截设置操作 
    set(target, key, newVal) { 
        // 设置属性值 
        target[key] = newVal 
        // 把副作用函数从桶里取出并执行 
        bucket.forEach(fn => fn()) 
        // 返回 true 代表设置操作成功 
        return true 
    } 
})
```

这里也可以参考[mini-vue]( https://github.com/cuixiaorui/mini-vue/blob/master/packages/reactivity/src/ref.ts) 这个项目，它去除了处理边缘情况或者是兼容处理逻辑，关注于核心逻辑。

```ts
export class RefImpl {
  private _rawValue: any;
  private _value: any;
  public dep;
  public __v_isRef = true;

  constructor(value) {
    this._rawValue = value;
    // 看看value 是不是一个对象，如果是一个对象的话
    // 那么需要用 reactive 包裹一下
    this._value = convert(value);
    this.dep = createDep();
  }

  get value() {
    // 收集依赖
    trackRefValue(this);
    return this._value;
  }

  set value(newValue) {
    // 当新的值不等于老的值的话，
    // 那么才需要触发依赖
    if (hasChanged(newValue, this._rawValue)) {
      // 更新值
      this._value = convert(newValue);
      this._rawValue = newValue;
      // 触发依赖
      triggerRefValue(this);
    }
  }
}
```



文件目录：

```shell
src
├── baseHandlers.ts #定义了用于代理普通对象和数组的 Proxy handler
├── collectionHandlers.ts #定义了用于代理 Set、Map、WeakSet 和 WeakMap 的 Proxy handler
├── computed.ts #实现了计算属性
├── deferredComputed.ts #实现了延迟计算的计算属性，只有在真正需要获取计算属性的值时才会计算
├── dep.ts #依赖集合相关方法，用于收集和管理响应式数据的依赖
├── effect.ts #定义副作用函数的注册方法，定义收集副作用函数的track方法和触发副作用函数的trigger方法
├── effectScope.ts #定义了 effectScope 类型和相应的 API，用于管理 effect 的生命周期
├── index.ts
├── operations.ts #枚举了track和trigger的操作方法
├── reactive.ts #实现了将非原始值转换成响应式对象的函数
├── ref.ts #实现了将原始值转换成响应式对象的函数
└── warning.ts #定义了警告的方法，用于在开发环境，打印一些警告信息
```

**在reactivity package下调试**

因为vue3源码架构是monorepo架构，所有也能直接将reactivity单独打包，在其内部生成dist文件，所以单纯看reactivity源码的时候，可以直接它里边写demo调试，需要在vue3根目录运行如下命令：

```shell
node ./scripts/dev.js reactivity -f esm-browser
```

> Vue.js 的 构建产物除了有环境上的区分之外，还会根据使用场景的不同而输出 其他形式的产物。不同类型的产物一定有对应的需求背景，因此我们从需求讲起。
>
> 1. 直接在 HTML 页面中使用
>
>    为了实现这个需求，我们需要输出一种叫作 IIFE 格式的资源。 IIFE 的全称是 Immediately Invoked Function Expression，即“立即调用的 函数表达式”。实际上， vue.global.js 文件就是 IIFE 形式的资源，在 rollup.js 中，我们可以通过配置 format: 'iife' 来输出这种 形式的资源
>
> 2. 直接引入 ESM 格式的资源
>
>    过随着技术的发展和浏览器的支持，现在主流浏览器对原生 ESM 的支持都不错，所以用户除了能够使用 <script> 标签引用 IIFE 格式的资源外，还可以直接引入 ESM 格式的资源。例如 Vue.js 3 还会 输出 vue.esm-browser.js 文件，用户可以直接用 

然后在reactivity下随便创建个文件夹（一般是examples），创建创建html文件，引入dist中的源码即可

```html
<script type="module">
  import { computed, ref, effect } from '../dist/reactivity.esm-browser.js'
  const foo = ref('foo')
  console.log(foo.value)
</script>
```

或者直接查看对应包的`__tests__`文件下的单元测试

```ts
...
it('should be reactive', () => {
    const a = ref(1)
    let dummy
    const fn = vi.fn(() => {
      dummy = a.value
    })
    effect(fn)
    // 断言fn被执行了一次，否则测试不通过
    expect(fn).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    a.value = 2
    // 断言fn被执行了两次，否则测试不通过
    expect(fn).toHaveBeenCalledTimes(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
  })
...
```

> 这里的`vi`是`@vue/test-utils`中的一个模拟函数库，它被用于测试Vue组件，但看起来也可以用于其他响应式系统的测试。

对应源码

`effect.ts`中定义了一个全局变量 `activeEffect`，初始值是 undefined，它的作用是存储被注册的副作用函数。接着定义了 `effect` 函数，它变成了一个用来注册副作用函数的函数，`effect` 函 数接收一个参数 fn，即要注册的副作用函数

```ts

/**
    注册给定的函数以跟踪响应式更新。
    给定的函数将立即运行一次。每当在其中访问的任何响应式属性更新时，该函数将再次运行。
    @param fn - 将跟踪响应式更新的函数。
    @param options - 用于控制副作用的行为。
    @returns 一个运行器，可用于在创建后控制副作用。 
*/
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect instanceof ReactiveEffect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn, NOOP, () => {
    if (_effect.dirty) {
      _effect.run()
    }
  })
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

// 除去一些边界条件
export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);

  // 把用户传过来的值合并到 _effect 对象上去
  // 缺点就是不是显式的，看代码的时候并不知道有什么值
  extend(_effect, options);
  _effect.run();

  // 把 _effect.run 这个方法返回
  // 让用户可以自行选择调用的时机（调用 fn）
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
```

也就是说使用`effect()`去收集副作用函数并且执行了，同时给全局变量`activeEffect`赋值了，赋值操作在`new ReactiveEffect`，`activeEffect`在执行`_effect.run()`时会把它本身赋值给`activeEffect`;

当 effect 函数执行时，首先会把副作用函数 fn 赋值给 全局变量 `activeEffect`。接着执行被注册的副作用函数 fn， 这将会触发响应式数据的读取操作，进而触发代理对象 Proxy 的 get 拦截函数

同时思考一个问题：我们**没有在副作用函数与被操作的目标字段之间建立明确的联系** 。例如当读取属性时，无论读取的是哪一个属性，其实都一样，都会把副作用函数收集到“桶”里；当设置属性时，无论设置的是哪一个属性，也都会把“桶”里的副作用函数取出并执行。副作用函数与被操作的字段之间没有明确的联系。解决方法很简单，只需要在副作用函数与被操作的字段之间建立联系即可

```js
// 存储副作用函数的桶
const bucket = new WeakMap()
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}
```

![副作用函数与被操作的目标字段关系](C:\Users\Administrator\Desktop\vue3\img\WeakMap、Map、Set之间的关系.png)

> `Map`类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键
>
> `WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。简单地说，`WeakMap` 对 key 是弱引用，不影响垃圾回收器的工作。据这个特性可知，一旦 key 被垃圾回收器回收，那么对应的键和值就访问不到了。所以 `WeakMap` 经常用于存储那些只有当 key 所引 用的对象存在时（没有被回收）才有价值的信息
>
> 但如果使用 `Map` 来代替 `WeakMap`， 那么即使用户侧的代码对 `target` 没有任何引用，这个 `target` 也不 会被回收，最终可能导致内存溢出

```js
const map = new Map();
const weakmap = new WeakMap();

(function () {
  const foo = { foo: 1 };
  const bar = { bar: 2 };

  map.set(foo, 6);
  weakmap.set(bar, 6);
  console.log(weakmap.get(bar));    // 6
})()

for (let key of map.keys()) {
  console.log(key); // 输出 { foo: 1 }
}
```

我们来调试完整代码来观察此时“桶”的结构

```js
// 存储副作用函数的桶
const bucket = new WeakMap()

const data = { ok: true, text: 'hello world' } 

const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
    return true
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}


// 用一个全局变量存储被注册的副作用函数
let activeEffect;
let globalVar
// effect 函数用于注册副作用函数
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给 activeEffect
  activeEffect = fn;
  // 执行副作用函数
  fn();
}

effect(function effectFn() { 
  globalVar = obj.ok ? obj.text : 'not' 
})

// obj.text = 'text'

console.log(globalVar,bucket.get(data));
```

更改`obj.text`的值会触发`obj`的`set`,从而执行副作用函数，自此我们就实现了一个简易的响应式系统。

### 分支切换和cleanup

```js
const data = { ok: true, text: 'hello world' } 
const obj = new Proxy(data, { /* ... */ }) 

    effect(function effectFn() { 
        document.body.innerText = obj.ok ? obj.text : 'not' 
    })
```

观察以上代码，当副作用函数中出现三元表达式时，当字段 `obj.ok` 的值发生变化时， 代码执行的分支会跟着变化，这就是所谓的**分支切换**。

`obj.ok`为`true`时，此时的副作用函数与响应式数据之间的联系：

![](C:\Users\Administrator\Desktop\vue3\img\分支切换下的依赖集合.png)

我们看现在的完整代码

```js
// 存储副作用函数的桶
// const bucket = new WeakMap();
// 这里使用Map是为了后续打印能看到bucket
const bucket = new Map();

let data = { ok: true, text: "hello world" };

let globalVar

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
// effect 函数用于注册副作用函数
function effect(fn) {
  // 当调用 effect 注册副作用函数时，将副作用函数 fn 赋值给 activeEffect
  activeEffect = fn;
  // 执行副作用函数
  fn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
    return true
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  console.log(key,depsMap);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  console.log(key);
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  console.log(key);
  deps.add(activeEffect);
  console.log(target,depsMap);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}

// 在收集
effect(function effectFn() { 
  globalVar = obj.ok ? obj.text : 'not' 
})

/* 
  这里改变响应式变量的值,触发副作用函数重新执行后，由于此时字段 obj.text 不
  会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作
  用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集
*/
obj.ok = false
console.log(globalVar,bucket);
```

当响应式变量`obj.ok`的值从`true`变为`false`时，由于此时字段 `obj.text` 不会被读取，只会触发字段 `obj.ok` 的读取操作，所以理想情况下副作用函数 `effectFn` 不应该被字段 `obj.text` 所对应的依赖集合收集。但上面的代码还未做到，**因为每一次触发`track`时都是从同一个`bucket`中读取的同一个`target`,对应的`key`还保留着上一次依赖收集的结果**

即我们是想实现如下的这种情况，但实际上，就产生了遗留的副作用函数，即`text`对应的副作用函数被保留了下来，遗留的副作用函数会导致不必要的更新，**因为当`obj.ok`的值为`false`时,无论`obj.text`的值如何变化，都不应该导致更新**

![](C:\Users\Administrator\Desktop\vue3\img\理想情况下分支切换的依赖集合.png)

解决这个问题的方法，**每次副作用函数执行时，我们可以先把它从所有与之关联的依赖集合中删除**，当副作用函数执行完毕后，会重新建立联系，但在新的联系中不会包含遗留的副作用函数。

![](C:\Users\Administrator\Desktop\vue3\img\分支切换-断开函数与响应式数据之间的联系.png)

要将一个副作用函数从所有与之关联的依赖集合中移除，因为一个依赖集合中可能会有多个副作用函数，要移除对应的副作用函数，就需要明确知道哪些依赖集合中包含它

为此我们重新设计`effect`函数,在其中**定义一个`effectFn`函数，并且添加一个属性`deps`用于存放含有该副作用函数的依赖集合**

同时需要思考在何处**收集副作用函数的依赖集合**，答案是在**track函数**

最后在**每次触发副作用函数前清除掉副作用函数和依赖集合之间的联系**，也就是说在触发一个副作用函数时，会先清除拥有这个副作用函数的依赖集合，这样就不会造成多余的遗留的副作用函数



完整代码：

```js
// 存储副作用函数的桶
// const bucket = new WeakMap();
// 这里使用Map是为了后续打印能看到bucket
const bucket = new Map();

let data = { ok: true, text: "hello world" };

let global;

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
// effect 函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除工作 
    cleanup(effectFn)  // 新增 
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  // console.log(key, depsMap);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  console.log(key);
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // console.log(key);
  // 把当前激活的副作用函数添加到依赖集合 deps 中
  deps.add(activeEffect);
  console.log(target, depsMap);

  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
  console.log(activeEffect);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects && effects.forEach((fn) => fn());
}


// 清除副作用函数对应的依赖集合
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const deps = effectFn.deps[i];
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// 在收集
effect(function effectFn() {
  global = obj.ok ? obj.text : "not";
});

/* 
  这里改变响应式变量的值,触发副作用函数重新执行后，由于此时字段 obj.text 不
  会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作
  用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集
*/
obj.ok = false;
console.log(bucket);
```

然而在调试当前代码时会出现无限循环，问题出在`trigger`函数

```js
function trigger(target, key) { 
    const depsMap = bucket.get(target) 
    if (!depsMap) return 
    const effects = depsMap.get(key) 
    effects && effects.forEach(fn => fn()) // 问题出在这句代码 
}
```

我们这里遍历的`effects`就是一个依赖集合，是一个`set`类型；当副作用函数执行时，会调用 `cleanup` 进行清除，实际上就是从 `effects` 集合中将当前执行的副作用函数剔除，但是副作用函数的执行会导致其重新被收集到集合 中，而此时对于 `effects` 集合的遍历仍在进行

我们来看在遍历set的同时修改它会发生什么

```js
const set = new Set([1]) 

set.forEach(item => { 
    set.delete(1) 
    set.add(1) 
    console.log('遍历中') 
})
```

> 语言规范中对此有明确的说明：在调用 forEach 遍历 Set 集合 时，如果一个值已经被访问过了，但该值被删除并重新添加到集合， 如果此时 forEach 遍历没有结束，那么该值会重新被访问。因此，上面的代码会无限执行

解决方法就是重新构建一个set并且遍历它：

```js
const set = new Set([1]) 

const newSet = new Set(set) 
newSet.forEach(item => { 
    set.delete(1) 
    set.add(1) 
    console.log('遍历中') 
})
```

修改后的代码如下：

```js
// 存储副作用函数的桶
// const bucket = new WeakMap();
// 这里使用Map是为了后续打印能看到bucket
const bucket = new Map();

let data = { ok: true, text: "hello world" };

let global;

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
// effect 函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除工作
    cleanup(effectFn); // 新增
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  // console.log(key, depsMap);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  console.log(key);
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // console.log(key);
  // 把当前激活的副作用函数添加到依赖集合 deps 中
  deps.add(activeEffect);
  // console.log(target, depsMap);

  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
  // console.log(activeEffect);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects); // 新增
  effectsToRun.forEach((effectFn) => effectFn()); // 新增
}

// 清除副作用函数对应的依赖集合
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const deps = effectFn.deps[i];
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// 在收集
effect(function effectFn() {
  global = obj.ok ? obj.text : "not";
});

/* 
  这里改变响应式变量的值,触发副作用函数重新执行后，由于此时字段 obj.text 不
  会被读取，只会触发字段 obj.ok 的读取操作，所以理想情况下副作
  用函数 effectFn 不应该被字段 obj.text 所对应的依赖集合收集
*/
obj.ok = false;
console.log(bucket);

```

### 嵌套的 effect  与 effect  栈

effect之间是可以嵌套的

```js
effect(function effectFn1() { 
    effect(function effectFn2() { /* ... */ }) 
    /* ... */ 
})
```

这种场景在组件的嵌套中会出现，但是我们之前实现的代码中并没有考虑嵌套的部分

我们根据之前的代码修改，增加`effect`嵌套的部分，以下是修改前的代码

```js
// 存储副作用函数的桶
const bucket = new WeakMap();
// 这里使用Map是为了后续打印能看到bucket
// const bucket = new Map();

let data = { foo: true, bar: true };

let global;
let temp1, temp2;

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
// effect 函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用 cleanup 函数完成清除工作
    cleanup(effectFn); // 新增
    // 当 effectFn 执行时，将其设置为当前激活的副作用函数
    activeEffect = effectFn;
    fn();
  };
  // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = [];
  // 执行副作用函数
  effectFn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  // console.log(key, depsMap);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  console.log(key);
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // console.log(key);
  // 把当前激活的副作用函数添加到依赖集合 deps 中
  deps.add(activeEffect);
  // console.log(target, depsMap);

  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
  // console.log(activeEffect);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects); // 新增
  effectsToRun.forEach((effectFn) => effectFn()); // 新增
}

// 清除副作用函数对应的依赖集合
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const deps = effectFn.deps[i];
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// 嵌套effect
effect(function effectFn1() {
  console.log("effectFn1执行");
  // 在 effectFn1 中读取 obj.foo 属性
  effect(function effectFn2() {
    console.log("effectFn2执行");
    // 在 effectFn2 中读取 obj.bar 属性
    temp2 = obj.bar;
  });
  temp1 = obj.foo;
});

obj.foo = false;
// obj.bar = false

console.log(bucket.get(data));
```

我们去修改`obj.foo`,预期是修改它会重新执行副作用函数`effectFn1`,并且嵌套在其中的effectFn2也会重新执行；

然而实际上的输出是

```shell
effectFn1执行
effectFn2执行
bar
foo
effectFn2执行
bar
```

我们用全局变量 `activeEffect` 来存储通过 `effect` 函数注册的 副作用函数，这意味着同一时刻 `activeEffect` 所存储的副作用函数 只能有一个。当副作用函数发生嵌套时，内层副作用函数的执行会覆盖 `activeEffect` 的值，并且永远不会恢复到原来的值。这时如果再 有响应式数据进行依赖收集，即使这个响应式数据是在外层副作用函数中读取的，它们收集到的副作用函数也都会是内层副作用函数，这就是问题所在。

为了解决这个问题，我们需要一个副作用函数栈 `effectStack`， 在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执 行完毕后将其从栈中弹出，并始终让 `activeEffect` 指向栈顶的副作用函数。这样就能做到一个响应式数据只会收集直接读取其值的副作用函数，而不会出现互相影响的情况

修改后的完整代码如下：

```js
// 存储副作用函数的桶
const bucket = new WeakMap();
// 这里使用Map是为了后续打印能看到bucket
// const bucket = new Map();

let data = { foo: true, bar: true };

let global;
let temp1, temp2;

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
const effectStack = []; // 新增
// effect 函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;

    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn); // 新增
    fn();

    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop(); // 新增
    activeEffect = effectStack[effectStack.length - 1]; // 新增
  };
  effectFn.deps = [];
  effectFn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 把当前激活的副作用函数添加到依赖集合 deps 中
  deps.add(activeEffect);

  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set(effects); // 新增
  effectsToRun.forEach((effectFn) => effectFn()); // 新增
}

// 清除副作用函数对应的依赖集合
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const deps = effectFn.deps[i];
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// 嵌套effect
effect(function effectFn1() {
  console.log("effectFn1执行");
  // 在 effectFn1 中读取 obj.foo 属性
  effect(function effectFn2() {
    console.log("effectFn2执行");
    // 在 effectFn2 中读取 obj.bar 属性
    temp2 = obj.bar;
  });
  temp1 = obj.foo;
});

obj.foo = false;
// obj.bar = false

// console.log(bucket.get(data));
```

### 避免无限递归循环

```js
const data = { foo: 1 } 
const obj = new Proxy(data, { /*...*/ }) 

effect(() => obj.foo++)
```

可以看到，在 effect 注册的副作用函数内有一个自增操作 `obj.foo++`，该操作会引起栈溢出

**这里的代码在浏览器环境中执行会引起栈溢出**

```js
// 等同于
effect(() => {
    obj.foo = obj.foo + 1
})
```

在这个语句中，既会读取 `obj.foo` 的值，又会设置 `obj.foo` 的 值，而这就是导致问题的根本原因。我们可以尝试推理一下代码的执行流程：首先读取 `obj.foo` 的值，这会触发 `track` 操作，将当前副作用函数收集到“桶”中，接着将其加 1 后再赋值给 `obj.foo`，此时会触发 `trigger` 操作，即把“桶”中的副作用函数取出并执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行。这样会导致无限递归地调用自己，于是就产生了栈溢出

此时无论是 `track` 时收集的副 作用函数，还是 `trigger` 时要触发执行的副作用函数，都是 `activeEffect`

**如果 `trigger`  触发执行的副作用函数与当前正在执行的副作用函数相同**，则不触发执行,修改后的完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <script>
        // 存储副作用函数的桶
        const bucket = new WeakMap();
        // 这里使用Map是为了后续打印能看到bucket
        // const bucket = new Map();

        let data = { foo: 1, bar: true };

        let global;
        let temp1, temp2;

        // 用一个全局变量存储被注册的副作用函数
        let activeEffect;
        const effectStack = []; // 新增
        // effect 函数用于注册副作用函数
        function effect(fn) {
            console.log('effect');
            const effectFn = () => {
                cleanup(effectFn);
                activeEffect = effectFn;

                // 在调用副作用函数之前将当前副作用函数压入栈中
                effectStack.push(effectFn); // 新增
                fn();

                // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
                effectStack.pop(); // 新增
                activeEffect = effectStack[effectStack.length - 1]; // 新增
            };
            effectFn.deps = [];
            effectFn();
        }
        const obj = new Proxy(data, {
            // 拦截读取操作
            get(target, key) {
                // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
                track(target, key);
                // 返回属性值
                return target[key];
            },
            // 拦截设置操作
            set(target, key, newVal) {
                // 设置属性值
                target[key] = newVal;
                // 把副作用函数从桶里取出并执行
                trigger(target, key);
            },
        });

        // 在 get 拦截函数内调用 track 函数追踪变化
        function track(target, key) {
            console.log('track')
            // 没有 activeEffect，直接 return
            if (!activeEffect) return;
            let depsMap = bucket.get(target);
            if (!depsMap) {
                bucket.set(target, (depsMap = new Map()));
            }
            let deps = depsMap.get(key);
            if (!deps) {
                depsMap.set(key, (deps = new Set()));
            }
            // 把当前激活的副作用函数添加到依赖集合 deps 中
            deps.add(activeEffect);

            // deps 就是一个与当前副作用函数存在联系的依赖集合
            // 将其添加到 activeEffect.deps 数组中
            activeEffect.deps.push(deps);
        }
        // 在 set 拦截函数内调用 trigger 函数触发变化
        function trigger(target, key) {
            console.log('trigger')
            const depsMap = bucket.get(target);
            if (!depsMap) return;
            const effects = depsMap.get(key);
            const effectsToRun = new Set(); // 修改
            effects && effects.forEach(effectFn => {
                // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
                if (effectFn !== activeEffect) {  // 新增 
                    effectsToRun.add(effectFn)
                }
            })
            effectsToRun.forEach((effectFn) => effectFn()); 
        }

        // 清除副作用函数对应的依赖集合
        function cleanup(effectFn) {
            // 遍历 effectFn.deps 数组
            for (let i = 0; i < effectFn.deps.length; i++) {
                // deps 是依赖集合
                const deps = effectFn.deps[i];
                // 将 effectFn 从依赖集合中移除
                deps.delete(effectFn);
            }
            // 最后需要重置 effectFn.deps 数组
            effectFn.deps.length = 0;
        }

        effect(() => {
            obj.foo = obj.foo + 1
        })

        // console.log(bucket.get(data));

    </script>

    <body>

    </body>

</html>
```



### 调度执行

可调度性是响应系统非常重要的特性。首先我们需要明确什么是可调度性。所谓可调度，指的是当 `trigger` 动作触发副作用函数重新执行时，有能力决定副作用函数执行的时机、次数以及方式

```js
const data = { foo: 1 } 
const obj = new Proxy(data, { /* ... */ }) 

effect(() => { 
    console.log(obj.foo) 
})

obj.foo++ 

console.log('结束了')
```

结果如下：

```js
1 
2 
'结束了'
```

如果说需要**更改打印的顺序**，除了直接更改代码，这时就需要响应系统**支持调度** 。

我们可以为 effect 函数设计一个选项参数 options，允许用户 指定调度器：

```js
effect( 
    () => { 
        console.log(obj.foo) 
    }, 
    // options 
    { 
        // 调度器 scheduler 是一个函数 
        scheduler(fn) { 
            // ... 
        } 
    } 
)
```

它是一个对象，其中允许指定 `scheduler` 调度函数，同时在 `effect` 函数内部我们需要把 `options` 选项挂载到对应的副作用函数上：

```js
function effect(fn,options = {}) {
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn;

        // 在调用副作用函数之前将当前副作用函数压入栈中
        effectStack.push(effectFn);
        fn();

        // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
        effectStack.pop(); 
        activeEffect = effectStack[effectStack.length - 1]; 


    };
    // 将 options 挂载到 effectFn 上 
    effectFn.options = options  // 新增 
    effectFn.deps = [];
    effectFn();
}
```

有了调度函数，我们在 trigger 函数中触发副作用函数重新执行时，就可以直接调用用户传递的调度器函数，从而把控制权交给用户：

```js
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach((effectFn) => {
      // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach((effectFn) => {
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
    if (effectFn.options.scheduler) { 
      effectFn.options.scheduler(effectFn); // 新增
    } else {
      // 否则直接执行副作用函数（之前的默认行为）
      effectFn(); // 新增
    }
  });
}
```

传入调度器后执行结果为：

```shell
1
结束了
2
```

完整代码：

```js
// 存储副作用函数的桶
const bucket = new WeakMap();

let data = { foo: 1, bar: true };

let global;
let temp1, temp2;

// 用一个全局变量存储被注册的副作用函数
let activeEffect;
const effectStack = [];
// effect 函数用于注册副作用函数
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;

    // 在调用副作用函数之前将当前副作用函数压入栈中
    effectStack.push(effectFn);
    fn();

    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };
  // 将 options 挂载到 effectFn 上
  effectFn.options = options; // 新增
  effectFn.deps = [];
  effectFn();
}
const obj = new Proxy(data, {
  // 拦截读取操作
  get(target, key) {
    // 将副作用函数 activeEffect 添加到存储副作用函数的桶中
    track(target, key);
    // 返回属性值
    return target[key];
  },
  // 拦截设置操作
  set(target, key, newVal) {
    // 设置属性值
    target[key] = newVal;
    // 把副作用函数从桶里取出并执行
    trigger(target, key);
  },
});

// 在 get 拦截函数内调用 track 函数追踪变化
function track(target, key) {
  // 没有 activeEffect，直接 return
  if (!activeEffect) return;
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 把当前激活的副作用函数添加到依赖集合 deps 中
  deps.add(activeEffect);

  // deps 就是一个与当前副作用函数存在联系的依赖集合
  // 将其添加到 activeEffect.deps 数组中
  activeEffect.deps.push(deps);
}
// 在 set 拦截函数内调用 trigger 函数触发变化
function trigger(target, key) {
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  const effectsToRun = new Set();
  effects &&
    effects.forEach((effectFn) => {
      // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn);
      }
    });
  effectsToRun.forEach((effectFn) => {
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
    if (effectFn.options.scheduler) { 
      effectFn.options.scheduler(effectFn); // 新增
    } else {
      // 否则直接执行副作用函数（之前的默认行为）
      effectFn(); // 新增
    }
  });
}

// 清除副作用函数对应的依赖集合
function cleanup(effectFn) {
  // 遍历 effectFn.deps 数组
  for (let i = 0; i < effectFn.deps.length; i++) {
    // deps 是依赖集合
    const deps = effectFn.deps[i];
    // 将 effectFn 从依赖集合中移除
    deps.delete(effectFn);
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0;
}

// ----------------------------------------------------------------
// effect(() => {
//   console.log(obj.foo);
// });

effect(
  () => {
    console.log(obj.foo);
  },
  {
    // 调度器 scheduler 是一个函数
    scheduler(fn) {
      // 将副作用函数放到宏任务队列中执行
      setTimeout(fn);
    },
  }
);
// ----------------------------------------------------------------

obj.foo++;

console.log("结束了");

// console.log(bucket.get(data));

```

除了控制副作用函数的执行顺序，通过调度器还可以做到控制它的**执行次数**，这一点也尤为重要

```js
const data = { foo: 1 } 
const obj = new Proxy(data, { /* ... */ }) 

effect(() => { 
    console.log(obj.foo) 
}) 

obj.foo++ 
obj.foo++
```

```shell
1
2
3
```

若我们只关注最终结果而不关注过程，希望的结果如下

```shell
1
3
```

思考如何基于调度器实现

```js
// 定义一个任务队列
const jobQueue = new Set();
// 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve();

// 一个标志代表是否正在刷新队列
let isFlushing = false;
function flushJob() {
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return;
  // 设置为 true，代表正在刷新
  isFlushing = true;
  // 在微任务队列中刷新 jobQueue 队列
  p.then(() => {
    jobQueue.forEach((job) => job());
  }).finally(() => {
    // 结束后重置 isFlushing
    isFlushing = false;
  });
}

effect(
  () => {
    console.log(obj.foo);
  },
  {
    scheduler(fn) {
      // 每次调度时，将副作用函数添加到 jobQueue 队列中
      jobQueue.add(fn);
      // 调用 flushJob 刷新队列
      flushJob();
    },
  }
);

obj.foo++;

obj.foo++;
```

整段代码的效果是，连续对 `obj.foo` 执行两次自增操作，会同步 且连续地执行两次 `scheduler` 调度函数，这意味着同一个副作用函 数会被 `jobQueue.add(fn)` 语句添加两次，但由于 `Set` 数据结构的 去重能力，最终 `jobQueue` 中只会有一项，即当前副作用函数。类似 地，`flushJob` 也会同步且连续地执行两次，但由于 `isFlushing` 标 志的存在，实际上 `flushJob` 函数在一个事件循环内只会执行一次， 即在微任务队列内执行一次。当微任务队列开始执行时，就会遍历 `jobQueue` 并执行里面存储的副作用函数。由于此时 `jobQueue` 队列 内只有一个副作用函数，所以只会执行一次，并且当它执行时，字段 `obj.foo` 的值已经是 3 了

> 这个功能有点类似于在 Vue.js 中连续多次 修改响应式数据但只会触发一次更新，实际上 Vue.js 内部实现了一个 更加完善的调度器，思路与上文介绍的相同。
