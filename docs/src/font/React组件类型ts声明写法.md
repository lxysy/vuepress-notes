---
title: Hook的闭包陷阱原因和解决方案
date: 2026-07-01
categories:
  - 框架
  - React
tags:
  - React
  - ts
  - 前端
---

### JSX 的类型

React 函数组件默认返回值就是 JSX.Element

JSX.Element 的类型定义：React.ReactElement

`interface JSX.Element -> interface Element extends React.ReactElement<any,any> {}`

也就是说，如果你想描述一个 jsx 类型，就用 **React.ReactElement** 就好了



如果有的时候就是 number、null，此时需要换成 **React.ReactNode** 

类型定义如下：

```ts
type ReactNode =
        | ReactElement
        | string
        | number
        | Iterable<ReactNode>
        | ReactPortal
        | boolean
        | null
        | undefined
        | DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES[
            keyof DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES
        ];
```

这三个类型的关系 ReactNode > ReactElement > JSX.Element。

### 函数组件的类型

类型是 **FunctionComponent**

```tsx
const Aaa: React.FunctionComponent<AaaProps> = (props) => {
  return <div>aaa, {props.name}{props.content}</div>
}
```

看下它的类型定义：

```ts
type FC<P = {}> = FunctionComponent<P>;
interface FunctionComponent<P = {}> {
    (props: P,deprecatedLegacyContext?: any,): ReactNode;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
}
```

FC 和 FunctionComponent 等价，参数是 Props，返回值是 ReactNode

### hook 的类型

#### useState

```ts
const [num, setNum] = useState<number>();
```

#### useRef

useRef可以保存 dom 引用或者其他内容

所以它的类型也有两种

保存 dom 引用的时候，参数需要传个 null：

```tsx
const ref = useRef<HTMLDivElement>(null);
```

保存别的内容的时候，不能传 null，不然也会报错，说是 current 只读：

```ts
const ref1 = useRef<{ num: number }>();
console.log(ref1);
ref1.current = { num: 2 };
```

当你传入 null 的时候，返回的是 RefObject，它的 current 是只读的

而不传 null 的时候，返回的 MutableRefObject，它的 current 就可以改了

因为 ref 既可以保存 dom 引用，又可以保存其他数据，而保存 dom 引用又要加上 readonly，所以才用 null 做了个区分

传 null 就是 dom 引用，返回 RefObject，不传就是其他数据，返回 MutableRefObject

#### useImperativeHandle

之前写过 forwardRef + useImperativeHandle 把 ref 从子组件传递到父组件

```tsx
import { useRef } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { useImperativeHandle } from 'react';

interface ChildProps {
  name: string;
}

interface ChildRef {
  aaa: () => void;
}

const child: React.ForwardRefRenderFunction<ChildRef, ChildProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus();
      }
    }
  }, [inputRef]);

  return <div>
    <input ref={inputRef}></input>
    <div>{props.name}</div>
  </div>
}

const Father = React.forwardRef(child);

function App() {
  const ref = useRef<ChildRef>(null);
 
  useEffect(()=> {
    console.log('ref', ref.current)
    ref.current?.aaa();
  }, []);

  return (
    <div className="App">
      <Father name="father" ref={ref}/>
    </div>
  );
}

export default App;
```

这是在子组件定义类型：**`React.ForwardRefRenderFunction<childRef, childProps>`**

也可以在父组件定义类型：

```tsx
import { useRef } from 'react';
import { useEffect } from 'react';
import React from 'react';
import { useImperativeHandle } from 'react';

interface ChildProps {
  name: string;
}

interface ChildRef {
  aaa: () => void;
}

const Father = React.forwardRef<ChildRef, ChildProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus();
      }
    }
  }, [inputRef]);

  return <div>
    <input ref={inputRef}></input>
    <div>{props.name}</div>
  </div>
});
```

父组件在使用forwardRef包裹子组时定义类型：

 **`React.forwardRef<ChildRef, ChildProps>`**

useImperativeHanlde 可以有两个类型参数，一个是 ref 内容的类型，一个是 ref 内容扩展后的类型：

```tsx
const Father = React.forwardRef<ChildRef, ChildProps>((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle<ChildRef,{ccc: string} & ChildRef>(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus();
      },
      ccc:'ccc'
    }
  }, [inputRef]);

  return <div>
    <input ref={inputRef}></input>
    <div>{props.name}</div>
  </div>
});
```

不过一般没必要写，因为传进来的 ref 就已经是有类型的了，直接用默认推导的就行

#### useReducer

useReducer 可以传一个类型参数也可以传两个：

```tsx
const [res, dispatch] = useReducer<Reducer<Data, Action>>(
    reducer,
    (param) => {
      return {
        result: 1,
      };
    }
  );

const [res, dispatch] = useReducer<Reducer<Data, Action>, string>(
    reducer,
    "zero",
    (param) => {
      return {
        result: 1,
      };
    }
  );
```

当传一个的时候，是 Reducer<xx,yy> 类型，xx 是 state 的类型，yy 是 action 的类型

当传了第二个的时候，就是传入的**初始化函数参数**的类型

#### 其余 hook

useCallback 的类型参数是传入的函数的类型：

```tsx
const fn = useCallback<() => number>(() => {
    return 666;
  }, []);
```

useMemo 的类型参数是传入的函数的返回值类型：

