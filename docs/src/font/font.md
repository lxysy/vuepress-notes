---
title: 前端基础
date: 2023-10-19
categories:
  - 前端
tags:
  - JavaScript
sticky: 1
---

# 前端基础知识

### 一. HTML

#### 1. HTML的简介

+ ##### HTML(HyperText Markup Language)是一种超文本标记语言，它不属于编程语言。

+ ##### HTML5是2014后推出的，它是公认的下一代web语言，是重要的网络推手。

+ ##### HTML具有简易性、可扩展性、平台无关性和通用性等特点。

+ ##### 网页分为静态和动态两种。

+ ##### 五大主流浏览器：IE(Edge),FireFox,Chrome,Opera,safari

+ ##### 浏览器内核由渲染引擎和JS引擎两部分组成。

  + 内核：Trident(IE),Gecko(FireFox),Webkit(safari/chrome),Blink(chrome/opera)
    国内大多数浏览器采用的双核驱动（Trident&Webkit或Trident&Blink）
    移动端：iphoe/ipad采用的是webkit内核，android4.4以下版本采用的webkit内核，而4.4以上版本采用是blink内核。

+ ##### 常用的专业开发工 sublime,HBuilder,VSCode,Atom,Webstorm

#### 2. HTML标签属性

+ ##### 标签分块级和行级（内联）两种。

  + 块级独占一行，识别宽高，如果不设置，宽度为整行宽度，高度为内容实际的高度；
  + 行级不独占一行，不能设置宽高，宽高分别为内容实际的宽高；
  + 块级标签可以通过设置样式：display:inline;转换为行级标签
  + 行级标签可以通过设置样式：display:block;转换为块级标签
  + 学过的块级标签有：div,p,h1-h6,ul,ol,pre,table,address等
  + 学过的行级行级标签：span,a,b,strong,i,em,sup,sub
  + img属于行级块标签。相当于执行了display:inline-block;操作。

#### 3. W3C规范

+ ##### W3C规范由结构、表现和形为三部分组成。

+ ##### W3C中的嵌套规范：

  + 块级元素可以包含行级元素或块级元素，但行级元素只能包含行级元素；
  + p,h1-h6,dt标签中只能包含行级标签，不能再包含块级标签；
  + 块级元素与块级元素并列，行级与行级并列。

+ ##### 在开发过程中，尽量要使用语义化标签。

#### 4. HTML标签属性

+ ##### 标签由标签名，标签属性和文本内容三部分组成（注意：单标签没有文本内容）。

+ ##### 标签属性是对标签的一种描述方式。标签属性分通用属性，自由属性和自定义属性。

+ ##### 通用属性：所有标签都具有的属性。（除br标签除外）

  + id：用来给标签取一个唯一的名称。id名称在一个网页中必须是唯一的。
  + class：用来给标签取一个类名。
  + style：用来设置该标签的行内样式。
  + title：当鼠标移到该标签，所显示的提示内容。

+ ##### 自定义标签属性：通常用来传值或用于图片懒加载等方面

  + data-*
  + \<img data-src = "图片名" alt = "提示文字" />
  + \<p data-id = "goosid"> ... \</p>

#### 5. table表格

+ ##### table标签 -主要用于呈现格式化数据，由行和列组成

  + ```html
    <table>
        <tr>
            <th></th>
            <td></td>
            <td></td>
        </tr>
        ...
    </table>
    ```

+ ##### table属性

  + border：表格边框，默认单位是像素
  + width：表格宽度，像素
  + align：表格对其方式（left，center，right）
  + cellpadding：单元格文本与边框的距离
  + cellspacing：单元格边框间距

+ ##### 跨行/跨列属性主要用来绘制复杂表格。

  + rowspan：跨行
  + colspan：跨列

+ ##### 完整表格组成：caption（标题），thead（表头），tbody（表体）和tfoot（表尾）四部分组成。

#### 6. form表单

+ ##### form表单标签是所有标签中最核心标签之一。它是用来实现前后端交互的一个重要标签

  + name：表单名称
  + action：表单数据提交的地方（通常是一个后台文件名（.jsp/.php/.asp/.asps/;py等）或网址
  + method：前端提交数据到后端的方法，主要有get和post，默认的是get。

+ ##### 表单元素分为

  + input类 --主要用来输入，选择或发出指令。
    + type：text/password/radio/checkbox/file/button/image/submit/reset
      + text：text：单行文本输入框 type="text"可以不写，默认值。
        + 属性：placeholder（提示）/name（命名）/minlength和maxlength（最少和最多输入的字符个数）/disabled（失效）/readonly（只读）value（默认值）/pattern（正则匹配）
      + password：密码框 属性与 text一样
      + radio：单选钮，通常是两项以上。常用属性有：name（必须要有）/value/checked（选中）/disabled（失效）/readonly（只读）
      + checkbox：复选框，可以用来选择0项，1项或多项。
        + 属性：name（必须要有）/value/checked（选中）/disabled（失效）/readonly（只读）
      + file：文件上传按钮
      + button：普通按钮，通常用它去调用脚本代码。
        + 属性：value（按钮的标题）/disabled（失效）
      + image：图片按钮，用法与button一样。有一个特殊属性：src（用来加载图片，用它替换了value）它有提交功能，与submit功能一样。
      + submit：提交按钮，用来将表单数据提交到后台。
      + reset：重置按钮，将表单所有组件输入的内容清空，还原到初始状态。
  + textarea类 --文本域（也可以叫多行文本框），主要用来输入大批量的内容。
    + 常用属性：name/id/cols/rows/placeholder/minlength/maxlength/required(必须输入)/value
  + select类 --下拉列表框，默认用于单项选择。用option呈现每个选项。
    + multiple属性：表示可以多选，这时的下拉列表框变成了列表框。
    + size：最多显示的行数
  + button类
    + 普通按钮，具有提交功能。可以单独使用，不写在form元素中。如果写在form中，有提交功能。

#### 7. iframe：框架集

+ ##### 是用来将多个网页文件组合成一个文件。常用属性：

  + name：框架名
  + src：引入外部的html文件
  + srcolling：滚动条（yes/no/auto）
  + width：设置宽度（%/px）
  + height：设置高度
  + frameborder：是否有边框（1/0）  
  + marginheight：框架离顶部和低端的距离（&/px）        
  + marginwidth：框架离左右的距离（%/px）

+ ##### 注意：在实际开发中，尽量减少使用iframe，因为它破坏了前进和后退功能，且不利于SEO（搜索引擎优化）

### 二. CSS

#### 1. CSS的简介

+ ##### css：层叠样式表，用来美化网页的。做到结构（HTML）和表现（CSS）分离。

+ 样式优先级：

  + 比较选择器权重，权重高的生效
  + 如果权重一致，距离元素最近的选择器生效（就近原则）
  + 如果样式设置了 ！improtant，则使用当前样式（如果都设置了相当于未设置）
  
  

#### 2. CSS的用法

+ ##### 基本语法：

  选择器{
          属性: 属性值;
          }

+ ##### css引用方式：行间样式，内部样式，外部样式，导入外部样式。

  + 行间样式：直接在标签上书写样式。
  + 内部样式：在文件的内部书写样式。
  + 外部样式：，再用link标签引入这个文件。
  + 导入外部样式：（1）先创建一个css文件；（2）在style标签中用import导入这个样式文件。
  + 以上四种css引用方式的区别：
            行间样式只作用于当前标签；而内部样式作用于当前文件；外部样式可以被多个HTML文件引用
            在实际项目开发中，最好使用外部样式。
            外部样式分为link引入和inport引入两种方式。
  
+ **基本样式：**

  - font
  - text
  - background

+ **CSS单位**

  + px ：逻辑像素（绝对单位）
  + em：相对单位，参考当前元素字体大小（1em = 16px）
  + rem：相对单位，参考HTML**标签**的字体大小
  + deg：角度

  浏览器默认字体大小为16px

+ **大小**

  + width：宽度
  + height：高度
  + min-width：最小宽度
  + max-width：最大宽度

+ font ->可被继承

  + font-size

  + font-weight  字体粗细（字体粗细取值范围取决于字体本身）

    + 100~900整百数
    + 关键字
      + lighter 细体  200
      + norma 正常 400
      + bold 加粗 600
      + bolder更粗 800
    + font-style：字体斜体
      + italic 斜体
    + font-family：字体
    + font-variant ：小型大写
    + font：复合属性，简写（不推荐）
      + szie family 必写属性
      + style variant weight size | line-height family

  + text:

    + color
      + 关键字
      + rgb（255,255,255）red，green，blue
      + rgba（255,255,255,0）透明度
      + 16进制 ：#ff0000
    + line-height
    + text-decoration  文本修饰
    + text-aligin  文本居中  （justify 两端对齐  内容必须超过一行；start end与文本方向有关）
    + text-indent  首行缩进  单位用em
    + letter-spacing   字符间隙
    + word-spacing    单词间隙
    + vertical-aligin   垂直对齐、baseline基线、middle、bottom
    + white-space  清理元素内的空白

  + background

    + -color

    + -image  url('')              多张图片，放在前面的层级越高

    + -repeat    (repeat、repeat-x、no-repeat)

    + -position

    + -attachment   fixed

    + -size  （cover占满元素，不变形，不保证图片完全显示，裁切，建议配合center；contain 不一定占满元素，不变形，保证图片完全显示）  img具有类似属性object-fit

    + origin

    + clip

      雪碧图：图标使用技巧，将大量小图片合成在一张图片上，使用时通过background-position进行定位使用

#### 3. CSS的选择器分类

+ ##### \* 匹配html中所有元素（注意*的性能差，因为它要匹配所有的元素，所以在开发时不建议使用）

+ ##### 标签选择器：用来匹配标签

+ ##### 类选择器：用来选择class命名的标签

+ ##### ID选择器：用来选择ID命名的标签

+ ##### 派出选择器：根据上下文来选择标签

+ ##### 伪类选择器

+ ##### 伪元素选择器

  + ```css
    1）基本选择器
    	id: #id
    	class: .class
    	element: element
    	*   选择所有标签（项目开发时，不要用，因为它要匹配完所有的标签，性能差）
    	,   选择多个DOM
    2）层次选择器
    	选择器1 选择器2：选择选择器1的所有的后代元素（选择器2）
    	选择器1>选择器2：只选择选择器1的子元素
    	选择器1+选择器2：选择紧挨着选择器1的第一个相邻元素（兄弟元素）
    	选择器1~选择器2：选择选择器1的所有兄弟元素
    3）过滤选择器
    	a.简单过滤选择器
    		:first或first()  第一个元素
    		:last或last()    最后一个元素
    		:not(selector)  除selector之外的元素
    		:even   偶数元素
    		:odd    奇数元素
    		:eq(index)  第n个元素
    		:gt(index)  大于第n个后的元素
    		:lt(index)  小于第n个后的元素
    		:header     选择h1-h6所有标题元素
    	b.内容过滤选择器
    		:contains(text) 获取包含指定文本内容的元素
    		:empty  获取不包含子元素或文本内容的元素
    		:has(selector)  获取含有选择器所匹配的元素
    		:parent 获取含有子元素或文本的元素
    	c.可见性过滤选择器
    		:hidden     选择display:none或隐藏文本域(hidden)的元素
    		:visible    选择display:block的元素
    	d.属性过滤选择器
    		[attr]      获取含有指定属性的元素
    		[attr=value]    获取属性值为value的元素
    		[attr!=value]   获取属性值不为value的元素
    		[attr^=value]   获取属性值以value开头的元素
    		[attr$=value]   获取属性值以value结尾的元素
    		[attr*=value]   获取属性值含有value的元素
    		[attr1][attr2][attr3]    获取含有指定多个属性的元素
    4）表单选择器
    	:input
    	:button
    	:submit
    	:text
    	:password
    ```

#### 4. 选择器的分组、继承和权重

+ ##### 选择器的分组

  + 让多个选择器（元素）具有相同的样式，一般用于设置公共样式。
  + 基本选择器
    + 标签选择器   一般不读使用
    + 类选择器（.）
    + ID选择器（#）不建议用于样式设置
    + 通配符选择器  不建议单独使用
  + 复合选择器（选择符 >）
    + 后代选择器   空格     标签1 标签2  标签3（）
    + 子代选择器  >
    + 兄弟选择器  ~         同级之后  多个
    + 相邻兄弟选择器  +    同级最近 单个
    + 并集选择器  ，逗号   复用样式
    + 交集选择器    直接写在一起
  + 属性选择器（属性）[]   ->使用概率不大
    + [attr] ： 包含属性
    + [attr=val]：包含属性  attr  并且值为val
    + [attr~=val]：包含属性 attr 并且值为val**单词**
    + [attr^=val]：以val开头
    + [attr$=val]：以val结尾
    + [attr*=val]：包含val
  + 伪类选择器（伪类）:
    + 结构性伪类
      + child系列 （:first-child、:last-child、:nth-child（））应用于本身
      + type系列（:first-of-type、last-of-type、:nth-of-type()，参数可为odd、even、n）   同种类型标签使用，指定位置
      + not          用法:not(类名)    除某个类之外
    + 状态性伪类
      + link、visited、hover、active
  + 伪元素选择器（伪元素）::     (content：''; 激活伪元素)   相当于插入span
    + ::before
    + ::after
    + ::stlection 文字被选中后的状态  全局选中，前面不能加东西  
    + ::first-letter      "first-letter" 选择器仅适用于在块级元素中（块级p、h1、ul、table  ；行内a、img、b、td）          
    + ::first-line       选择元素的首行，并为其设置样式

+ ##### 选择器权重

  + 通配符，选择符：0,0,0,0

  + 标签，伪元素：0,0,0,1

  + 类，伪类，属性：0,0,1,0

  + ID：0,1,0,0

  + 内联样式：1,0,0,0

    选择器权重为单个选择器权重之和（并集选择器每个部分单独计算）

  + 样式不生效:

    -    权重问题

    - 选择器写错

  + 

+ ##### 选择器的继承

  + 子元素可以继承父元素的样式，反之不可以。

+ ##### 样式权重

  +  ！importent(10000) > 内联样式(1000) > id选择器(100)>类，伪类选择器(10) > 标签选择器(1)

#### 5. CSS字体

+ ##### font-size:字号(px/%)  

+ ##### font-family:字体

+ ##### font-style:样式

  + normal/italic/oblique

+ ##### font-weight:加粗

  + normal/bold/bolder/lighter/100-900

+ ##### line-height:行高(px/数字/em等)

