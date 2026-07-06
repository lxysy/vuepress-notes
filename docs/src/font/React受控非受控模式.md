---
title: React受控非受控模式
date: 2026-07-06
categories:
  - 框架
  - React
tags:
  - React
  - 前端
---

前端开发经常会涉及表单的处理，或者其他一些用于输入的组件，比如日历组件。

涉及到输入，就绕不开受控模式和非受控模式的概念。

改变表单值只有两种情况：

- 用户去改变 value 
- 代码去改变 value

如果不能通过代码改表单值 value，那就是非受控，也就是不受我们控制

但是代码可以给表单设置初始值 defaultValue



![React受控非受控1](./img/react-controlled-uncontrolled-1.svg)

代码设置表单的初始 value，但是能改变 value 的只有用户，代码通过监听 onChange 来拿到最新的值，或者通过 ref 拿到 dom 之后读取 value。

这种就是非受控模式。

反过来，代码可以改变表单的 value，就是受控模式。

> 注意，value 和 defaultValue 不一样：
>
> defaultValue 会作为 value 的初始值，后面用户改变的是 value

其实绝大多数情况下，非受控就可以了，因为我们只是要拿到用户的输入，不需要手动去修改表单值。

但有的时候，你需要根据用户的输入做一些处理，然后设置为表单的值，这种就需要受控模式

**value 由用户控制就是非受控模式，由代码控制就是受控模式**

### 非受控模式 defaultValue + onChange

```tsx
import type { ChangeEvent } from "react";

// 非受控模式 defaultValue + onChange
function App() {
  console.log("render...");

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  return <input defaultValue={"guang"} onChange={onChange} />;
}

export default App;
```

非受控模式也不一定通过 onChange 拿到最新 value，通过 ref 也可以

```tsx
import { useEffect, useRef } from "react"

function App() {

  // 非受控模式也不一定通过 onChange 拿到最新 value，通过 ref 也可以
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      console.log(inputRef.current?.value);
    }, 2000);
  }, []);

  return <input defaultValue={'guang'} ref={inputRef}/>
}

export default App
```

### 受控模式value + onChange

受控模式的写法：

```tsx
import { type ChangeEvent, useState } from "react";

// 受控模式的写法，这种写法并不推荐 value + onChange
// 而且受控模式每次 setValue 都会导致组件重新渲染
// 使用场景：需要对输入的值做处理之后设置到表单的时候，或者是你想实时同步状态值到父组件，比如把用户输入改为大写
function App() {
  const [value, setValue] = useState("guang");
  // console.log("render...");

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    // 注释时，用户可以输入，onChange 也可以拿到输入后的表单值，但是 value 并没有变
    // setValue(event.target.value);
    setValue(event.target.value.toUpperCase());
    console.log(event.target.value.toUpperCase(), value);
  }

  return <input value={value} onChange={onChange} />;
}

export default App;
```

**setState 是异步的，只调度重渲染，不立即修改当前闭包中的变量**：

1. 每次 render，`value` 都是该次渲染闭包中的一个常量（`const`）
2. `setValue(newVal)` → React 将其加入更新队列，计划下一次 render 时用新值
3. `console.log(value)` 读到的仍是**本次 render 闭包中**的旧 `value`，不会读到新值
4. 新值在**下一次 render**（`App` 函数重新执行）时，通过 `useState` 返回

如果是单独用的组件，比如 Calendar，那就没必要用受控模式了，用非受控模式，设置 defaultValue 就可以了

很多人上来就设置 value，然后监听 onChange，但是绕了一圈又原封不动的把用户输入转为 value，还平白导致组件的很多次重新渲染

比如ant design 的 Calendar 组件就是这样，基础组件得都支持，让调用者自己去选择非受控模式的 defaultValue，还是用受控模式的 value + onChange

### 日历组件非受控写法

写一下日历的非受控写法：

