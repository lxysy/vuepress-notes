---
title: AntV G6 在 Vue2/Vue3 项目中的常用 API 与场景指南
date: 2025-05-25
categories:
  - 可视化
  - AntV G6
tags:
  - antvg6
  - vue
  - 可视化
---

## 一、在 Vue 中集成 G6

### 安装与引入

```bash
npm install @antv/g6
```

### 基本集成方式

```javascript
// Vue3 Composition API
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import G6 from '@antv/g6'

export default {
  setup() {
    const container = ref(null)
    let graph = null

    onMounted(() => {
      graph = new G6.Graph({
        container: container.value,
        width: 800,
        height: 600,
        // ...配置项
      })
      graph.data(data)
      graph.render()
    })

    onBeforeUnmount(() => {
      graph?.destroy()
    })

    return { container }
  }
}
```

```javascript
// Vue2 Options API
import G6 from '@antv/g6'

export default {
  data: () => ({ graph: null }),
  mounted() {
    this.graph = new G6.Graph({
      container: this.$refs.container,
      width: 800,
      height: 600,
    })
    this.graph.data(data)
    this.graph.render()
  },
  beforeDestroy() {
    this.graph?.destroy()
  }
}
```

### 响应式数据更新

```javascript
// Vue3 watch 驱动 G6 数据更新
watch(() => props.data, (newData) => {
  graph.changeData(newData)  // 增量更新，G6 自动做 diff
}, { deep: true })

// 或手动操作
watch(() => props.nodes, (newNodes) => {
  graph.changeData({ nodes: newNodes, edges: graph.getEdges() })
})
```

---

## 二、核心 API 速查

### 1. Graph 实例化与生命周期

```javascript
const graph = new G6.Graph({
  container: domElement,   // 必填：DOM 容器
  width: 800,              // 画布宽度
  height: 600,             // 画布高度
  renderer: 'canvas',      // 'canvas'（默认）| 'svg'
  fitView: true,           // 自动适配视口
  fitViewPadding: 30,      // fitView 内边距
  fitCenter: true,         // 自动居中
  animate: true,           // 全局动画开关
  enabledStack: true,      // 启用撤销/重做栈
  minZoom: 0.2,            // 最小缩放
  maxZoom: 5,              // 最大缩放
  groupByTypes: true,      // 节点与边分开渲染（性能优化）
  autoPaint: true,         // 自动重绘
  modes: { default: ['drag-canvas', 'zoom-canvas', 'drag-node'] },
})

// 生命周期
graph.data(data)           // 设置数据
graph.render()             // 渲染
graph.changeData(newData)  // 更新数据（自动 diff）
graph.refresh()            // 刷新画布
graph.destroy()            // 销毁实例，释放资源

// 视口操作
graph.fitView(30)          // 适配视口
graph.fitCenter()          // 居中
graph.focusItem(item)      // 聚焦到某个元素
graph.zoomTo(2)            // 缩放到指定比例
graph.zoom(0.8)            // 相对缩放
graph.translate(100, 200)  // 平移

// 画布大小
graph.changeSize(1000, 800)
graph.getWidth()
graph.getHeight()

// 坐标转换
graph.getCanvasByPoint(x, y)        // 页面坐标 → 画布坐标
graph.getPointByCanvas(x, y)        // 画布坐标 → 页面坐标
graph.getClientByPoint(x, y)        // 画布坐标 → 客户端坐标
graph.getPointByClient(clientX, clientY)
```

### 2. 数据格式

```javascript
// 节点
const nodes = [
  {
    id: 'node1',              // 必填，唯一标识
    label: '节点1',           // 显示文本
    x: 100, y: 200,          // 位置（可选，布局算法会自动计算）
    type: 'rect',            // 节点类型（使用注册的自定义节点）
    size: [80, 40],          // 尺寸 [宽, 高]
    style: {                 // 样式
      fill: '#69b3a2',
      stroke: '#333',
      lineWidth: 2,
      opacity: 0.9,
      radius: 4,             // 圆角（rect 类型）
    },
    labelCfg: {              // 标签配置
      position: 'center',
      offset: 5,
      style: { fill: '#fff', fontSize: 12 },
    },
    anchorPoints: [[0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]], // 连接桩
    stateStyles: {           // 状态样式（hover/selected 等）
      hover: { fill: 'orange', lineWidth: 3 },
      selected: { fill: 'red', shadowBlur: 10, shadowColor: '#999' },
    },
  },
]

// 边
const edges = [
  {
    source: 'node1',         // 必填：起始节点 id
    target: 'node2',         // 必填：目标节点 id
    label: '连接',           // 标签
    type: 'polyline',        // 边类型：line / polyline / quadratic / cubic / arc
    style: {
      stroke: '#ccc',
      lineWidth: 2,
      endArrow: {            // 终点箭头
        path: G6.Arrow.triangle(8, 10, 0),
        fill: '#ccc',
      },
      lineDash: [5, 5],      // 虚线
    },
    labelCfg: { autoRotate: true, style: { fill: '#666', fontSize: 10 } },
    stateStyles: {
      hover: { stroke: 'blue', lineWidth: 3 },
    },
  },
]

graph.data({ nodes, edges })
```