+ ##### color：颜色

  + 颜色的单词/rgb()->r/g/b取值:0-255/16进制(以#开头，后跟六位（#rrggbb）或三位（#rgb）十六进制数)

+ ##### text-decoration:文字的修饰

  + normal/underline/overline/line-through/none

+ ##### text-align:对齐方式

+ ##### text-transform:字母大小写

  + capitalize/uppercase/loweercase/none

+ ##### text-indent:文本缩进(px/em/%/pt)

+ ##### Tip: font复合属性：

  + font：font-style  font-variant  font-weight  font-size/line-height  font-family;
  + 注意：
    + 属性值的位置顺序
    + 除了font-size和font-family之外，其他任何一个属性值都可以省略
    + font-variant:normal/small-caps（让大写字母变得小一些）

#### 6. CSS背景

+ ##### background-color：背景色（transparent/color）

+ ##### background-image：背景图（none/url）

+ ##### background-repeat：背景图像铺排方式（repeat/no-repeat/repeat-x/repeat-y）

+ ##### background-position:设置对象的背景图像位置（{x-number|top|center|bottom}{y-number|left|center|bottom}）

+ ##### background-attachment：背景图像滚动位置（scroll/fixed）

+ ##### background：设置背景的复合写法：

  + background：color  image  repeat  attachment  position

#### 7. CSS伪类选择器

+ ##### 伪类：专门用来表示元素的一种特殊状态。

+ ##### 常用伪类选择器：

  + a标签的伪类： :link/:visited/:hover/:active
  + :focus 获得焦点 
  + :first-child/:last-child/:nth-child(number)

#### 8. 属性和关系选择器

+ ##### \[属性名]：包含有指定属性名的元素（常用）

+ ##### \[属性名=值]：属性名的值为指定值的元素（常用）

+ ##### \[属性名~=值]：属性名的值包含指定值的元素

+ ##### \[属性名^=值]：属性名的值以指定值的开头的元素

+ ##### \[属性名$=值]：属性名的值以指定值的结尾的元素



+ ##### 空格：后代选择器

+ ##### \>：只选择儿子元素

+ ##### +：兄弟选择器

#### 9. CSS伪元素(权重为1)

+ ##### CSS伪元素与伪类区别：

  + css引入伪类和伪元素概念是为了格式化文档树以外的信息，也就是说，伪类和伪元素是用来修饰不在文档树中的部分。
  + 伪类用于当已有元素处于的某个状态时，为其添加对应的样式，这个状态时根据用户行为而动态变化的。它只有处于dom树无法描述的状态下才能为元素添加样式，所以将其称之为伪类。
  + 伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

+ ##### 伪元素&伪类的特点：

  + 伪元素和伪类都不会出现在源文档或者文档树中
  + 伪类允许出现在选择器的任何位置，而一个伪元素只能跟在选择器的最后一个简单选择器后面
  + 伪元素名和伪类名都是大小写不敏感的
  + 有些伪类是互斥的，而其他的可以同时用在一个元素上。（在规则冲突的情况下，常规层叠顺序决定结果）。
  + :before/:after/:first-letter/:first-line:前面是一个冒号也可以是双冒号
  + ::selection/::placeholder/::backdrop : 前面必须是双冒号
    + ：before	在元素的内容前面插入内容（必须有content属性）
      + ：after在元素的内容后面插入内容（必须有content属性）

#### 10. 浮动

- 最初目的：解决图文环绕问题

- 语法：float：left | right | none

- 浮动描述：设置了浮动元素，会脱离正常文档流，向具体方向浮动，遇到父级边界停止；<u>块级元素无法检测到浮动元素</u>；<u>行内（行内块级）元素和文本可以检测到浮动元素</u>。浮动元素在页面中会呈现行内块级元素特性（不包含幽灵空格）

- 应用在布局：
  - 内容左右浮动
  - 内容同排显示
  - 图文环绕
- 浮动问题：
  - 由于块级元素无法检测到浮动元素，所以包含浮动元素的父级元素的高度可能显示不正常，从而页面布局显示异常
  - 解决浮动带来的副作用（清除浮动）：
    - 定高（不推荐）
    - clear属性
      - 块级标签 + clear （极度不推荐）
      - 伪元素 + clear （推荐）   content = ''; display：block；clear：both left right
      - BFC
        - BFC容器的内部元素无法影响外部元素
        - 设置了BFC的元素在计算高度时，浮动元素参与计算
        - 设置了BFC的元素无法和浮动元素重叠
  - clear：设置了clear属性的元素，不受浮动影响；clear只用于块级标签

+ ##### 浮动就是让块级标签不独占一行。目的（使用场景）：把块级标签元素可以排在一行上。

+ ##### 浮动的原理就是让元素脱离文档流，不占用标准流。

+ ##### float的属性值：

  + left：左浮动
  + right：右浮动
  + none：默认值，不浮动

+ ##### 浮动后，后面的元素不管是块级还是行级元素，不会显示在下一行

+ ##### 清除浮动 (让后面的元素自动掉到下一行)  的方法

  + 添加空标签，并设置样式：clear：both
    + clear：left 清除左浮动
    + clear：right 清除右浮动
    + clear：both 清除左右浮动
    + clear：none 左右浮动都不清除
  + 在要清除浮动的**父级**添加样式：overflow:hidden； 超出部分隐藏，也可以用来实现清除浮动
  + 在要清除浮动的**父级**添加伪元素，并设定样式：
    + 父元素：after{
      			content: "";
                   	  	display: block;
                    	 	clear: both;
                  }
  + 注意：在实际项目开发中，我们一般首选第二种方案。

#### 11. CSS盒子模型

+ ##### 每个元素都是一个盒子，一个盒子由margin（外边距），border（边框线），padding（内边距）和content（内容）组成。	区别外边距和内边距是以边框为参照。

+ ##### 系统默认外边距为8px。

+ ##### 外边距指元素边框线之外的距离。

  + margin-left
  + margin-right
  + margin-top
  + margin-bottom
  + margin：可用来设置任意一个边的边距，可以带你1-4个参数。
    + 一个（apx）：表示上下左右都有这样的apx外边距。
    + 两个（apx，bpx）：表示上下为apx，左右为bpx。
    + 三个（apx，bpx，cpx）：表示上为apx，下为cpx，左右为bpx。
    + 四个（apx，bpx。cpx，dpx）表示上右下左为abcdpx。

+ ##### 内边距指元素的文本内容与边框之间的距离。

  + 它的用法与margin完全一样。

+ ##### 边框

  + border-width：边框线宽度
  + border-style：边框线样式
  + border-color：边框线颜色
  + 复合写法
    + border：border-width  border-style  border-color;
    + 注意：border-width border-style border-color 这三个参数没有位置之分

+ ##### 盒子的真实尺寸

  + 盒子宽度 = width + padding左右 + border左右
  + 盒子高度 = height + padding上下 + border上下

#### 12. display属性

+ ##### 用来设置元素的显示方式。

+ ##### none：不显示元素

+ ##### block：块显示，在元素前后设置换行符。目的：将行级标签转化为块级标签（因为行级标签不识别宽高，而块级标签识别，转化后，行级标签也可以设置宽高）

+ ##### inline：将块级转化为行级标签。

+ ##### inline-block：将块级或行级标签转化为行内块标签。

#### 13. table样式

+ ##### table一般不用来布局，主要用来格式化数据。

+ ##### table属性：

  + width：宽度
  + height：高度
  + border-collapse：collapse：单线边框
  + border：边框线

+ ##### td，tr属性：

  + width：宽度
  + height：高度
  + border：边框线
  + text-align：文本左右对齐（left/center/right）
  + vertical-align：文本垂直对齐(top/middle/bottom)，默认基线。块级元素无效。去除底部空白则不能用基线对齐或转换为块级元素

#### 14. 列表样式

+ ##### 不是描述性的文本的任何内容都可以认为是列表。比如：菜单，商品列表等。

+ ##### 列表类型

  + 无序（ul），有序（ol）和自定义列表（dl）。
  + ul和ol的列表项都是用li表示，而dl是由一个dt和一个或多个dd组成的。
  + dl一般用来设定一个定义，比如名词解释等。dt是标题，dd是描述，用来对dt进行解释并说明的。

+ ##### 列表样式

  + list-style-image:用图像表示标识
  + list-style-position:标识的位置（inside/outside）
  + list-style-type:标识类型
  + list-style-type的属性值：
    + 无序：disc(默认)/circle（空心圆）/square（实心圆）
    + 有序：decimal/decimal-leading-zero/lower-roman/upper-roman/lower-alpha/upper-alpha/lower-greek/lower-latin/upper-latin
    + 有序和无序：none
  + 简写：
    + list-style：list-style-image  list-style-position  list-style-type
    + list-style的值可以按任意顺序列出，而且可以任意省略，只要提供一个值，其他的都自动默认

#### 15. 定位（position）

- 层级：普通元素  <  浮动元素  定位元素

- 定位：
  - 层级关系
  - 定位方式  +  偏移度    [层级]
- 定位方式（position）
  - static :静态定位，没有定位
  - fixed：固定定位    必须设置偏移度和宽度
    - 定位基点：基于浏览器可视窗口定位
    - 是否改变元素特性：改变
    - 是否脱离文档流：完全脱离文档流
  - relative 相对定位  一般不单独使用
    - 定位基点：基于自身原本定位   原本的位置会占据位置
    - 是否改变元素特性：不改变
    - 是否脱离文档流：不完全脱离文档流
  - sticky   粘性定位    出现时间较晚，兼容性有待提高，可以使用，如要求必须实现相应效果，用js替换
    - 粘性定位是相对定位和固定定位的几何体，在未满足触发条（偏移度）时，呈现相对定位特征，再触发条件后，呈现固定定位特征
  - absolute  绝对定位（父相子绝）
    - 定位基点：基于最近的设置了定位的父级进行定位，如果没有定位的父级，则基于 body 进行定位
    - 是否改变元素特性：改变
    - 是否脱离文档流：完全脱离文档流
- 偏移度
  
  - right | left | top| bottom
- 设置层级
  
- z-index  <10
  
- 居中问题：

  - 水平

    - 块级标签：width + margin：0  auto
    - 行内标签：在父级上设置 text-align：center

  - 垂直

    - 单行内容居中：line-height    vertical-align  

    - 定位 + 负的 margin、偏移

    - 定位 + 平移 transform：translate（-50%,-50%）推荐

    - 在有宽高的情况下，偏移度全为0，margin：auto

      回顶部

      ![image-20210426171055835](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210426171055835.png)

锚点跳转 

```html
<a href='#id'></a>
<heard id=''></heard>
```

```css
html{
    //页面平滑滚动
    scroll-behavior:smooth
}
```



- ##### 设定元素在文档中的位置。会将标签（元素）转换为块级。

- ##### 定位分类（属性值）

  + static：静态定位
    + 默认值，没有定位，不能设置偏移值（left/top/right/bottom），占用标准流（文档流）
  + relative：相对定位
    + 占用标准流（文档流），它会出现在文档流中它该出现的位置。可以设置偏移值改变其位置。它相对于自身所占的位置做偏移。
  + absolute：绝对定位
    + 脱离文档流，相对于body做偏移。
    + 绝对定位一般与相对定位结合使用
  + fixed：固定定位
    + 脱离文档流，相对于浏览器窗口左上角（0,0）做偏移，它与relative设定的对象没有关系。
    + 也就是说，它跟父级的定位没有任何关系。
    + 一般在开发中用来固定导航栏。

- ##### z-index

  + 当多个元素添加绝对定位，元素将叠加在一起，使用z-index可以设置元素显示的层次。
  + 文档流默认的z-index的值为0。
  + 用在static和relative元素上将无效

#### 16. 网站开发策略和布局

- 双栏布局
  - 侧栏宽度固定，主体内容自适应
    - 侧栏左浮动，main设置左margin
    - 侧栏浮动，主体main设置BFC（浮动、绝对定位、行内块、display：flow-root、overflow：hidden | auto | scroll）
  - 元素隐藏
    - display:none

+ ##### 先整体再局部，至顶向下，逐步细化。

+ ##### 双飞翼布局：

  + 由三列组成，两端固定，中间自适应。
    + 固定定位，main用margin
  + 双飞翼布局：
    + 兼容性好，兼容所有主流浏览器，包括万恶的IE6。
    + 因为在DOM中center_panel在三列结构的最前面，因此可以实现主要内容的优先加载。
  + 圣杯布局
    + 由三列组成，两端固定，中间自适应。外观与双飞翼布局一样。
    + 布局时与双飞翼相比增加了定位和偏移设置。
  
+ **基本布局**

  样式初始化：reset.css (https://guide.aotu.io/docs/css/reset.html)     noamlize.css

  + **盒模型**

    + margin  外边距   元素之间的距离    

      + margin：10px 10px 10px 10px   顺时针
      + margin：10px 10px 10px    上  左右  下
      + margin：10px 10px   上下  左右

    + border  边框   大小  样式  颜色

      + boder：width style color
      + boder-style：（solid、dashed虚线、dotted点线） 
      + boder-radius    8个参数

    + outline ：width style color 外廓  

    + padding  内边距   内容和边框之间的距离

    + content  内容

      元素width = content-width + padding-width + boder-width （设置只包含content-width）

      设置width = content-width + padding-width + boder-width

      box-sizing：设置元素尺寸的计算方式

      	content-box：标准盒模型   设置 width = content-width
  	  	
      	boder-box：IE（怪异）盒模型  设置 width = content-width + padding-width + boder-width
  	  	
      	padding-box（提案）

  + **浮动**

  + **定位**

    margin  BUG

    	margin 叠压：当两元素设置上下margin时，取较大值   设置左右不受影响
  		
    	margin 塌陷 ：父级是块级元素，第一个（最后一个）子集元素也是块级元素，当子集元素设置margin-top（margin-bottom）时，父级会发生坍塌。撑不开父元素
  		
    	解决方式：
  		
    		破坏条件，改变父元素或子元素块级为其他
  		
    		破坏条件   使用padding替换
  		
    		BFC（块级格式化上下文）

    浏览器对元素有默认渲染行为，当设置BFC 时，浏览器对元素的渲染行为会受到一定影响，被改变行为

    		BFC容器的内部元素无法影响外部元素
  		
    	如何设置

    <img src="C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210423162651597.png" alt="image-20210423162651597" style="zoom: 67%;" />		

    

    ​              

    元素分类（css）

    - block  块级元素：占满一行 

    - inline-block  行内块级元素  （幽灵空格：li之间的换行）    input

      - 这是由于标签中的空白字符造成，原因是所有元素都自带的**white-space**属性在起作用。默认行为就是把换行变成空格。也就是这里的间隙实际上是来自div和div之间的换行转变成空格导致的

      - 解决方式<img src="C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210423115716747.png" alt="image-20210423115716747" style="zoom:50%;" />

        第一种
        	消除元素标签之间的空白字符，把标签连在一起。
        第二种：
        	第一步：在这些行内元素的父元素上设置font-size设置为0；
        	第二步：在行内元素上设置正常的字体显示大小，例如:font-size:14px;
    
    - iniline    行内(内联)元素：不占满一行
    
      
    
      元素类型转换：display

  高级布局

+ **弹性布局**

  + 基本概念

  + 轴线

    + 主轴  默认水平 左->右
    + 交叉轴
    + 起始线和终止线  start end

  + 使用弹布局

    + display:flex  |  inline-flex

  + flex属性

    + flex-direction:  设置主轴方向
      + row
      + row-reverse
      + column
      + column-reverse
    + flex-wrap 控制项目的换行
      + no-wrap  不换行
      + wrap 换行
      + wrap-reverse 换行，新内容在上方显示
    + flex-flow: 复合属性
      + flex-direction  
      + flex-wrap

    + 容器属性（写在容器，作用于所有项目）
      + justify-content: 控制项目剩余空间分配方式（水平排列方式）
        + flex-start
        + flex-end
        + space-around  平均分  1:2:1
        + space-between  两端对齐 0:1:1:0
        + space- evenly    1:1:1:1
        + center
      + align-item   内容在单行内，交叉轴对齐方式
        + center
        + flex-start
        + flex-end
        + baseline
      + align-content  内容在容器内交叉轴对齐方式
        + stretch  默认 平均分
    + 项目属性（写在项目，作用于自身）
      + order  设置项目在容器中的排列顺序
      + align-self： 设置自身在交叉轴的对齐方式（更改align-items对自身的影响，不和align-content使用）
      + flex：1     flex-grow：1    设置项目扩大基数(设置分配空间比例)，默认0
      + flex-shrink：   设置缩小基数，（自身可利用空间）
      + flex-basis：设置元素在分配前的基准大小
      + flex：0 1 auto 默认值

  + 特性

    + 默认情况下，弹性布局子元素在一排显示
    + 设置了display: flex本称为flex容器，其<u>直接子元素</u>被称为flex项目（子项）
    + flex项目无法使用浮动属性

+ **网格布局**

  caniuse查看是否支持布局

#### 17. BFC&IFC

+ ##### FC：Fomatting Context（格式上下文）。它是CSS2.1规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。BFC和IFC都是常见的FC。分别叫做Block Fomatting Context 和Inline Formatting Context。

+ ##### BFC：块级格式上下文

  + 形成BFC的条件
    + 浮动元素（float除none以外的值）
    + 定位元素（position[absolute/fixed]）
    + display（值为inline-block/table-cell/table-caption时）
    + overflow（值为hidden/auto/scroll时）
  + BFC特性（规则）
    + 内部的盒子会在垂直方向上一个接一个的放置
    + 垂直方向的距离由magin最大值决定（如果不要叠加，就需要将该盒子变成一个独立的盒子）
    + BFC的区域不会与float元素区域重叠
    + 计算BFC的高度时，浮动元素也参与计算
    + BFC就是页面上的一个独立的容器，容器里面的子元素不会影响到外面的元素
  + BFC的作用
    + 解决margin重叠的问题（添加独立BFC来解决这个问题）
    + 解决浮动高度塌陷的问题（在父级添加overflow：hidden）
    + 解决侵占浮动元素的问题（在父级添加overflow：hidden清除浮动）

+ ##### 行级格式上下文

  + 形成BFC的条件
    + font-size
    + line-height
    + height
    + vertical-aligin
  + IFC特性（规则）
    + IFC的元素会在一行中从左至右排列
    + 在一行上的所有元素会在该区域形成一个一个行框
    + 行宽的高度为包含框的高度，高度为行框中最高元素的高度
    + 浮动的元素不会在行框中，并且浮动元素会压缩行框的宽度
    + 行框的宽度容纳不下子元素时，子元素会自动换下一行显示，并且会产生新的行框
    + 行框的元素内遵循text-align和vertical-align

+ ##### 容器的高度 height = line-height + vertical-align

### 三. HTML5

#### 1. HTML5简介

+ ##### HTML5由W3C和WHAT组织机构共同研发出来的，于2014年正式发布。

+ ##### HTML5成为新一代网页开发标准。

#### 2. HTML5新特性（面试）

+ ##### 增加了audio和video音频视频播放，抛弃了flash。

+ ##### 新增了canvas画布（绘画，制作动画[如小游戏开发等]）

+ ##### 地理定位

+ ##### 增加了离线缓存

+ ##### 硬件加速

+ ##### Web Socket（全双工通信）

+ ##### 增加了本地存储

+ ##### 新增了一些语义化标签

+ ##### 网页布局标签

  + header：页首
  + nav：导航栏
  + aside：侧边栏
  + main：主体
  + section：区块
  + article：文章
  + footer：页尾

+ ##### 语义化标签

  + mark：高亮显示（行级）
  + details（描述）与summary（摘要）：一般用于名词解释或用于封装一个区块
  + meter：定义度量衡
    + 属性：value/min/max
  + progress：进度条
    + 属性：value/min/max
  + dialog：对话框或窗口
  + figure：用于对元素进行组合（一般用来组合一张图的标题、图片和图片描述等）

#### 3. HTML5多媒体

+ ##### audio

  + 播放音乐或音频。IE9以下的版本不支持。
  + 支持的格式：  .mp3/.ogg/.wav
  + 属性
    + src：文件路径
    + autoplay：自动播放
    + loop：循环
    + controls：控制条
    + muted：静音
    + preload：预加载（当使用autoplay时，preload自动失效）
  + 兼容
    + \<audio>
      	\<source src = "" type="audio/mpeg">
      	\<source src = "" type="audio/ogg">
      	您的浏览器不支持
      \</audio>

+ ##### video

  + 加载视频。IE9以下的版本不支持。
  + 支持的格式： .mp4/.ogg/.webm
  + 属性
    + src：文件路径
    + autoplay：自动播放
    + loop：循环
    + controls：控制条
    + muted：静音
    + preload：预加载（当使用autoplay时，preload自动失效）
    + width：宽度
    + height：高度
    + poster：海报

+ ##### embed

  + 嵌入内容或加载插件。
  + 属性：
    + src：文件路径
    + width：宽度
    + height：高度
    + type：类型

+ ##### canvas

  + 画布。是一个容器元素。
  + 注意：单独使用canvas没有什么意思，它必须结合JavaScript的使用。它的具体功能体现是JavaScript体现出来的
  + canvas的宽高最好不要通过css实现，而是直接使用标签属性width和height实现。

#### 4. HTML5常用属性

+ ##### contentEditable

  + 将标签转换为可编辑状态。可用于所有标签。它的值有true和false。

+ ##### hidden

  + 对元素进行隐藏，一般用来传值或当某个条件成立，执行内容显示。

+ ##### data-*

  + 用于存储页面或应用程序的私有自定义数值。一般用于传值。

+ ##### multiple

  + 规定输入域中可选择多个内容给。用于表单组件中，如file/select

+ ##### required

  + 约束表单元素，在提交前必须输入值。用于表单组建中，需要结合提交按钮使用。

+ ##### pattern

  + 用于验证输入字段的模式。

#### 5. HTML5新表单

+ ##### 表单组件

  + color：颜色
  + email：邮箱
  + tel：电话号码
  + url：网址
  + number：数字
  + range：范围
  + search：搜索
  + date：日期
  + datetime：日期时间
  + datetime-local：本一日期时间
  + year：年份
  + mouth：月份
  + time：时间

+ ##### 表单属性

  + formaction：修改action数据提交的地方
  + formenctype：修改表单请求的类型
  + formmethod：修改数据提交的方法
  + form：设置表单元素属于哪一个表单
  + novalidate：不验证

#### 6. input属性

+ ##### autocomplete

  + 自动完成
  + 用来帮助用户输入，每一次输入的内容，浏览器是否保存输入的值，以备将来使用
  + 值有：on/off。默认为on。
  + 为了保护敏感数据（比如用户的账号密码等），避免本地浏览器对它们不安全存储，一般要关闭。

+ ##### autofocus：自动获焦

+ ##### step：步长

+ ##### multiple：多选

+ ##### pattern：正则匹配

+ ##### placeholder：输入提示

+ ##### required：必须输入

+ ##### outline：轮廓线，一般为0或者none去掉它

+ ##### resize：none 防止文本域拖拽

#### 7. 鼠标样式

+ ##### cursor：更改鼠标样式

  + default：默认
  + pointer：小手
  + move：移动
  + text：文本
  + not-allowed：禁止

### 四. CSS3

#### 1. CSS3的主要新特性

+ ##### 选择器

+ ##### 阴影

+ ##### 形状转换（2D<->3D）

+ ##### 变形

+ ##### 动画（过渡动画，帧动画）

+ ##### 边框

+ ##### 多重背景

+ ##### 反射

+ ##### 文字

+ ##### 颜色（rgba，hsl，hsla）

+ ##### 滤镜（filter）

+ ##### 弹性布局

+ ##### 多列布局

+ ##### 盒模型

+ ##### Web字体

+ ##### 媒体查询

#### 2. CSS3兼容性问题

+ ##### CSS不是所有浏览器或同一浏览器的不同版本都支持，所以需要做兼容处理，通常的做法就是加厂商前缀。

+ ##### 主流浏览器内核（面试）

  + Trident：IE内核
  + Webkit：Chrome和Safari内核
  + Gecko：FireFox内核
  + Blink（是Webkit的一个分支）：Chrome和Opera内核
  + Tips（小技巧）： 目前国内的浏览器大多都是双核的（IE内核+Chrome内核）

+ ##### 厂商前缀

  + IE：-ms-
  + Chrome&Safari：-webkit
  + FireFox：-moz-
  + Opera：-o-

#### 3. CSS3选择器（权重为10）

+ ##### 丰富选择的目的，在标签中减少class和id的使用。
+ ##### 属性选择器

  + \[属性名]
  + \[属性名=属性值]
  + \[属性名w^=属性值]：以属性名开头的属性
  + \[属性名$=属性值]：以属性名结尾的属性
  + \[属性名*=属性值]：含有属性名的属性
+ ##### 结构性伪类

  + ：first-child		匹配父元素中的第一个子元素
    + ：last-child	匹配父元素中的最后一个子元素
    + ：nth-child（n）匹配父元素中的第n个子元素（可以是even偶数，odd奇数也可以是公式2n偶数，2n+1奇数）
    + ：nth-last-child（n）
    + ：nth-of-type（n）指定类型e的第n个
  + ：nth-last-of-type（n）
  + ：only-child
  + ：only-of-type
+ ##### 目标伪类

  +  ：target
+ ##### UI元素状态伪类

  + ：checked（只在Opera浏览器中有效）
  + ：disable
  + ：enable
  + ：：selection
+ ##### 否定伪类

  + ：not（）
+ ##### 通用兄弟元素选择器

  + ~

#### 4. CSS3文本

+ ##### 文本阴影（主流浏览器都支持，IE9以上支持）

  + 语法： text-shadow：h-shadow（水平偏移） v-shadow（垂直偏移） [blur]（模糊度） [spread]（尺寸）[color]（颜色）[inset];

+ ##### 文本自动换行（主流浏览器都支持）

  + 语法：word-wrap: normal|break-word;

  + ```css
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    ```

  + 

+ ##### 单词拆分（主流浏览器都支持）

  + 语法：word-break: normal|break-all|keep-all;

+ ##### 文本拆分（所有主流浏览器都不支持）

  + 语法：text-wrap: normal|none|unrestricted|suppress;

+ ##### 文本溢出

  + 单行文本溢出（重要）	语法： text-overflow: clip|ellipsis|string;

  + 处理文字溢出样式：

    + ```css
      width: px/%/em..;
      white-space: nowrap; /*不允许换行*/
      
      -ms-text-overflow: ellipsis;/*处理IE兼容*/
      text-overflow: ellipsis;
      overflow: hidden;
      ```

  + 多行文本溢出（IE9以下版本不支持，主要是谷歌支持）

    + ```css
      width: px/%/em..;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3（行数）;
      overflow: hidden;
      ```

#### 5. CSS3边框

+ ##### 圆角边框

  + 语法：border-radius: 1-4 length|% / 1-4 length|%;
  + 两个参数：第一个参数对应的是左上和右下，第二个参数对应的是右上和左下
  + 三个参数：第一个参数对应的是左上、，第二个参数对应的是右上和左下，第三个参数对应的是右下
  + 四个方位的值：top-left/top-right/bottom-left/bottom-right

+ ##### 边框阴影（IE9以上支持）

  + 语法： box-shadow: h-shadow（水平偏移） v-shadow（垂直偏移） [blur]（模糊距离） [spread]（尺寸）[color]（颜色）[inset];

+ ##### 边框图片(IE11.0及以后的版本支持)

  + border-image：source（图片路径） slice（向内偏移距离） width（宽度） outset（图像区超出边框的距离） repeat（重复效果）
  + 重复效果：round（铺满）/stretch（拉伸）/repeat（平铺）

#### 6. CSS3背景

+ ##### 多重背景

  + background：背景色 背景图片 平铺方式 位置，背景色 背景图片 平铺方式 位置...

+ ##### background-size：设定背景图片的尺寸

  + background-size: length（固定长度）|percentage（百分比值）|cover（完全覆盖）|contain（扩展到最大尺寸）;

+ ##### background-origin：属性指定了背景图像的位置区域。

  + 语法： background-origin: padding-box|border-box|content-box;
  + padding-box：背景图像相对于内边距框来定位。
  + border-box：背景图像相对于边框盒来定位。
  + content-box：背景图像相对于内容框来定位。

+ ##### background-clip：设定背景的绘制区域。

  + 语法： background-clip: border-box|padding-box|content-box;
  + border-box ：背景被裁剪到边框盒。
  + padding-box ：背景被裁剪到内边距框。
  + content-box ：背景被裁剪到内容框。

+ ##### 渐变背景

#### 7. CSS3颜色函数

+ ##### rgba（r,g,b,a）

  + r：红色    取值范围：0-255/0-100%
  + g：绿色    取值范围：0-255/0-100%
  + b：蓝色    取值范围：0-255/0-100%
  + a：不透明度  取值范围：0-1的一个小数

+ ##### HSLA

  + hsl（h，s，l）
  + h：色调    取值范围：0-360
  + s：饱和度   取值范围：0-100%
  + l：亮度    取值范围：0-100%
  + a：不透明度  取值范围：0-1的一个小数

+ ##### opacity

  + 调整元素的不透明度，大多数情况下用于做元素的遮罩效果。取值范围：0-1的一个小数
  + IE8及8以下版本不支持opacity，处理兼容的方式，再添加一行代码来处理不透明度：filter：alpha（opacity=数值）       数值的范围：0-100

#### 8. CSS3渐变

+ ##### 主要用来设置背景或制作三维图

+ ##### 线性渐变

  + background：linear-gradient(方向或角度，颜色1 百分比，颜色2 百分比...)
  + 方向：
    + to left：从右向左渐变
    + to right：从左向右渐变
    + to top：从下向上渐变
    + to bottom：从上向下渐变
    + to top left：从右下向左上渐变
    + to top right：从左下向右上渐变
    + to bottom left：从右上向左下渐变
    + to bottom right：从左上向右下渐变
  + 角度：
    + 比如45度角，应该表示为：45deg
  + 颜色取值：
    + 表示颜色的单词
    + 16进制颜色
    + 表示颜色的函数（rgb()/rgba()/hsl()/hsla...）、

+ ##### 径向渐变（沿着半径方向渐变）

  + 语法： background: radial-gradient(shape（形状） size（渐变大小） at 位置, start-color（颜色1） 百分比 , ..., last-color（颜色n) 百分比;
  + 形状：
    + ellipse：椭圆径向渐变（默认）
    + circle：圆径向渐变
  + 渐变大小：
    + farthest-corner：渐变的半径长度为从圆心到圆心最远的角（默认）
    + closest-side：渐变的半径长度为从圆心到圆心最近的边
    + closest-corner：渐变的半径长度为从圆心到圆心最远的角
    + farthest-side：渐变的半径长度为从圆心到圆心最远的边
  + 位置：
    + center：设置圆心在中心（默认）
    + top：设置圆心在顶部
    + bottom：设置圆心在底部
    + at 圆心横坐标 圆心纵坐标：设置圆心在横坐标，纵坐标的位置

+ ##### 文字渐变

  + background-image: -webkit-linear-gradient(#2fff99,#69fff3,#000000);//线性或径向渐变
  + background-image: linear-gradient(#2fff99,#69fff3,#000000);
  + -webkit-background-clip: text;
  + -webkit-text-fill-color: transparent;

#### 9. box-sizing

+ ##### 允许你以某种方式定义某些元素，以适应指定的区域。

+ ##### box-sizing：content-box/border-box（火狐和谷歌需要厂商前缀）

+ ##### border-box：盒子的实际宽度包含了padding和border

+ ##### content-box：盒子的实际宽度没有包含padding和border（默认）

#### 10. 变形（transform）

transform:

+ ##### translate

  + translate（x，y）定义2D旋转，沿着X和Y轴移动元素。位移效果
  + translateX（y）定义2D旋转，沿着X移动元素。单位如果是百分比则是移动自身宽度的百分之多少
  + translateY（x）定义2D旋转，沿着Y轴移动元素。<u>translate对于行内元素是无效的</u>

+ ##### scale

  + scale（x，y）定义2D缩放转换，改变元素的宽度和高度。可以是一个数，代表宽高都放大
  + scaleX（y）定义2D缩放转换，改变元素的宽度。
  + scaleY（x）定义2D缩放转换，改变元素的高度。

+ ##### rotate（angle）定义2D旋转，在参数中规定角度。(-360deg - 360deg) 旋转效果   turn = 360deg

+ ##### skew

  + skew（x-angle，y-angle）定义2D倾斜转换，沿着X轴和Y轴。 变形效果
  + skewX（angle）定义2D倾斜转换，沿着X轴。
  + skewY（angle）定义2D倾斜转换，沿着Y轴。

+ ##### matrix（n，n，n，n，n，n）定义2D转换，使用六个值的矩阵。（略）

+ ##### transform-origin:设置元素的基点。

  + 语法： transform-origin: x-axis y-axis z-axis;
  + 属性值： 
    + x-axis ：定义视图被置于 X 轴的何处。可能的值：left，center，right，length，%。
    + y-axis ：定义视图被置于 Y 轴的何处。可能的值：top，center，bottom，length，%。
    + z-axis ：定义视图被置于 Z 轴的何处。可能的值：length。

+ ##### perspective

  + 让子元素获得透视效果。
  + perspective：length|none；
  + 主流浏览器都不支持，谷歌要加-webkit-，或在长度后加单位

+ ##### transform-style

  + transform-style 属性规定如何在 3D 空间中呈现被嵌套的元素。
  + 注释：该属性必须与 transform 属性一同使用。
  + 语法： transform-style: flat|preserve-3d;

+ ##### rotateZ

  + 沿着垂直于Z轴的方向顺指针旋转。

#### 11. CSS3动画

动效

组成

hover

- 过渡：transition  

  		property属性
  	
  		attribute属性

  

- ##### transition:过渡动画  用于正常元素（不用于伪类）

  + 常规用法
    + transition-property  控制产生过渡效果的属性，默认为all
    + transition-duration    过渡时间
    + transition-timing-fuunction  速度曲线（时间函数），用于控制速度运动轨迹
      + ease - 规定过渡效果，先缓慢地开始，然后加速，然后缓慢地结束（默认）
      + linear - 规定从开始到结束具有相同速度的过渡效果
      + ease-in -规定缓慢开始的过渡效果
      + ease-out - 规定缓慢结束的过渡效果
      + ease-in-out - 规定开始和结束较慢的过渡效果
      + cubic-bezier(n,n,n,n) - 允许您在三次贝塞尔函数中定义自己的值
    + transition-delay   延时过渡效果
  + 简洁（复合）用法：
    
    + transition：property-name-list | all duration | timing-function | delay;
    
      transition: width 2s linear 1s；
  + 可以使用的属性有：
  + 颜色
    
    + color background-color border-color outline-color
  + 位置
    
    + backgorund-position left right top bottom
  + 长度
    + max-height min-height max-width min-width height width
    + border-width margin padding outline-width outline-offset
    + font-size line-height text-indent vertical-align
    + border-spacing letter-spacing word-spacing
  + 数字
    
    + opacity visibility z-index font-weight zoom
  + 组合
    
    + text-shadow transform box-shadow clip
  + 其他
    
    + gradient
  + duration：动画持续时间
  + timing-fuunction：动画函数
    + linear：匀速
    + ease：变速（先慢后快，最后再慢）
    + ease-in：变速（由慢变快）
    + ease-out：变速（由快到慢）
    + ease-in-out：变速（慢速开始，慢速结束）
    + cubic-bezier（n，n，n，n）：自行设定变速，n的值在0-1之间
  + delay：动画延时时间，一般以秒（s）或毫秒（ms）为单位。

- ##### 关键帧动画

  - 设置动画执行内容  

    - animation：myAni 2s linear infinite(无限)  alternate

  - 声明动画执行相关配置

    ```css
    @keyframes myAni{
        0%{}
        100%{}
    }
    ```

    

  - 步骤：

    + 设置关键帧

    + 如果只有两个关键帧：

    + ```
      @keyframes 动画名{
      	0%：{样式表}
      	100%：{样式表}
      }
      ```

    + ```
      @keyframes 动画名{
      	from：{样式表}
      	to：{样式表}
      }
      ```

    + 如果是多个关键帧：

    + ```
      @keyframes 动画名{
      	0{样式表}
      	25%{样式表}
      	60%{样式表}
      	...
      	100%{样式表}
      }
      ```

  - 注意:这里的百分比一般是升序值，可以是0%~100%之间的任意值，也可以是倒序。

  - 实施动画（常规用法）

    + animation-name：动画名 （来自于@keyframes定义的动画名）
    + animation-duration：动画持续时间，动画延时时间，一般以秒（s）或毫秒（ms）为单位。（默认为0）
    + animation-timing-function：动画函数
      + linear：匀速（默认）
      + ease：变速（先慢后快，最后再慢）
      + ease-in：变速（由慢变快）
      + ease-out：变速（由快到慢）
      + ease-in-out：变速（慢速开始，慢速结束）
      + cubic-bezier（n，n，n，n）：自行设定变速，n的值在0-1之间
      + steps()：指定时间函数中的间隔数量（步长）
    + animation-delay：动画延时时间，动画延时时间，一般以秒（s）或毫秒（ms）为单位。（默认为0）
    + animation-iteration-count：动画循环次数
      + number：按设定的次数循环（默认一次）
      + infinite：无限循环
    + animation-direction：动画播放完后是否反向播放
      + normal：不反向（默认）
      + alternate：向正向后反向
      + reverse：反向
      + alternate-recerse：先反向后正向
    + animation-play-state：动画播放或停止播放
      + paused：停止播放
      + running：播放（默认）
    + animation-fill-mode: 
      + backwards：回到起始状态
      + forwards：设置动画结束后停留位置，在结束位置

  - 实施动画（简洁用法）

    + animation：name  duration  timing-function  delay  iteration-count  direction  animation-play-state/animation-fill-mode ;
  
- 3D变换

  - transform-style：
  - perspective视距

  - transform：translateZ
  - backface-visibility

#### 12. 多列（分栏）

+ ##### column-count 规定元素应该被分隔的列数（）栏数。

  + column-count: number | auto;

+ ##### column-gap 设置栏间距。

  + column-gap：length | normal；

+ ##### column-rule 设置栏间分隔线。

  + column-rule-style：设置线型。
    + none 没有分隔线
    + hidden 隐藏线
    + dotted 点线
    + dashed 虚线
    + solid 实线
    + double 双线
    + groove 3D沟槽效果。
    + ridge 3D脊状效果。
    + inset 3D左上角阴影效果。
    + outset 3D右下角阴影效果。
  + 注意：
    + 3D线型在分栏中没有效果，当实线处理。
  + column-rule-width：设置线宽。
  + column-rule-color：设置分隔线颜色。
  + 简洁（复合）写法：
    + column-rule：width style color

+ ##### column-width 设置栏宽。

  + column-width：length | auto

+ ##### columns 是column-width 和 column-count 的简写属性。

  + columns：width count；

#### 13. flex弹性盒子布局

+ ##### CSS3 弹性盒（ Flexible Box 或 flexbox），是一种当前页面需要适应不同的屏幕大小以及设备，使元素拥有恰当的行为的布局方式。

+ ##### 目的是提供一个更加有效的方式来对一个容器中的子元素进行排列，对齐和分配空白空间。

+ ##### flex-direction（应用于父元素）

  + flex-direction 指定了弹性子元素在父容器中的位置。   主轴方向
  + 语法：flex-direction：row | row-reverse | column | column-reverse
  + 参数：
    + row：横向从左到右排列（左对齐）  ——》
    + row-reverse：反转横向排列（右对齐，从后往前排，最后一项排在最前面）  《——
    + column：纵向排列   从上到下
    + column-reverse：反纵向排列，从后往前排，最后一项排在最上面。

+ **flex-wrap（用于父元素）**

  + nowrap (默认) 不换行
  + wrap 换行 第一行在上方
  + wrap-reverse 换行，第一行在下方

+ ##### flex-flow

  + flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

+ ##### justify-content（应用于父元素）

  + 把弹性项沿着弹性容器的主轴线对齐。
  + 语法：justify-content: flex-start | flex-end | center | space-between | space-around
  + 参数：
    + flex-start：紧凑方式左对齐
    + flex-end：紧凑方式右对齐
    + center：紧凑方式居中对齐
    + （\*）space-between：除了第一个和最后一个子元素外，其他子元素等分空白区域
    + （\*）space-around：所有子元素等分空白区域

+ ##### align-items（应用于父元素）

  + 子元素在侧轴（纵轴）方向上的对齐方式。
  + 语法：align-items: flex-start | flex-end | center | baseline | stretch
  + 参数：
    + flex-start：沿纵轴顶端对齐
    + flex-end：沿纵轴底端对齐
    + center：沿纵轴垂直居中对齐
    + baseline：沿纵轴基线对齐
    + stretch：纵向拉伸对齐

+ ##### flex-grow（应用于子元素）

  + 子元素的放大比例，默认为0，即如果存在剩余空间，也不放大。
  + 语法：flex-grow：number；

+ **flex-shrink (应用于子元素)**

  + flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
  + 默认为1，空间不足，项目将缩小
  + 值为0，空间不足，项目不缩小

+ **flex-basis**

  + flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

+ ##### flex

  + 用于指定弹性子元素空间分配。
  + 语法：flex: auto | initial | none | inherit | [ flex-grow ] || [ flex-shrink ] || [ flex-basis ]
  + 参数：
    + auto : 计算值为 1 1 auto。
    + initial : 计算值为 0 1 auto。
    + none ：计算值为 0 0 auto。
    + inherit ：从父元素继承。
    + [ flex-grow ] ：定义弹性盒子元素的扩展比率。
    + [ flex-shrink ] ：定义弹性盒子元素的收缩比率。
    + [ flex-basis ] ：定义弹性盒子元素的默认基准值。
  + Tips:
    + flex可以带1-3个参数
    + 带一个参数
      + 无单位，这个数值会被当做flex-grow（放大）的值
      + 带单位，这个数值会被当做flex-basis（基本宽度）的值
      + auto（自动宽度） | initial（初始宽度） | none
    + 带二个参数
      + 第一个参数必须是一个无单位的数值，它会被当做flex-grow的值
      + 第二个参数：
        + 无单位，这个数值会被当做flex-shrink（收缩比例）的值
        + 带单位，这个数值会被当做flex-basis（基本宽度）的值
    + 带三个参数
      + 第一个参数必须是一个无单位的数值，它会被当做flex-grow的值。
      + 第二个参数必须是一个无单位的数值，它会被当做flex-shrink（收缩比例）的值。
      + 第三个参数必须是一个有效的宽度值（带单位），它会被当做flex-basis（基本宽度）的值。

#### 14. 响应式布局

- 多端适配方案
  - 自适应布局：一个终端书写一套代码
    - 服务判断
  - 响应式布局：一套样式覆盖多个终端
    - 代码冗余
    - 维护性差

+ ##### 响应式布局概念

  + Responsive Design，在实现不同屏幕分辨率的终端上浏览网页的不同展示方式。
  + 通过响应式设计能使网站在手机和平板电脑上有更好的浏览阅读体验。

+ ##### 响应式布局和自适应布局的区别（面试点）

  + 响应式布局只开发一套代码，通过检测视口的分辨率，针对不同客户端，在客户端做代码处理，来展现不同的布局和内容；
  + 自适应需要开发多套界面，来判断当前访问的设备是pc端、平板、手机等，从而请求服务层，返回不同的页面
  + 响应式布局等同于流动网格布局，而自适应等同于使用固定分割点来进行布局。
  + 自适应布局给出了更多的设计空间，只用考虑几种不同的状态就可以了；
  + 而响应式布局要考虑上百种不同的状态，虽然有些状态差异较小，但也要考虑到。

+ ##### 响应式布局开发实现方法

  + 媒体查询
  + 百分比布局
  + rem布局（相对于根节点（元素）html中的字号布局）
  + 视口单位布局（vw，vh）

+ ##### 响应式设计步骤

  + 设置meta标签
  + 通过 媒体查询/百分比... 来设置样式
  + 设置多种视图的宽度
    + 宽度需要使用百分比/rem/vw&vh等
    + 处理图片缩放
    + 其他属性处理
      + 如pre/iframe/video等，都要缩放其大小table，建议不要增加padding属性，低分辨率下要使用内容居中操作

#### 15. 媒体查询

+ ##### 设置meta标签

  + ```css
    <meta name="viewpoint" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
    ```

  + 说明：

    + 以上标签的内容只能被移动设备识别。
    + viewpoint：视口（移动端）。
      + layout viewport: 布局视口
      + visual viewport: 设备视口
      + idea viewport：理想视口      visual viewport = layout viewport
    + width-device-width：宽度等于当前设备的宽度
    + initial-scale=1.0：初始缩放比例（默认为1.0）
    + minimum-scale=1.0：允许用户缩放到的最小比例（默认为1.0）
    + maximum-scale=1.0：允许用户缩放到的最大比例（默认为1.0）
    + user-scalable=no：允许用户是否可以手动缩放（默认为no）

+ ##### 设置IE渲染方式 默认为最高版本

  + ```css
    <meta http-equiv="x-ua-compatible" content="IE=Edge,chrome=1">
    ```

  + 说明：

    + 以上代码表示如果浏览器有chrome插件，将以chrome提供的v8引擎渲染页面；
    + 如果没有，将以IE的最高版本渲染页面。

+ ##### 引入兼容的JS文件

  + ```css
    <!--[if lt IE 9]>
    <script src="http://oss.maxcdn.cm/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="http://oss.maxcdn.cm/libs/responed.js//responed.min.js"></script>
    <![endif] -->
    ```

  + 说明：

    + 因为IE8及以下版本既不支持HTML5，也不支持CSS3 media，所以我们需要加载JS文件来处理兼容。
    + 上面的代码是一个注释语句，也就是说，IE9及以上的版本不会编译这几行代码。

+ ##### 进入CSS3提供的媒体查询

  + 引入外部CSS文件时使用

    + ```css
      <link rel="stylesheet" href="../CSS/css_day09/screen480.css" media="screen and (max-width:480px)">
      如果屏宽为480px以下，将加载screen480.css文件
      <link rel="stylesheet" href="../CSS/css_day09/screen800.css" media="screen and (min-width:480px) and (max-width:800px)">
      如果屏宽为480px以上800px以下，将加载screen800.css文件
      <link rel="stylesheet" href="../CSS/css_day09/screengt800.css" media="screen and (min-width:800px)">
      如果屏宽为800px以上，将加载screengt800.css文件
      ```

    + 设备：

      + all：所有设备
      + screen：PC端显示器
      + print：打印机或打印预览图
      + handheld：便携设备
      + tv：电视
      + speech：音频合成器
      + braille：盲人点触设备
      + embossed：盲人打印机
      + projection：投影设备
      + tty：固定密度字母栅格设备
      + only：用来排除不支持媒体查询的浏览器。

    + 在style标签中用@media定义

#### 移动端适配

- 	viewport

- 	单位
  - px：绝对单位（逻辑像素）
  - dpr：devicePixlRatio  设备像素比  物理像素/逻辑像素   视网膜屏
  - vw，vh，vmin，vmax

- 适配方式

  - flexable

  - vw

  - vw + rem

    width = 10vw  1/10宽度

     

  - sass

  ```css
  @baseWidth:750
  @function pxtorem($px){
      @return($px / ($baseWidth / 10)) + rem
  }
  body{	
  	width:pxtorem(48);
      height:pxtorem(207);
  }
  ```





px

dpr

逻辑像素 & 物理像素



`200*200` ->` 400*400`



git add .

git commit -m ''

git pull

git push

#### 16. web字体

+ ##### 开发者引入外部字体。

+ 语法：

  + ```css
    @font-face{
        font-family：字体名；
        src：url（"字体文件"）format（"字体文件格式以处理浏览器兼容"），url（） format；
    }
    ```

  + 说明：

    + 可以同时引入多个字体文件，字体一样，文件的扩展名不一样，目的是为了处理浏览器兼容。

  + eg：

    + ```css
      @font-face {font-family: "iconfont";
      src: url('iconfont.eot?t=1491967237541'); /* IE9*/
      src: url('iconfont.eot?t=1491967237541#iefix') format('embedded-opentype'), /* IE6-IE8 */
      url('iconfont.woff?t=1491967237541') format('woff'), /* chrome, firefox */
      url('iconfont.ttf?t=1491967237541') format('truetype'), /* chrome, firefox, opera, Safari,
      Android, iOS 4.2+*/
      url('iconfont.svg?t=1491967237541#iconfont') format('svg'); /* iOS 4.1- */
      }
      ```

#### 17. iconfont图标字体

+ ##### 由阿里巴巴提供的一种图标字体。

+ ##### 步骤：

  + 进入官网http://www.iconfont.cn/,注册并登陆

  + 创建一个项目

  + 添加图标到购物车

  + 将购物车中的图标添加到项目中

  + 下载iconfont文件，解压后，将部分文件复制到网页项目中

  + 使用字体图标前，先引入iconfont,css文件

  + 使用字体图标方法

    + 用类名

    + ```css
      <div class="iconfont iconhome"></div>
      ```

    + 用unicode值

    + ```css
      <div class="iconfont">&#xe692;</div>
      ```

#### **18.css预处理器**

- ##### sass

  - 基本特性：	
    - 变量 *
    - 嵌套 *
    - 注释
    - 计算
  - 重构（复用）代码
    - @import
    
    - @extend 继承 *
    
    - @mixin 混入 *
    
      - 在css中重用样式
    
      ```css
      @mixin rounded-corners {
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
      }
      notice {
        background-color: green;
        border: 2px solid #00aa00;
        @include rounded-corners;
      }
      //sass最终生成：
      .notice {
        background-color: green;
        border: 2px solid #00aa00;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        border-radius: 5px;
      }
      ```
    
  - 函数指令
  
- ##### less

./  当前目录

../  上级目录

/  根目录			

## JavaScript

基础

进阶

ES6

图形编程

Node

- #### JavaScript组成

  - ECMAScript   语法标准
  - DOM(文档对象模型)   页面控制
    - 提供了对文档的结构化的描述，改变文档结构，样式和内容
    - 元素控制
      - 元素搜索
        - el.getElementByld(id)    通过元素ID获取元素
        - el.getElements*()
          - 通过元素的特征，返回复合条件的集合(类数组)        <u>实时集合</u>
          - 包含特征 
            - getElementsByClassName()
            - getElementsByTagName('div')    
            - getElementsByName()
        - el.querySelector(selector)    获取复合选择器条件的第一个元素    （.main:nth-child(2)）
        - el.querySelectorAll(selector)      获取复合选择器条件的所有元素的集合        <u>静态集合</u>
        - el.closest(selector)     会查找与css选择器匹配的最近的祖先元素(包含自身)
        - el.matches(selector)    检查el是否与传入的
        
      - 元素遍历：以一个元素为基点，获取她周围的元素（父级，子级，同级）
        - 顶层元素对象    
          - documentElment      //html
          - document.body
          - doucumnt.head
        - 父级
          - parentElment        顶层为documentElment      null
          - parentNode      documentElment      document     null
        - 子级
          - childNodes   所有子节点（包含文本，注释）
          - children
          - firstChild     第一个子节点（包含文本，注释）
          - firstElementChild     第一个元素子节点
          - lastChild     第一个子节点（包含文本，注释）
          - lastElementChild     第一个元素子节点
        - 兄弟
          - previousSibling    上一个节点
          - previousElementSibling     上一个元素节点
          - nextSibling     下一个节点
          - nextElementSibling
        
      - 节点相关
        - nodeType
          - 节点类型
          - 常见节点类型
            - 1   元素
            - 3   文本
            - 8   注释
            - 9    document
            - 11   文档碎片  DocumentFragment
        - textContent   文本内容    
        - InnerHTML      innerText
        - outerHTML   包含自身（用内容替换原本标签）   innerText
        - 输入控件  .value  .textContent  获取
        - nodeValue/data    非元素节点的内容   
        - hidden    元素是否隐藏   ==  display:none
        
      - 属性操作（obj）
        - 属性：元素对象的属性（在标签不可见）   obj{}
        - 特征：HTML标签的属性
        - elem.hasAttriubute(name)
        - elem.getAttriubute(name)
        - elem.setAttribute(name,value)
        - elem.removeAttriubute(name)     'class'
        - elem.attriubute
          - 所有特征的集合
          - 只读
        - 自定义特征
        
      - 元素修改
        - 添加
          - 创建元素
          - document.createElment("")
          - doucment.createTextNode('')
          - el.cloneNode(true)  克隆元素 传入擦拿书表示是否复制子级 
          - doucument.createDocumentFragment()
          - 插入元素
          - parentElem.appendChild(node)
          - parentElem.insertBefore(node,nextSbling)  插入元素到父元素某个子节点之前
          - node.append(node or strings)    最后
          - node.prepend(node or strings)   最前
          - node.after(node or strings)
          - node.before(node or strings)
          - elem.insertAdjacentHTML(where,html) 
            - where(beforebegin,afterbegin,beforeend,afterend)
          - elem.insertAdjacentText(where,text)
          - elem.insertAdjacentNode(where,node)
        - 替换
          - parentElem.replaceChild(node,oldChild)
          - node.replaceWith(node or Strings)
        - 删除
          - parentElem.removeChild()
          - node.remove()
        
      - 样式控制   
        - class样式控制	
          - className
          - classList    
            -  .toggle('')切换
            - .add('',''......)   可多个
            - remove('')
            - .replace('old','new')
            - contains('')   判断是否存在class
            - 
        - css 控制  
          - el.style     只能获取内联样式
          - el.style.cssText   以字符串形式设置完整的样式  动态生成样式标签
        - getComputedStyl(element,[pseUdo])   获取样式    可获取伪元素样式
        
      - 元素大小 & 位置
      
        - offsetParent   最近的定位父级, offsetLeft/Top     距离offsetParent 元素的距离
        - offsetWidth/Height    元素的 content padding border(包含滚动条)
        - clientTop/Left       上边框/左边框大小
        - clientWidth/Height     内容+padding（不包含滚动条*）元素实际可利用区域
        - scrollTop/Left  （可更改）
        - scrollWidth/Height    在内容为溢出时，等同于client;如果内容溢出，按实际大小获取
        - 坐标
          - 相对于窗口    clientX/clientY
          - 相对于文档    pageX/pageY
          - getBoundingClientRect()     获取元素坐标信息
      
      - window 大小 & 滚动
      
        - doucument.documentElement   (除去滚动条的可利用宽高)
          - clientWidth
          - clientHeight
        - window.innerWidth/innerHeight
      
      - 获取当前滚动
      
        - window.pageXoffset/pageXoffset
        - window.scrollX/scrollY
      
      - 控制滚动
      
        - scrollTo(x,y)	指定位置   
      
        - ```js
          // 设置滚动行为改为平滑的滚动
          window.scrollTo({
              top: 1000,
              behavior: "smooth"
          });
          ```
      
        - scrollBy (x,y)   一段距离
      
        - scrollintoView()    让元素出现在可视窗口（默认）
      
      - 禁止滚动
      
        - document.body.style.overflow = "hidden"
    - 事件
      - 事件基础
      - 冒泡和捕获
        - 从内 -> 外   DOM0 级事件只有
        - 从外 -> 内    (事件流向 先捕获后冒泡)
        - ![image-20210603173855809](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210603173855809.png)
        - 停止冒泡（停止事件传播）
      - 事件委托
      - 浏览器默认行为
      - 事件分类
  - BOM	浏览器相关

- #### 如何引入 JS

  - 内部使用

  - 外部引入   

    ```html
    <script src=""></script>
    ```

    标签特性（不使用）

    ```html
    <noscript></noscript>   //禁用js提示
    ```

    输入输出 

    - console.log()
    - doucument.write('')
    - alert('')  提示框   确定
    - confirm('')  询问框   确定/取消
    - prompt('')  输入框

  - 变量：值得具名储存（引用）

    - 定义变量  var  ，禁止不使用var定义变量

    - 同时定义多个变量

    - 关键字  &  保留字 

    - 变量（声明）提升（建议把变量声明写在最前面），在预解析过程中，变量提到最前面

    - 命名规范

      - 第一个字符必须以 字母 , _ , $ 

      - 其他为 字母 , _ , $，数字

      - 建议使用他驼峰式命名 

      - ```js
        var getNumber = 123;   //小驼峰，最常用
        var GetNumber = 234;   //大驼峰，构造函数使用
        var GET_NUMBER = 345;  //常量
        ```

      - 见名知意

    - 数据类型（JS是动态数据类型语言）

      - 基本数据类型
        - Number 数字    
          - NaN(not  a  number)
          - Infinity  无限
        - String 字符串   ‘ ’    “ ”   ``

        ```js
        var str1 = "it's"
        ```

        - Boolean 布尔值
        - null  
        - undefined
        - bigint
        - symbol

      - 复合数据类型 (引用数据类型)

        - object 对象      key-value

          - Array

          - Date

          - Math

          - ```js
            var obj{
            	num:1;
                str:'hello word'
            }
            ```

      - typeof 判断数据类型

      - 运算符

        - 操作数（元）

        - 一元运算符：

          - +类型转换成数字
          - -类型转换成数字
          - ！
          - ++ , --      后置加减：先进行输出/运算，在进行加减 ；前置加减：先加减，再输出/运算   

        - 二元运算符：

          - 算术运算符
            - +
            - -
            - *
            - /
            - % 取余，求模
          - 关系运算符：>   <   <=   >=
          - 相等运算符:  ==（不判断数据类型）  ,  != ,  ===严格相等（判断数据类型），!==严格不等
          - 位移运算符:  二进制运算
          - 二元逻辑运算符：&&   ||   ??
            - expr1  &&  exper2      (exper1  true  返回 exper2  ；exper1  false 返回 expr1)
            - 当数值参与逻辑或运算时，结果为true，会返回第一个为真的值；如果结果为false，会返回第二个为假的值；
            - 空值合并操作符，为常量提供默认值，保证常量不为null和undefined，a ?? 1,当a为null和undefined时，值为1；否则值为a
      
        - 三元(条件)运算符
      
          - ```js
            var num = num > 10 ? 123 : 456
            ```
      
        - 运算符优先级
      
      - 类型转换（基本类型）
      
        -   Number
        - String
        - Boolean
        - 显式转换（强制转化）
          - String()
          - num1.toString     null  undefined 无法转换
          - Boolean ()
            - 0    ''     null    undefined   
          - Number()
            - 非数值型字符串   ->NaN     不与任何值==
            - ture  ->1   flase->0    null->0   '  '空格->0    ' '空格->false       undefined —>NaN null==undefined  null不与其他值相等
            - parseInt() 转化成整数，用于字符串，从左到右依次读取字符，直到遇到第一个非数字型字符停止        不管参数是什么，先转字符串，再转数字
            - parseFloat() 转换成小数，用于字符串，从左到右依次读取字符，直到遇到第一个非数字型字符停止（忽略第一个点）
            - isNaN判断是否为非数值（使用Number()转换）
        - 隐式转换（数据类型不同，先转换成数字，再进行比较）
          - 一元加减
          - 判断语句
  
  - JS  执行
  
    - 预解析
    - 代码执行
  
- #### 执行结构

  - 顺序结构

  - 分支结构

    - if

      - 判断

    - switch

      - ```js
        switch(){
        	case 1:
               ....;
               break;
            case 2:
               ...;
               break;
            default:
               }
        ```

        

  - 循环结构

    - for

      - ```js
        for(初始控制量;判断条件;控制量变化规律){}
        ```

    - while

      - ```js
        whlie(){}
        ```

    - do while

      - ```js
        do{}while(){}
        ```

      break   结束单层循环

      continue  跳出单层循环

      标记，标签   结束，跳过多重循环

      ```js
      标记名:
      break 标记名；
      ```

- #### 函数

  - 复用，对代码封装

  - 函数也是一个对象

  - 定义

    - 函数声明function  fnName(形参1，形参2){}               
    - 函数表达式：将（匿名）函数复制给一个变量
      - var fnName = function(形参1，形参2){}

  - 函数调用

    - 普通调用
    - 立即执行函数
    - html 特性
    - dom 事件

  - 函数参数

    - 形参 ：提供给函数内部使用
    - 实参
    - arguments：储存所有传递的实际参数，是一个类数组
    - ![image-20210525161046704](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210525161046704.png)

  - 函数提升  ，在预解析过程中，函数整体提到最前面

  - 函数返回值：默认返回undefined，否则返回return的值    可以返回任意类型

  - ```js
    //自执行函数，执行一次
    void (function(num){ 
          console.log();
          })();
    ```

  - 变量分类

    - 全局变量（全局作用域）
  - 局部变量（函数作用域）
  
- #### 对象

  - 一系列属性和方法的集合（key-value）

  - ```js
    //定义对象
    //使用 new 操作符和 Object 构造函数
    var person = new Object(); 
    person.name = "Nicholas"; 
    person.age = 29;
    //对象字面量
    var a = {
        name: 'tom',
        say: function(){},
        'say hello':function(){}
    }
    
    //获取对象内容
    a.[say hello]();
    a.[变量]
    ```

  - 对象的属性方法是无序的

  - 对象的属性名不能重复（覆盖）

  - ![image-20210526112544223](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210526112544223.png)

  - 构造器（构造函数）：用于创造对象

    - Number

    - Boolean

    - String

    - Object

    - Function

      - ```js
        var f = new Function()
        ```

    - Array

      - ```js
        var obj = new Array()
        ```

    - RegExp    /a/     正则表达式

  - 直接量：生成变量的一种简写形式

    - ```js
      var obj = {}
      ```

  - 包装类

    - Number
    - Boolean
    - String

- #### 数组  Array

  - 一系列数据的集合

  - 定义数组：

    - 直接量

    - ```js
      var colors = ["red", "blue", "green"]; // 创建一个包含 3 个元素的数组
      var names = []; // 创建一个空数组
      var values = [1,2,]; // 创建一个包含 2 个元素的数组
      ```

    - 构造函数

    - ```js
      var colors = new Array();
      var colors = new Array(20);      // 创建一个大小为20的空数组
      var colors = new Array("red", "blue", "green");
      colors.lenght = 0;    //清空数组
      ```
      
      Array.of() 

  - 数组方法

    - 类型相关
  
      - ```js
        Array.isArray(arr)      //   静态方法
        Array.from()         //将类数组转换为数组（便于利用数组的方法）
        Array.of()          // new Arrray() 优化
        数组名.toString()    //1,2,3      
        ```

    -  增删改查（改变原数组）
  
      - ```js
        push()       //添加数据到数据尾部    push(1,2,3)   
        unshift()       //添加数据到数据头部  unshift(1,2,3)
        pop()        //删除一个尾部数据  返回删除值
        shift()      //删除一个头部数据  返回删除值
        splice(index,count,...data)   // 以index开始删除 count个数据，添加后面的数据   index必填   -2倒数第二个   返回被删除的值
        ```
  
    - 其他
    
      - ```js
        slice(starIndex,endIndex)   //数组截取    [startIndex,endIndex)
        slice()   //复制原数组   浅拷贝
        
        fill(value,starIndex,endIndex)       //填充数组，影响原数组
        
        concat()   //数组拼接，返回新数组
        
        join(symbol)    //将数组转化为字符串，symbol为拼接的符号；
        str.split(symbol)   //逆方法,symbol为切割的符号   字符串转化为数组
        ```
    
      - 浅拷贝（只复制对象地址），深拷贝
    
    - 数组排序
    
      - ```js
         //改变原数组
        reverse() 
        sort()
        arr1.sort(function(a,b)){
                  return a - b;           //升序排列    b-a降序
                  }
        ```
    
    - 查找判断
    
      - ```js
        indexOf(目标元素)         //查找目标元素，返回索引值
        indexOf(目标元素,查找起始位置)
        lastIndexOf()           //从数组末尾查找
        includes()       //判断数组是否存在  (es6)
        find(func)   //可判断对象属性
        findIndex(func)   
        some(func)
        every(func)
        ```
    
    - 遍历
    
      - ```js
        for(var i = 0 ; i<arr.lenght ; i++){}
        for(var key in obj){
            console.log(key,obj[key])
        }                                 //主要用于遍历对象，跳过空值 (es6)
        for(var i in arr){
            console.log(i)
        }                   //遍历数组，拿到索引
        for(var val of arr){}    //遍历数组，拿到值
        forEach(function(val,index,array))
        map(function(val,index,array))    //数组映射   以一个数组为原型生成另一个数组
        filter(function(){})   //数据筛选
        reduce(function(prev,current,index){
           console.log(prev,current);
            return prev + current
        },0)   //数据聚合
        ```
    
      - ![image-20210526175155628](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210526175155628.png)
    
      - ![image-20210526172918297](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210526172918297.png)
  
- #### String,Date,Math

  - ##### String：字符数组（``可换行）

    - charAt(index)   取出(访问，不影响)相应索引位置字符   ——>str[index]    从一个字符串中返回指定的字符
    - charCodeAt(index)       字符  转换成UTF-16     unicode编码    *
    - fromCharCode(unicode码)   unicode码 转换成 字符   *
    - concat    拼接字符串，返回新字符串
    - includes()                        *
    - endWith()，startWith()            以....开始   *
    - indexOf()，lastIndexOf()                           *
    - padEnd()，padStart(count，data)   字符补全   *

    - match()   匹配、捕获（配合正则表达式使用）
    - replace()    替换
    - search()    返回下标
    - split(),                  *
    - slice(startIndex,endIndex),substr(startIndex,endIndex),substring(startIndex,count)     字符串截取
    - toLowerCase(),toUpperCase   大小写转换              *
    - trim(),trimStart(),trimEnd()     清除空格              *

  - ##### Date：时间

    - ```js
      //创建一个时间对象
      var date  = new Date(2021,05,27);
      var date  = new Date(2021-05-27);
      var date  = new Date(2021/05/27);
      console.log(Date.now())
      console.log(new Date(Date.parse('2021,5,27')))
      console.log(new Date(Date.UTC(2021,05,27)))
      
      //获取时间戳
      Date.now()   获取当前时间的时间戳
      new Date().getTime()  获取当前时间对象的时间戳
      Date.parse(str)   将一个时间字符转化为时间戳
      Date.UTC(year,month,day)    传入时间参数，生成时间戳
      
      //获取时间信息
      var data = new Date();
      console.log(date.getFullYear())
      console.log(date.getMonth()+1)
      console.log(date.getDate())   //号数
      console.log(date.getDay())    //星期几
      console.log(date.getHours())
      console.log(date.getMinutes())
      console.log(date.getSeconds())
      console.log(date.getMillseconds())  //毫秒
      
      //设置时间
      date.setHours(13)
      date.setDate(0)
      ```
  
  - ##### Math
  
  - ```js
    Math.PI
    Math.abs()
    Math.ceil()
    Math.floor()
    Math.max()
    Math.min()
    Math.pow(x,y)
    Math.random()
    Math.rand()
    Math.sign()
    Math.trunc()
    ```
  
    
  
- #### 正则表达式（RegExp）

  - 正则表达式是用于匹配字符串中字符组合的模式

  - RegExp

    - exec  执行
    - test  测试

  - String

    - match
    - matchAll
    - replace
    - search
    - aplit

  - 创建一个正则表达式

    - 构造函数

    - ```js
      var re = new RegExp("ab+c");
      ```

    - 字面量

    - ```js
      var re = /ab+c/;
      ```

  - 特殊字符

    - ^  开始 （非）
    - $  结束

  - 字符组

    - []      [^]除...
    - [abc]   匹配a,b,c三者之一
    - [0-9]  匹配0-9之间任意数  [a-zA-Z_$]
    - .  （小数点）默认匹配除换行符之外的任何单个字符
    - \d    匹配一个数字`。``等价于[0-9]`。
    - \D    匹配一个非数字字符`。``等价于[^0-9]`。
    - \w   匹配一个单字字符（字母、数字或者下划线）。等价于 `[A-Za-z0-9_]`。
    - \W   匹配一个非单字字符。等价于 `[^A-Za-z0-9_]`。
    - \b   匹配一个词的边界
    - \B    匹配一个非单词边界

  - 量词

    - abc{1,3}  匹配ab  c重复1~3次
    - c{2}   匹配2个c
    - c{2,}   至少2个c
    - `*`     匹配前一个表达式 0 次或多次。等价于 `{0,}`。
    - `+`       匹配前面一个表达式 1 次或者多次。等价于 `{1,}`。
    - ?   匹配前面一个表达式 0 次或者 1 次。等价于 `{0,1}`。   ||  触发非贪婪模式
      - 贪婪模式   &   非贪婪模式
      - 贪婪：尽可能多地匹配字符

  - 捕获组（）

    - 将括号内获取到的内容进行捕获，便于后面利用
    - /(\d)\1/  重复的两个数字

  - 断言

    -  x(?=y)   x后必须跟y      先行断言
    - (?<=y)x    x前面必须是y   后行断言
    - x(?!y)     x后必须不是y    正向否定断言
    - (?<!y)x

#### DOM

- 	

### 一. JS基础

#### 1. js简介

+ ##### JS是运行在客户端的一种解释型编程语言，它是一种弱类型的语言。

+ ##### JS的作用：

  + 用来完成前后端交互、增加用户体验的一些逻辑实现。

+ ##### 一个网页是三部分组成：结构（HTML/HTML5）、表现（CSS/CSS3）和形为（JavaScript）。

+ ##### 前端开发的核心是：JavaScript。

+ ##### JavaScript的组成：

  + ECMAScript（标准：ECMA-262）：基础语言部分（基础、面向对象等）
  + DOM（标准：W3C）：节点操作
  + BOM（无标准）：浏览器操作

+ ##### JS的特点

  + 松散性
    + JS的中变量没有一个明确的类型，也叫弱类型的语言（允许将一块内存看作多种类型）。
  + 对象属性
    + 对象的属性也可以映射为任意的数据。
  + 继承机制
    + JS是基于原型继承的。

#### 2. js的使用

+ ##### 使用script标签（只能被当前HTML文件使用）

  + ```js
    <script type="text/javascript" defer="defer" charset="utf-8">
        alert('这是我的第一个JS程序');// alert表示弹出一个警告框
    </script>
    ```

  + defer:表示所有DOM元素加载完成后，再执行JS代码（现在开发一般不需要）

  + charset：字符编码（主要解决汉字乱码问题）（现在开发一般不需要）

  + 注意：

    + script标签可以写在网页代码中的任意的地方，因为JS是同步执行的，但为了避免JS阻塞和影响操作DOM，最好写在body后。
    + 如果要输出script结束标签时，必须拆开写： alert('</sc'+'ript>');

+ ##### 在a标签的href中写JS代码（实际开发中不建议这种使用，因为会影响到性能）

  + ```html
    <a href="javascript:alert('大家好！')">大家好</a>
    <a href="javascript:var a=10,b=20;alert('结果为：'+(a+b))">计算结果</a>
    <a href="javascript:close();">&times;</a>
    <a href="javascript:void(1);">test</a>
    ```

+ ##### 用script标签引入外部JS文件（可以被多个HTML文件使用）

  + ```javascript
    <script src="01_test.js" type="text/javascript" async="async"></script>
    ```

  + 说明：

    + src:引入的外部JS文件的路径和文件名（只能用于引入JS文件）
    + async:异步加载JS代码（在加载DOM元素的同时可以运行JS代码）

#### 3. 标识符

+ ##### 所谓标识符，就是指变量、函数、属性的名字，或者函数的参数。

+ ##### 标识符定义规则：

  + 第一字符必须是一个字母、下划线（_）或一个美元符号（$）。
  + 其他字符可以是字母、下划线、美元符号或数字。
  + 不能把关键字、保留字、true、false和null作为标识符。
  + 关键字：
    + break、else、new、var、case、finally 、return 、void、catch、for、switch、while、continue、function、this、with、default、if、throw、delete、in、try、do、instanceof、typeof等
  + 保留字：
    + abstract、enum、int、short、boolean、export、interface、static、byte、extends、long、super、char、final、native、synchronized、class、float、package、throws、const、goto、private、transient、debugger、implements、protected、volatile、double、import、public等
  + 注意：
    + 在JS中任意地方是严格区别字母大小写的！！！

#### 4. 注释

+ ##### 单行注释

  + // 注释内容     一般用于对当前行的代码时进行说明（一般写在代码后面）  （在WebStorm中的快捷键是Ctrl+/）

+ ##### 多行注释 （在WebStorm中的快捷键是Ctrl+Shift+/）

  + ```js
    /*
        注释内容
        注释内容
        ……
    */ 也叫作块注释。一般对下面的代码进行整体说明，且说明内容可能较多。
    ```

  + 说明：

    + 注释语句在浏览器中不会被解析执行，仅起说明作用；
    + 在项目中，要习惯去写注释，主要便于后期的项目维护。

#### 5. 常量和变量

+ ##### 常量也叫直接量或字面量，在程序中直接给出具体的数据。

+ ##### 常量是不可以改变的。

  + 如：100，true，'abc',null,undefined等

+ ##### 变量就是在内存中开辟一段空间用于存放某个数据。

+ ##### 变量必须要有变量名，变量名必须遵循标识符的命名规范。

+ ##### 定义：

  + ```js
    1）只定义变量
    	var x;
    	var a, b, c;
    2）定义变量且赋值
    	var x1 = true;
    	var y1 = 100, y2 = null;
    ```

  + 说明：

    + 定义变量时不需要给出数据的类型（松散式语言特点）。
    + 变量可以重复定义，后面会覆盖前面变量。
    + 不用var定义变量也可以，默认是为window对象添加了属性。
    + name = '张三'; // 相当于 window.name = '张三';
    + 定义的变量如果没有赋值，系统将自动赋默认值为'undefined'。
    + 一条语句可以以分号结束，也可以不加分号；如果是多条语句写在同一行上，必须用分号隔开。
    + 在书写代码时，除了字符串中可以使用中文标点之外，其它任何地方只能用英文标点符号。

#### 6. 数据类型

+ ##### 数据类型指的是在内存存储的方式。

+ ##### 基本数据类型

  + number：数值型
    + 用来表示一个数字，通常可用作进行加减乘除等运算。
    + 分为整型和浮点型（小数位可以浮动）。
    + 100（10进制）
    + 0123（8进制）
    + 0xae12（16进制）
    + isNaN()：用来判断是不是不是一个数。
  + string：字符型
    + 用引号（单双引号都可以，它们没区别）引起来的一串字符（可以是数字、字母、标点符号、汉字等）,通常用作描述。
    + 'abc'
    + "abc"
    + "a\\'bc"
  + boolean：布尔（逻辑）型
    + 表示真（true）或假（false）。
  + null：空
    + 表示一个空对象的地址指定指向的为空。
  + undefined：未定义
    + 表示定义了一个变量，但如果没有给这个变量赋值，系统将自动赋值为undefined。

+ ##### 引用数据类型

  + object:对象型

    + 用来申明或存储一个对象（对象，函数、正则、字符、数值等）

    + ```js
      var a = new Number(10);
          var obj = {
          sno: '007',
          sname: '张三'
      }
      ```

#### 7. 运算符

+ ##### 算术运算符

  + \+	\-	\*	/	%(求余/模) 	++(自增) 	--(自减)

+ ##### 字符串运算符

  + \+：用于实现字符串连接。

+ ##### 关系运算符

  + \>	<	>=	<=	==	===		！=		！==
  + 返回的结果只能是true或false。
  + 比较方法：
    + 数值比较，是比较其大小；
    + 字符比较，是比较ASCII码值的大小；
      + 0->48,A->65,a->97,回车->13,ESC->27
    + 汉字比较，是比较其Unicode编码值的大小
      + 可以通过charCodeAt()获取编码值。
    + ==和!=只比较值，不比较类型；===和！==既比较值又比较类型
    + 比较：部分符号<数字<大写字母<小写字母<汉字

+ ##### 逻辑运算符

  + 逻辑运算符有:！、&&和||三种。返回的值一般是逻辑值true或false，也可能返回其它值。
  + ！：逻辑非（取反）(单目/一元运算)
    + ！true -> false 	   ！false -> true
  + &&：逻辑与(双目/二元运算)
    + 只要有一个操作数为false，结果为false。
    + 注意：
      + 如果两个中任意一个操作数非逻辑值，第一个操作数的结果为true时，返回第二个操作数的值；
      + 第一个操作数的结果为false时，返回第一个操作数的值。
  + ||：逻辑或(双目/二元运算)
    + 只要有一个操作数为true，结果为true。
    + 注意：
      + 如果两个中任意一个操作数非逻辑值，第一个操作数的结果为true时，返回第一个操作数的值；
      + 第一个操作数的结果为false时，返回第二个操作数的值。
  + 短路运算：
    + &&运算时，如果第一个操作数为false，不需要计算第二个操作数，结果返回false。
    + ||运算时，如果第一个操作数为true，不需要计算第二个操作数，结果返回true。

+ ##### 位运算符

+ ##### 三目运算符（条件运算符）

  + 语法：
    + 表达式1 ? 表达式2 ：表达式3
    + 如果表达式1成立，返回表达式2的结果；如果不成立，返回表达式3的结果。
  + Tips:
    + 三目运算相当于if语句中的双分支结构。
    + 如果表达式2或表达式3较为复杂，建议用if语句或switch语句实现。

+ ##### 运算符优先级：

  + ```
    运算符	                              描述
    . [] ()	                            字段访问、数组下标、函数调用以及表达式分组
    ++ -- - ~ ! delete new typeof void	一元运算符、返回数据类型、对象创建、未定义值
    * / %	                            乘法、除法、取模
    + - +	                            加法、减法、字符串连接
    << >> >>>	                        移位
    < <= > >= instanceof	            小于、小于等于、大于、大于等于、instanceof
    == != === !==	                    等于、不等于、严格相等、非严格相等
    &	                                按位与
    ^	                                按位异或
    |	                                按位或
    &&	                                逻辑与
    ||	                                逻辑或
    ?:	                                条件（三目运算）
    = += -= *= /= %=	                赋值、运算赋值
    ,	                                多重求值
    ```

#### 8. 流程控制

+ ##### JS是一门既面向过程，也是面向对象的解释型语言。

+ ##### 面向过程：按照代码书写的顺序依次执行（OOP）。

+ ##### JS也是一门结构性语言。

+ ##### JS的结构分为顺序结构、分支（条件/选择）结构和循环结构三种。

  + 顺序结构：按照代码的书写顺序依次执行，一般包含初始化、赋值、输入/输出等语句。

  + 条件结构：用if或switch语句实现，其中的代码是有条件选择执行的。

  + 循环结构：某部分代码在指定的条件范围内反复执行，用for/for...in/forEach/while/do...while语句实现。

  + 条件结构

    + ```js
      a.单分支
      	语法：
      	if(条件)语句;
      	或：
      	if(条件){
      		语句组;
      	}
      	如果条件成立，将执行语句或语句组；条件不成立，执行if的下一条语句。
      ```

    + ```js
      b.双分支
      	语法：
      	if(条件)语句1;else 语句2;
      	或：
      	if(条件){
      		语句组1;
      	}else{
      		语句组2;
      	}
      	如果条件成立，将执行语句1或语句组1；条件不成立，将执行语句2或语句组2。
      
      	注意：else表示“否则”的意思，其后不能写条件。
      ```

    + ```js
      c.多分支（三分支及以上的）
      	多分支实际上是单分支和双分支的嵌套。
      	语法：
      	if(条件1){
      		if(条件2){
      			if(条件3){
      				语句或语句组;
                  }
      		}
      	}
      
      	或：
      	if(条件1){
      		语句1或语句组1;
      	}else{
      		if(条件2){
      			语句2或语句组2;
      		}else{
      			语句3或语句组3;
      		}
      	}
      
      	或：
      	if(条件1){
      		if(条件2){
      			语句1或语句组1;
      		}
      	}else{
      		if(条件3){
      			语句1或语句组2;
      		}else{
      			语句1或语句组3;
      		}
      	}
      	或（简洁写法，推荐）：
      	if(条件1){
      		语句1或语句组1;
      	}else if(条件2){
      		语句2或语句组2;
      	}else if(条件3){
      		语句3或语句组3;
      	}
      	....
      	else{
      		语句n或语句组n;
      	}
          如果条件1成立，将执行语句1或语句组1，后面的代码将不会被执行；
          如果条件1不成立，将判断条件2，条件2成立，执行语句2或语句组2……
          如果前面的条件都不满足时，将执行else后面的代码。
      
      ```

    + ```javascript
      d.情况语句switch
      	语法：
      	switch(表达式){
      		case 表达式1: 语句1或语句组1;[break;]
      		case 表达式2: 语句2或语句组2;[break;]
      		case 表达式3: 语句3或语句组3;[break;]
      		...
              case 表达式n: 语句n或语句组n;[break;]
      		default:语句n+1或语句组n+1;
      	}
      
          说明：执行表达式，如果表达式的结果为case后面的某个对应的值，将执行后面所对应的语句或语句组，如果语句后有break，将终止该情况语句，
          如果没有break，将不再判断条件，继续执行后面的语句，直到遇到break为止；如果条件都不满足，将自动执行default后的语句。
      
      ```

    + switch与if的区别：

      + switch一般用于能获取结果的简单条件的判断，而if一般用于较为复杂的条件判断；
      + if能实现的条件判断,switch不一定能实现，switch能实现的条件判断，if也一定能；
      + 如果switch和if都能用的情况下，switch一般较简洁些。

  + 循环结构

    + ```js
      a.计数循环(for)
      	语法：
      	for([变量初始值];[条件];[步长]){
      		[循环体;]
      		[continue;]
      		[break;]
      	}
      
          说明：
          先执行变量初始值，再判断条件，如果条件成立，再循环体，再计算步长，最后再判断条件，条件成立，继续执行循环体……，直到条件不成立，跳出循环为止。
      
          该循环的次数是可以计算出来：
          循环次数=[（终值 - 初值） / 步长] + 1
      ```

    + ```js
      b.当型循环(while)
      	语法：
      	while（条件）{
      		[循环体;]
      		[continue;]
      		[break;]
      	}
      	说明：
      		当条件成立时，执行循环体，反之则跳出循环。
      ```

    + ```js
       c.直到型循环(do...while)
                      语法：
                         do{
                              [循环体;]
                              [continue;]
                              [break;]
                          } while（条件）
                      说明：
                          先执行循环体，再判断条件，如果条件成立，继续循环，反之则跳出循环。
         
                          直到型循环与当型循环的区别：
                              当条件1次都不成立时，直到型循环至少会执行一次循环，而当型循环一次也不执行。
       ```

    + ```js
      d.数组和对象遍历（后面再讲）
        	for...in
        	forEach()
      ```

  + 小结：

    + for只能用于循环次数已知的情况；而while和do...while可以用在循环次数已知或未知的情况，
    + 一般循环次数已知用for较多；for...in用于遍历数组和对象；forEach()用于遍历数组，for循环也可以遍历数组，但性能较差。

  + break和continue语句

    + break语句可以用在switch语句和循环语句中（forEach循环除外），表示跳出（结束）情况语句或循环。
    + continue语句只能用在循环语句（forEach循环除外）中，表示结束本次，继续下一次循环。

  + 注意：

    + break和continue语句必须单独存在，后面不能添加其它代码。
    + break和continue语句一般放在if语句中。

#### 9. 函数

+ ##### 函数就是将具有一定功能的一段JS代码的封装，可以在程序的多个地方被反复调用。

+ ##### 定义函数

  + ```js
    格式一：
    	function 函数名（[形参列表]）{
    		函数体；
    		[return [<表达式>];]
    	}
    格式二：
    	var 变量名 = function（[形参列表]）{
    		函数体；
    		[return [<表达式>];]
    	}
    格式三：
    	;(function（[形参列表]）{
    		函数体；
    		[return [<表达式>];]
    	})([实参列表]);
    上面的函数叫立即执行函数表达式（IIFE），它会自动调用自身，不被在其它地方被调用，一般用于JS库或JS插件的封装或闭包处理。
    ```

+ ##### 函数调用

  + 函数名([实参列表]);
  + 函数不会自动执行（IIFE（立即执行函数表达式）除外），必须通过调用才能执行。

+ ##### return

  + 函数可以通过return返回结果，如果return没有返回结果，表示结束函数的调用，且返回调用处。

+ ##### arguments对象

  + 返回实参列表的一个伪数组。
  + 一般用在不确定传过来的实参的个数的情况下。

#### 10. 对象

+ ##### 对象，其实就是一种类型，即引用类型。用于将数据和功能组织在一起。

+ ##### 对象由属性和方法组成，通常用键值对定义。

+ ##### 对象定义

  + ```js
    a)new构建
    	new Object([参数]);
    b)字面量定义
    	var obj = {
    		key: value,// 属性
    		fn: function(){ // 方法
    		...
    		}
    	}
    ```

+ ##### 对象的引用

  + 对象名.属性名
  + 对象名.方法名([实参列表])
  + 对象名[属性名]

#### 11. 数组（Array）

+ ##### 数组将一组数据组合到一起，并存入到一个变量中，数组是有序排列的，占用一段连续的内存空间。

+ ##### 一个数组可以存储不同类型的数据。

+ ##### 定义数组

  + ```
    a.new
    	new Array([值列表])
    b.字面量创建
    	var arr = [值列表]
    ```

+ ##### 获取数组元素值

  + 数组名[下标] // 下标可以是一个数值型常量，也可以是一个表达式或函数或变量

+ ##### 遍历数组

  + 一维数组用一个循环实现；二维数组必须用双重循环实现（先行后列）。
  + for
  + for...in      // 推荐写法
  + forEach()

+ ##### 数组的属性和方法

  + length属性
    + 获取数组的长度。
  + push()
    + 向数组中添加数组到数组最后。
  + pop()
    + 删除数组最后一个元素。
  + unshift()
    + 向数组头部添加数据。
  + shift()
    + 删除数组第一元素。
  + concat()
    + 将两个或多个数组组合成一个数组。
  + reverse()
    + 对数组进行倒序处理。
  + join()
    + 将数组转换为字符串。
  + splice()
    + 删除、修改或向数组中添加数据。

#### 12. Function类型

+ ##### Function是一个用来构建函数的类（构造函数）。

+ ##### 函数内部属性

  + 在函数内部，有两个特殊的对象：arguments和this。
    + arguments是一个类数组对象，包含着传入函数中的所有参数，主要用途是保存函数参数。
    + 但这个对象还有一个名叫callee的属性，该属性是一个指针，指向拥有这个arguments对象的函数。
    + 也即是说可以通过arguments.callee调用函数自身，一般用于函数的递归调用。
    + 函数自己调用自己叫函数的递归调用。
    + this指针对象
      + 在全局中this指向的是window（在JS中没有global这个全局对象，而JS的全局对象是window）；
      + 在函数中this指向的是这个函数执行所操作的当前对象。

### 二. 面向对象 

#### 特性

![img](file:///D:\QQFile\2570104417\Image\C2C\IU7A9Y2_0E`9~IB_RC_29S7.png)

![image-20210623091835441](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210623091835441.png)

![img](file:///D:\QQFile\2570104417\Image\C2C\0SR[DI%R4%%3]N[C2RTIDWX.png)

![image-20210622112532795](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210622112532795.png)

- 属性包含数据描述属性和getter, setter-
  - Object.getOwnPropertyDescriptor()	
    - .configurable: true   属性是否可以被配置
    - .enumerable: true   属性是否可以被枚举(遍历)
    - .value: 1   属性值
    - .writable: true  属性是否可以被修改
    - writable: true属性是否可以被修改
  - Object.defineProperty ()
  - Object.defineProperties ()
  - Object.getOwnPropertyNames()
  - defineProperty:数据双向绑定

- - 原始模式（字面量）

  - 工厂模式

    - 没有类型
  - 共同的方法单独设置（浪费资源）
  
  - 构造函数

    - 共同的方法单独设置（浪费资源）

  - 原型模式

    - 只能设置公用属性方法

  - 组合模式（构造函数 + 原型模式）

  - **`new`** 关键字会进行如下的操作：

    1. 创建一个空的简单JavaScript对象（即`**{}**`）；

    2. 链接该对象（设置该对象的**constructor**）到另一个对象 ；

    3. 将步骤1新创建的对象作为`**this**`的上下文 ；

    4. 如果该函数没有返回对象，则返回`**this**`。

       使用构造函数时必须配合new运算符（不写会污染全局环境）

       ```js
        //new操作符验证
       function checkNewUsed(fn,target){
           if(!target){
       		throw new Error(`${fn.name}函数必须使用new运算符调用`)
           }
       }
       
       Function.prototype.checkNewUsed = function(target){
       	if(!target){
       		throw new Error(`${this.time}函数必须使用new运算符调用s`)
           }
       }
       ```
  
       

       

- 继承

- 多态

#### 继承

- 原型链继承

  - 原型对象：存在于构造函数上，所有通过构造函数创建的对象都可以访问原型对象

  - 缺点：会将父类上的属性在子类的原型后创建一遍

  - ```js
    Dog.prototype = new Animal();
    Dog.constructor = Dog;
    ```

  - 原型对象的访问

    - 实例   ->  原型   Object.getPrototypeof() , _proto
    - 实例      构造函数   constructor
    - 构造函数     原型  prototype
    - 原型      构造函数    constructor
    - 原型     无法访问实例
    - 构造函数          无法访问实例

- 借用构造函数继承

  - 改变this指向
    - call      call(this,type,age,name)    参数列表
    - apply           apply(this,[type,age,name])   数组
    - bind       bind(thisArg, arg1, arg2, /* …, */ argN) 返回被更改 this 指向后的函数
  - 缺点：只能继承构造函数的内容

- 组合继承（原型链继承+借用构造函数继承）

  - 缺点：

- 原型继承

  - ```js
    Dog.prototype = Object.create(Animal.prototype)
    Dog.prototype.constructor;
    ```

  - ```js
    Dog.prototype = obj(Animal.prototype)
    Dog.prototype.constructor;
    function F(){
        function  F(){
            F.prototype = prototype;
            return new F();
        }
    }
    ```

- 寄生继承(原型 + 构造)

- 寄生组合继承

  - 类class  寄生组合继承语法糖

  - ```js
    class Animal{
    	constructor(type,age,name){
    		this.age = age;
        }
        getName(){
    		console.log(this.name)
        }
    }
    
    var anil = new Animal('a','b','c');
    
    class Dog extends Animal{
    	constructor(type,age,name){
    		super(type,age,name)
        }
    }
    var dogs  = new Dog(1,2,3)
    ```
    
    在JavaScript中，实现继承的方式有以下几种：
    
    1. 原型链继承：通过将父类的实例作为子类的原型来实现继承。
    ```javascript
    function Parent() {
      this.name = 'parent';
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, ' + this.name);
    }
    
    function Child() {
      this.age = 18;
    }
    
    Child.prototype = new Parent();
    
    var child = new Child();
    child.sayHello(); // 输出：Hello, parent
    ```
    
    2. 构造函数继承（借用构造函数）：通过在子类的构造函数中调用父类的构造函数来实现继承。
    ```javascript
    function Parent() {
      this.name = 'parent';
    }
    
    function Child() {
      Parent.call(this);
      this.age = 18;
    }
    
    var child = new Child();
    console.log(child.name); // 输出：parent
    ```
    
    3. 组合继承：结合原型链继承和构造函数继承的方式，既继承了父类的原型方法，又继承了父类的属性。
    ```javascript
    function Parent() {
      this.name = 'parent';
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, ' + this.name);
    }
    
    function Child() {
      Parent.call(this);
      this.age = 18;
    }
    
    Child.prototype = new Parent();
    Child.prototype.constructor = Child;
    
    var child = new Child();
    child.sayHello(); // 输出：Hello, parent
    console.log(child.name); // 输出：parent
    ```
    
    4. 原型式继承：通过借助一个中间对象来实现继承，类似于浅拷贝。
    ```javascript
    function createObject(obj) {
      function F() {}
      F.prototype = obj;
      return new F();
    }
    
    var parent = {
      name: 'parent',
      sayHello: function() {
        console.log('Hello, ' + this.name);
      }
    };
    
    var child = createObject(parent);
    child.sayHello(); // 输出：Hello, parent
    ```
    
    5. 寄生式继承：在原型式继承的基础上，增强对象，返回一个新对象。
    ```javascript
    function createObject(obj) {
      var clone = Object.create(obj);
      clone.sayHello = function() {
        console.log('Hello, ' + this.name);
      };
      return clone;
    }
    
    var parent = {
      name: 'parent'
    };
    
    var child = createObject(parent);
    child.sayHello(); // 输出：Hello, parent
    ```
    
    6. 寄生组合式继承：通过借用构造函数继承属性，通过原型链继承方法，避免了调用两次父类构造函数。
    ```javascript
    function inheritPrototype(child, parent) {
      var prototype = Object.create(parent.prototype);
      prototype.constructor = child;
      child.prototype = prototype;
    }
    
    function Parent() {
      this.name = 'parent';
    }
    
    Parent.prototype.sayHello = function() {
      console.log('Hello, ' + this.name);
    }
    
    function Child() {
      Parent.call(this);
      this.age = 18;
    }
    
    inheritPrototype(Child, Parent);
    
    var child = new Child();
    child.sayHello(); // 输出：Hello, parent
    console.log(child.name); // 输出：parent
    ```
    
    这几种继承方式在实现继承的过程中有一些区别：
    
    1. 原型链继承：子类通过将父类的实例作为自己的原型来实现继承。子类可以访问父类的属性和方法，但是所有子类的实例共享同一个父类的实例，因此对父类实例的修改会影响到所有子类的实例。
    
    2. 构造函数继承（借用构造函数）：子类通过在自己的构造函数中调用父类的构造函数来实现继承。子类可以拥有自己的属性，但是无法继承父类的原型方法。
    
    3. 组合继承：结合了原型链继承和构造函数继承的方式，既继承了父类的原型方法，又继承了父类的属性。但是在创建子类实例时，会调用两次父类的构造函数，一次是在子类构造函数中调用，一次是通过原型链继承父类的实例。
    
    4. 原型式继承：通过借助一个中间对象来实现继承，类似于浅拷贝。子类和父类之间共享同一个原型对象，因此对原型对象的修改会影响到所有子类的实例。
    
    5. 寄生式继承：在原型式继承的基础上，增强对象，返回一个新对象。通过在新对象上添加新的方法或属性，实现对父类的扩展。子类和父类之间共享同一个原型对象，因此对原型对象的修改会影响到所有子类的实例。
    
    6. 寄生组合式继承：通过借用构造函数继承属性，通过原型链继承方法，避免了调用两次父类构造函数。这种方式是最常用的继承方式，既继承了父类的属性，又继承了父类的原型方法，并且避免了原型链继承时调用两次父类构造函数的缺点。
    
       具体来说，`new`操作符的过程如下：
    
       1. 创建一个空对象，即`{}`。
       2. 将新对象的原型指向构造函数的`prototype`属性，通过`Object.setPrototypeOf()`或者`__proto__`来实现。
       3. 将构造函数的`this`指向新对象。
       4. 执行构造函数的代码，给新对象添加属性和方法。
       5. 如果构造函数有返回值且返回值是一个对象，则返回该对象；否则，返回新创建的对象。

- 函数执行

  - 执行上下文
    - 词法环境
    - 变量环境
    - this
  - 执行栈    先进后出
  - ![image-20210621164303324](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210621164303324.png)
  - 作用域 & 作用域链
    - 全局作用域
    - 函数作用域
    - 块级作用域   代码块{}     var没有，let有     ES6
  - 闭包     移出执行栈，不被回收
    - 函数嵌套：外部函数嵌套内部函数，内部函数引用外部函数变量
    - 优点 & 缺点： 局部变量持久化       内存泄漏IE
  - ![image-20210621165524772](C:\Users\LX\AppData\Roaming\Typora\typora-user-images\image-20210621165524772.png)
  - this
    - 谁调用指向谁，没吊用，指向window
      - new
      - 箭头函数
      - bind apply call

#### 1. 内置对象

+ ##### global对象

  + 在JS中没有global对象，Web浏览器将Global作为window对象的一部分加以实现。

+ ##### 方法：

  + encodeURIComponent():对unicode进行编码处理
  + decodeURIComponent():对unicode编码进行解码处理
  + eval(''):具有字符串解析器的作用（慎用！因为它的性能较差，且比较危险）

+ ##### Math对象

  + 该对象主要提供了大量的数学运算的属性和方法。
  + 属性：
    + Math.E
    + Math.PI
  + Math.min()：取最小值函数
  + Math.max()：取最大值函数
  + Math.round()：四舍五入函数
  + Math.ceil()：向上取整（取大于或等于操作数的最小整数）
  + Math.floor()：下下取整（取小于或等于操作数的最大整数）
  + Math.random()：产生[0,1)之间的一个任意小数
  + Math.abs(num)： 返回num的绝对值
  + Math.exp(num)： 返回Math.E的num次幂
  + Math.log(num)： 返回num的自然对数
  + Math.pow(num,power)： 返回num的power次幂
  + Math.sqrt(num)：返回num的平方根
  + Math.acos(x)： 返回x的反余弦值
  + Math.asin(x)： 返回x的反正弦值
  + Math.atan(x)： 返回x的反正切值
  + Math.atan2(y,x)： 返回y/x的反正切值
  + Math.cos(x)： 返回x的余弦值
  + Math.sin(x)： 返回x的正弦值
  + Math.tan(x)： 返回x的正切值

#### 2. 面向对象

+ ##### 常规创建对象

  + new
  + 字面量

+ ##### 工厂模式创建对象

  + 通过封装函数实现创建一批相似的对象。
  + 缺陷：无法知道创建的对象是哪一个对象的实例。

+ ##### 构造函数创建对象

  + 构造函数是用来构建一个类（ES5中没类的概念，实际上这里的构造函数就是类）。

  + 类是对象的一个抽象符号化表示（把相同或相似的一部分对象抽离出来就形成了一个类）。

  + 对象是类的实例化（具体化）（赋予一定的属性和功能）

  + ```js
    创建构造函数（类）
    	语法：
    	function 类名([形参列表]){
    		this.属性名 = 参数；
    		……
    		this.方法名 = function(){
    		函数体；
    		}
    		……
    	}
    通过构造函数实例化对象
    	new 类名([实参列表]);
    ```

  + 使用了构造函数的方法，和使用工厂模式的方法他们不同之处如下：

    + 构造函数方法没有显式的创建对象(new Object())；
    + 直接将属性和方法赋值给this对象；
    + 没有return语句。

  + 构造函数的方法有一些规范：

    + 函数名和实例化构造名相同且大写，(PS：非强制，但这么写有助于区分构造函数和普通函数)；
    + 通过构造函数创建对象，必须使用new运算符。

  + 构造函数执行的过程：

    + 当使用了构造函数，并且new 构造函数()，那么就后台执行了new Object()；
    + 将构造函数的作用域给新对象，(即new Object()创建出的对象)，而函数体内的this就代表new Object() 出来的对象。
    + 执行构造函数内的代码；
    + 返回新对象(后台直接返回)。

#### 3. 基本包装类型

+ ##### 在基本数据类型中有3个特殊的类的存在：String、Number和Boolean。

+ ##### 上面三个基本类型都有自己的包装对象，有相应的属性和方法。调用方法的过程是在后台发生的，所以我们称作为基本包装类型。

+ ##### 通俗地讲就是基本类型的数据都有一个包装它们的类，这些类都有自己的属性和方法，这些基本类型的数据都可以直接去调用这些属性和方法。

+ ##### Boolean类型

  + 没有自己的属性和方法。

+ ##### Number类型

  + 属性
    + MAX_VALUE 表示最大数
    + MIN_VALUE 表示最小值
    + NaN 非数值
    + NEGATIVE_INFINITY 负无穷大，溢出返回该值
    + POSITIVE_INFINITY 无穷大，溢出返回该值
    + prototype 原型，用于增加新属性和方法
  + 方法
    + toString() 将数值转化为字符串，并且可以转换进制
    + toLocaleString() 根据本地数字格式转换为字符串
    + toFixed() 将数字保留小数点后指定位数并转化为字符串
    + toExponential() 将数字以指数形式表示，保留小数点后指定位数并转化为字符串
    + toPrecision() 指数形式或点形式表述数，保留小数点后面指定位数并转化为字符串
    + valueOf() 显示原始值

+ ##### String类型

  + 属性
    + length
  + 方法
    + str.charAt(n) 返回指定索引位置的字符
    + str.charCodeAt(n) 以Unicode编码形式返回指定索引位置的字符
    + str.concat(str1...str2) 将字符串参数串联到调用该方法的字符串
    + str.slice(n,m) 返回字符串n到m之间位置的字符串
    + str.substring(n,m) 返回字符串n到m之间位置的字符串
    + str.substr(n,m) 返回字符串n开始的m个字符串
    + str.indexOf(str, n) 从n开始搜索的第一个str，并将搜索的索引值返回
    + str.lastIndexOf(str, n) 从n开始搜索的最后一个str，并将搜索的索引值返回
    + str.str.toLowerCase() 将字符串全部转换为小写
    + str.str.toUpperCase() 将字符串全部转换为大写
    + str.match(pattern) 返回pattern 中的子串或null
    + str.replace(pattern, replacement) 用replacement 替换pattern
    + str.search(pattern) 返回字符串中pattern 开始位置
    + str.split(pattern) 返回字符串按指定pattern 拆分的数组
    + String.fromCharCode(ascii) 静态方法，输出Ascii码对应值
    + str.localeCompare(str1,str2) 比较两个字符串，并返回相应的值

+ ##### 变量、作用域及内存

  + 变量
    + 基本类型的变量
      + 基本类型的变量的值存储在栈中。通过变量名可以直接获取变量的值。
    + 引用类型的变量
      + 引用类型的变量的值存储在堆中，在栈中存储的是引用类型的变量的地址（指针）。
      + 如果要获取引用类型变量的值，需要先从栈中获取地址，再按址查找，从而获取到值。
  + 作用域
    + 在ES5作用域分为全局作用域和局部作用域两种。
    + 在ES6作用域分为全局作用域、局部作用域和块级作用域三种。
      + 全局作用域：定义在函数外部的变量拥有全局作用域。
      + 局部作用域：定义在函数内部的变量拥有局部作用域。
  + 垃圾回收机制 GC
    + JS有自动回收垃圾的功能。
    + 在项目开发过程中，初始化对象时，最好赋初值为null。

### 三. JSON

#### 1. JSON的使用

+ ##### JSON(JavaScript Object Natation：JS对象表示法）是一种轻量级的数据交换格式。用独立的编程语言的文本格式来存储和表示数据。

+ ##### 优点

  + 易于阅读和编写，同时也易于浏览器解析和生成，并有效地提升网络传输效率。

+ ##### 与XML比较

  + JSON书写或解析时是一个对象，更容易解析；而XML是由用户自定义标签来存储数据的，对于前端来说，不容易书写且解析起来比较困难。

+ ##### JSON文件内容

  + 它可以是一个单值，也可以是一个对象，也可以是一个数组，也可以是对象和数组的结合。

+ ##### JSON写在哪里

  + 可以写在JavaScript代码中，也可以形成一个独立的.json文本文件。
  + 在JS中书写JSON数据
    + 值如果是字符串，可以用单或双引号引起来，数值型数据和逻辑值以及null不能加引号；
    + 如果是对象，键可以用单或双引号引起来，也可以不加引号。
  + 独立的JSON文件
    + 文件的扩展名必须是.json，JSON文件不是JS文件，不能出现任何的JS代码，它只是一个文本文件布而已；
    + 数据不能赋给某个变量；
    + 键必须用双引号引起来；
    + 值如果是字符型数据，必须用双引号引起来，其它类型的数据不能用引号引；
    + 在JSON文件中不能添加任何注释。

+ ##### 数据值可以有以下三种

  + 简单值：可以在JSON中表示字符串、数值、布尔值和null。但JSON不支持JavaScript中的特殊undefined。
  + 对象（{}）
  + 数组（[]）

+ ##### 在实际开发中的数据处理

  + 在实际项目开发中，如果后台工程师还没创建好后台数据接口时，前端工程师可以先做数据mock（模拟），写对应的HTML、CSS和JS代码，等后台数据可以调用时，再进行替换即可。
  + 在项目开发中，数据最好分离出来，形成单独的JSON文件。

+ ##### 解析JSON数据

  + JS中JSON
    + 如果是JSON数据，可以直接访问；如果是JSON格式的字符串需要用JSON.parse()方法进行转换。
    + JSON.parse()：将JSON格式的字符串转换为JSON
    + JSON.stringify()：将JSON转换为JSON格式的字符串
  + 解析JSON文件
    + JSON文件必须用ajax（异步请求）技术去获取。

#### 2. ajax请求操作步骤

+ ##### 创建请求对象

  + ```js
    var xhr = new XMLHttpRequest();
    ```

+ ##### 建立请求连接

  + ```js
    xhr.open('get',url,true);
    // get/post：请求方式 true/false：true表示异步请求,false表同步操作 url：表示请求的路径
    ```

+ ##### 向后台发送请求

  + ```js
    xhr.send();
    ```

+ ##### 前端对请求的结果进行处理

  + ```
    xhr.onreadystatechange = function () {
    	if(xhr.readyState == 4 && xhr.status == 	200){ 
    	// 如果请求成功
    	console.log(JSON.parse(xhr.responseText)); 
    	// responseTextr：获取请求的结果
    }
    };
    ```

+ 注意：如果发送ajax请求，必须以http（服务器端）的方式启动文件，不能在本地直接打开。

### 四. DOM操作

#### 1. DOM操作

+ ##### DOM（Document Object Model:文档对象模型）：是HTML和XML文档的编程接口，定义了访问和操作HTML和XML文档的标准方法。

+ ##### DOM以树型目录结构表达HTML和XML文档的，每一个节点就是一个DOM元素。

  + ```
    document->html->head/body->...
    ```

+ ##### DOM节点

  + 节点层次
    + 节点层次分为父子节点和同胞节点两种。
    + 在节点树中，顶端节点被称为根（root）
    + 每个节点都有父节点、除了根（它没有父节点）
    + 一个节点可拥有任意数量的子节点
    + 同胞节点是拥有相同父节点的节点，也叫兄弟节点
  + DOM节点分类
    + 元素节点：标签
    + 属性节点：标签的属性
    + 文本节点：标签后的换行符
    + 文档节点：document
  + DOM节点的名称（nodeName）
    + 元素节点 标签名相同
    + 属性节点 属性名相同

+ ##### 节点操作

  + 获取节点

    + ```
      通过ID获取节点 【返回具体某个节点】
      	document.getElementById(ID名)
      通过标签名获取节点 【返回节点数组，即使只有一个】
      	document.getElementsByTagName(标签名)
      通过标签的name值获取节点 【返回节点数组】
      	document.getElementsByName(Name名)
      通过class值来获取节点 【返回节点数组】
      	document.getElementsByClassName(Class名)
      根据选择器返回找到结果集中的第一个
      	document.querySelect("选择器")
      根据选择器返回找到的结果集，是个节点数组
      	document.querySelectAll("选择器")
      ```

  + 创建DOM节点j

    + ```js
      i)创建元素节点
      	document.createElement('标签名');
      ii)创建文本节点
      	document.createTextNode('文本内容');
      iii)创建属性节点
      	document.createAttribute('属性名');
      属性节点名.value = '属性值'; // 为属性设置值
      
      // 关联以上三个节点
      元素节点名.appendChild(文本节点名); // 在元素节点上添加文本节点
      元素节点名.setAttributeNode(属性节点名); // 在元素节点上添加属性节点
      
      document.body.appendChild(元素节点名); // 将创建的节点添加到文档中
      ```


      简洁写法：
      var oDiv = document.createElement('div'); // 创建元素节点
      oDiv.setAttribute('class','wrapper box'); // 为元素节点添加属性及属性值
      oDiv.innerHTML = '创建DOM元素的简洁写法';  // 为元素节点设置文本内容
      document.body.appendChild(oDiv); // 将创建的元素节点添加到文档中
      ```

  + ##### 插入节点

    + ```js
      i)插入内部的尾部
      	父节点.appendChild(创建的节点)
      ii)插入内部的某个前面
      	父节点.insertBefore(创建的节点,已知的子节点)
      ```

  + ##### 替换节点

    + ```
      父节点.replaceChild(新节点，老节点)
      ```

  + ##### 克隆节点

    + ```
      深度克隆： 包含子节点一起克隆。
      浅克隆： 只会将找到的这个节点克隆，子节点不会克隆
      
      需要被复制的节点. cloneNode(true/false);
      true: 复制当前节点以及所有子节点（深度克隆）
      false: 仅复制当前节点（浅克隆）
      ```

  + ##### 删除节点

    + ```
      i)删除当前节点及子节点
      	节点.remove();
      ii)删除子节点
      	父节点.removeChild(子节点)
      ```

  + ##### 节点属性操作

    + ```js
      i)获取属性值
      	DOM节点.属性名   // 不能获取用户自定义属性的值
      	DOM节点.getAttribute(属性名)  // 获取所有属性（用户自定义属性）的值
      ii)设置属性值
      	DOM节点.属性名 = 属性值   // 不能设置用户自定义属性的值
      	DOM节点.setAttribute(属性名, 属性值)  // 设置所有属性（用户自定义属性）的值
      iii)删除属性值
      	DOM节点.属性名 = ''   // 不能删除用户自定义属性
      	DOM节点.removeAttribute(属性名)  // 删除所有属性（用户自定义属性）
      ```

  + ##### 节点文本操作

    + ```js
      i) 获取文本
      	节点.innerHTML //获取节点下的所有内容包含了标签
      	节点.innerText // 获取节点下的文本内容，会过滤掉标签
      	节点.value // 获取input输入框等表单控件的内容
      	节点.getAttribute(“value”) //value是表单输入框的属性，可以使用getAttribute获得value值
      ii)设置文本
      	节点.innerHTML= "文本内容" // 会翻译html标签
      	节点.innerText = "文本内容" // 不会翻译html标签
      	节点.value = 值
      	节点.setAttribute("value",值) // 因为value是属性，所以也可以中这个方法设置内容
      iii)删除文本
      	节点.innerHTML= ""
      	节点.innerText = ""
      	节点.value = ""
      	节点.removeAttribute("value")
      ```

  + ##### DOM节点样式操作

    + ```js
      a)操作样式class
      	i)获取class
      	节点.className 获取节点的所有class
      	节点.getAttribute("class") 获取节点的所有class
      	ii)设置class
      	节点.className = 值
      	节点.setAttribute("class",值)
      	iii)其它方法
      	节点.classList.add(value); //为元素添加指定的类
      	节点.classList.contains(value); // 判断元素是否含有指定的类，如果存在返回true
      	节点.classList.remove(value); // 删除指定的类
      	节点.classList.toggle(value); // 有就删除，没有就添加指定类
      b)操作内联样式
      	i)获取内联样式
      	节点.style.样式属性名 // 获取某个具体的内联样式
      	节点.style.cssText // 获取某个节点的所有内联样式，返回字符串
      	ii)设置内联样式
      	节点.style.样式属性名 = 属性值  // 设置某个具体的内联样式
      	节点.style.cssText = 属性值或属性值列表 // 设置某个节点的所有内联样式
      ```

#### 2. API文档

+ ##### DOM(文档对象模型，w3c规范)

+ ##### 获取元素

  + document.getElementById		  获取ID
  + document.getElementsByTagName 获取过来元素对象的集合 以伪数组的形式存储

  + getElementsByClassName		  根据类名获得某些元素集合
  + document.querySelector			  获取此类标签的第一个（H5新增，用法类似css）
  + document.querySelectorAll		  获取所有的此类标签       
  + var bodyEle = document.body; 	  获取body
  + var htmlEle = document.documentElement;       获取html

+ ##### 节点获取

  + Element.parentNode		    获取离元素最近的父级节点
  + Element.childNode	            所有的子节点，包含元素节点，文本节点等等
  + Element.children			    所有的子元素节点 [常用]
  + Element.firstChild/lastChild  第一个/最后一个子节点，不管是文本节点还是元素节点等等
  + Element.firstElementChild     返回第一个子元素节点 [IE9以上支持]
  + Element.children[0]/[children.length-1]   实际开发中的写法，没有兼容问题。返回第一个和最后一个节点
  + Element.nextSibling		  下一个兄弟节点，包含文本节点或者元素节点等等
  + Element.previousSibling	   上一个兄弟节点，包含文本节点或者元素节点等等
  + Element.nextElementSibling		           下一个兄弟元素节点 [IE9以上支持]
  + Element.previousElementSibling	           上一个兄弟元素节点 [IE9以上支持]

+ ##### 创建元素节点

  + document.createElement('tagName')	    创建多个元素时，比采用数组形式的innerHTML方式效率稍低

+ ##### 添加元素节点

  + node.appendChild(child)		node是父级，child是子级（后面追加元素）
  + node.insertBefore(child, [指定元素])	node是父级，child是子级（前面追加元素）

+ ##### 删除元素节点

  + node.removeChild(child, [指定元素]) 	node是父级，child是子级

+ ##### 克隆元素节点

  + node.cloneNode()
    + 调用该方法的节点的一个副本。括号为空或者false，只复制节点本身，不克隆里面的子节点。括号为true，克隆所有

+ ##### 自定义属性

  + Element.setAttribute('date-*')		    创建自定义属性 
  + Element.getAttribute		                    获取自定义属性
  + Element.removeAttribute		            删除自定义属性

+ ##### H5新增自定义属性方法

  + Element.dateset	       获取data开头的自定义属性的集合
  + Element.dateset.index/['index']       	获取data-index属性

+ ##### DOM事件

  + onclick		        鼠标点击
  + onfocus		        获得焦点
  + onblur		        失去焦点
  + onmouseover	        鼠标经过（会冒泡，经过子盒子还会触发）
  + onmouseenter        鼠标经过（只会经过自己盒子会触发）
  + onmouseout	        鼠标离开
  + onmouseleave        鼠标离开（不会冒泡）
  + onmousemove	        鼠标移动
  + onmouseseup	        鼠标弹起
  + onmousedown	        鼠标按下
  + oncontextmenu	    禁用右键菜单
    + （document.addEventListener('contextmenu', function(e) {e.preventDefault();})）
  + onselectstart	    禁止选中文字
    + （document.addEventListener('selectstart', function(e) {e.preventDefault();})）
  + onkeyup		某个键盘按钮被松开
  + onkeydown	        某个键盘按钮被按下
  + onkeypress	        某个键盘按钮被按下。不识别功能键，比如shift，ctrl，箭头等
  + onscroll                 滚动事件，滚动条发生变化会触发

+ ##### 元素的操作（表单元素不需要style，表单专有：value，type，disabled等）

  + Element.innerText	                元素的文本内容（不识别标签属性，删除空格和换行）
  + Element.innerHTML	                元素的文本内容（识别标签属性，不删除空格和换行）[常用]
  + Element.style.color	                元素的文字颜色
  + Element.style.backgroundcolor 	    元素的背景颜色
  + Element.src	                            引用路径
  + Element.type	                    元素的类型
  + Element.style.width	            宽度
  + Element.style.display              元素的显示隐藏
  + Element.style.backgroundPosition    元素的背景坐标
  + Element.value	                    元素文本框的内容
  + Element.className                元素的类名
  + Element.checked         	     选项

+ ##### 注册事件

  + Element.onclick = function（）{}	传统注册事件
  + eventTarget.addEventListener(type, listener[, useCaptures])
    + eventTarget.addEventListener()方法将指定的监听器注册到eventTarget（目标对象）上
    + 当该对象触发指定时间时，就会执行事件处理函数
    + 三个参数：
      + type：事件类型字符串，不如click，mouseover...注意这里不要带on
      + listener：事件处理函数，事件发生时，会调动该函数
      + useCapture：可选函数，是一个布尔值，默认false。
  + Element.attachEvent('onclick')		IE9以下写法【略】

+ ##### 删除事件

  + Element.onclick = null；		    传统删除事件
  + Element.removeEventListener('click' , function(){}/fn)
    + 一般不用匿名函数，单独写函数fn，再把函数传入第二个数值。不用带小括号和参数
  + Element.datachEvent（'onclick'，fn）	IE9以下写法【略】

+ ##### 事件对象

  + e.targer		                e.targer返回的是触发事件的对象，this返回的是绑定事件的对象
  + e.srcElement	        触发事件的对象	非标准，ie6-8使用【兼容: e.target || e.srcElement】
  + e.type		                返回事件的类型
  + e.cancelBubble	        该属性阻止冒泡	非标准 ie6-8使用
  + e.returnValue	        该属性阻止默认事件，比如不让链接跳转	非标准 ie6-8使用
  + e.preventDefault()	 该方法阻止默认事件	标准
  + e.stopPropagation()	  阻止冒泡	标准

+ ##### 事件委托（jQuery称为事件委派）

  + 原理: 不是每个子节点单独设置监听器，而是事件监听器设置在其父节点上，
  + 然后利用冒泡原理影响设置每个子节点。（e.target返回当前点击的对象）

+ ##### 鼠标事件对象（MouseEvent）

  + e.clientX		返回鼠标相对于浏览器窗口可视区的X坐标
  + e.clientY		        返回鼠标相对于浏览器窗口可视区的Y坐标
  + e.pageX		        返回鼠标相对于文档页面的X坐标	IE9以下不支持
  + e.clientY		        返回鼠标相对于文档页面的Y坐标	IE9以下不支持
  + e.screenX		返回鼠标相对于电脑屏幕的X坐标
  + e.screenY		返回鼠标相对于电脑屏幕的Y坐标

+ ##### 键盘事件对象【keyup和keydown不区分字母的大小写，keypress区分】

  + e.keyCode	返回按下键位的ASCII值

+ ##### offset系列属性（只读）

  + offset 翻译过来就是偏移量， 我们使用 offset 系列相关属性可以动态的得到该元素的位置（偏移）、大小等。
  + element.offsetParent            返回作为该元素带有定位的父元素，父级都没有定位返回body
  + element.offsetTop               返回元素相对带有定位父元素上方的偏移
  + element.offsetLeft              返回元素相对带有定位父元素左方的偏移
  + element.offsetWidth             返回自身包括padding，边框，内容区的宽度，不带单位
  + element.offsetHeight            返回自身包括padding，边框，内容区的高度，不带单位

+ ##### client系列属性

  + element.clientTop               返回元素上边框的大小
  + element.clientLeft              返回元素左边框的大小
  + element.clientWidth             返回自身包括padding，内容区宽度，不含边框。返回数值不带单位
  + element.clientHeight            返回自身包括padding，内容区高度，不含边框。返回数值不带单位

+ ##### 立即执行函数

  + 作用：独立创建一个作用域，里面的所有变量都是局部变量，不会有命名冲突
  + 语法：
                (function(a){
                    console.log(a); // 局部变量
                    var num = 10; // 局部变量
                })(1); // 第二个小括号可以看做是调用函数，可以传实参
                (function(a,b){
                    console.log(a + b);
                    var num = 10; // 局部变量
                }(2,3)); // 第二个小括号可以看做是调用函数，可以传实参

+ ##### scroll系列属性（超出部分也计算在内）

  + element.scrollTop               返回被卷去的上侧距离，返回数值不带单位
  + element.scrollLeft              返回被卷去的左侧距离，返回数值不带单位
  + element.scrollWidth             返回自身实际的宽度，不含边框，返回数值不带单位
  + element.scrollHeight            返回自身实际的高度，不含边框，返回数值不带单位
  + tip:
    元素被卷去的头部是element.scrollTop，如果是页面被卷去的头部则是window.pageYOffset

#### 3. BOM操作

+ ##### 浏览器对象模型，提供了独立于内容而与浏览器窗口进行交互的对象，核心对象window

+ ##### 窗口注册事件

  + window.onload = function(){}			只能写一次
  + window.addEventListener('load', function(){})	没有限制

+ ##### 窗口事件

  + document.add....DOMContentLoaded	
    + DOM加载完毕就执行，不包含图片 flash css....
  + load		                
    + 等页面内容全部加载完毕再执行，包含dom元素 图片 flash....
  + resize		                
    + 窗口大小发生变化时触发，利用它完成响应式布局。
  + window.innerWidth           当前屏幕宽度

+ ##### 窗口的调用函数方法(window可以省略)

  + window.setTimeout(调用函数，[延时时间])
    + 延时时间单位毫秒，省略时为0
    + 调用函数可以直接写函数，也可以是函数名（函数名不用带小括号），或者字符串'函数名（）'
    + 页面中可能有多个定时器，需要给定时器加标识符（名字）var 名字 = setTimeout（调用函数，延时时间）
    + setTimeout（）这个调用函数我们也称为回调函数
  + window.clearTimeout(timeoutID)
    + 取消先前通过调用setTimeout()建立的定时器
  + window.setInterval(调用函数，[间隔的毫秒数])
    + 重复调用一个函数，每隔间隔的时间就去调用一次
    + 调用函数可以直接写函数，也可以是函数名（函数名不用带小括号），或者字符串'函数名（）'
    + 页面中可能有多个定时器，需要给定时器加标识符（名字）var 名字 = setInterval(调用函数，[间隔的毫秒数])
  + window.clearInterval(intervalID) 
    + 取消先前通过调用setInterval()建立的定时器

+ ##### JS动画

  + 核心原理：通过定时器setInterval()不断的移动盒子的位置
  + 注意：加一个结束定时器的条件；此元素需要定位才能使用element.style.left
        缓动效果
  + 原理：让盒子每次移动的距离慢慢变小
  + 算法：（目标值-现在的位置）/ 10 作为每次移动的距离 步长

+ ##### 节流阀

  + 防止轮播图按钮连续点击造成播放过快
  + 核心实现思路：利用回调函数，添加一个变量来控制，锁住函数和解锁函数。

+ ##### JS执行机制：

  + 同步和异步。先执行执行栈中的同步任务，将异步任务放入任务队列，同步任务执行完毕再执行异步任务。
  + 同步：程序的执行顺序和任务的排列顺序是一致的。同步任务都是在主线程上执行，形成一个执行栈。
  + 异步：一件事情花费很长时间会同时处理其他事情。JS的异步是通过回调函数实现的
  + 一般来说异步任务有以下三种类型：
    + 普通事件，如click，resize等
    + 资源加载，如load，error等
    + 定时器，如setInterval，setTimeout等
  + 主线程序执行完毕查询任务队列，取出任务，推入主线处理。重复此操作的过程称为事件循环（event loop）。
  + 异步任务
    + 宏任务
    + 微任务
    + ![image-20210830222111676](D:\前端\笔记\image-20210830222111676.png)
    + 宏任务，微任务执行顺序![image-20210830222353969](D:\前端\笔记\image-20210830222353969.png)

+ ##### URL：统一资源定位符

  + 语法：protocol://host[:port]/path/[?query]#fragment
    + http://www.itcast.cn/index.html?name=andy&age=18#link
  + protocol:通信协议，常用的http,ftp,maito等
  + host：主机（域名）www.baidu.com
  + port：端口号 可选，省略时使用默认端口，如好头疼http默认为80
  + path：路径 由 零或者多个/符号隔开的字符串，一般用来表示主机上的一个文件地址或目录
  + query：参数 键值对的形式通过&符号隔开
  + fragment：片段 #后面内容 常见于链接 锚点

+ ##### location对象属性：

  + location.href       获取或者设置整个 URL
  + location.host       返回主机（域名）
  + location,port       返回端口号，如果为空返回 空字符串
  + location,pathname   返回路径
  + location.search     返回参数
  + location.hash       返回片段

+ ##### location对象方法：

  + location.assign()   跟href一样，可以跳转页面
  + location.replace()  替换当前页面，不记录历史，所以不能后退页面
  + location.reload()   重新加载页面，相当于刷新按钮或者f5，如果参数为true，强制刷新ctrl+f5

+ ##### navigator对象属性：（了解）

  + navigator.userAgent 返回由客户机发送服务器的user-agent头部的值，判断是哪个终端打开的
  + 语法： if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                 window.location.href = ""; //手机
                } else {
                 window.location.href = ""; //电脑
                }

+ ##### history对象方法

  + history.back()              可以后退功能
  + history.forward()           前进功能
  + history.go(参数)            前进后退功能 参数为1 前进一个页面，-1后退一个页面

#### 4. 移动端页面特效

+ ##### 事件

  + touchstart                  手指触摸到一个DOM元素时触发
  + touchmove                   手指在一个DOM元素上滑动时触发
  + touchend                    手指从一个DOM元素上移开时触发
  + transitionend               图片滚动完成后判断

+ ##### 事件对象（TouchEvent）

  + e.touches                   正在触摸屏幕的所有手指的一个列表
  + e.targetTouches             正在触摸当前DOM元素上的手指的一个列表
  + e.changedTouches            手指状态发生改变的列表，从无到有，从有到无变化
  + e.classList                 返回元素的类名（伪数组形式）IE10以上
  + e.classList.add('类名')   往元素中添加类名，后面追加，不会覆盖
  + e.classList.remove('类名')从元素中移出类名
  + e.classList.toggle('类名')切换类，有就删除，没有就添加
  + click延时解决方案
    + 移动端click事件有300ms的延时判断用户是否会双击
    + 解决方案：
      + 禁用缩放：\<meta name = "viewport" content = "user-scalable = no ">
      + 利用touch事件封装：当手指触摸时记录当前时间，用手指离开的时间减去触摸的时间，小于150ms并且没有滑动屏幕。就定义为点击
      + 引入fastclick插件并引用

#### 5. 本地存储

+ ##### sessionStorage

  + 生命周期为关闭浏览器窗口，同一个窗口下数据共享，以键值对的形式存储使用
  + 存储数据：sessionStorage.setltem(key,value);
  + 获取数据：sessionStorage.getItem(key);
  + 删除数据：sessionStorage.removeItem(key);
  + 删除所有数据：sessionStorage.clear();

+ ##### localStorage

  + 生命周期永久生效，除非手动删除否则关闭仍存在，多窗口共享，以键值对的形式存储使用
  + 存储数据：localStorage.setltem(key,value);
  + 获取数据：localStorage.getItem(key);
  + 删除数据：localStorage.removeItem(key);
  + 删除所有数据：localStorage.clear();

### 五. 高级JS

#### 1. 函数调用方式

+ ##### 普通函数

  + function fn(){
                    console.log();
                }
                fn();   fn.call()

+ ##### 对象的方法

  + var o = {
                    sayHi:function(){}
                }
                o.sayHi();

+ ##### 构造函数

  + function Star(){};
    new Star();

+ ##### 绑定事件函数

  + btn.onclick = function(){};

+ ##### 定时器函数

  + setInterval(function(){},1000);

+ ##### 立即执行函数

  + (functiong(){})()

#### 2. this指向问题

+ ##### 普通函数this指向window

+ ##### 对象的方法中this指向这个对象

+ ##### 构造函数的this指向实例对象，prototype原型对象this指向也是实例对象

+ ##### 绑定事件this指向的是函数的调用者

+ ##### 定时器的this指向window

+ ##### 立即执行函数的this指向window

+ ##### 改变this指向，js提供了三种方法

  + call()    调用函数 ，主要作用可以实现继承
    + var o = {
                      name = 'andy';
                  }
                  function fn(a,b){
                      console.log(this);
                      console.log(a,b);
                  }
                  fn.call(o,1,2);
  + apply()   调用函数 ，作用比如借助数学内置对象求最大值
    + var o = {
                      name = 'andy';
                  }
                  function fn(arr){
                      console.log(this);
                      console.log(arr);   // 打印的是一个字符串
                  }
                  fn.apply(o, ['pink']);  // 参数必须是数组形式
                  var arr = [1,4,156,15,46]
                  Math.max.apply(Math.arr);
  + bind()  不调用函数   ，返回的是原函数改变this之后产生的新函数
    + var o = {
                      name = 'andy';
                  }
                  function fn(a,b){
                      console.log(this);
                      console,log(a+b);
                  }
                  var f = fn.bind(o ,1 ,2);
                  f();
    + 有的函数我们不需要立即调用，又想改变this指向。此时用bind

#### 3. 严格模式

+ ##### 严格模式strict mode（ES5新增。有兼容问题，ie10以上）

+ ##### 消除JavaScript语法的一些不合理，不严谨之处，减少一些怪异行为

+ ##### 消除代码的一些不安全之处，保证代码运行

+ ##### 提高编译器效率，增加运行速度

+ ##### 禁用了在ECMAScript的未来版本中可能会定义的一些语法，为以后版本做铺垫

+ ##### 严格模式可以应用到整个脚本或个别函数中，因此分为为脚本开启严格模式/为函数开启严格模式

+ ##### 为脚本（script）开启严格模式：

  +  'use strict'
  + (function(){
                'use strict';
            })()

+ ##### 为函数开启严格模式：

  + function(){
                    'use strict'
                }

+ ##### 严格模式的变化：

  + 变量名必须先声明再使用
  + 我们不能随意删除已经声明好的变量
  + 严格模式下全局作用域函数中的this指向undefined
  + 构造函数不加new调用，this会报错
  + 定时器里面的this还是指向window，事件、对象还是指向调用者
  + 函数名不允许有重名
  + 不允许在非函数的代码块声明函数（if，for...）
  + ......

#### 4. 高阶函数

+ ##### 高阶函数是对其他函数进行操作的函数，它接收函数作为参数或将函数作为返回值输出

  + function fn(a, b ,callback){
                console.log(a+b);
            }
            fn(1,2, function(){
                console.log('我是最后调用的');
            });

+ ##### 闭包

  + 闭包（closure）指有权访问另一个函数作用域中变量的函数。

  + 通俗点就是一个作用域可以访问另外一个函数内部的局部变量，被访问的函数就是闭包函数

    + function fn(){  // fn()就是一个闭包函数

      var num = 10;
      function fun(){
              console.log(num);
      }
      fun();
      return function(){
              console.log(num);
      };
                  }
      fn();
      (function(i){
          ...
      })(i)

  + fn外面的作用域可以访问fn内部的局部变量

  + var f = fn();   // 类似于 var f = functiong fun(){}

    f();

  + 闭包的主要作用就是延伸了变量的作用范围

#### 5. 递归和深浅拷贝

+ ##### 如果一个函数可以在内部调用其本身，那么这个函数就是递归函数

+ ##### 效果类似循环，必须加退出条件，否则栈溢出

+ ##### 浅拷贝和深拷贝

  + 浅拷贝只拷贝一层，更深层次对象级别的只拷贝引用
  + 深拷贝拷贝多层，每一级别的数据都会拷贝
  + var obj = {
                    id:1,
                    name:'andy',
                    msg:{
                        age:18
                    }
                };
                // var o = {};
                // for(var k in obj){
                //     // k是属性名，obj[k]属性值
                //     o[k] = obj[k];
                // }
                Object.assign(o, obj);
  + // 封装函数
                function deepCopy(newobj, oldobj){
                    for(var k in oldobj){
                        //判断属性值属于简单还是复杂数据类型
                        var item = oldobj[k[
                        if(item instanceof Array){
                            newobj[k] = [];
                            deepCopy(newobj[k], item)
                        }else if(item instanceof Object){
                            newobj[k] = {};
                            deepCopy(newobj[k], item);
                        }else{
                            newobj[k] = item;
                        };
                    };
                };

#### 6. 正则表达式

+ ##### 匹配字符串中字符组合的模式，js中正则表达式是对象

+ ##### 正则表达式里面不需要加引号，不管是数字型还是字符串型

+ ##### 作用：

  + 检索、替换那些符合某个模式（规则）的文本，例如验证表单
  + 过滤页面内容中的一些敏感词（替换）
  + 获取想要的特定部位（提取）

+ ##### 创建正则表达式

  + 通过调用  RegExp 对象的构造函数创建
    + var regexp = new RegExp(/123/);
  + 利用字面量创建
    + var rg = /123/;

+ ##### 测试正则表达式

  + test()正则对象方法，用于检测字符串是否符合规则，返回true和false
  + var rg = /123/; // 只要包含123，返回的都是true
  + rg.test(123);   // true

+ ##### 特殊字符

  + 边界符

    + ^   表示匹配行首的文本（以谁开始）
    + $   表示匹配行尾的文本（以谁结束）
      + /^abc$/     精确匹配，必须是adc才符合规则

  + 字符类

    + []  表示有一系列字符可供选择，只要匹配其中一个就可以

      + var rg = /[abc]/

        rg.test('andy');    // true

        /^[abc]$/   三选一 只有是a、b、c、这三个字母才返回true

    + [-] 表示方括号内部范围符

      + /^[a-z]$/   26个英文字母任何一个字母返回true

    + 字符组合

      + /^[a-zA-Z]$/    26个英文字母（大小写都可以）
      + /^\[^a-zA-Z0-9]$/    中括号里面有 ^ 表示取反，不能包含这些

  + 量词符

    + \*	重复0次或者更多次       /^a*$/
    + \+      重复一次或者更多次      /^a+$/
    + ?       重复0次或者一次         /^a?$/
    + {n}     重复n次                /^a{3}$/
    + {n,}    重复n次或更多次         /^a?{3,}/
    + {n,m}   重复n到m次              /^a?{3,5}/

  + 预定义类

    + \d      匹配0-9之间的任一数字，相当于[0-9]
    + \D      匹配0-9以外的任一数字，相当于\[^0-9]
    + \w      匹配任意的字母、数字和下划线，相当于[A-Za-z0-9_]_
    + _\W      匹配任意除字母、数字和下划线以外字符，相当于[^A-Za-z0-9_]
    + \s      匹配空格（包括换行符、制表符、空格符等），相当于[\t\r\n\v\f]
    + \S      匹配非空字符，相当于\[^\t\r\n\v\f]
    + 或者
    + |

+ ##### 替换

  + replace()方法可以实现替换字符串操作，用来替换的参数可以是一个字符串或者正则表达式
  + stringObject.replace(regexp/substr[switch],replacement)
    + 第一次参数：被替换的字符串或者正则表达式
    + 第二个参数：替换为的字符串
    + switch:按照什么样的模式来匹配
      + g：全局匹配
      + i：忽略大小写
      + gi：全局匹配+忽略大小写
    + 返回值是一个替换完毕的新字符串

#### 7. ES6新增语法

+ ##### let

  + ES6中新增的用于声明变量的关键字
  + 声明的变量只在所处于的块级有效
  + 在一个大括号中使用let关键字声明的变量才具有块级作用域
  + 使用var声明的变量不具有块级作用域特性
  + 防止循环变量变成全局变量

+ ##### const

  + ES6中新增的声明常量的关键字，常量就是值（内存地址）不能变化的量
  + 声明的常量只在所处于的块级有效
  + 在一个大括号中使用const关键字声明的常量才具有块级作用域
  + 声明常量必须赋值，基本数据类型赋值后，值（内存地址）不能修改。
  + 复杂数据类型通过下标可以修改值

+ ##### let、const、var的区别

  + 使用var声明的变量，其作用域为该语句所在的函数内，且存在变量提升现象
  + 使用let声明的变量，其作用域为该语句所在的代码块内，不存在变量提升
  + 使用const声明的常量，在后面出现的代码中不能再修改该常量的值

+ ##### 解构赋值

  + ES6中允许从数组中提取值，按照对应位置，对变量赋值。对象也可以实现解构
  + 数组解构
    + 数组解构允许我们按照一一对应的关系从数组中提取值然后赋值给变量
    + let ary = [1,2,3]
    + let [a,b,c] = ary;
    + 如果解构不成功（没有对应值），返回undefined
  + 对象解构
    + 对象解构允许我们使用变量的名字匹配变量的属性，匹配成功则将对象属性的值赋值给变量
    + let person = {name = 'lisi' ,age = 18}
    + let {name , age} = person   // name = lisi；age = 18；
    + let {name : Myname ,age : Myage}    // Myname = lisi; Myage = 18;

+ ##### 箭头函数

  + 用来简化函数定义语法
  + const fn = ()=>{}
  + 函数体只有一句代码，且代码的执行结果就是返回值，可以省略大括号
    + function sum(num1.num2){    // 传统方式
                  return num1+num2;
              }
    + const sum = (num1,num2) => num1 + num2; //箭头函数
  + 如果形参只有一个，小括号可以省略
  + 箭头函数不绑定this关键字，箭头函数中的this，指向的是函数定义位置的上下文this

+ ##### 剩余参数

  + 将一个不定数量的参数表示为一个数组
  +   ...   将剩下的多余的参数表示为一个数组
    + const sum = (...args) -> {
                  let total = 0;
                  args.forEach(item => total += item);
              }
      sum(10,20,30,40); // 100
  + 剩余参数和解构配合使用
    + let students = ['wangwu','zhangsan','lisi']
      let [s1, ...s2] = students;     // s1 = 'wangwu'；s2 = ['zhangsan','lisi']

+ ##### Array 的扩展运算符

  + 将数组或者对象转为用逗号分隔的参数序列

    + let ary = [1,2,3]
      console.log(...ary);    // ...ary = 1,2,3

  + 合并数组

    + let ary1 =[1,2.3];

      let ary2 =[4,5,6];

      let ary3 =[...ary1 , ...ary2];  // 方法1

      ary1.push(...ary2);     // 方法2

  + Array.from()

    + 将类数组或可遍历对象转换为真正的数组
    + let arrayLike = {
                      '0':'a',
                      '1':'b',
                      '2':'c',
                      length:3
                  };
      let arr2 = Array.from(arrayLike);   // ['a','b','c']
      let newAry = Array.from(arrayLike , item => item*2);

  + find

    + 用于找出第一个符合条件的数组成员，如果没有找到返回undefined
    + let ary = [{
                      id: 1,
                      name: '张三'
                  },{
                      id: 2,
                      name: '李四'
                  }];
      let target = ary.find((item, index) => item.id == 2);

  + findIndex()

    + 用于找出第一个符合条件的数组成员的位置，如果没有找到返回-1
    + let ary = [1,5,10,15];
      let index = ary.findIndex((value , index) => value > 9);    // index = 2;

  + includes()

    + 表示某个数组是否包含给定的值，返回布尔值
    + [1,2,3].includes(2);    //  true
      [1,2,3].includes(4);    //  false

+ ##### String 的扩展方法

  + ES6新增的创建字符串的方式，使用反引号定义

    + let name = \`zhangsan`;

  + 模板字符串中可以解析变量

    + let name = \`张三`;

      let sayHello = \`hello, my name is ${name}`; // hello，my name is 张三

  + 模板字符串可以换行

    + let result = {
                  name = 'zhangsan',
                  age = 20;
              }
    + let html = \`\<div>
                 \<span>${result.name}\</span>
                  \<span>${result.age}\</span>
             \</div>`;

  + 模板字符串中可以调用函数

    + const sayHello = function(){
                      return '哈哈哈哈';
                  };

      let greet = \`${sayHello}啊啊啊啊`;  // 哈哈哈哈啊啊啊啊

  + startsWith()和endsWith()

    + startsWith():表示参数字符串是否在原字符串的头部，返回布尔值
    + endsWith()：表示参数字符串是否在原字符串的尾部，返回字符串
    + let str = 'Hello world';
    + str.startsWith('Hello');    // true
    + str.endsWith('!');          // false

  + repeat()

    + 表示将原字符串重复n次，返回一个新字符串
    + 'x'.repeat(3);      // 'xxx'
    + 'hello'.repeat(2);  // 'hellohello'

