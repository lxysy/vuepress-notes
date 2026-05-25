---
title: D3.js 在 Vue2/Vue3 项目中的常用 API 与场景指南
date: 2025-05-25
categories:
  - 可视化
  - D3.js
tags:
  - d3.js
  - vue
  - 可视化
---

## 一、在 Vue 中集成 D3.js

### 基本集成方式

```javascript
// Vue3 Composition API
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'

export default {
  setup() {
    const container = ref(null)

    onMounted(() => {
      const svg = d3.select(container.value)
        .append('svg')
        .attr('width', 800)
        .attr('height', 600)
      // ...绘制逻辑
    })

    return { container }
  }
}
```

```javascript
// Vue2 Options API
import * as d3 from 'd3'

export default {
  mounted() {
    const svg = d3.select(this.$refs.container)
      .append('svg')
      .attr('width', 800)
      .attr('height', 600)
    // ...绘制逻辑
  },
  beforeDestroy() {
    // 清理绑定，避免内存泄漏
    d3.select(this.$refs.container).selectAll('*').remove()
  }
}
```

### 响应式数据驱动更新

```javascript
// Vue3 watch 驱动 D3 更新
watch(() => props.data, (newData) => {
  updateChart(newData)
})

function updateChart(data) {
  const svg = d3.select(container.value).select('svg')
  const bars = svg.selectAll('.bar').data(data, d => d.id)
  // enter + update + exit 模式
  bars.enter().append('rect').attr('class', 'bar')
    .merge(bars)
    .attr('x', d => xScale(d.name))
    .attr('y', d => yScale(d.value))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d.value))
  bars.exit().remove()
}
```

---

## 二、核心 API 速查

### 1. 选择器与 DOM 操作

| API | 说明 | 示例 |
|-----|------|------|
| `d3.select(selector)` | 选择第一个匹配元素 | `d3.select('#chart')` |
| `d3.selectAll(selector)` | 选择所有匹配元素 | `d3.selectAll('.bar')` |
| `selection.append(tag)` | 添加子元素 | `svg.append('g')` |
| `selection.attr(name, value)` | 设置属性 | `.attr('fill', 'steelblue')` |
| `selection.style(name, value)` | 设置样式 | `.style('opacity', 0.8)` |
| `selection.text(value)` | 设置文本 | `.text(d => d.name)` |
| `selection.html(value)` | 设置 HTML | `.html('<tspan>...</tspan>')` |
| `selection.remove()` | 移除元素 | `bars.exit().remove()` |
| `selection.raise()` / `selection.lower()` | 提升/降低层级 | `.raise()` |
| `selection.on(event, handler)` | 绑定事件 | `.on('click', handleClick)` |

### 2. 数据绑定（核心模式）

```javascript
// enter-update-exit 三件套
const rects = svg.selectAll('rect')
  .data(data, d => d.id)  // key 函数，类似 Vue 的 :key

// ENTER: 新增元素
const enter = rects.enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => xScale(d.name))
  .attr('width', xScale.bandwidth())
  .attr('y', height)
  .attr('height', 0)

// UPDATE: 更新已有元素
enter.merge(rects)
  .transition().duration(750)
  .attr('x', d => xScale(d.name))
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))

// EXIT: 移除多余元素
rects.exit()
  .transition().duration(500)
  .attr('y', height).attr('height', 0)
  .remove()
```

### 3. 比例尺（Scale）

```javascript
// 线性比例尺 — 最常用
const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])  // 数据范围
  .range([0, width])                          // 像素范围
  .nice()  // 取整端点

// 带比例尺 — 柱状图 x 轴
const xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.2)          // 柱子间距比例
  .paddingInner(0.3)     // 内部间距
  .paddingOuter(0.2)     // 外侧间距

// 序数比例尺 — 颜色映射
const color = d3.scaleOrdinal()
  .domain(['A', 'B', 'C'])
  .range(['#5470c6', '#91cc75', '#fac858'])
// 或使用内置配色
const color = d3.scaleOrdinal(d3.schemeCategory10)

// 时间比例尺
const xScale = d3.scaleTime()
  .domain([new Date('2024-01-01'), new Date('2024-12-31')])
  .range([0, width])

// 对数比例尺
const yScale = d3.scaleLog()
  .domain([1, 10000])
  .range([height, 0])

// 分位数 / 分位比例尺 — 热力图色阶
const colorScale = d3.scaleQuantize()
  .domain([0, 100])
  .range(d3.schemeBlues[9])

const colorScale2 = d3.scaleQuantile()
  .domain(data.map(d => d.value))
  .range(['#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'])
```