### 3. 布局（Layout）

```javascript
// ---- 树图布局 ----
{
  type: 'compactBox',       // compactBox / dendrogram / mindmap / indented
  direction: 'TB',          // TB / BT / LR / RL / H (horizontal) / V
  getId: d => d.id,
  getHeight: () => 36,
  getWidth: () => 80,
  getVGap: () => 10,
  getHGap: () => 80,
}

// ---- 力导向布局 ----
{
  type: 'force',
  center: [400, 300],       // 中心点
  linkDistance: 100,        // 边长度
  nodeStrength: -200,       // 节点作用力（负=斥力）
  edgeStrength: 0.5,        // 边作用力
  preventOverlap: true,     // 防止重叠
  nodeSize: 30,             // 节点大小（碰撞检测用）
  alphaDecay: 0.028,        // 冷却系数
  alphaMin: 0.001,          // 最小能量阈值
  collideStrength: 1,       // 碰撞强度
  onTick: () => {},         // 每次迭代回调
  onLayoutEnd: () => {},    // 布局完成回调
}

// ---- 层次布局（Dagre）----
{
  type: 'dagre',
  rankdir: 'TB',            // TB / BT / LR / RL
  align: undefined,         // UL / UR / DL / DR
  nodesep: 40,              // 同级节点间距
  ranksep: 80,              // 层级间距
  controlPoints: true,      // 是否使用控制点
}

// ---- 环形布局 ----
{
  type: 'circular',
  radius: 200,
  startAngle: 0,
  endAngle: 2 * Math.PI,
  ordering: 'topology',     // null / 'topology' / 'degree'
  divisions: 1,             // 分段数
}

// ---- 网格布局 ----
{
  type: 'grid',
  rows: 5,
  cols: 0,                  // 0 = 自动计算
  sortBy: 'degree',         // 排序依据
  preventOverlap: true,
  nodeSize: 40,
}

// ---- 同心圆布局 ----
{
  type: 'concentric',
  center: [400, 300],
  nodeSize: 30,
  minNodeSpacing: 30,
  preventOverlap: true,
  sweep: 2 * Math.PI,
}

// ---- 辐射布局 ----
{
  type: 'radial',
  center: [400, 300],
  linkDistance: 150,
  maxIteration: 1000,
  focusNode: 'root',       // 中心节点 id
  unitRadius: 80,
  preventOverlap: true,
  nodeSize: 30,
}

// ---- MDS 布局（多维缩放）----
{
  type: 'mds',
  center: [400, 300],
  linkDistance: 100,
}

// ---- Fruchterman 布局 ----
{
  type: 'fruchterman',
  center: [400, 300],
  gravity: 10,
  speed: 1,
  clustering: false,
  clusterGravity: 10,
  maxIteration: 1000,
  workerEnabled: true,     // 使用 Web Worker
}

// 使用布局
const graph = new G6.Graph({
  layout: { type: 'force', ... },
  // ...其他配置
})
```

### 4. 交互模式（Mode）与行为（Behavior）