+ ##### Set 数据结构

  + ES6提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值
  + Set 本身是一个构造函数，用来生成 Set 数据结构
    + const s = new Set();
  + Set 函数可以接受一个数组作为参数，用来初始化
    + const set = new Set([1,2,3,4,4]);
    + console.log(set.size)   // 4
    + const ary = [...set]    // [1 2 3 4]
  + add(value)：添加某个值，返回Set结构本身
  + delete(value)：删除某个值，返回一个布尔值，表示删除是否成功
  + has(value)：返回一个布尔值，表示改值是否为Set的成员
  + clear()：清除所有成员，没有返回时
    + const s = new Set();
    + s.add(1).add(2).add(3);
    + s.delete(2);
    + s.has(1);
    + s.clear();
  +  遍历：Set 结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，没有返回值
    + s.forEach(value => console.log(value));

##### 	异步并发请求

```js
const fn = () =>{
   Promise.all([fn1(),fn2()]).then(res =>{
       console.log(res);// [1,2]
   }) 
}
//如果并发请求时，只要其中一个异步函数处理完成，就返回结果，要用到Promise.race()
```



## Bootstrap

一

## JQuery

## NodeJS

## TypeScript

## 工程化开发

### 一. npm

#### 1.什么是npm

+ 

#### 2.npm的安装