### 4. 坐标轴

```javascript
// 创建坐标轴生成器
const xAxis = d3.axisBottom(xScale)   // 底部轴
const yAxis = d3.axisLeft(yScale)     // 左侧轴
// axisTop / axisRight 对应顶部/右侧

// 配置
xAxis
  .ticks(10)                         // 刻度数量建议
  .tickSize(6)                       // 刻度线长度
  .tickSizeOuter(0)                  // 两端刻度线长度
  .tickPadding(8)                    // 刻度文字间距
  .tickFormat(d3.format('.0%'))      // 格式化（百分比）
  .tickFormat(d3.format(',.0f'))     // 千分位

// 渲染到 SVG
svg.append('g')
  .attr('transform', `translate(0, ${height})`)
  .call(xAxis)

svg.append('g')
  .attr('transform', `translate(${margin.left}, 0)`)
  .call(yAxis)

// 自定义刻度值
yAxis.tickValues([0, 10, 25, 50, 100])
yAxis.tickFormat((d, i) => `${d}%`)
```

### 5. 形状生成器

```javascript
// 折线生成器
const line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.value))
  .curve(d3.curveMonotoneX)  // 平滑曲线
  // 常用曲线: curveLinear, curveStep, curveBasis, curveCardinal, curveCatmullRom

svg.append('path')
  .datum(data)
  .attr('d', line)
  .attr('fill', 'none')
  .attr('stroke', '#5470c6')
  .attr('stroke-width', 2)

// 面积生成器
const area = d3.area()
  .x(d => xScale(d.date))
  .y0(height)                       // 基线
  .y1(d => yScale(d.value))         // 顶部
  .curve(d3.curveMonotoneX)

svg.append('path')
  .datum(data)
  .attr('d', area)
  .attr('fill', 'rgba(84,112,198,0.3)')

// 圆弧生成器 — 饼图/环形图
const arc = d3.arc()
  .innerRadius(0)    // 0 = 饼图，>0 = 环形图
  .outerRadius(150)
  .cornerRadius(4)   // 圆角
  .padAngle(0.02)    // 间距

// 饼图每一块的 path
arcGroup.selectAll('path')
  .data(pieData)
  .join('path')
  .attr('d', arc)
  .attr('fill', (d, i) => color(i))

// 弦生成器 — 和弦图/关系图
const ribbon = d3.ribbon().radius(200)

// 符号生成器 — 散点图形状
const symbol = d3.symbol()
  .type(d3.symbolCircle)  // symbolCross, symbolDiamond, symbolSquare, symbolStar, symbolTriangle, symbolWye
  .size(100)
```

### 6. 布局（Layout）

```javascript
// ---- 饼图布局 ----
const pie = d3.pie()
  .value(d => d.value)         // 值访问器
  .sort(null)                  // 不排序
  .padAngle(0.02)              // 扇区间隙

const pieData = pie(data)      // 返回含 startAngle, endAngle 的数据

// ---- 力导向布局 ----
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(100))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide().radius(20))
  .on('tick', () => {
    // 每次迭代更新元素位置
    link.attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
    node.attr('cx', d => d.x).attr('cy', d => d.y)
  })

// 拖拽节点
const drag = d3.drag()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x; d.fy = d.y
  })
  .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null; d.fy = null
  })
node.call(drag)

// ---- 树布局（tree / cluster / treemap）----
const treeLayout = d3.tree().size([width, height - 200])
const root = d3.hierarchy(treeData)
const treeData = treeLayout(root)

const linkGen = d3.linkVertical()  // 或 linkHorizontal / linkRadial
  .x(d => d.x).y(d => d.y)

// ---- 分区图 / 旭日图 ----
const partition = d3.partition().size([2 * Math.PI, radius])

// ---- 直方图布局 ----
const histogram = d3.histogram()
  .value(d => d.value)
  .domain(xScale.domain())
  .thresholds(xScale.ticks(20))
const bins = histogram(data)

// ---- 打包布局 ----
const pack = d3.pack().size([width, height]).padding(3)
```