```tsx
const obj = useMemo<{ aaa: number }>(() => {
    return {
      aaa: 1,
    };
  }, []);
```

useContext 的类型参数是 Context 内容的类型：

```tsx
import { createContext, useContext, Component } from "react";

const countContext = createContext(111);

function Aaa() {
  return (
    <div>
      <countContext.Provider value={222}>
        <Bbb></Bbb>
      </countContext.Provider>
    </div>
  );
}

function Bbb() {
  return (
    <div>
      <Ccc></Ccc>
    </div>
  );
}

function Ccc() {
  const count = useContext<number>(countContext);
  return <h2>context 的值为：{count}</h2>;
}

export default Aaa;
```

这些都没必要手动声明，用默认推导的就行

memo可以直接用包裹的函数组件的参数类型：

```tsx
function Bbb(props: BbbProps){
    console.log('bbb')
    return <h2>{props.count}</h2>
}
const MemoBbb = memo(Bbb)
```

或者在类型参数中声明：

```tsx
const MemoBbb = memo<BbbProps>(function Bbb(props: BbbProps){
    console.log('bbb')
    return <h2>{props.count}</h2>
})
```

### 参数类型

再来看传入组件的 props 的类型

#### PropsWithChildren

之前提到过，jsx 类型用 ReactNode，比如 content 参数

如果你不想通过参数传入内容，直接在模板中传入children:

```tsx
type CccProps = PropsWithChildren<{
  content: ReactNode;
}>;

function Ccc(props: CccProps) {
  return (
    <div>
      ccc,{props.content}
      {props.children}
    </div>
  );
}

function App() {
  return (
    <div>
      {/* 如果你不想通过参数传入内容，可以在 children 里,这时候就要声明 children 的类型为 ReactNode */}
      <Ccc
        content={<div>666</div>}
        color="yellow"
        styles={{ backgroundColor: "cyan" }}
      >
        <button>7777</button>
      </Ccc>
    </div>
  );
}
```

**声明 props.children 的类型为 ReactNode**

其实没有必要自己写，传 children 这种情况太常见了，React 提供了相关类型：

```ts
type CccProps = PropsWithChildren<{
  content: ReactNode,
}>
```

```ts
type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
```

#### CSSProperties

组件可以通过 props 传入一些 css 的值，此时类型使用CSSProperties

```tsx
type CccProps = PropsWithChildren<{
  content: ReactNode;
  color: CSSProperties["color"];
  // 此时填写参时会有css属性的类型提示
  styles?: CSSProperties;
}>;
```

#### HTMLAttributes

如果你写的组件希望可以当成普通 html 标签一样用，也就是可以传很多 html 的属性作为参数

可以继承 HTMLAttributes：

```ts
interface CccProps extends HTMLAttributes<HTMLDivElement> {}
```

当然，继承 HTMLAttributes 只有 html 通用属性，有些属性是某个标签特有的，这时候可以指定 FormHTMLAttributes、AnchorHTMLAttributes 等：

#### ComponentProps

继承 html 标签的属性，前面用的是 HTMLAttributes，其实也可以用 ComponentProps

```ts
import React, { HTMLAttributes, ComponentProps } from "react";
// ComponentProps 的类型参数是标签名，比如 a、div、form 这些
interface CccProps extends ComponentProps<"a"> {}
```

#### EventHandler

很多时候，组件需要传入一些事件处理函数，比如 clickHandler：

```tsx
import React, { HTMLAttributes, MouseEventHandler } from "react";

interface CccProps {
  clickHandler: MouseEventHandler
} 

function Ccc(props: CccProps) {
  return <div onClick={props.clickHandler}>ccc</div>
}

function App() {

  return <div>
    <Ccc clickHandler={(e) => {
      console.log(e);
    }}></Ccc>
  </div>
}

export default App;
```

这种参数就要用 xxxEventHandler 的类型，比如 MouseEventHandler、ChangeEventHandler 等，它的类型参数是元素的类型。

或者不用 XxxEventHandler，自己声明一个函数类型也可以：

```ts
import React, {
  HTMLAttributes,
  LazyExoticComponent,
  MouseEvent,
  MouseEventHandler,
} from "react";
interface CccProps {
  clickHandler: (e: MouseEvent<HTMLDivElement>) => void;
}
```

**总结：**

- **ReactNode**：JSX 的类型，一般用 ReactNode，但要知道 ReactNode、ReactElement、JSX.Element 的关系
- **FunctionComonent**：也可以写 FC，第一个类型参数是 props 的类型
- **useRef 的类型**：传入 null 的时候返回的是 RefObj，current 属性只读，用来存 html 元素；不传 null 返回的是 MutableRefObj，current 属性可以修改，用来存普通对象。
- **ForwardRefRenderFunction**：第一个类型参数是 ref 的类型，第二个类型参数是 props 的类型。forwardRef 和它类型参数一样，也可以写在 forwardRef 上
- **useReducer**：第一个类型参数是 Reducer<data 类型, action 类型>，第二个类型参数是初始化函数的参数类型。
- **PropsWithChildren**：可以用来写有 children 的 props
- **CSSProperties**： css 样式对象的类型
- **HTMLAttributes**：组件可以传入 html 标签的属性，也可以指定具体的 ButtonHTMLAttributes、AnchorHTMLAttributes。
- **ComponentProps**：类型参数传入标签名，效果和 HTMLAttributes 一样
- **EventHandler**：事件处理器的类型