#### 3.npm的基本使用

#### 4.package.json文件属性

#### 5.NPM安装包的使用

#### 6.通过npm安装包来解决ES6语法兼容性的问题

#### 7.yarn的安装和使用

### 二. webpack

#### 1.webpack的工作原理

#### 2.webpack的安装

#### 3.webpack的核心概念

#### 4.多入口和多出口的情况配置

#### 5.打包和压缩HTML资源

#### 6.webpack打包CSS资源

#### 7.webpack打包less和sass资源

#### 8.webpack打包图片和其他图标字体资源

#### 9.对js语法配置eslint规范

#### 10.配置开发服务器devServer以及开发环境的优化HMR模块热替换

### 三. ES6

#### 1.ES6关键字的使用

#### 2.箭头函数和this指向的问题

#### 3.数组中新增的高级函数

#### 4.ES6新增的数据结构Map和Set

#### 5.字符串新增的方法和模板字符串

#### 6.解构赋值和三点扩展运算符

#### 7.ES6新增的class用法和JSON的新应用

#### 8.Module模块化编程export和import的使用

### 四. axios

#### 1.什么是axios

#### 2.为axios应用准备RestFul标准API

#### 3.Postman的安装和基本使用

#### 4.ES6中新增的promise应用

#### 5.axios的应用

