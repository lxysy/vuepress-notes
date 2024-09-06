---
title: 计算属性 computed 与 lazy
date: 2024-09-06
categories:
  - vue3
tags:
  - vue3
---
# 计算属性 computed 与 lazy

​		在深入讲解计算属性之前，我们需要先来聊聊关于懒执行的effect，即 lazy 的 effect ,现在我们所实现的 effect 函数会立即执行传递给它的副作用函数.

​		但在有些场景下，我们并不希望它立即执行，而是希望它在需要的时候才执行，例如计算属性。这时我们可以通过在 options 中添加lazy 属性来达到目的，如下面的代码所示：

```js
effect(
    // 指定了 lazy 选项，这个函数不会立即执行
    () => {
        console.log(obj.foo)
    },
    // options
    {
        lazy: trues
    }
)
```

`lazy` 选项和之前介绍的 `scheduler` 一样，它通过 `options` 选项对象指定。有了它，我们就可以修改 `effect` 函数的实现逻辑了，当 `options.lazy` 为 `true` 时，则不立即执行副作用函数

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }

  effectFn.options = options
  effectFn.deps = []
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) { // 新增
    // 执行副作用函数
    effectFn()
  }
  // 将副作用函数作为返回值返回
  return effectFn // 新增
}
```

​		我们将副作用函数 effectFn 作为 effect 函数的返回值，这就意味着当调用 effect 函数时，通过其返回值能够拿到对应的副作用函数，这样我们就能手动执行该副作用函数了，修改代码：

```js
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  effectFn.options = options;
  effectFn.deps = [];
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn()
  }
  return effectFn;
}
```

​		通过新增的代码可以看到，传递给 effect 函数的参数 fn 才是真正的副作用函数，而 effectFn 是我们包装后的副作用函数。为了通过effectFn 得到真正的副作用函数 fn 的执行结果，我们需要将其保存到 res 变量中，然后将其作为 effectFn 函数的返回值。
​		现在我们已经能够实现懒执行的副作用函数，并且能够拿到副作用函数的执行结果了，接下来就可以实现计算属性了，如下所示：

```js
function computed(getter) {
  // 把 getter 作为副作用函数，创建一个 lazy 的 effect
  const effectFn = effect(getter, {
    lazy: true,
  });
  const obj = {
    // 当读取 value 时才执行 effectFn
    get value() {
      return effectFn();
    },
  };
  return obj;
}
```

接下来使用这个计算属性：

```js
let data = { foo: 1, bar: 2 }
const sumRes = computed(() => obj.foo + obj.bar)
console.log(sumRes.value)   // 3
```

可以看到它能够正确地工作。不过现在我们实现的计算属性只做到了懒计算，也就是说，只有当你真正读取 sumRes.value 的值时，它才会进行计算并得到值。但是还做不到对值进行缓存，即假如我们多次访问 sumRes.value 的值，会导致 effectFn 进行多次计算，即使obj.foo 和 obj.bar 的值本身并没有变化：

```js
console.log(sumRes.value)   // 3
console.log(sumRes.value)   // 3
console.log(sumRes.value)   // 3
```

多次访问 sumRes.value 的值，每次访问都会调用effectFn 重新计算。

所以我们需要对它增加值缓存功能，修改computed函数：

```js
function computed(getter) {
  // value 用来缓存上一次计算的值
  let value;
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
  });
  const obj = {
    get value() {
      // 只有“脏”时才计算值，并将得到的值缓存到 value 中
      if (dirty) {
        console.log("计算");
        value = effectFn();
        // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
        dirty = false;
      }
      return value;
    },
  };
  return obj;
}
```

我们新增了两个变量 value 和 dirty，其中 value 用来缓存上一次计算的值，而 dirty 是一个标识，代表是否需要重新计算。当我们通过 sumRes.value 访问值时，只有当 dirty 为 true 时才会调用 effectFn 重新计算值，否则直接使用上一次缓存在 value 中的值。这样无论我们访问多少次 sumRes.value，都只会在第一次访问时进行真正的计算，后续访问都会直接读取缓存的 value 值。

```js
const sumRes = computed(() => {
  return obj.foo + obj.bar;
});
console.log(sumRes.value); // 3
console.log(sumRes.value);
console.log(sumRes.value);
```

打印结果如下：

```js
计算
3
3
3
```

此时你会发现computed的计算只会执行一次，无论依赖的obj是否发生变化，这里的dirty标志还需要再依赖变化的时候重新设置为true

```js
const sumRes = computed(() => {
  console.log("计算");
  return obj.foo + obj.bar;
});
console.log(sumRes.value); // 3
console.log(sumRes.value);
console.log(sumRes.value);
// 修改 obj.foo
obj.foo++;

// 再次访问，得到的仍然是 3，但预期结果应该是 4
console.log(sumRes.value); // 3
```

打印结果：

```js
计算
3
3
3
3
```

这里我们使用之前的调度器`scheduler`，我们发现调度器会在响应式变量被设置值时触发,更改computed代码如下：

```js
function computed(getter) {
  // value 用来缓存上一次计算的值
  let value;
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler(){
      dirty = true
    }
  });
  const obj = {
    get value() {
      // 只有“脏”时才计算值，并将得到的值缓存到 value 中
      if (dirty) {
        console.log("计算");
        value = effectFn();
        // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
        dirty = false;
      }
      return value;
    },
  };
  return obj;
}
```

打印结果：

```js
计算
3
3
3
计算
4
```

目前还有一个缺陷，它体现在当我们在另外一个 effect 中读取计算属性的值时：

```js
const sumRes = computed(() => {
  console.log("计算属性内的副作用函数");
  return obj.foo + obj.bar;
});
console.log(sumRes.value); // 3
obj.foo++
console.log(sumRes.value);

