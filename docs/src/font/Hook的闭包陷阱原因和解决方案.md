---
title: Hook的闭包陷阱原因和解决方案
date: 2026-07-01
categories:
  - 框架
  - React
tags:
  - React
  - hook
  - 前端
---

## Hook的闭包陷阱原因和解决方案

```jsx
import { useEffect, useState } from 'react';

function App() {

    const [count,setCount] = useState(0);

    useEffect(() => {
        setInterval(() => {
            console.log(count);
            setCount(count + 1);
        }, 1000);
    }, []);

    return <div>{count}</div>
}

export default App;
```

### 问题原因 — 闭包捕获了过时的值

```mermaid
sequenceDiagram
    participant R as 首次渲染
    participant E as useEffect
    participant I as setInterval
    participant C as 点击/触发

    Note over R: 组件运行 count = 0
    R->>E: 执行 useEffect
    E->>I: 创建定时器，每秒执行
    Note over I: 闭包捕获 count = 0
    I->>I: console.log(count) → 0
    I->>C: setCount(0 + 1)
    Note over C: React 重新渲染 count = 1
    Note over I: ⚠️ 闭包中的 count 仍是 0
    I->>I: console.log(count) → 0（仍然旧值）
    I->>C: setCount(0 + 1)（又设为 1）
```

如上组件，`setInterval` 的回调**闭包捕获了第一次渲染时的 `count`（值为 0）**。由于 `useEffect` 的依赖数组为 `[]`，它只在挂载时运行一次，此后每次定时器触发时读取的 `count` 始终是 0，所以 `setCount(count + 1)` 永远在设置 `0 + 1 = 1`。

- **界面显示**一直是 `1`
- **控制台**一直打印 `0`

### 解决方案 — 函数式更新

```mermaid
graph LR
    subgraph 错误写法
        A1[闭包捕获旧 count] --> B1[setCount count+1]
        B1 --> C1[永远是 setCount 1]
        C1 --> D1[界面卡在 1]
    end

    subgraph 函数式更新
        A2[闭包捕获旧 count] --> B2[setCount prev+1]
        B2 --> C2[获取最新 state]
        C2 --> D2[值正确递增]
    end

    D1 -.->|改为| A2
```

将 `setCount(count + 1)` 改为 `setCount(prev => prev + 1)`，这样即使闭包中的 `count` 是旧的，React 也会把**最新的 state 值**作为 `prev` 传入，确保每次递增的是最新值。