```javascript
const graph = new G6.Graph({
  modes: {
    // 默认模式（可切换）
    default: [
      'drag-canvas',       // 拖拽画布
      'zoom-canvas',       // 滚轮缩放画布
      'drag-node',         // 拖拽节点
      {
        type: 'zoom-canvas',
        sensitivity: 2,               // 缩放灵敏度
        minZoom: 0.3,
        maxZoom: 5,
        enableOptimize: true,          // 拖拽时优化渲染（隐藏边）
        optimizeZoom: 0.1,             // 优化触发阈值
      },
      {
        type: 'drag-node',
        enableDelegate: true,          // 拖拽时只显示阴影
        delegateStyle: { fill: '#eee', stroke: '#999' },
      },
    ],
    // 编辑模式
    edit: [
      'click-select',      // 点击选择
      {
        type: 'create-edge',
        trigger: 'drag',               // drag / click
        key: undefined,                // 限制按键（如 shift）
        shouldBegin: (e) => true,
        shouldEnd: (e) => true,
      },
    ],
    // 只读模式
    preview: ['drag-canvas', 'zoom-canvas'],
  },

  // 设置当前模式
  // graph.setMode('edit')
})

// 运行时切换模式
graph.setMode('edit')

// 常用内置行为列表
// 'drag-canvas'      拖拽画布
// 'zoom-canvas'      缩放画布
// 'drag-node'        拖拽节点
// 'click-select'     点击选中
// 'brush-select'     框选
// 'lasso-select'     套索选择
// 'collapse-expand'  展开/收起（树图）
// 'create-edge'      创建边
// 'shortcuts-call'   快捷键
// 'tooltip'          提示框
// 'edge-tooltip'     边提示框
// 'activate-relations' 高亮关联节点
```

### 5. 插件（Plugins）

```javascript
const graph = new G6.Graph({
  plugins: [
    // 缩略图
    new G6.Minimap({
      size: [200, 150],
      className: 'g6-minimap',
      type: 'delegate',            // 'default' | 'keyShape' | 'delegate'
      delegateStyle: { fill: '#40a9ff' },
      viewportWindowStyle: { fill: '#e6f7ff', stroke: '#1890ff' },
    }),

    // 图例
    new G6.Grid(),
    new G6.Legend({/* ... */}),

    // 工具栏
    new G6.ToolBar({
      container: document.getElementById('toolbar'),
      className: 'g6-toolbar',
      getContent: () => `<button>按钮</button>`,
      handleClick: (code, graph) => { /* 处理点击 */ },
    }),

    // 鱼眼放大镜（编辑前调用 graph.getPluginById('fisheye')?.disable()）
    new G6.Fisheye({ r: 200, maxR: 400, maxD: 50 }),
  ],
})
```

### 6. 状态管理

```javascript
// 设置状态
graph.setItemState(item, 'selected', true)
graph.setItemState('node1', 'hover', true)
graph.setItemState('edge1', 'highlight', true)

// 清除状态
graph.clearItemStates(item, ['selected', 'hover'])
graph.clearItemStates('node1')

// 获取状态
graph.getItemState(item, 'selected')  // boolean

// 状态样式在数据中定义
{
  stateStyles: {
    selected: {
      fill: '#f00',
      stroke: '#333',
      lineWidth: 3,
      shadowBlur: 10,
      shadowColor: '#999',
    },
    hover: { fill: 'orange' },
    highlight: { opacity: 1 },
    dark: { opacity: 0.3 },
  }
}
```

### 7. 事件系统

```javascript
// 画布事件
graph.on('click', (evt) => { /* 点击空白处 */ })
graph.on('canvas:dragstart', (evt) => {})
graph.on('canvas:drag', (evt) => {})
graph.on('canvas:dragend', (evt) => {})
graph.on('canvas:mouseenter', (evt) => {})
graph.on('canvas:mouseleave', (evt) => {})
graph.on('viewportchange', (evt) => { /* 视口变化 */ })

// 节点事件
graph.on('node:click', (evt) => {
  const { item, target, x, y, canvasX, canvasY } = evt
  const model = item.getModel()    // 获取节点数据模型
  // item.getModel() === { id, label, x, y, ... }
})
graph.on('node:dblclick', handler)
graph.on('node:mouseenter', handler)
graph.on('node:mouseleave', handler)
graph.on('node:mousemove', handler)
graph.on('node:dragstart', handler)
graph.on('node:drag', handler)
graph.on('node:dragend', handler)
graph.on('node:contextmenu', (evt) => {
  // 右键菜单
  evt.preventDefault()
  showContextMenu(evt.clientX, evt.clientY, evt.item)
})

// 边事件
graph.on('edge:click', handler)
graph.on('edge:mouseenter', handler)
graph.on('edge:mouseleave', handler)
graph.on('edge:contextmenu', handler)

// 组合事件（Combo）
graph.on('combo:click', handler)
graph.on('combo:drag', handler)

// 移除事件
graph.off('node:click', handler)
```