### 7. 过渡动画

```javascript
// 基本过渡
selection.transition()
  .duration(750)           // 持续时间 ms
  .delay((d, i) => i * 50) // 交错延迟
  .ease(d3.easeCubicInOut) // 缓动函数
  .attr('y', d => yScale(d.value))
  .attr('height', d => height - yScale(d.value))
  .style('fill', 'orange')

// 常用缓动
d3.easeLinear           // 线性
d3.easeCubicInOut       // 缓入缓出
d3.easeElasticOut       // 弹性
d3.easeBounceOut        // 弹跳
d3.easeSinInOut         // 正弦

// 链式过渡
selection.transition().duration(500).attr('y', 100)
  .transition().duration(300).attr('fill', 'red')
  .transition().duration(200).attr('opacity', 0).remove()

// 过渡控制
transition.on('start', () => {})
transition.on('end', () => {})
transition.on('interrupt', () => {})
```

### 8. 缩放与平移

```javascript
const zoom = d3.zoom()
  .scaleExtent([0.5, 5])           // 缩放范围
  .translateExtent([[-100, -100], [width + 100, height + 100]]) // 平移范围
  .on('zoom', (event) => {
    mainGroup.attr('transform', event.transform)
    // event.transform 包含 { x, y, k }
  })

svg.call(zoom)

// 程序化缩放
svg.transition().duration(500).call(zoom.scaleTo, 2)
svg.transition().duration(500).call(zoom.translateTo, 100, 200)

// 双击缩放
svg.on('dblclick.zoom', () => {
  svg.transition().call(zoom.scaleBy, 1.5)
})
```

### 9. 刷选（Brush）

```javascript
const brush = d3.brush()
  .extent([[0, 0], [width, height]])
  .on('brush', (event) => {
    const [[x0, y0], [x1, y1]] = event.selection
    // 根据刷选范围过滤数据
    const selected = data.filter(d =>
      xScale(d.x) >= x0 && xScale(d.x) <= x1 &&
      yScale(d.y) >= y1 && yScale(d.y) <= y0
    )
    updateDetail(selected)
  })
  .on('end', (event) => {
    if (!event.selection) updateDetail(data) // 点击空白取消选择
  })

svg.append('g').attr('class', 'brush').call(brush)
```

### 10. 颜色与配色

```javascript
// 内置色板
d3.schemeCategory10   // 10 种分类色
d3.schemeAccent       // 8 种强调色
d3.schemeDark2        // 8 种深色
d3.schemePaired       // 12 组成对色
d3.schemeSet1 ~ Set3  // 9/8/12 色
d3.schemeTableau10    // Tableau 10 色

// 连续色板
d3.schemeBlues[9]     // 蓝色渐变色
d3.schemeReds[9]
d3.schemeGreens[9]
d3.schemeRdYlBu[9]   // 红-黄-蓝 渐变色
// 取值: d.schemeBlues[3] ~ d.schemeBlues[9]

// 颜色插值器
const interpolate = d3.interpolateRdBu
const color = d3.scaleSequential()
  .domain([0, 100])
  .interpolator(d3.interpolateViridis)

// 颜色计算
d3.color('steelblue').darker(0.5).toString()
d3.hsl('steelblue').brighter(0.5).toString()
d3.rgb(84, 112, 198)
d3.lab(color)  // CIELAB 色彩空间
```

### 11. 辅助工具

