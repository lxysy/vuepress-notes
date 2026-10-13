---
title: langchain + Nest SSE流式AI接口
date: 2026-10-09
categories:
  - AI
tags:
  - AI Runnable
---

LangChain 的各种功能，但都是在 Node.js 脚本里跑的，而实际上大多数 Agent 都是跑在后端服务里

Nest 这个后端框架，它是 Node.js + Typescript 的最主流的框架

底层是 Express，封装后提供了 MVC、DI（依赖注入）等架构特性

### Nest基础使用

安装

```shell
npm install -g @nestjs/cli
```

新建一个项目

```shell
nest new hello-nest-langchain
```

初始化一个crud

```shell
nest g res book --no-spec
```

![image-20261011211430825](./img/image-20261011211430825.png)

可以看到它是一个MVC架构

在 controller 里面写路由，比如 /list 的 get 接口，/create 的 post 接口

在 service 里写具体的业务逻辑，比如增删改查、调用第三方服务等

然后这些都是以 module 的形式组织，一个 module 里有 controller、service 等

![architecture-doodle](./img/architecture-doodle.png)

从根模块 AppModule 引入 BookModule

BookController 里的路由就会生效了

同时Nest这里的依赖注入类似于angular

也就是你不用手动 new 依赖对象，只要声明下，运行的时候会自动注入依赖的实例对象。

比如这里用 @Injectable 声明了 BookService

![image-20261011213004902](./img/image-20261011213004902.png)

在hello-nest-langchain\src\book\book.controller.ts中在构造器声明了依赖：

![image-20261011213225085](./img/image-20261011213225085.png)

这样运行的时候就会自动注入 BookService 的实例对象

这样一个好处是所有的依赖都是单例的，不用自己去 new

这就是被叫做 providers 的原因

![image-20261011213551590](./img/image-20261011213551590.png)

就是一个用来提供某种能力的对象

用 @Injectable 声明的 class 只是一种，还可以使用useFactory创建 provider：

![image-20261011214532381](./img/image-20261011214532381.png)

然后再service中使用这个名字来注入

这里是属性注入，注入了一个bookRepository属性

![image-20261011214941533](./img/image-20261011214941533.png)

然后我们去访问 http://localhost:3000/book

![image-20261011215611363](./img/image-20261011215611363.png)

可以看到使用useFactory创建的provider也被注入了

### 结合langchain实现AI接口

安装下langchain

```shell
pnpm install @langchain/core @langchain/openai
```

生成一个模块

```shell
nest g res ai --no-spec
```

![image-20261011220158758](./img/image-20261011220158758.png)

然后在AiService 里调用 langchain 创建一个 chain



![image-20261012202342703](./img/image-20261012202342703.png)

使用@Inject 通过 key 在构造器里创建 一个model

我们看对应的Contolller:

![image-20261012204114803](./img/image-20261012204114803.png)

在这里加了一个路由/ai/chat

#### 模型配置文件

然后关于在Service中模型的配置，我们写到配置文件

这里用一个新的包

```shell
pnpm i @nestjs/config
```

然后在 AppModule 里引入 ConfigModule：

![image-20261012205526798](./img/image-20261012205526798.png)

它的作用就是读取 .env 配置文件，提供一个 service 来读配置

isGlobal 设置为 true 就是全局模块，也就是不用 imports 就可以注入里面的 provider

然后在根目录写上模型的配置，再看在ai.module.ts 中的使用

![image-20261012210136753](./img/image-20261012210136753.png)

然后我们访问对应的接口：