### 8. 数据操作 API

```javascript
// ---- 查询 ----
graph.findById('node1')           // 找到元素（node/edge/combo）
graph.getNodes()                  // 所有节点
graph.getEdges()                  // 所有边
graph.getCombos()                 // 所有 combo
graph.getNeighbors(node, 'source') // 邻居节点（'source' | 'target' | undefined=双向）
graph.getAdjMatrix()              // 邻接矩阵

// ---- 增删改 ----
// 添加
graph.addItem('node', { id: 'newNode', label: '新节点', x: 100, y: 100 })
graph.addItem('edge', { source: 'node1', target: 'newNode' })

// 更新
graph.updateItem(item, { label: '新标签', style: { fill: 'red' } })
graph.updateItem('node1', { x: 200, y: 300 })

// 删除
graph.removeItem(item)
graph.removeItem('node1')

// 刷新
graph.refreshItem(item)          // 刷新单个元素
graph.refreshPositions()         // 刷新所有位置

// ---- 批量操作 ----
graph.changeData(newData)        // 智能 diff 更新（推荐）
// changeData 会自动计算 enter / update / exit 并执行动画

// ---- 层级操作 ----
graph.toFront(item)              // 置顶
graph.toBack(item)               // 置底
graph.getItemDepth(item)         // 获取层级

// ---- 锁定/解锁 ----
graph.lock(item)
graph.unlock(item)
graph.hasLocked(item)
```

### 9. 自定义节点

```javascript
// 注册自定义节点
G6.registerNode('custom-node', {
  // 绘制形状
  draw(cfg, group) {
    const { size = [80, 40], style = {} } = cfg
    const [w, h] = size

    // 主形状 keyShape（必须，用于碰撞检测和连接桩计算）
    const keyShape = group.addShape('rect', {
      attrs: {
        x: -w / 2, y: -h / 2,
        width: w, height: h,
        radius: 6,
        fill: style.fill || '#69b3a2',
        stroke: style.stroke || '#333',
        lineWidth: style.lineWidth || 2,
        ...style,
      },
      name: 'key-shape',
    })

    // 附加形状
    group.addShape('text', {
      attrs: { text: cfg.label, x: 0, y: 0, textAlign: 'center', textBaseline: 'middle', fill: '#fff', fontSize: 12 },
      name: 'label',
    })

    // 图标
    group.addShape('image', {
      attrs: { x: -w / 2 + 8, y: -8, width: 16, height: 16, img: '/icon.png' },
      name: 'icon',
    })

    return keyShape
  },

  // 获取连接桩（可选）
  getAnchorPoints() {
    return [[0, 0.5], [1, 0.5], [0.5, 0], [0.5, 1]]
  },

  // 更新时调用（可选）
  update(cfg, item) { /* ... */ },

  // 响应状态变化后的样式（可选）
  setState(name, value, item) { /* ... */ },

  // 包围盒（可选，用于 optimize 模式下的渲染优化）
  getBBox(cfg) {
    const [w, h] = cfg.size || [80, 40]
    return { x: -w / 2, y: -h / 2, width: w, height: h }
  },
}, 'single-node')  // 继承自 'single-node'（默认）| 'circle' | 'rect' | 'ellipse' | 'diamond' | 'triangle' | 'star' | 'image' | 'modelRect'

// 注册自定义边
G6.registerEdge('custom-edge', {
  draw(cfg, group) {
    const { startPoint, endPoint } = cfg
    const keyShape = group.addShape('path', {
      attrs: { path: [['M', startPoint.x, startPoint.y], ['L', endPoint.x, endPoint.y]], stroke: '#999', lineWidth: 2 },
      name: 'key-shape',
    })
    return keyShape
  },
  afterDraw(cfg, group) { /* 在 draw 之后调用，常用于箭头动画 */ },
  setState(name, value, item) { /* ... */ },
}, 'line')
```

### 10. 使用 G6 内置 Shape

