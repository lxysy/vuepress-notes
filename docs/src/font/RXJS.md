参考《深入浅出RxJS_程墨》

# RXJS

在 RxJS v7.2.0 中，大多数操作符已移至 `'rxjs'` 导出点。这意味着导入操作符的首选方式是从 `'rxjs'`，而 `'rxjs/operators'` 导出点已被弃用。

首选方法为

```tsx
import {map} from 'rxjs'
```



## 操作符

### 按功能分类

根据功能操作符可分为：

- 创建类
- 转化类
- 过滤类
- 合并类
- 多播类
- 错误处理类
- 辅助工具类
- 条件分支类
- 数学和合计类

一些特殊的操作符类别：

- 背压控制类
- 可连接类
- 高阶 Observable 处理类

### 静态和实例分类

静态操作符：Observable类上的静态函数，通过Observable类调用；实例操作符：Observable的实例函数；无论是静态操作符还是实例操作符都会返回一个Observable对象，如何使用完全由其功能决定。

### 实现操作符

实现操作符考虑以下功能点：

- 返回一个全新的Observable对象
- 对上游的订阅和退订处理
- 处理异常情况
- 及时释放资源

先实现操作父内部逻辑

```tsx
function map(){
    return new Observable(observer => {
        const sub =  this.subscribe({
            // 捕获project调用的错误
            try{
            	next: value => observer.next(project(value)),
            } catch(err) {
                observer.error(err)                     
            }
            error: err => observer.error(error),
        	complete: () => observer.complete()
        })
        return{
            // 下游退订时，需要对上游做退订动作，释放资源
            unsubscribe:() => {
                sub.unsubscribe()
            }
        }
    })
}
```

### 关联操作符

**给Observeable打补丁**

```tsx
// 静态操作符
Observable.map = map

// 实例操作符
Observable.prototype.map = map

// 函数声明部分不能使用箭头函数,this不为Observable对象
Observable.prototype.map = (project) => {}
```

> 这种方式会影响全局的Observable类，不能使用;
>
> 实际上通过 rxjs/add/operator/repeat 导入的都是打补丁的方式，通过rxjs/operators/map 导入的为具体操作符的实现

**绑定特定的Observable对象**

bind

```tsx
const operator = map.bind(source$)
const result$ = operator(x => x*2)
```

call

```tsx
const result$ = map.call(source$,x => x*2)
```

::绑定操作符

```tsx
const result$ = source$::map(x => x*2)::map(x => x*2)
```

> 只要是返回Observable对象，::绑定操作符和.句点符号可同时使用，绑定操作符不为es6规范，需使用babel转译工具



使用this、call，Observable对象本身不会受影响，但是每一个操作符的函数体内部依然要访问this，不是纯函数且call返回的是一个any类型，会失去类型检查

### lettable操作符

```tsx
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/let'
// 导入路径 /add/operator/map 为打补丁方式； /operator/map 为导入的实现方法，可单独使用 

const source$ = observable.of(1,2,3)
const double$ = obs$ => obs$.map(x => x*2)
const res$ = sourcce$.let(double$)
// 接收一个Observable对象，返回一个Observable对象交给下游订阅

result$.subscribe(consloe.log)
```

若不想打补丁可使用以下方式：

```tsx
function map(project){
    return function(obs$){
        return new Observable(observer => {
            return obs$.subscribe({
                next: value => observer.next(project(value)),
                error: err => observer.error(error),
                complete: () => observer.complete()
            })
        })
    }
}
const result$ = source$.let(map(x => x*2))

//es6
const map = fn => obs$ => new Observable(observer => {
            return obs$.subscribe({
                next: value => observer.next(project(value)),
                error: err => observer.error(error),
                complete: () => observer.complete()
            })
        })
```

### pipeable操作符

pipe操作符无需导入模块，任何Observable都支持匹配；pipe具备let功能，还有管道功能，可串联lettable操作符