[localhost:3000/ai/chat?query=ai agent学习路线](http://localhost:3000/ai/chat?query=ai agent学习路线)

![image-20261012211505508](./img/image-20261012211505508.png)

这样就完成了ai接口

但是现在并没有流式返回

#### 流式返回处理

这种不断返回内容一般用 SSE（server-sent event） 来做

SSE流程：

![sse-flow](./img/langchain-nest-sse-01.png)

服务端返回的 Content-Type 是 text/event-stream，这是一个流，可以多次返回内容

我们在AiService 里加一个流式的接口：

![image-20261012212956036](./img/image-20261012212956036.png)

调用 chain 的 stream 方法，流式返回内容

这里用到了 js 的生成器语法，也就是方法名那里标个*，然后 yield 不断异步返回内容

这里不过分纠结这个语法，只用了解到我们在对应的Controller中是如何消费这个chunk的

![image-20261012214124060](./img/image-20261012214124060.png)

加了一个路由/ai/chat/stream

声明接口是 sse 的，然后创建一个 Observable，从 service 的返回流里读取内容，用 map 转成有 data 属性的对象

这个是 rxjs 的写法，Nest 用 rxjs 来处理异步流

其实和 LCEL 的声明式写法思路一样，就是声明对这个流做什么处理

访问这个地址，此时就是流式返回了

![image-20261012214616133](./img/image-20261012214616133.png)

#### 前端处理

直接新建 hello-nest-langchain\public\sse-test.html

然后让让 nest 服务支持静态 html 文件访问

```shell
pnpm i @nestjs/serve-static
```

![image-20261012224611491](./img/image-20261012224611491.png)

然后关注页面的逻辑部分：

![image-20261012215605492](./img/image-20261012215605492.png)

调用 EventSource 的 api，在 onmessage 回调里接收 data 就可以了

EventSource是浏览器的API,存在一些局限，比如**只能 GET，且无请求体**、**不能自定义请求头**

访问静态页面：[SSE 流式接口测试](http://localhost:3000/sse-test.html)

![image-20261012224656432](./img/image-20261012224656432.png)

### 补充

#### js异步生成器语法

这是纯语法/概念解释，不涉及改代码，我直接讲。

**一、`async *` 是什么**

`*` 标记这是一个**生成器函数**，`async` 表示它还是**异步**的。两者组合叫 **异步生成器函数（async generator）**，调用它不会立刻执行函数体，而是返回一个**异步迭代器对象**（`AsyncGenerator<string>`）。

对应 [ai.service.ts:22](hello-nest-langchain/src/ai/ai.service.ts#L22)：

```ts
async *streamChain(query: string): AsyncGenerator<string> {
  const stream = await this.chain.stream({ query });
  for await (const chunk of stream) {
    yield chunk;
  }
}
```

四种函数变体对比：

| 写法                  | 返回       | 产出物               | 能否 `await` |
| --------------------- | ---------- | -------------------- | ------------ |
| `function f()`        | 值         | —                    | 否           |
| `function* f()`       | 同步迭代器 | `yield` 同步值       | 否           |
| `async function f()`  | Promise    | —                    | 是           |
| `async function* f()` | 异步迭代器 | `await yield` 异步值 | 是           |

**二、`yield` 的语义：暂停 + 吐出**

`yield chunk` 不是 `return`。它的行为是：

1. 把 `chunk` 交给**调用方**（谁在 for await 谁就拿到）；
2. **函数在此处挂起**，局部变量、执行位置全部保留；
3. 调用方要下一个值时，从挂起处**继续往下执行**，直到下一个 `yield`。

所以这个函数本质是「**按需生产的流水线**」，而不是「一次性算出所有结果」。对比非生成器写法：

```ts
// 全部塞进数组再返回 —— 必须等 LLM 全部答完，内存里存一整份
async streamChainAll(query: string): Promise<string[]> {
  const stream = await this.chain.stream({ query });
  const out: string[] = [];
  for await (const chunk of stream) out.push(chunk);
  return out;
}
```

生成器版本是**惰性的**：LLM 吐一个 token，`yield` 一个，调用方立刻能推到前端，首字节延迟从「整段生成完」降到「第一个 token」。

**三、这里有两层异步迭代**

容易看混，拆开看：

```ts
const stream = await this.chain.stream({ query });  // 第一层：拿到 LangChain 的流
for await (const chunk of stream) {                 // 第二层：消费这个流
  yield chunk;                                      // 第三层：把每个 chunk 转交给上层消费者
}
```

- `await this.chain.stream(...)`：`stream()` 本身返回 Promise，await 后得到**异步可迭代对象**（每个 `chunk` 是模型输出的一小段字符串）。
- `for await ... of`：异步遍历它。注意 `for await` 只能用于异步迭代器 / 同步迭代器，普通数组也能用。
- `yield`：`streamChain` 自己又是个异步生成器，所以它也能被 `for await` 消费——**逐层转发**。

`yield*` 是简写形式，等价于上面的循环：

```ts
async *streamChain(query: string) {
  yield* await this.chain.stream({ query });
}
```

**四、谁来消费它**

看 [ai.controller.ts:16-20](hello-nest-langchain/src/ai/ai.controller.ts#L16-L20)：

```ts
@Sse('chat/stream')
chatStream(@Query('query') query: string): Observable<{ data: string }> {
  return from(this.aiService.streamChain(query)).pipe(
    map((chunk) => ({ data: chunk }))
  );
}
```

`from()`（RxJS 7+）能把**异步可迭代对象**直接转成 `Observable`，于是整条链路是：

```
LLM SSE 流 → chain.stream() → for await → yield → from() → Observable → @Sse → 浏览器 EventSource
```

这也是为什么这里必须用生成器而不是数组：NestJS 的 `@Sse` 需要的是一个**能持续推数据的流**，`Observable` 每收到一个值就写一条 SSE `data:` 帧；如果先 `push` 满数组再返回，就退化成一次性响应了。

**五、几个必须知道的坑**

1. **`yield` 只能在生成器函数里用**。`async *streamChain` 里可以用 `await`，普通 `function*` 里不行。
2. **异常会终结迭代器**。函数体里抛错，`for await` 那边会在 `next()` 上 reject。想在被外部提前 `break` 时清理资源，写 `try { ... } finally { ... }`。
3. **提前退出**：调用方 `break` 或 Stream 取消订阅，会让生成器在挂起点被「遣散」，`finally` 会跑，后面代码不再执行。SSE 场景下客户端断开就属于这种。
4. **不能重复迭代**。`AsyncGenerator` 是一次性的，`from()` 被订阅两次不会重放，第二次会是空的（要重放得用 `defer(() => from(...))` 之类）。
5. **`return` vs `yield`**：生成器里的 `return x` 表示结束，`x` 作为 `{ done: true, value: x }` 返回，`for await` 循环拿不到它；想让调用方拿到得用 `yield`。

**六、手写等价代码（帮助理解原理）**

上面那段 `for await + yield` 约等于：

```ts
// 语义等价，只是手写出来
streamChain(query: string) {
  const it = this.chain.stream({ query });   // 忽略 stream 外层 Promise
  return {
    [Symbol.asyncIterator]() { return this; },
    next: () => it.then(s => s.next()).then(r => ({ value: r.value, done: r.done })),
  };
}
```

`async *` 只是把「实现 `Symbol.asyncIterator` + 维护暂停状态」这套样板语法糖化了。

一句话总结：`async *` + `yield` 是「**可暂停、可逐块流出的异步序列**」，这里被用来把 LangChain 的 token 流转发成 SSE 流，关键在于**惰性、低延迟、低内存**，而不是攒完再发。



#### chatStream中rxjs用法概念解释

看完两个文件，这段其实是**两个"管道"概念的交接点**，我换个视角讲。

**换个概念：这不是"异步"，是"传送带"**

你平时写的 `async/await` 是**一次性快递**：调用 → 等 → 拿到**一个**包裹，然后结束。

而这里返回的 `Observable` 是**回转寿司传送带**：盘子（值）按时间一个接一个送到你面前，可能送很多个，可能中途断货（`error`），也可能最后传送带停下（`complete`）。最关键的是——**你可以随时起身走人**（取消订阅），这在 Promise 世界里做不到。

顺着这个比喻拆你这三行：

| 代码                 | 传送带视角                                                   |
| -------------------- | ------------------------------------------------------------ |
| `streamChain(query)` | 上游那台机器，是**AsyncGenerator**——它只会"你伸手我才给"（`for await` 就是伸手拿） |
| `from(...)`          | **把"伸手拿"改成"自动往前送"** 的转接装置。这就是这行代码的全部意义：pull 模式 → push 模式 |
| `.pipe(map(...))`    | 在传送带上**加装一个加工工位**。每过来一个零件就套个包装盒：`"你好"` → `{ data: "你好" }` |
| `@Sse`               | 传送带的出口。Nest 帮你**订阅**这条带子，每来一个零件就往浏览器写一条 `data: {...}\n\n` |

所以 controller 里**没有 `async`、没有手写订阅**——因为 Observable 天生就是"延迟执行 + 有人订阅才启动"，框架替你做订阅这件事。

**一个细节：`from()` 到底解决什么问题**

`AiService.streamChain` 返回的是 AsyncGenerator，Nest 的 `@Sse` 只认 Observable。所以 `from()` 干的活儿是**协议转换**：

```ts
for await (const chunk of stream) { yield chunk }   // 消费方主动要
                    ↓ from()
Observable 每 yield 一个就往订阅者那里推                  // 生产方主动给
```

顺手一提：`of()` 用来包"同步的一串定值"，`from()` 用来包"Promise / 数组 / 异步可迭代对象"。你这里是 AsyncGenerator，所以必须用 `from`。

**最妙的地方：两个 `.pipe()` 是同一个隐喻**

看两处代码：

```ts
// ai.service.ts:15  —— LangChain 的管道
this.chain = prompt.pipe(model).pipe(new StringOutputParser());

// ai.controller.ts:17 —— RxJS 的管道
from(...).pipe(map(chunk => ({ data: chunk })))
```

两者都是**"上一步的输出直接接到下一步的输入"**。区别只是：

- LangChain 的 pipe 组的是**处理逻辑**（提示词 → 模型 → 解析文本），一次请求走一遍
- RxJS 的 pipe 组的是**时间轴上的数据流**（每来一个 token 就 map 一次），一直在跑

你的代码正好是这两条管道首尾相接：LangChain 那侧吐出 token 流，RxJS 这侧把 token 流包成 SSE 事件流。

顺带说两个坑

1. **`from()` 默认是冷 Observable**：每被订阅一次，`streamChain(query)` 就重新执行一次，真的再调一遍大模型。这里 `@Sse` 只订阅一次所以没事，但如果自己再 `.subscribe()` 一次就会重复请求。
2. **这里的 `map` 不需要 `async`**：它是纯同步变换，只改形状不改时机。如果要在里面 await（比如查库），得用 `mergeMap` / `concatMap` 这类操作符，`map` 里 await 会得到一个 Observable 而不是值。

如果你想让客户端能区分"正常片段"和"结束/错误"，下一步可以在 map 里带上 `type` 字段，或者用 `filter` + `catchError` 组合——要的话我可以直接改成那种版本。