```javascript
// 在自定义节点时使用的 shape 方法
group.addShape('rect', { attrs: { ... } })
group.addShape('circle', { attrs: { ... } })
group.addShape('ellipse', { attrs: { ... } })
group.addShape('path', { attrs: { path: [...] } })
group.addShape('line', { attrs: { x1, y1, x2, y2 } })
group.addShape('polyline', { attrs: { points: [[x1,y1],[x2,y2],...] } })
group.addShape('polygon', { attrs: { points: [...] } })
group.addShape('image', { attrs: { img: 'url', x, y, width, height } })
group.addShape('text', { attrs: { text: 'hello', x, y, fontSize: 12, fill: '#333', textAlign: 'center', textBaseline: 'middle' } })
group.addShape('dom', { attrs: { html: '<div>...</div>', x, y, width, height } })
group.addShape('fan', { attrs: { x, y, r, startAngle, endAngle, clockwise } })
group.addShape('marker', { attrs: { x, y, r, symbol: 'triangle' } })
```

### 11. 动画

```javascript
// 入场动画 — 在自定义节点的 afterDraw 中
afterDraw(cfg, group) {
  const shape = group.get('children')[0]
  shape.animate(
    (ratio) => {
      // ratio: 0 → 1
      return { opacity: ratio, r: ratio * cfg.size[0] / 2 }
    },
    { duration: 500, easing: 'easeCubicInOut' }
  )

  // 循环动画
  const icon = group.get('children').find(n => n.get('name') === 'icon')
  icon.animate(
    () => ({ rotate: Math.PI * 2 }),
    { duration: 2000, repeat: true, easing: 'easeLinear' }
  )
}

// 节点间平移动画
graph.updateItem(node, { x: 300, y: 200 },
  { animate: true, animateCfg: { duration: 600, easing: 'easeCubicInOut' } }
)

// 全局动画
graph.updateLayout({/* 新布局配置 */}, 'moveCombo', true)
```

---

## 三、常见场景完整示例

### 场景 1：流程图 / DAG 图

```javascript
// 使用 Dagre 布局实现流程图
const graph = new G6.Graph({
  container: container.value,
  width: 1000,
  height: 700,
  layout: {
    type: 'dagre',
    rankdir: 'TB',          // 从上到下
    nodesep: 30,
    ranksep: 60,
    controlPoints: false,   // 不显示控制点
  },
  defaultNode: {
    type: 'modelRect',
    size: [140, 40],
    style: { fill: '#f0f5ff', stroke: '#1890ff', radius: 4 },
    labelCfg: { style: { fill: '#333', fontSize: 13 } },
    stateStyles: {
      selected: { fill: '#e6f7ff', stroke: '#1890ff', lineWidth: 2 },
    },
  },
  defaultEdge: {
    type: 'polyline',
    style: {
      stroke: '#999',
      lineWidth: 1.5,
      endArrow: { path: G6.Arrow.triangle(8, 10, 0), fill: '#999' },
    },
  },
  modes: {
    default: ['drag-canvas', 'zoom-canvas', {
      type: 'click-select',
      multiple: true,
      shouldBegin: () => false,  // 默认不允许选中，通过编程控制
    }],
  },
})

graph.data({
  nodes: [
    { id: '1', label: '开始', style: { fill: '#f6ffed', stroke: '#52c41a' } },
    { id: '2', label: '数据预处理', style: { fill: '#fff7e6', stroke: '#fa8c16' } },
    { id: '3', label: '模型训练', style: { fill: '#e6f7ff', stroke: '#1890ff' } },
    { id: '4', label: '模型评估', style: { fill: '#fff7e6', stroke: '#fa8c16' } },
    { id: '5', label: '结果输出', style: { fill: '#f6ffed', stroke: '#52c41a' } },
  ],
  edges: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
    { source: '3', target: '4' },
    { source: '4', target: '5' },
  ],
})
graph.render()

// 切换流向
// graph.updateLayout({ type: 'dagre', rankdir: 'LR' })
```

### 场景 2：网络拓扑图