```tsx
import { ChangeEvent, useState } from "react"

interface CalendarProps{
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}
function Calendar(props: CalendarProps) {
  
  const {
    defaultValue = new Date(),
    onChange
  } = props;

  const [value, setValue] = useState(defaultValue);

  function changeValue(date: Date) {
    setValue(date);
    onChange?.(date);
  } 


  return <div>
    {value.toLocaleDateString()}
    <div onClick={()=> {changeValue(new Date('2024-5-1'))}}>2023-5-1</div>
    <div onClick={()=> {changeValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {changeValue(new Date('2024-5-3'))}}>2023-5-3</div>
  </div>
}

function App() {
  return <Calendar defaultValue={new Date('2024-5-1')} onChange={(date) => {
    console.log(date.toLocaleDateString());
  }}/>
}

export default App
```

这种情况，调用者只能设置 defaultValue 初始值，不能直接传入 value 来控制，所以是非受控模式

### 日历组件受控模式写法

然后再来写下受控模式的版本：

```tsx
import { ChangeEvent, useEffect, useState } from "react"

interface CalendarProps{
  value: Date;
  onChange?: (date: Date) => void;
}
function Calendar(props: CalendarProps) {
  
  const {
    value,
    onChange
  } = props;

  function changeValue(date: Date) {
    onChange?.(date);
  } 

  return <div>
    {value.toLocaleDateString()}
    <div onClick={()=> {changeValue(new Date('2024-5-1'))}}>2023-5-1</div>
    <div onClick={()=> {changeValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {changeValue(new Date('2024-5-3'))}}>2023-5-3</div>
  </div>
}

function App() {
  const [value, setValue] = useState(new Date('2024-5-1'));

  return <Calendar value={value} onChange={(date) => {
    console.log(date.toLocaleDateString());
    setValue(date);
  }}/>
}

export default App
```

直接用 props 传入的 value，然后切换日期的时候回调 onChange 函数

value 的值的维护在调用方

### 同时支持

同时支持受控和非受控模式，组件库基本都是这么做的：

```tsx
import { useEffect, useRef, useState } from "react"

interface CalendarProps{
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {
  
  const {
    value: propsValue,
    defaultValue,
    onChange
  } = props;

  const [value, setValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue;
    } else {
      return defaultValue;
    }
  });

  const isFirstRender = useRef(true);

   // 当 propsValue 变成 undefined，effect 触发 setValue(undefined)，把内部 state 也清空。
  // 然后 mergedValue = value = undefined，界面清空，组件以一个干净的空白状态进入非受控模式。
  useEffect(() => {
    if(propsValue === undefined && !isFirstRender.current) {
      setValue(propsValue);
    }
    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? value : propsValue;

  function changeValue(date: Date) {
    if (propsValue === undefined) {
      setValue(date);
    }
    onChange?.(date);
  } 

  return <div>
    {mergedValue?.toLocaleDateString()}
    <div onClick={()=> {changeValue(new Date('2024-5-1'))}}>2023-5-1</div>
    <div onClick={()=> {changeValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {changeValue(new Date('2024-5-3'))}}>2023-5-3</div>
  </div>
}

function App() {
  return <Calendar defaultValue={new Date('2024-5-1')} onChange={(date) => {
    console.log(date.toLocaleDateString());
  }}/>
}

export default App
```

参数同时支持 value 和 defaultValue，通过判断 value 是不是 undefined 来区分受控模式和非受控模式。

如果是受控模式，useState 的初始值设置 props.value，然后渲染用 props.value。

如果是非受控模式，那渲染用内部 state 的 value，然后 changeValue 里 setValue。

当不是首次渲染，但 value 变为 undefined 的情况，也就是从受控模式切换到了非受控模式，要同步设置 state 为 propsValue。

### hook优化

其实组件库也都是这么做的

比如 [arco design 的 useMergeValue 的 hook](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Farco-design%2Farco-design%2Fblob%2F1e677c3c5bba72728668c40d78faea6536c480a8%2Fcomponents%2F_util%2Fhooks%2FuseMergeValue.ts)

再比如 ant design 的工具包 rc-util 里的 [useMergedValue](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Freact-component%2Futil%2Fblob%2Fmaster%2Fsrc%2Fhooks%2FuseMergedState.ts) 的 hook

我们也来封装个useMergeState hook：

```tsx
function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T,
    value?: T
  }
): [T, React.Dispatch<React.SetStateAction<T>>,] {
  const { defaultValue, value: propsValue } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if(defaultValue !== undefined){
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    if(propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  return [mergedValue, setStateValue]
}
```

