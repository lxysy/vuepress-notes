---
title: React
date: 2024-01-02
categories:
  - 框架
  - React
tags:
  - React
---

## 简介

`jsx`不是一门标准语言，需要编译成`js`。在`react`中是可选的，但大多数`react`项目会使用jsx

### 添加样式：

```html
<img className="avator"></img>
```

可在`css`文件中单独定义样式，`react`没有规定如何添加`css`文件，在`HTML`可使用`link`标签。在`.jsx`组件导入该样式文件，使用变量的方式添加到元素上，具体方式参考构建框架如`umi`

```js
import style from './index.less'
<img className={style.avator} style={{display:none}}></img>
```

```css
.avator{
    width:100%
}
```

使用{}会回到`JavaScript`中

### 条件渲染

没有特殊语法编写条件语句，根据变量动态导入`jsx`或使用`？ 、&&`等运算符

### 渲染列表

### 响应事件

```jsx
const handleClick = ()=>{}
const Test = (){
    return(
    	<button onClick={handleClick}></button>
    )
}
```

### 更新界面

```react
import { useState } from 'react';

const handleClick = ()=>{
    setCount(count + 1)
    // setCount(count++)报错
}

// 在组件中声明state
const Test = (){
    const [count,setCount] = useState(0)
    return(
    	<button onClick={handleClick}></button>
    )
}
```

### Hook

以`use`开头的函数，`useState`为`react`内置`hook`，`hook`只能在**组件**或者其他`hook`的顶层调用

若想在条件循环中使用`useState,`请提取一个组件并在组件内部使用

###　组件之间共享数据

将两个按钮的数据同是更新，将各个按钮的 `state`向上移动到父组件

```react
import { useState } from 'react';

const App = () => {
    const [count,setCount] = useState(0)   
    const handleClick = ()=>{
        setCount(count + 1)
        // setCount(count++)报错
    }
    return(
    	<>
        	<Test count={count} onClick={handleClick}/>
        	<Test count={count} onClick={handleClick}/>
        </>
    )
}

// 在组件中声明state
const Test = ({count,onClick}){
    return(
    	<button onClick={onClick}>{count}</button>
    )
}
```

### hook示例

`react`组件以`.js 、.jsx或.tsx`为后缀，当需要使用`typeScript`的类型检查功能时，使用`.tsx`

#### `useReducer`

是一个用于管理组件状态的`Hook`，他是`userState`的替代方案，用于处理复杂的状态逻辑

接受一个`reducer`函数和初始state作为参数，`reducer`函数接受两个参数：当前状态和`action`对象，根据`action`的类型来更新状态，`reducer`函数返回的状态将替换当前状态

```tsx
import { useReducer } from "react";

interface State{
  count:number
}

type CounterAction = 
  {type:'reset'}
  | {type:"setCount"; value:State['count']}

const intialState: State = {
  count: 0
}


/**
 * reducer函数
 * @param state 当前状态 
 * @param action 操作状态传入的对象
 * @returns 返回状态替换当前状态
 */
function stateReducer(state:State,action:CounterAction):State{
  switch(action.type){
    case 'reset':
      return intialState
    case "setCount":
      return {...state,count:action.value}
    default:
      throw new Error("Unknown action type: " + action);
  }
}

export default function Test(){
  const [state,dispatch] = useReducer(stateReducer,intialState)

  const addFive = ()=>dispatch({type:'setCount',value:state.count + 5})
  const reset = ()=>dispatch({type:'reset'})

  return(
    <div>
      <h1>计数器</h1>

      <p>计数：{state.count}</p>
      <button onClick={addFive}>+ 5</button>
      <button onClick={reset}>+ 5</button>
    </div>
  )
}
```

#### `useContext`

是一种无需通过组件传递`props`,可以直接在组件树中传递数据的技术。通过创建`provider`组件使用，通常会创建一个`Hook`在子组件使用

