# vue2响应式实现

- 在组件的初始化阶段，将对传入的状态进行初始化，以下以`data`为例，会将传入的数据包装为响应式的数据

```js
//对象示例：
main.js
new Vue({  // 根组件
  render: h => h(App)
})
```
```vue

app.vue
<template>
  <div>{{info.name}}</div>  // 只用了info.name属性
</template>
export default {  // app组件
  data() {
    return {
      info: {
        name: 'cc',
        sex: 'man'  // 即使是响应式数据，没被使用就不会进行依赖收集
      }
    }
  }
}

```

在组件`new Vue()`后的执行`vm._init()`初始化过程中，当执行到`initState(vm)`时就会对内部使用到的一些状态，如`props`、`data`、`computed`、`watch`、`methods`分别进行初始化，再对`data`进行初始化的最后有这么一句

```js
function initData(vm) {  //初始化data
  ...
  observe(data) //  info:{name:'cc',sex:'man'}
}
```

这个`observe`就是将用户定义的`data`变成响应式的数据，接下来看下它的创建过程：

```js
export function observe(value) {
  if(!isObject(value)) {  // 不是数组或对象，再见
    return
  }
  return new Observer(value)
}
```

简单理解这个`observe`方法就是`Observer`这个类的工厂方法，所以还是要看下`Observer`这个类的定义：

```js
export class Observer {
  constructor(value) {
    this.value = value
    this.walk(value)  // 遍历value
  }
  
  walk(obj) {
    const keys = Object.keys(obj)
    for(let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])  // 只传入了两个参数
    }
  }
}
```

当执行`new Observer`时，首先将传入的对象挂载到当前`this`下，然后遍历当前对象的每一项，执行`defineReactive`这个方法，看下它的定义：

```js
export function defineReactive(obj, key, val)     //key val 为传入对象的每个键值对

  const dep = new Dep()  // 依赖管理器 发布者
  
  val = obj[key]  // 计算出对应key的值
  observe(val)  // 递归包装对象的嵌套属性
  
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
}
```

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
}
这段代码就会有三个响应式数据：
  info, info.name, info.sex

```

知识点：`Object.defineProperty`内的`get`方法，它的作用就是谁访问到当前`key`的值就用`defineReactive`内的`dep`将它收集起来，也就是依赖收集的意思。`set`方法的作用就是当前`key`的值被赋值了，就通知`dep`内收集到的依赖项，`key`的值发生了变更，视图请变更吧~

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/14/16c90a72355f9e70~tplv-t2oaga2asx-watermark.awebp)

# 依赖收集

什么是依赖了？在组件挂载阶段,`mountComponent`的使用到的`Watcher`类

```js
function mountComponent(vm, el) {
  ...
  const updateComponent = function() {
    vm._update(vm._render())
  }
  
  new Watcher(vm, updateComponent, noop, {  // 渲染watcher
    ...
  }, true)  // true为标志，表示是否是渲染watcher
  ...
}
```

根据传入的参数不同，可以分别实例化出三种不同的`Watcher`实例，它们分别是用户`watcher`，计算`watcher`以及渲染`watcher`：

- 用户(user) watcher

```js
new Vue({
  data {
    msg: 'hello Vue!'
  }
  created() {
    this.$watch('msg', cb())  // 定义用户watcher
  },
  watch: {
    msg() {...}  // 定义用户watcher
  }
})
```

这里的两种方式内部都是使用`Watcher`这个类实例化的，只是参数不同

- 计算`(computed) watcher`

这个是当定义计算属性实例化出来的一种：

```js
new Vue({
  data: {
    msg: 'hello'  
  },
  computed() {
    sayHi() {  // 计算watcher
      return this.msg + 'vue!'
    }
  }
})
```



- 渲染`(render) watcher`

只是用做视图渲染而定义的Watcher实例，再组件执行vm.$mount的最后会实例化Watcher类，这个时候就是以渲染watcher的格式定义的，收集的就是当前渲染watcher的实例，我们来看下它内部是如何定义的：

```js
class Watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    this.vm = vm
    if(isRenderWatcher) {  // 是否是渲染watcher
      vm._watcher = this  // 当前组件下挂载vm._watcher属性
    }
    vm._watchers.push(this)  //vm._watchers是之前初始化initState时定义的[]
    this.before = options.before  // 渲染watcher特有属性
    this.getter = expOrFn  // 第二个参数
    this.get()  // 实例化就会执行this.get()方法
  }
  
  get() {
    pushTarget(this)  // 添加
    ...
    this.getter.call(this.vm, this.vm)  // 执行vm._update(vm._render())
    ...
    popTarget()  // 移除
  }
  
  addDep(dep) {
    ...
    dep.addSub(this)  // 将当前watcher收集到dep实例中
  }
}
```

当执行`new Watcher`的时候内部会挂载一些属性，然后执行`this.get()`这个方法，首先会执行一个全局的方法`pushTarget(this)`，传入当前`watcher`的实例，我们看下这个方法定义的地方：

```js
Dep.target = null
const targetStack = []  // 组件从父到子对应的watcher实例集合