```javascript
// 格式化
d3.format(',.0f')(1234567)  // "1,234,567"
d3.format('.2%')(0.1234)    // "12.34%"
d3.format('.2s')(42100)     // "42k"
d3.format('04d')(7)         // "0007"

// 时间格式化
const parseTime = d3.timeParse('%Y-%m-%d')
const formatTime = d3.timeFormat('%b %d, %Y')
d3.timeFormat('%Y-%m-%d %H:%M:%S')(new Date())

// 数组统计
d3.max(data, d => d.value)
d3.min(data, d => d.value)
d3.extent(data, d => d.value)     // [min, max]
d3.sum(data, d => d.value)
d3.mean(data, d => d.value)
d3.median(data, d => d.value)
d3.quantile(data, 0.25)            // 四分位数
d3.deviation(data, d => d.value)   // 标准差
d3.variance(data, d => d.value)    // 方差

// 分组与聚合
d3.group(data, d => d.category)                         // Map
d3.rollup(data, v => d3.sum(v, d => d.value), d => d.category)
d3.groups(data, d => d.category)                        // [[key, values], ...]

// 生成器
d3.range(0, 100, 5)  // [0, 5, 10, ..., 95]
d3.shuffle(array)     // 随机打乱
d3.ticks(0, 100, 10)  // 生成刻度值数组

// 插值
d3.interpolateNumber(0, 100)(0.5)         // 50
d3.interpolateRgb('red', 'blue')(0.5)     // 中间色
d3.interpolateString('a{0}b', 'a{10}b')  // "a{5}b"

// 地理投影（地图）
const projection = d3.geoMercator()
  .center([104, 35]).scale(500).translate([width / 2, height / 2])
const path = d3.geoPath(projection)
```

### 12. 交互事件处理

```javascript
// 鼠标/触摸事件
element.on('click', (event, d) => { /* d 是绑定数据 */ })
element.on('mouseenter', function(event, d) {
  d3.select(this).attr('fill', 'orange')
})
element.on('mouseleave', function(event, d) {
  d3.select(this).attr('fill', 'steelblue')
})
element.on('mousemove', (event, d) => {
  tooltip.style('left', event.pageX + 10 + 'px')
         .style('top', event.pageY - 20 + 'px')
})

// 获取指针坐标（相对 SVG）
const [x, y] = d3.pointer(event)
const [x, y] = d3.pointer(event, svgNode) // 相对指定节点

// 事件属性
event.target        // 事件源
event.currentTarget // 当前监听器绑定的元素
event.pageX/pageY   // 页面坐标
```

---

## 三、常见场景完整示例

### 场景 1：柱状图

```javascript
function createBarChart(svg, data, { width, height, margin }) {
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand().domain(data.map(d => d.name)).range([0, innerW]).padding(0.2)
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([innerH, 0]).nice()

  // 坐标轴
  g.append('g').call(d3.axisLeft(y).ticks(5))
  g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x))

  // 柱子
  g.selectAll('.bar').data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.name)).attr('y', d => y(d.value))
    .attr('width', x.bandwidth()).attr('height', d => innerH - y(d.value))
    .attr('fill', '#5470c6')

  // 数值标签
  g.selectAll('.label').data(data)
    .join('text')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', d => y(d.value) - 6)
    .attr('text-anchor', 'middle').attr('font-size', 12)
    .text(d => d3.format(',.0f')(d.value))
}
```

### 场景 2：折线图 + 面积

```javascript
function createLineChart(svg, data, { width, height, margin }) {
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date)).range([0, innerW])
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).range([innerH, 0]).nice()

  // 面积
  g.append('path').datum(data)
    .attr('fill', 'rgba(84,112,198,0.15)')
    .attr('d', d3.area().x(d => x(d.date)).y0(innerH).y1(d => y(d.value)).curve(d3.curveMonotoneX))

  // 折线
  g.append('path').datum(data)
    .attr('fill', 'none').attr('stroke', '#5470c6').attr('stroke-width', 2)
    .attr('d', d3.line().x(d => x(d.date)).y(d => y(d.value)).curve(d3.curveMonotoneX))

  // 散点
  g.selectAll('.dot').data(data)
    .join('circle')
    .attr('cx', d => x(d.date)).attr('cy', d => y(d.value))
    .attr('r', 4).attr('fill', '#5470c6')

  g.append('g').call(d3.axisLeft(y))
  g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(6))
}
```

### 场景 3：饼图 / 环形图