```tsx
type Theme = 'light' | 'dark' | 'system'
const ThemeContext = createContext<Theme>('system')
const useGetTheme = ()=>useContext(ThemeContext)

function Test1(){
  const [theme,setTheme] = useState<Theme>('light')

  return(
    <ThemeContext.Provider value={theme}>
      <MyComponent></MyComponent>
    </ThemeContext.Provider>
  )
}

function MyComponent(){
  const theme = useGetTheme()
  return(
    <div>
      <p>当前主题：{theme}</p>
    </div>
  )
}
```

#### `useMemo`

在`React`中，`useMemo`是一个用于优化性能的`Hook`。它的作用是在组件重新渲染时，只有在依赖项发生变化时才重新计算和返回值，否则直接返回上一次计算的结果。

`useMemo`接受两个参数：一个函数和一个依赖项数组。函数用于计算和返回一个值，依赖项数组用于指定在数组中的值发生变化时才重新计算该值。

下面是一个使用`useMemo`的简单示例：

```jsx
import React, { useMemo } from 'react';

function ExpensiveComponent({ a, b }) {
  // 计算和返回一个值
  const result = useMemo(() => {
    console.log('Calculating result...');
    return a + b;
  }, [a, b]);

  return (
    <div>{result}</div>
  );
}

function App() {
  const a = 5;
  const b = 10;

  return (
    <ExpensiveComponent a={a} b={b} />
  );
}
```

在上面的示例中，我们定义了一个`ExpensiveComponent`组件，它接受两个属性`a和b`。在`ExpensiveComponent`组件中，我们使用`useMemo`来计算和返回一个值`result`。`useMemo`的第一个参数是一个函数，它在依赖项`a和b`发生变化时才会被调用。第二个参数是一个依赖项数组，它指定了在数组中的值发生变化时才重新计算`result`。

通过使用`useMemo`，我们可以避免在每次组件重新渲染时都重新计算`result`，只有在`a或b`发生变化时才进行计算。这样可以提高组件的性能，避免不必要的计算和渲染。

> 注：第二个参数必须是一个数组，这个依赖项数组可以包含任何值，不止是基本数据类型，也可以是对象、数组、函数等。React使用浅比较，当依赖数组中的值为引用数据类型，只有引用改变，才会重新计算

#### `useCallback`

`useCallback`是`React`中的一个优化性能的`Hook`，它用于返回一个记忆化的**函数**。当依赖项发生变化时，会返回一个新的函数，否则返回上一次记忆的函数。

`useCallback`接受两个参数：一个函数和一个依赖项数组。函数是需要记忆化的函数，依赖项数组用于指定在数组中的值发生变化时才返回一个新的函数。

下面是一个使用`useCallback`的简单示例：

```jsx
import React, { useCallback } from 'react';

function ExpensiveFunction({ a, b }) {
  // 记忆化函数
  const calculateResult = useCallback(() => {
    console.log('Calculating result...');
    return a + b;
  }, [a, b]);

  return (
    <div>{calculateResult()}</div>
  );
}

function App() {
  const a = 5;
  const b = 10;

  return (
    <ExpensiveFunction a={a} b={b} />
  );
}
```

在上面的示例中，我们定义了一个`ExpensiveFunction`组件，它接受两个属性a和b。在`ExpensiveFunction`组件中，我们使用`useCallback`来返回一个记忆化的函数`calculateResult`。`useCallback`的第一个参数是一个函数，它在依赖项`a和b`发生变化时才会返回一个新的函数。第二个参数是一个依赖项数组，它指定了在数组中的值发生变化时才返回一个新的函数。

通过使用`useCallback`，我们可以避免在每次组件重新渲染时都重新创建`calculateResult`函数，只有在`a或b`发生变化时才返回一个新的函数。这样可以提高组件的性能，避免不必要的函数创建和内存消耗。

> 需要注意的是，记忆化的函数是通过引用比较来确定是否发生变化的。如果**函数内部使用了依赖项数组中的值**，那么每次渲染时都会创建一个新的函数，即使依赖项的值没有发生变化。为了避免这种情况，可以使用useMemo来记忆化函数内部使用的值。



#### `useMemo`和`useCallback`的使用场景和区别

它们可以在某些特定场景下使用，以避免不必要的计算和渲染。

`useCallback`适用于以下场景：

1. 将函数作为`props`传递给子组件时，可以使用`useCallback`来避免在每次渲染时都创建新的函数实例，从而避免子组件的不必要渲染。