console.log('--------------------------------------------------------');

effect(
  () => {
    // 在该副作用函数中读取 sumRes.value
    console.log('另一个effect调用computed计算属性')
    console.log(sumRes.value);
  },
);


console.log('--------------------------------------------------------');

obj.foo++;

```

打印结果：

```js
计算属性内的副作用函数
3
计算属性内的副作用函数
4
--------------------------------------------------------
另一个effect调用computed计算属性
4
--------------------------------------------------------
```

如果此时修改`obj.foo` 的值，我们期望副作用函数重新执行，就像我们在 `Vue.js` 的模板中读取计算属性值的时候，一旦计算属性发生变化就会触发重新渲染一样。

但是如果尝试运行上面这段代码，会发现修改 `obj.foo` 的值并不会触发副作用函数的渲染，因此我们说这是一个缺陷。

分析问题的原因，我们发现，从本质上看这就是一个典型的effect 嵌套。一个计算属性内部拥有自己的 effect，并且它是懒执行的，只有当真正读取计算属性的值时才会执行。对于计算属性的
getter 函数来说，它里面访问的响应式数据只会把 computed 内部的 effect 收集为依赖。而当把计算属性用于另外一个 effect 时，就会发生 effect 嵌套，外层的 effect 不会被内层 effect 中的响应式数据收集。

当读取计算属性的值时，我们可以手动调用track 函数进行追踪；当计算属性依赖的响应式数据发生变化时，我们可以手动调用 trigger 函数触发响应：

```js
function computed(getter) {
  // value 用来缓存上一次计算的值
  let value;
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // dirty = true;
      if(!dirty){
        dirty = true;
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
        trigger(obj, "value");
      }
    },
  });
  const obj = {
    get value() {
      // 只有“脏”时才计算值，并将得到的值缓存到 value 中
      if (dirty) {
        value = effectFn();
        // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
        dirty = false;
      }
      if(activeEffect) {
        // 当读取value时，手动调用track函数进行追踪
        track(obj, 'value')
      }
      return value;
    },
  };
  return obj;
}
```

也就是说在读取计算属性`sumRes.value`时,`sumRes.value`收集到的依赖如下

```js
sumRes.value  --------    () => {
  console.log("计算属性内的副作用函数");
  return obj.foo + obj.bar;
})

computed(obj)
	└── value
		└── effectFn
```

之后因为更改了`obj.foo`，也就是计算属性sumRes依赖的响应式数据被更改，会执行调度器函数，在调度器函数内手动调用 trigger 函数

完整代码如下：

```js
// 存储副作用函数的桶
const bucket = new WeakMap();

let data = { foo: 1, bar: 2 };

let activeEffect; // 当前被激活的副作用函数
const effectStack = []; // 副作用函数栈

// effect 函数用于注册副作用函数
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    effectStack.push(effectFn);
    const res = fn();
    // 当前副作用函数结束后，将此函数推出栈顶，并将activeEffect指向栈顶的副作用函数
    // 这样：响应式数据就只会收集直接读取其值的副作用函数作为依赖
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res; // 将函数的结果传递出去，配合lazy选项
  };
  effectFn.options = options;
  effectFn.deps = [];
  // 只有非 lazy 的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn();
  }
  return effectFn;
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

function computed(getter) {
  // value 用来缓存上一次计算的值
  let value;
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着“脏”，需要计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      // dirty = true;
      if(!dirty){
        dirty = true;
        // 当计算属性依赖的响应式数据变化时，手动调用 trigger 函数触发响应
        trigger(obj, "value");
      }
    },
  });
  const obj = {
    get value() {
      // 只有“脏”时才计算值，并将得到的值缓存到 value 中
      if (dirty) {
        value = effectFn();
        // 将 dirty 设置为 false，下一次访问直接使用缓存到 value 中的值
        dirty = false;
      }
      if(activeEffect) {
        // 当读取value时，手动调用track函数进行追踪
        track(obj, 'value')
      }
      return value;
    },
  };
  return obj;
}

const sumRes = computed(() => {
  console.log("计算属性内的副作用函数");
  return obj.foo + obj.bar;
});
console.log(sumRes.value); // 3
obj.foo++
console.log(sumRes.value);

console.log('--------------------------------------------------------');

effect(
  () => {
    // 在该副作用函数中读取 sumRes.value
    console.log('另一个effect调用computed计算属性')
    console.log(sumRes.value);
  },
);


console.log('--------------------------------------------------------');

obj.foo++;

```

打印结果如下：

```js
计算属性内的副作用函数
3
计算属性内的副作用函数
4
--------------------------------------------------------
另一个effect调用computed计算属性
4
--------------------------------------------------------
另一个effect调用computed计算属性
计算属性内的副作用函数
5
```