```javascript
function createPieChart(svg, data, { width, height, innerRadius = 0 }) {
  const radius = Math.min(width, height) / 2
  const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const pie = d3.pie().value(d => d.value).sort(null)
  const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius).cornerRadius(4).padAngle(0.02)

  const arcs = g.selectAll('.arc').data(pie(data))
    .join('g').attr('class', 'arc')

  arcs.append('path')
    .attr('d', arc).attr('fill', d => color(d.data.name))
    .on('mouseenter', function() { d3.select(this).attr('opacity', 0.7) })
    .on('mouseleave', function() { d3.select(this).attr('opacity', 1) })

  // 标签线 + 文字
  const outerArc = d3.arc().innerRadius(radius * 1.1).outerRadius(radius * 1.1)
  arcs.append('polyline')
    .attr('points', d => [arc.centroid(d), outerArc.centroid(d), [outerArc.centroid(d)[0] * 1.1, outerArc.centroid(d)[1]]])
    .attr('fill', 'none').attr('stroke', '#666').attr('stroke-width', 1)

  arcs.append('text')
    .attr('transform', d => `translate(${outerArc.centroid(d)[0] * 1.15},${outerArc.centroid(d)[1]})`)
    .attr('text-anchor', d => outerArc.centroid(d)[0] > 0 ? 'start' : 'end')
    .attr('font-size', 11).text(d => `${d.data.name}: ${d.data.value}`)
}
```

### 场景 4：力导向关系图

```javascript
function createForceGraph(svg, { nodes, links }, { width, height }) {
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(80))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(25))

  const g = svg.append('g')

  const link = g.append('g').selectAll('line')
    .data(links).join('line')
    .attr('stroke', '#999').attr('stroke-width', 1.5)

  const node = g.append('g').selectAll('circle')
    .data(nodes).join('circle')
    .attr('r', 8).attr('fill', '#69b3a2')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null }))

  const label = g.append('g').selectAll('text')
    .data(nodes).join('text')
    .attr('font-size', 10).attr('dx', 10).attr('dy', 4).text(d => d.name)

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
    node.attr('cx', d => d.x).attr('cy', d => d.y)
    label.attr('x', d => d.x).attr('y', d => d.y)
  })
}
```

### 场景 5：树图 / 组织架构图

```javascript
function createTreeChart(svg, data, { width, height }) {
  const g = svg.append('g').attr('transform', 'translate(40, 40)')

  const root = d3.hierarchy(data)
  const treeLayout = d3.tree().size([height - 80, width - 160])
  treeLayout(root)

  // 连线
  g.selectAll('.link').data(root.links())
    .join('path')
    .attr('class', 'link')
    .attr('fill', 'none').attr('stroke', '#ccc').attr('stroke-width', 1.5)
    .attr('d', d3.linkVertical().x(d => d.y).y(d => d.x))

  // 节点组
  const nodeG = g.selectAll('.node').data(root.descendants())
    .join('g')
    .attr('transform', d => `translate(${d.y},${d.x})`)

  nodeG.append('rect')
    .attr('x', -40).attr('y', -15).attr('width', 80).attr('height', 30)
    .attr('rx', 6).attr('fill', '#69b3a2')

  nodeG.append('text')
    .attr('text-anchor', 'middle').attr('dy', 4)
    .attr('fill', '#fff').attr('font-size', 12)
    .text(d => d.data.name)
}
```

### 场景 6：桑基图

```javascript
function createSankey(svg, data, { width, height }) {
  const sankey = d3.sankey()
    .nodeWidth(24).nodePadding(8)
    .extent([[0, 0], [width, height]])
    .nodeAlign(d3.sankeyJustify) // sankeyLeft, sankeyCenter, sankeyRight

  const { nodes, links } = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  })

  const color = d3.scaleOrdinal(d3.schemeCategory10)

  // 连线
  svg.append('g').selectAll('path')
    .data(links).join('path')
    .attr('d', d3.sankeyLinkHorizontal())
    .attr('stroke', d => color(d.source.name))
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('fill', 'none')
    .attr('opacity', 0.5)

  // 节点
  svg.append('g').selectAll('rect')
    .data(nodes).join('rect')
    .attr('x', d => d.x0).attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => color(d.name))
}
```

### 场景 7：堆叠柱状图 / 堆叠面积图