2. 在使用`useEffect`时，可以使用`useCallback`来指定依赖项数组，以确保只有在依赖项发生变化时才执行`effect`。

3. 在使用自定义`Hook`时，可以使用`useCallback`来返回一个记忆化的函数，以避免在每次渲染时都重新创建函数。

`useMemo`适用于以下场景：

1. 在计算和返回某个值时，可以使用`useMemo`来避免在每次渲染时都重新计算该值。只有在依赖项发生变化时，才会重新计算和返回`Memoized`的值。

2. 在渲染大量数据列表时，可以使用`useMemo`来缓存计算结果，以避免在每次渲染时都重新计算数据。

区别：

1. `useCallback`返回的是一个记忆化的函数，而`useMemo`返回的是一个记忆化的值。

2. `useCallback`的第一个参数是一个函数，`useMemo`的第一个参数是一个返回值的函数。

3. `useCallback`的依赖项数组用于指定在数组中的值发生变化时才返回一个新的函数，而`useMemo`的依赖项数组用于指定在数组中的值发生变化时才重新计算`Memoized`的值。

4. `useCallback`主要用于避免子组件的不必要渲染，而`useMemo`主要用于避免不必要的计算和渲染。

需要根据具体的场景和需求来选择使用`useCallback`还是`useMemo`，以达到最佳的性能优化效果。

## 详情

### 交互

响应事件

事件处理函数、内联事件处理函数

```jsx
<button onClick={handleClick}></button>
<button onClick={（）=>{...}}></button>
```

事件处理函数读取`props`

```jsx
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="正在播放！">
        播放电影
      </AlertButton>
      <AlertButton message="正在上传！">
        上传图片
      </AlertButton>
    </div>
  );
```

将事件处理函数作为`props`传递

```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`正在播放 ${movieName}！`);
  }

  return (
    <Button onClick={handlePlayClick}>
      播放 "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('正在上传！')}>
      上传图片
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="魔女宅急便" />
      <UploadButton />
    </div>
  );
}
```

### 事件传播

事件处理函数将会捕获任何来自子组件的事件

> 注：`React`中所有事件都会传播，除了`onScroll`,它仅适用于你附加到的`JSX`标签；`e.stopPropagation()`阻止事件冒泡，`e.preventDefault()`阻止浏览器默认事件

### 渲染和提交

初次渲染，`React`调用根组件

后续渲染，`React`会调用内部状态更新触发了渲染的函数组件

设置`state`只会为下一次渲染变更`state`的值

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

每次点击只会让`number`递增一次，点击事件过程：

1. `setNumber(number + 1);` ：`number`是`0`，`setNumber(0 + 1);`  React在下一次渲染时将number改为1
2. `setNumber(number + 1);` ：`number`是`0`，`setNumber(0 + 1);`  React在下一次渲染时将number改为1
3. `setNumber(number + 1);` ：`number`是`0`，`setNumber(0 + 1);`  React在下一次渲染时将number改为1

尽管调用了三次`setNumber(number + 1);`，但在这次渲染的事件函数中`number`一直为`0`