```tsx
const source$ = of(1,2,3)
const result$ = source$.pipe(
	filter(x => x%2 === 0),
    map(x => x*2)
)
const result$ = source$.let(filter(x => x%2 === 0)).let(map(x => x*2))
result$.subscribe()
```

pipeable操作符和lettable操作父是不同时间段的同一产物



## 创建数据流

为避免和JavaScript内关键字冲突，有以下特殊操作符：

- do 改为 tap
- catch 改为 catchError
- switch 改为 switchAll
- finally 改为 finalize

```tsx
of
create
// 每次递增1
range(start,length)

// 循环创建
const source$ = Observable.generate(
    2, // 初始值
    val => val < 10, //循环条件
    val => val + 2, //每次递增的值
    val => val * val //产生的结构
)
// 等同于
const result = []
for(let i=2;i<10;i+=2){
    result.push(i*i)
}
```

创建类操作符大部分为静态操作符，repeat是个实例操作符

```tsx
const source$ = Observable.of(1,2,3)
// 将上游Observable中的数据重复
// repeat将source$数据流订阅了10次
// 需要注意的是repeat是在接受到上游的complete事件后才重新订阅
const repeated$ = source$.repeat(10)
```

> repeat参数代表重复次数，不传或者传入负数就代表无限此重复

### empty、never、throw三个极简的操作符

`empty`:产生一个直接完结的Observable对象

```tsx
import 'rxjs/add/observable/empty'
const source$ = Observable.empty()
```

`throw`:产生一个直接抛出错误的Observable对象

```tsx
import 'rxjs/add/observable/throw'
const source$ = Observable.throw(new Error('Oops'))

// throw为js关键字，若不使用打补丁方式，导入_throw
import { _throw } from 'rxjs/observable/throw'
const source$ = _throw({new Error('Oops')})
```

`never` 既不吐出数据 、也不产生错误、也不完结

```tsx
import 'rxjs/add/observable/never'
const source$ = Observable.never()
```

> 单独使用这些操作符无意义

### 创建异步数据的Observable对象

`interval`  会返回一个 Observable，它发送一个无限递增的整数序列，在这些发送之间有一个恒定的时间间隔

```tsx
interval(period: number = 0, scheduler: SchedulerLike = asyncScheduler): Observable<number>

import { interval } from 'rxjs';
const source$ = interval(1000)
// 这个interval不会主动完结，interval不会主动调用下游的complete

// 默认从0开始递增，若要更改起始位置，则应和其他操作符连用,如下从1开始
const result$ = source$.map(x=>x+1)
```

`timer`接受一个数值或Date对象，在指定毫秒后吐出数据

```tsx
import { interval,timer } from 'rxjs';
const source$ = timer(1000)

const later = new Date(now.getTime() + 1000)
const source$ = timer(later)

// 接受第二个参数
const source$ = timer(1000,1000)
// 等同于
const source$ = interval(1000)
```

`from`可把一切转化为Observable，字符串、数组、Promise、generator

当接收Promise对象时，Promise完成且成功，产生的Observable对象也立即吐出成功结果（next）并结束；Promise完成且失败，产生的Observable对象也立即吐出失败结果（catch）并结束

`fromEvent`将Dom事件、events(Node.js)转化为Observable

`fromEventPattern`

`ajax`

`repeatWhen`

```tsx
const notifier = (notification$)=>{
	return notification$.delay(2000)    
}
const repeated$ = source$.repeatWhen(notifier)
// 每次repeatWhen的上游完结时，2秒后再重新订阅上游
```

`defer`接受一个函数（返回Observable或Promise），当defer产生的Observable对象被订阅时，这个函数参数才会正真创建占用资源的Observable

```tsx
import { of,defer } from 'rxjs'
const observableFactory = () => of(1,2,3)
const source$ = defer(observableFactory)
```

## 合并数据流