```javascript
const graph = new G6.Graph({
  container: container.value,
  width: 1000, height: 700,
  layout: {
    type: 'force',
    preventOverlap: true,
    nodeStrength: -300,
    linkDistance: 100,
    nodeSize: 32,
  },
  defaultNode: {
    size: [40, 40],
    type: 'circle',
    style: { fill: '#69b3a2', stroke: '#fff', lineWidth: 3, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.2)' },
    labelCfg: { position: 'bottom', offset: 8, style: { fill: '#666', fontSize: 11 } },
  },
  defaultEdge: {
    style: { stroke: '#ccc', lineWidth: 1, opacity: 0.8 },
  },
  modes: {
    default: [
      'drag-canvas',
      {
        type: 'zoom-canvas',
        sensitivity: 3,
        enableOptimize: true,
        optimizeZoom: 0.5,
      },
      {
        type: 'drag-node',
        enableDelegate: true,
      },
      {
        type: 'activate-relations',
        trigger: 'mouseenter',
        activeState: 'highlight',
        inactiveState: 'dark',
        resetSelected: true,
      },
    ],
  },
})

// 高亮关联节点
graph.on('node:mouseenter', (e) => {
  const node = e.item
  const edges = node.getEdges()
  const neighbors = graph.getNeighbors(node)

  graph.getNodes().forEach(n => graph.setItemState(n, 'dark', true))
  graph.getEdges().forEach(e => graph.setItemState(e, 'dark', true))

  graph.setItemState(node, 'highlight', true)
  neighbors.forEach(n => graph.setItemState(n, 'highlight', true))
  edges.forEach(e => graph.setItemState(e, 'highlight', true))
})

graph.on('node:mouseleave', () => {
  graph.getNodes().forEach(n => graph.clearItemStates(n))
  graph.getEdges().forEach(e => graph.clearItemStates(e))
})
```

### 场景 3：树图 / 组织架构图

```javascript
const graph = new G6.TreeGraph({
  container: container.value,
  width: 1000, height: 700,
  layout: {
    type: 'compactBox',
    direction: 'TB',
    getId: d => d.id,
    getHeight: () => 40,
    getWidth: () => 100,
    getVGap: () => 16,
    getHGap: () => 60,
  },
  defaultNode: {
    type: 'rect',
    size: [100, 36],
    style: { fill: '#e6f7ff', stroke: '#1890ff', radius: 4 },
    labelCfg: { style: { fill: '#333', fontSize: 13 } },
    anchorPoints: [[0, 0.5], [1, 0.5]],
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: { stroke: '#aaa', lineWidth: 1.5 },
  },
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      {
        type: 'collapse-expand',
        trigger: 'click',
        shouldBegin: (e) => e.target.get('name') === 'collapse-btn',
      },
    ],
  },
})

// 注册带展开/收起按钮的节点
G6.registerNode('tree-node', {
  draw(cfg, group) {
    const [w, h] = cfg.size || [100, 36]
    const keyShape = group.addShape('rect', {
      attrs: { x: -w / 2, y: -h / 2, width: w, height: h, radius: 4, fill: '#e6f7ff', stroke: '#1890ff' },
      name: 'key-shape',
    })
    group.addShape('text', {
      attrs: { text: cfg.label, x: 0, y: 0, textAlign: 'center', textBaseline: 'middle', fill: '#333', fontSize: 12 },
      name: 'label',
    })
    if (cfg.children && cfg.children.length > 0) {
      group.addShape('circle', {
        attrs: { x: -w / 2, y: 0, r: 8, fill: '#1890ff', cursor: 'pointer' },
        name: 'collapse-btn',
      })
      group.addShape('text', {
        attrs: { text: cfg.collapsed ? '+' : '-', x: -w / 2, y: 0, textAlign: 'center', textBaseline: 'middle', fill: '#fff', fontSize: 14, cursor: 'pointer' },
        name: 'collapse-btn-text',
      })
    }
    return keyShape
  },
}, 'single-node')

graph.node(node => ({ type: 'tree-node', ...node }))
```

### 场景 4：关系图谱 / 知识图谱