#### 6.axios的并发请求处理

#### 7.axios的全局配置

#### 8.axios的实例封装

#### 9.axios拦截器的应用

### 五. git

## Vue3.0

### 一. Vue基本使用

#### 1.Vue3的认识和CDN方式安装

#### 2.vue-cli安装和项目的创建

#### 3.vue-cli的拓展配置

#### 4.options的基础定义和MVVM模式

#### 5.模板基础语法#插值和指令

#### 6.数据绑定v-bind

#### 7.计算属性computed

#### 8.事件监听v-on

#### 9.条件分支v-if和v-show

#### 10.循环遍历v-for和key的绑定

#### 11.双向绑定v-model

#### 12.购物车案例

### 二. 组件化开发

#### 1.组件化开发的思想

#### 2.创建Vue组件和组件语法结构

#### 3.组件间数据的传递(父传子)

#### 4.组件间数据的传递(子传父)

#### 5.父子组件间互相访问的方式

#### 6.Vue插槽slot的应用

#### 7.Vue3中的生命周期函数

#### 8.在Vue中使用axios请求服务器

#### 9.封装网络请求

### 三. Router路由

#### 1.认识Vue的路由

#### 2.VueRouter的应用

#### 3.Router模式切换和懒加载

#### 4.自定义router-link和使用命名视图