### 随时间变化的state

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```



```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(()=>{alert(number)},3000)
      }}>+5</button>
    </>
  )
}
```

第一段代码弹出框结果为`0`，弹出框未关闭前，`h1`为`0`，关闭后为`5`

第二段代码`h1`为`5`，弹出框为`0`

- `useState`的更新是异步的，`setNumber`函数并不会立即改变当前的状态`number`，在下一次渲染后更新；
- 当调用`useState`时，`React`会为该次渲染提供一张state快照
- 每个渲染都有自己的渲染函数
- 每个渲染(以及其中的函数)始终看到的是`React`提供给这个渲染的`state`快照



### 批量更新state（加入更新队列）

`React`会等到事件处理函数中的所有代码都运行完毕再处理你的`state`更新

### 在下次渲染前多次更新同一个state

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

`n => n + 1`被称为更新函数，当它被传给第一个`state`设置函数时：

1. 将更新函数加入队列,在事件处理函数中的所有其他代码运行后处理
2. 在下一次渲染期间调用`useState`时，`React`会遍历队列，将初始状态作为参数传入更新函数执行，`React`会获取上一次的更新函数的返回值作为下个更新函数的参数，以此类推



```jsx
<button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>增加数字</button>
```

输出 6

> `setState(x)`实际上会像`setState(n => x)`一样运行，都会被放入队列中，只是没有使用`n`

> 事件处理函数结束后，`React`将触发重新渲染，重新渲染期间，`React`将会处理队列，更新函数将会在渲染期间执行，所以更新函数必须是**纯函数**。不要尝试在更新函数中执行其他副作用，在严格模式下，`React`会执行每个更新函数两次（丢弃第二个结果）以帮助你发现错误

- 设置`state`不会更改现有渲染中的变量，但会重新请求新渲染
- 在事件处理函数执行完成之后，处理`state`更新被称为批处理
- 在一个事件中多次更新`state`使用更新函数`setState(x=>x+1)`

### 更新state的对象

不能直接修改`state`中的对象，需要重新创建一个新的对象（或者将其拷贝一份），然后将`state`更新为此对象

> 复制对象时可以使用`...`展开运算符，但是它的本质是浅拷贝，当存在嵌套属性时需要多次使用展开语法

```jsx
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

```jsx
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

```jsx
setPerson({
  ...person, // 复制其它字段的数据 
  artwork: { // 替换 artwork 字段 
    ...person.artwork, // 复制之前 person.artwork 中的数据
    city: 'New Delhi' // 但是将 city 的值替换为 New Delhi！
  }
});
```

但是这种用法在有多几嵌套时过于冗长，使用`immer`库解决

```shell
npm install user-immer
```

```jsx
import { useImmer } from 'use-immer'

//替换掉下述代码
// import { useState } from 'react'

const [person, setPerson] = useImmer({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});


setPerson(draft => {
    draft.artwork.city = 'aaa'
})
```

> `immer`提供的`draft`对象时一种特殊的类型对象，被称为`Proxy`，它会检查对象的哪些部分被改变，并依照改变新建一个新对象

- 将`React`中所有的`state`都视为不可直接修改的
- 直接修改`state`不会重新渲染，并会改变前一次渲染“快照”中`state`的值

### 更新state中的数组

|          | 避免使用(会改变原始数组)  | 推荐使用 (会返回一个新数组        |
| -------- | ------------------------- | --------------------------------- |
| 添加元素 | push，unshift             | concat，[...arr] 展开语法（例子） |
| 删除元素 | pop，shift，splice        | filter，slice（例子               |
| 替换元素 | splice，arr[i] = ... 赋值 | map（例子）                       |
| 排序     | reverse，sort             | 先将数组复制一份（例子）          |

或者使用`immer`,这样就可使用表格中的所有方法

## 状态管理

构建`state`结构原则

1. 合并多个关联的`state`
2. 避免矛盾、冗余的(可从其它`state`计算而来)、重复的(同一数据在嵌套数据中重复)`state`
3. 避免深度嵌套`state`

不要将组件的`props`构建成`state`，当父组件传递的`props`发生改变，**`state`不会更新**，只有当想要忽略`props`的新值时，可以使用这种写法，按照惯例，`props`的名称以`initial`或`default`开头

```jsx
function Message({msgColor}){
    const [color,setColor] = useState(msgColor)
}
```

```jsx
function Message({initialColor}){
    const [color,setColor] = useState(initialColor)
}
```



### 在组件之间共享状态

若希望两个组件的状态共同更新，可以将相关state从两个组件移到共公共的父组件

```jsx
 import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          显示
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>哈萨克斯坦，阿拉木图</h2>
      <Panel title="关于">
        阿拉木图人口约200万，是哈萨克斯坦最大的城市。它在 1929 年到 1997 年间都是首都。
      </Panel>
      <Panel title="词源">
        这个名字来自于 <span lang="kk-KZ">алма</span>，哈萨克语中“苹果”的意思，经常被翻译成“苹果之乡”。事实上，阿拉木图的周边地区被认为是苹果的发源地，<i lang="la">Malus sieversii</i> 被认为是现今苹果的祖先。
      </Panel>
    </>
  );
}
```

`Accordion`下的`Panel`的状态时相互独立的，若想在展开时只打开一个面板，需要将各个`Paneld`的状态提升到父组件

```jsx
 import { useState } from 'react';