```javascript
function createStackedBarChart(svg, data, keys, { width, height, margin }) {
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, innerW]).padding(0.2)
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d3.sum(keys, k => d[k]))]).range([innerH, 0])
  const color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10)

  const stackedData = d3.stack().keys(keys)(data)

  const groups = g.selectAll('.group').data(stackedData)
    .join('g').attr('fill', d => color(d.key))

  groups.selectAll('rect').data(d => d)
    .join('rect')
    .attr('x', d => x(d.data.month)).attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth())

  g.append('g').call(d3.axisLeft(y))
  g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x))
}
```

### 场景 8：时间轴 / 甘特图

```javascript
function createGanttChart(svg, tasks, { width, height }) {
  const x = d3.scaleTime()
    .domain([d3.min(tasks, d => d.start), d3.max(tasks, d => d.end)])
    .range([0, width - 200])

  const y = d3.scaleBand()
    .domain(tasks.map(d => d.name)).range([0, height - 60]).padding(0.3)

  const g = svg.append('g').attr('transform', 'translate(150, 30)')

  // 任务条
  g.selectAll('.task').data(tasks)
    .join('rect')
    .attr('x', d => x(d.start)).attr('y', d => y(d.name))
    .attr('width', d => x(d.end) - x(d.start))
    .attr('height', y.bandwidth())
    .attr('rx', 4).attr('fill', d => d3.schemeCategory10[d.group % 10])

  // 今日线
  g.append('line')
    .attr('x1', x(new Date())).attr('x2', x(new Date()))
    .attr('y1', 0).attr('y2', height - 60)
    .attr('stroke', 'red').attr('stroke-dasharray', '4,4')

  g.append('g').call(d3.axisLeft(y))
  g.append('g').attr('transform', `translate(0,${height - 60})`).call(d3.axisBottom(x))
}
```

---

## 四、Vue 中封装的实用 Hooks / Mixins

### Vue3 Composable

```javascript
// composables/useD3Chart.js
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as d3 from 'd3'

export function useD3Chart(drawFn) {
  const container = ref(null)

  onMounted(() => drawFn(container.value))
  onBeforeUnmount(() => {
    if (container.value) d3.select(container.value).selectAll('*').remove()
  })

  return { container }
}

// 使用
const { container } = useD3Chart((el) => {
  const svg = d3.select(el).append('svg')...
})
```

### 响应式尺寸（ResizeObserver）

```javascript
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useChartSize() {
  const container = ref(null)
  const width = ref(0)
  const height = ref(0)
  let observer = null

  onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
      width.value = entry.contentRect.width
      height.value = entry.contentRect.height
    })
    if (container.value) observer.observe(container.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { container, width, height }
}
```

### Vue2 Mixin

```javascript
// mixins/d3Mixin.js
import * as d3 from 'd3'

export default {
  data: () => ({ _d3Instances: [] }),
  beforeDestroy() {
    this._d3Instances.forEach(cleanup => cleanup())
  },
  methods: {
    $d3GetRef(refName) {
      const el = this.$refs[refName]
      const svg = d3.select(el).append('svg')
      const cleanup = () => d3.select(el).selectAll('*').remove()
      this._d3Instances.push(cleanup)
      return svg
    }
  }
}
```

---

## 五、常见问题与注意事项

| 问题 | 解决方案 |
|------|---------|
| Vue 响应式与 D3 冲突 | 用 `watch` 手动触发 D3 重绘，不要让 D3 操作 Vue 的 template |
| 内存泄漏 | `onBeforeUnmount` / `beforeDestroy` 中调用 `selectAll('*').remove()` |
| SVG 缩放模糊 | 使用更大的 SVG 再用 CSS 缩小，或设置 `shape-rendering: crispEdges` |
| 动画残留 | 过渡中调用 `transition().remove()` 而非立即 `remove()` |
| 图表响应式 | 使用 `ResizeObserver` 监听容器变化，重新绑定 `viewBox` 或重绘 |
| 大量数据性能 | 使用 Canvas 渲染（`d3-geo` + Canvas）或虚拟化，降低 DOM 节点 |
| key 函数 | `data(data, d => d.id)` 始终提供 key 函数，避免错误的 enter/exit 匹配 |