#### 5.嵌套路由(子路由)

#### 6.动态路由和参数传递

#### 7.重定向和别名

#### 8.导航守卫介绍及应用

#### 9.keep-alive和vue-router结合使用

### 四. Vuex

#### 1.Vuex状态管理应用概述

#### 2.安装和体验Vuex状态管理

#### 3.使用devtools工具查看状态管理

#### 4.Mustations传参

#### 5.Vuex中计算属性getters的应用

#### 6.Actions异步处理操作

#### 7.Moduls模块划分和文件拆分

### 五. Composition

#### 1.CompositionAPI组合API介绍和体验

#### 2.组合API入口方法setup详解

#### 3.Composition中常见的API应用

#### 4.Composition中的computed计算属性API

#### 5.CompositionAPI侦听器watch

#### 6.Composition中的生命周期函数

#### 7.在组合API中provide和inject使用

#### 8.CompositionAPI结合路由使用

## React



## 监听浏览器关闭，弹出确认框提示

onbeforeunload与onunload事件,onunload和onbeforeunload都是在刷新或关闭时调用，可以在< script>脚本中通过window.onunload来指定或者在< body>里指定。区别在于onbeforeunload在onunload之前执行，它还可以阻止onunload的执行。

Onbeforeunload也是在页面刷新或关闭时调用，Onbeforeunload是正要去服务器读取新的页面时调用，此时还没开始读取；而onunload则已经从服务器上读到了需要加载的新的页面，在即将替换掉当前页面时调用。Onunload是无法阻止页面的更新和关闭的。而 Onbeforeunload 可以做到。


> 页面加载时只执行onload
> 页面关闭时先执行onbeforeunload，最后onunload
> 页面刷新时先执行onbeforeunload，然后onunload，最后onload。
> 
> onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发。
>
> 该事件可用于弹出对话框，提示用户是继续浏览页面还是离开当前页面。
>
> 对话框默认的提示信息根据不同的浏览器有所不同，标准的信息类似 "确定要离开此页吗？"。该信息不能删除。
>
> 但你可以自定义一些消息提示与标准信息一起显示在对话框。
>
> 注意1： 在 Firefox 与 Chorme浏览器中，只显示默认提醒信息（不显示自定义信息）。IE会显示出自定义的字符串。
>
> 注意2： 如果你没有在body元素上指定 onbeforeunload 事件，则需要在 window 对象上添加事件，并使用 returnValue 属性创建自定义信息。
>
> 注意3：“onbeforeunload 事件”生效的前题是，打开该网页后，需要鼠标点击一下网页，让网页获取焦点，然后再关闭或刷新！若打开后不点击页面直接关闭或刷新不会触发该事件方法。





## svg

获取svg内部g元素大小     getBBox()