使用这个hook：

```tsx
function Calendar(props: CalendarProps) {
  const {
    value: propsValue,
    defaultValue,
    onChange
  } = props;

  const [mergedValue, setValue] = useMergeState(new Date(), {
    value: propsValue,
    defaultValue
  });

  function changeValue(date: Date) {
    if (propsValue === undefined) {
      setValue(date);
    }
    onChange?.(date);
  } 

  return <div>
    {mergedValue?.toLocaleDateString()}
    <div onClick={()=> {changeValue(new Date('2024-5-1'))}}>2023-5-1</div>
    <div onClick={()=> {changeValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {changeValue(new Date('2024-5-3'))}}>2023-5-3</div>
  </div>
}
```

同时把onChange的部分也封装到这个hook中，不然用户用的时候还要想着去处理非受控组件的情况

ahooks 的 useControllableValue 就封装进去了

优化后如下：

```tsx
import {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
    onChange?: (value: T) => void;
  },
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { defaultValue, value: propsValue, onChange } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if (defaultValue !== undefined) {
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  function isFunction(value: unknown): value is Function {
    return typeof value === "function";
  }

  // 这里把 setStateValue 二次封装成 setState
  // 调用 setState(newValue) 时：
  // 非受控：更新内部 state + 触发 onChange
  // 受控：不更新内部 state（由父组件通过 value 控制），只触发 onChange
  // 这里缓存 setState，避免每次调用都创建新的函数，只在 stateValue 变化时返回新函数
  const setState = useCallback(
    (value: SetStateAction<T>) => {
      let res = isFunction(value) ? value(stateValue) : value;

      if (propsValue === undefined) {
        setStateValue(res); // 非受控 → 更新内部 state
      }
      onChange?.(res); // 无论哪种模式，都触发 onChange
    },
    [stateValue],
  );

  return [mergedValue, setState];
}

interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {
  const { value: propsValue, defaultValue, onChange } = props;

  const [mergedValue, setValue] = useMergeState(new Date(), {
    value: propsValue,
    defaultValue,
    onChange,
  });

  return (
    <div>
      {mergedValue?.toLocaleDateString()}
      <div
        onClick={() => {
          setValue(new Date("2024-5-1"));
        }}
      >
        2023-5-1
      </div>
      <div
        onClick={() => {
          setValue(new Date("2024-5-2"));
        }}
      >
        2023-5-2
      </div>
      <div
        onClick={() => {
          setValue(new Date("2024-5-3"));
        }}
      >
        2023-5-3
      </div>
    </div>
  );
}

function App() {
  const [value, setValue] = useState(new Date("2024-5-1"));

  return (
    <Calendar
      value={value}
      onChange={(date) => {
        console.log(date.toLocaleDateString());
        setValue(date);
      }}
    />
  );
  // return <Calendar defaultValue={new Date('2024-5-1')} onChange={(date) => {
  //   console.log(date.toLocaleDateString());
  // }}/>
}

export default App;
```

优化了以下几点：

- 统一受控/非受控的 setter，也就是二次封装的setState

  - 非受控：更新内部 state + 触发 onChange

  -  受控：不更新内部 state（由父组件通过 value 控制），只触发 onChange

- 支持函数式更新，原生 `setState(prev => prev + 1)` 的用法能正常工作，因为闭包里拿到了最新的 `stateValue`

  - ```tsx
    let res = isFunction(value) ? value(stateValue) : value
    ```

- 使用`useCallback`，缓存更新函数，`useCallback` 在这里依赖 `[stateValue]`：没有 `useCallback` 的话，每次组件渲染 `setState` 都是新函数，如果它作为 props 传给子组件会导致不必要的重渲染。这里是**性能优化 + 保证闭包值正确**

### 总结

单独用的组件，绝大多数情况下，用非受控模式就好了，因为你只是想获取到用户的输入

受控模式只在需要对用户的输入做一些修改然后再设置到 value 的情况用，再就是实时同步表单值到父组件的时候，比如 Form

写组件想同时支持受控和非受控，可以直接用 ahooks 的 useControllableValue，也可以自己实现

arco design、ant design 等组件库都是这么做的，并且不约而同封装了 useMergedValue 的 hook