```javascript
const graph = new G6.Graph({
  container: container.value,
  width: 1000, height: 700,
  layout: {
    type: 'force',
    nodeStrength: -150,
    edgeStrength: 0.3,
    preventOverlap: true,
    nodeSize: (d) => 20 + d.degree * 3,  // 根据度数动态调大小
  },
  defaultNode: {
    type: 'circle',
    size: [30, 30],
    style: { fill: '#40a9ff', stroke: '#fff', lineWidth: 2 },
    labelCfg: { position: 'bottom', offset: 6, style: { fill: '#333', fontSize: 10 } },
  },
  defaultEdge: {
    style: { stroke: '#ddd', lineWidth: 1, opacity: 0.7 },
  },
  modes: {
    default: [
      'drag-canvas', 'zoom-canvas',
      { type: 'drag-node', enableDelegate: true },
      'brush-select', 'click-select',
    ],
  },
  nodeStateStyles: {
    selected: { stroke: '#f00', lineWidth: 3, shadowBlur: 10, shadowColor: 'rgba(255,0,0,0.3)' },
  },
})

// 双击展开节点
graph.on('node:dblclick', async (e) => {
  const node = e.item
  const model = node.getModel()
  const subData = await fetchNeighbors(model.id)  // 获取关联数据
  const existing = new Set(graph.getNodes().map(n => n.getModel().id))

  const newNodes = subData.nodes.filter(n => !existing.has(n.id))
  const newEdges = subData.edges.filter(
    e => !graph.findById(e.id) && (existing.has(e.source) || existing.has(e.target))
  )

  graph.changeData({
    nodes: [...graph.getNodes().map(n => n.getModel()), ...newNodes],
    edges: [...graph.getEdges().map(e => e.getModel()), ...newEdges],
  })
})
```

### 场景 5：分组聚合（Combo）

```javascript
const graph = new G6.Graph({
  container: container.value,
  width: 1000, height: 700,
  layout: { type: 'force', preventOverlap: true },
  defaultNode: { size: [30, 30], type: 'circle', style: { fill: '#69b3a2' } },
  defaultEdge: { style: { stroke: '#ccc' } },
  defaultCombo: {
    type: 'circle',       // 'circle' | 'rect'
    size: [120],
    padding: 10,
    style: {
      fill: '#f0f0f0',
      stroke: '#bbb',
      lineWidth: 1.5,
      opacity: 0.9,
    },
    labelCfg: { position: 'top', offset: 5 },
  },
  modes: {
    default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'drag-combo', 'collapse-expand-combo'],
  },
})

graph.data({
  nodes: [
    { id: 'n1', comboId: 'c1' },
    { id: 'n2', comboId: 'c1' },
    { id: 'n3', comboId: 'c2' },
    { id: 'n4', comboId: 'c2' },
    { id: 'n5' },
  ],
  edges: [
    { source: 'n1', target: 'n3' },
    { source: 'n2', target: 'n4' },
    { source: 'n1', target: 'n5' },
  ],
  combos: [
    { id: 'c1', label: '分组 A' },
    { id: 'c2', label: '分组 B' },
  ],
})
graph.render()

// 动态创建 combo
graph.createCombo({ id: 'c3', label: '新分组' }, ['n5'])
graph.uncombo(graph.findById('c1'))  // 解散 combo
```

### 场景 6：思维导图

```javascript
const graph = new G6.TreeGraph({
  container: container.value,
  width: 1000, height: 700,
  layout: {
    type: 'mindmap',
    direction: 'H',       // H (水平) | V (垂直)
    getId: d => d.id,
    getHeight: () => 28,
    getWidth: () => 80,
    getVGap: () => 8,
    getHGap: () => 40,
    getSide: (d) => d.id === 'root' ? null : (d.data.side || 'right'),
  },
  defaultNode: {
    type: 'rect',
    size: [80, 28],
    style: { radius: 4, fill: '#69b3a2', stroke: '#69b3a2' },
    labelCfg: { style: { fill: '#fff', fontSize: 12 } },
  },
  defaultEdge: {
    type: 'cubic-horizontal',
    style: { stroke: '#69b3a2', lineWidth: 1.5 },
  },
  modes: { default: ['drag-canvas', 'zoom-canvas'] },
})

graph.node(node => ({
  ...node,
  style: {
    fill: d3.scaleOrdinal(d3.schemeSet2)(node.depth),
    stroke: d3.scaleOrdinal(d3.schemeSet2)(node.depth),
  },
}))
```

### 场景 7：流程图 + 自定义 Tooltip

```javascript
const graph = new G6.Graph({
  // ...基础配置
  modes: {
    default: [
      'drag-canvas',
      'zoom-canvas',
      {
        type: 'tooltip',
        formatText(model) {
          return `<div style="padding:8px">
            <div style="font-weight:bold;margin-bottom:4px">${model.label}</div>
            <div style="color:#666">ID: ${model.id}</div>
            <div style="color:#666">类型: ${model.type || '默认'}</div>
          </div>`
        },
        offset: 10,
        shouldBegin: (e) => e.target.get('name') === 'key-shape',
      },
      {
        type: 'edge-tooltip',
        formatText(model) {
          return `<div style="padding:4px 8px">${model.label || model.source + '→' + model.target}</div>`
        },
      },
    ],
  },
})
```