export function pushTarget (_target) {  // 添加
  if (Dep.target) {
    targetStack.push(Dep.target)  // 添加到集合内
  }
  Dep.target = _target  // 当前的watcher实例
}

export function popTarget() {  // 移除
  targetStack.pop()  // 移除数组最后一项
  Dep.target = targetStack[targetStack.length - 1]  // 赋值为数组最后一项
}
```

首先会定义一个`Dep`类的静态属性`Dep.target`为`null`，这是一个全局会用到的属性，保存的是当前组件对应渲染`watcher`的实例；

`targetStack`内存储的是再执行组件化的过程中每个组件对应的渲染`watcher`实例集合，使用的是一个先进后出的形式来管理数组的数据，这里可能有点不太好懂，稍等再看到最后的流程图后自然就明白了；

然后将传入的`watcher`实例赋值给全局属性`Dep.target`，在之后的依赖收集过程中就是收集的它。

``` js
//依赖收集过程
root => initData()    //根组件没有data属性
root => vm.$mount()    //根组件挂载
root => new Watcher(vm,getter)    //实例化渲染watch
root => pushTarget(watcher)   //Dep.target赋值为父组件watcher实例
root => getter()   // 传入的vm._update(vm._render())
root => vm._update(vm._render())  //没有data属性，不用收集依赖
	app => initData   //遇到嵌套组件，执行子组件初始化
	app => observer(data)   //将data转为响应式数据
	app => Sub.$mount()   //子组件挂载   
    app => new Watcher(vm,getter)   //子组件实例化渲染watcher
    app => pushTarget(watcher)   //Dep.target赋值为子组件watcher实例
    app => getter()   //执行传入第二个参数
    app => vm._render()   //render函数内有读取到响应式数据
    app => defineProperty => get(){...}   // 触发get进行依赖收集
    app => dep.addSub(watcher)   //将子组件watcher实例添加到key中的dep中
    app => vm._update(vnode)   //没有嵌套组件，执行完毕
    app => popTarget()   //移除数组内子组件watcher，Dep.target为父watcher
root => popTarget()   //父组件执行完，Dep.target为undefined
```

这个时候我们知道`watcher`是个什么东西了，简单理解就是数据和组件之间一个通信工具的封装，当某个数据被组件读取时，就将依赖数据的组件使用`Dep`这个类给收集起来。



当前例子`data`内的属性是只有一个渲染`watcher`的，因为没有被其他组件所使用。但如果该属性被其他组件使用到，也会将使用它的组件收集起来，例如作为了`props`传递给了子组件，再`dep`的数组内就会存在多个渲染`watcher`。我们来看下`Dep`类这个依赖管理器的定义：

```js
let uid = 0
export default class Dep {
  constructor() {
    this.id = uid++
    this.subs = []  // 对象某个key的依赖集合
  }
  
  addSub(sub) {  // 添加watcher实例到数组内
    this.subs.push(sub)
  }
  
  depend() {
    if(Dep.target) {  // 已经被赋值为了watcher的实例
      Dep.target.addDep(this)  // 执行watcher的addDep方法
    }
  }
}

----------------------------------------------------------
class Watcher{
  ...
  addDep(dep) {  // 将当前watcher实例添加到dep内
    ...
    dep.addSub(this)  // 执行dep的addSub方法
  }
}

```