function Panel({ title, children，isActive,onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          显示
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
    const [activeIndex,setActiveIndex] = useState(0)
  return (
    <>
      <h2>哈萨克斯坦，阿拉木图</h2>
      <Panel title="关于" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)}>
        阿拉木图人口约200万，是哈萨克斯坦最大的城市。它在 1929 年到 1997 年间都是首都。
      </Panel>
      <Panel title="词源" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)}>
        这个名字来自于 <span lang="kk-KZ">алма</span>，哈萨克语中“苹果”的意思，经常被翻译成“苹果之乡”。事实上，阿拉木图的周边地区被认为是苹果的发源地，<i lang="la">Malus sieversii</i> 被认为是现今苹果的祖先。
      </Panel>
    </>
  );
}
```

这里将状态提升到父组件，再将更改状态的函数从父组件传入，由子组件`UI`触发



### 对state进行保留重置

当向组件中添加状态时，可能会认为状态”存在“组件当中，但实际上，状态是由React保存的，React通过组件在渲染树中的位置，将它保存的每个状态与组件关联起来

```jsx
import { useState } from 'react';

export default function App() {
    const counter = <Counter />
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

以上例子中只有一个`<Counter />`标签，，但它们会在两个不同的位置渲染，相互独立，互不影响



只有当在树中相同位置渲染相同的组件时，`React`才会保留组件的`state`，第二个计数器的`state`一直被保留。

当停止渲染第二个计数器时，会销毁它的`state`;

只要一个组件还被渲染在`UI`树的相同位置，`React`就会保留它的`state`

```jsx
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        加一
      </button>
    </div>
  );
}
```

> 更新`App`的状态不会导致`Counter`的state被重置，`Counter`是位于相同位置的相同组件，对`React`来说它是同一个组件，会保留它的状态
>
> 对`React`来说，重要的树`React`在`UI`树中的位置，而不是在`jsx`中的位置；`React`只会看到你返回的树，而不知道函数中是如何判断的

**相同位置的不同组件会使`state`重置**

并且当在相同位置渲染不同组件时，组建的整个子树会被重置；

> 注意：组件函数的定义不应该嵌套，加入父组件函数定义中又定义了子组件，在父组件每次渲染时都会创建一个不同的子组件函数，所以在相同位置渲染的时**不同**的组件，并且会导致性能问题。

**相同组件重置state**

- 将组件渲染在不同位置

```jsx
  export default function App() {
    const [isFancy, setIsFancy] = useState(false);
    return (
      <div>
        {isFancy && (
          <Counter isFancy={true} /> 
        )} 
        {！isFancy && (
          <Counter isFancy={false} /> 
        )}
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          使用好看的样式
        </label>
      </div>
    );
  }
```
- 使用key重置state

```jsx
export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} key="Taylor"/> 
      ) : (
        <Counter isFancy={false} key="Sarah"/> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        使用好看的样式
      </label>
    </div>
  );
}
```



> `key`并不是全局唯一的，它们只能指定父组件内部的顺序；即使是在同一位置，但是`key`不同，`React`会将它们看做两个组件



- 在相同位置渲染相同组件，`React`会保留其状态
- 为子树指定一个不同的`key`，可以重置它的状态
- 不要嵌套定义组件，否则可能导致子组件意外重置`state`



### 迁移状态至Reducer中

当组件在需要更新的状态过多，会导致过于分散的事件处理函数。对于这种情况，可以将组件中的所有状态更新逻辑整合到一个外部函数`Reducer`中。

通过三个步骤将`useState`迁移到`useReducer`:

1. 将`setState`的路基修改成`dispatch`一个`action`  
2. 编写一个`reducer`函数
3. 在组件中使用`reducer`函数



**将`setState`的路基修改成`dispatch`一个`action`**  

```jsx
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

将`setState`改为`dispatch action`

```tsx
function handleAddTask(text) {
    dispatch({
        type:'added',
        id:nextId++,
        text:text
    })
}

function handleChangeTask(task) {
    dispatch({
        type:'changed',
        task:task
    })
}

function handleDeleteTask(taskId) {
    dispatch({
        type:'deleted',
        id:taskId
    })
}
```

`dispatch`的对象叫做`action`对象，它是一个普通的`js`对象，它的结构由自己决定

> 注：按照惯例来说，通常会添加一个type:字段用于表明发生了什么，其他字段用于传递额外信息



**编写`reducer`函数**

```tsx
// 参数为当前的state action对象
function yourReducer(tasks,action){
    // 返回更新后的state
    switch(action.type){
        case 'added':{
            return [
                ...tasks,
                {
                  id: action.id,
                  text: action.text,
                  done: false,
                },
              ]
        }
        case 'changed':{
            return tasks.map((t) => {
                if (t.id === task.id) {
                    return task;
                  } else {
                    return t;
                  }
            }
        }
        case 'deleted':{
        	return tasks.filter((t) => t.id !== taskId)                    
        }
        default:{
            throwError('未知 action' + action.type)
        }
    }
}
```

> 按照惯例，通常会使用`switch`,相比`if/else`更加清晰;`reducer`实际上是参考数组方法`reduce`命名的；
>
> `reduce`允许你将数组中的多个值”累加”成一个值；
>
> `reducers`接收一个**目前状态**和**`action`**，返回**下一个状态**，`action`会随着时间累计到状态中



**在组价中使用`reducer`**

```tsx
import { useReducer } from 'react'

// cosnt [tasks，setTasks] = useState(initialTasks)

// 替换为reducer
cosnt [tasks，dispatch] = useReducer(tasksReducer,initialTasks)
```

> 甚至可以将`reducer`函数分离成另一个文件，以减小组件代码，以便更好地理解组件逻辑；事件处理程序只通过派发任务来指定发生了什么，而`reducer`函数通过响应`actions`来决定状态如何更新；
>
> `useReducer`和`useState`可自由搭配，，甚至可在一个组件同时使用



**编写reducer函数的原则**

- `reducer`函数**必须纯净**，它不应该包含异步请求和定时器等任意副作用，`recucer`在渲染时运行，`actions`会排队直到下一次渲染
- 每个`action`都只描述一个单一的用户交互，即使它会引发数据的多个变化



**使用`Immer`简化`reducers`**

使用`Immer`库可使用`push、arr[i]`更新状态

```tsx
import { useImmerReducer } from 'user-immer'

cosnt [tasks，dispatch] = useImmerReducer(tasksReducer,initialTasks)

function yourReducer(tasks,action){
    // 返回更新后的state
    switch(action.type){
        case 'added':{
            tasks.push({
                 id: action.id,
                 text: action.text,
                 done: false,
            })
        }
        case 'changed':{
            const index = tasks.findIndex((t)=>{t.id === action.task.id})
            task[index] = action.task
        }
        case 'deleted':{
        	return tasks.filter((t) => t.id !== taskId)                    
        }
    }
}
```


### 使用context深层传递参数

当状态提升到太高的层级，会导致逐层传递props的情况

```jsx
export default function Page() {
  return (
    <Section level={1}>
      <Heading>主标题</Heading>
      <Section level={2}>
        <Heading>标题1</Heading>
        <Heading>标题2</Heading>
      </Section>
    </Section>
  )
}
```

创建context

```js
// LevelContext.js 创建context
import { createContext } from 'react'

export const LevelContext = createContext(1)
```

使用、提供context

```jsx
// Section.jsx
import { useContext } from 'react'
import { LevelContext } from './LevelContext.js'

export default Section ({children}) {
  const level = userContext(LevelContext)
  return (
    <section>
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  )
}
```

```jsx
export defaault function Heading(children){
  const level = useContext(LevelContext)
  ... 
}
```

> 在Section组件中的任何子组件请求`LevelContext`都会使用UI树中它上层最近的`LevelContext.Provider`传递过来的值;若想要覆盖来自上层的某些context,唯一的方法是将子组建重包裹到一个提供不同值的`contex .provider`


### context的使用场景

* 主题
* 当前账户
* 路由
* 状态管理：随着应用的增长，在靠近顶层的位置可能会有很多state,通常使用`reducer`和`context`搭配使用来管理

### 结合使用`context`和`reducer`

1. 创建context
2. 将`state`和`dispatch`放入`context`
3. 在组件树的任何地方使用`context`

```jsx
const [task,dispath] = useReducer(taskReducer,initialTasks)
```

```js
//TaskContext.js
import { createContext } from 'react'

export const TaskContext = createContext(null)
export const TasksDispatchContext = createContext(null)
```


未使用`context`前：
```jsx
export  default function TaskApp() {
  const [task,dispatch] = useReducer(taskReducer,initialTasks)
  function handleAddTask(){dispathc({...}) ...}
  function hadndleChangeTask(){...}
  function hadndleDeleteTask(){...}

  return(
    <>
      <AddTask onAddTask={handleAddTask}/>
      <TaskList 
        tasks={tasks} 
        onChangeTask={hadndleChangeTask}
        onDeleteTask={hadndleDeleteTask}
      />
    </>
  )
}
```
> tasks状态和dispatch函数仅在顶级组件TaskApp中可用，要在其他组件使用则必须显式地传递当前状态和事件处理函数


使用`context`后：
```jsx
import { TaskContext,TasksDispatchContext } from './TaskContext.js'

export default function TaskApp() {
  const [task,dispatch] = useReducer(taskReducer,initialTasks)
  ...
  return(
    <TaskContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        <AddTask />
        <TaskList />
      </TasksDispatchContext.Provider >
    </TaskContext.Provider>
  )
}
```

> 任何子组件都能从`context`中获取`task`和`dispatch`

```jsx
export default function AddTask() {
  const dispath = useContext(TasksDispatchContext)
  ...
}
```

优化
```jsx
//TaskContext.js
import { createContext } from 'react'

export const TaskContext = createContext(null)
export const TasksDispatchContext = createContext(null)

export function TaskProvider({ children }) {
  const [] = userReducer(taskReducer,initialTasks)
  return(
    <TaskContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskContext.Provider>
  )
}
```

```jsx
import { TaskProvider } from './TaskContext.js'

export default function TaskApp() {
  return(
    <TaskProvider>
        <AddTask />
        <TaskList />
    </TaskProvider>
  )
}
```

## 进阶
 
### ref

```jsx
import { useRef } from 'react'

export default function Counter(){
  // useRef会返回一个对象{current: initialValue}
  let ref = useRef(0)

  function handleClick(){
    ref.current = ref.current + 1
    alert('点击了' + ref.current + '次') 
  }

  return(
    <button onClick={handleClick}>点击</button>
  )
}
```

> 更改`state`会重新渲染组件，更改`ref`不会
>
> 在渲染期间不要使用`ref`

### ref使用场景

通常当组建组要跳出`React`并与`API`通信时，你会用到`ref`（组件需要用到一些值，但不影响渲染逻辑）:

* 存储`Timeout ID`
* 存储和操作`DOM`元素
* 存储不需要被用来计算`JSX`的其他对象

### 操作DOM

```jsx
// react会将DOMy元素放入myRef.current
<div ref={myRef}>
```

#### 为列表绑定`ref`
 
`Hook`只能在组件的顶层被调用，不能在循环、条件语句或者`map`中调用`useRef`

将函数传递给`ref`属性，这称为`ref`回调
```jsx
import { useRef } from 'react'

export default function Test(){
  ...
  function getMap(){
    if(!temsRef.current){
      item.current = new Map()
    }
    return itemRef.current
  }
  return(
    <>
      <ul>
        {catList.map(cat => (
          <li
            key={cat.id}
            ref={(node) => {
              {/* 此处的node是对应的DOM节点 */}
              const map = getMap()
              if(node){
                map.set(cat.id,node)
              }else{
                map.delete(cat.id)
              }
            }}
          >
            <img
              src={cat.imageUrl}
              alt={'Cat #' + cat.id}
            >
          </li>
        ))}
      </ul>
    </>
  )
}
```

> `temsRef`保存的是列表项`ID`和`DOM`节点的`Map`