### 场景 8：时序图 / 时间线网络演化

```javascript
// 分帧展示网络随时间变化
let currentFrame = 0
const frames = [
  { nodes: [...], edges: [...] },
  { nodes: [...], edges: [...] },
  { nodes: [...], edges: [...] },
]

function playFrame(index) {
  currentFrame = index
  graph.changeData(frames[index])
  graph.fitView(20)
}

// 自动播放
let timer = null
function startPlay(interval = 2000) {
  timer = setInterval(() => {
    playFrame((currentFrame + 1) % frames.length)
  }, interval)
}

// onBeforeUnmount 中 clearInterval(timer)
```

---

## 四、Vue 中封装的实用 Hooks / Mixins

### Vue3 Composable

```javascript
// composables/useG6.js
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import G6 from '@antv/g6'

export function useG6(config) {
  const container = ref(null)
  const graph = shallowRef(null)
  let resizeObserver = null

  onMounted(() => {
    graph.value = new G6.Graph({
      container: container.value,
      ...config,
    })

    if (config.autoResize !== false) {
      resizeObserver = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect
        graph.value.changeSize(width, height)
        graph.value.fitView(20)
      })
      resizeObserver.observe(container.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    graph.value?.destroy()
  })

  return { container, graph }
}
```

```javascript
// composables/useG6Tree.js — 专门用于树图
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import G6 from '@antv/g6'

export function useG6Tree(config) {
  const container = ref(null)
  const treeGraph = shallowRef(null)

  onMounted(() => {
    treeGraph.value = new G6.TreeGraph({
      container: container.value,
      ...config,
    })
  })

  onBeforeUnmount(() => {
    treeGraph.value?.destroy()
  })

  const collapseExpand = (nodeId) => {
    const node = treeGraph.value.findById(nodeId)
    const collapsed = !node.getModel().collapsed
    node.getModel().collapsed = collapsed
    treeGraph.value.layout()
    treeGraph.value.fitView()
  }

  const expandAll = () => treeGraph.value.changeData({ expandAll: true })
  const collapseAll = () => treeGraph.value.changeData({ expandAll: false })

  return { container, treeGraph, collapseExpand, expandAll, collapseAll }
}
```

### Vue2 Mixin

```javascript
// mixins/g6Mixin.js
import G6 from '@antv/g6'

export default {
  data: () => ({ _g6Instance: null }),
  beforeDestroy() { this._g6Instance?.destroy() },
  methods: {
    $g6Create(GraphClass = G6.Graph, config = {}) {
      const container = this.$refs.g6Container || config.container
      this._g6Instance = new GraphClass({
        container,
        width: container?.offsetWidth || 800,
        height: container?.offsetHeight || 600,
        ...config,
      })
      return this._g6Instance
    },
    $g6() { return this._g6Instance },
  },
}
```

---

## 五、常见问题与注意事项

| 问题 | 解决方案 |
|------|---------|
| 容器尺寸为 0 | 确保 `container` 挂载完毕后再初始化，或使用 `ResizeObserver` 延迟初始化 |
| `changeData` 后样式丢失 | `changeData` 会重建内部 model，自定义属性需在数据中重新传入 |
| 大量节点（>1000）卡顿 | 启用 `enableOptimize`、使用 Canvas 渲染器、降低刷新频率 |
| 树图节点折叠后尺寸异常 | 展开/收起后需调用 `treeGraph.layout()` 重新布局 |
| 自定义节点点击不触发 | 检查 `keyShape` 是否正确返回，事件默认绑定在 `keyShape` 上 |
| 拖拽节点后布局重置 | 拖拽会固定 `fx/fy`，切换布局前需清除固定坐标 |
| G6 v4.x 与 v5.x API 差异大 | v5 采用全新 Spec 方式，本文 API 基于 **v4.8.x** |
| 内存泄漏 | 路由切换时务必 `graph.destroy()`，否则定时器与事件监听不会释放 |
| 边箭头不显示 | 检查 `endArrow` 配置是否正确，且 `path` 必须使用 `G6.Arrow.triangle()` |
| 自定义节点 resize 无效 | `size` 是节点的边界矩形，需要在 `draw` 中读取 `cfg.size` 使用 |
