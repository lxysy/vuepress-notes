---
title: Output Parser实战
date: 2026-08-04
categories:
  - AI
tags:
  - AI output parser
---

之前使用 model.withStructuredOutput 来控制输出的结构，它底层会根据模型来决定用 tool 或者 output parser

但是在要实现流式返回，实现打字机效果时，就需要使用output parser了

一般在录入信息时，常见的做法是：

- 填表单
- excel文档导入

基本就是自己整理数据结构，然后用代码解析再存到数据库

这个过程有了AI,就相应地简化了，你只需要传一段自然语言文字，让AI分析并提取数据，按结构整理好，插入数据库

这就是结构化AI的输出，就会使用到withStructuredOutput 

### 安装mysql

在docker中搜索mysql镜像，点击run，会开始下载

![image-20260804212911881](./img/image-20260804212911881.png)

填写参数运行

![image-20260804213152095](./img/image-20260804213152095.png)

![image-20260804213320286](./img/image-20260804213320286.png)

容器就跑起来了

然后去下载一个GUI工具连结它，这里用了官方的Mysql Workbench

![image-20260804214816019](./img/image-20260804214816019.png)

### 创建数据库和表

```js
import mysql from "mysql2/promise";

async function main() {
  const connectionConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "admin",
    multipleStatements: true,
  };

  const connection = await mysql.createConnection(connectionConfig);

  try {
    // 创建 database
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS hello CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
    await connection.query(`USE hello;`);

    // 创建好友表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS friends (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        gender VARCHAR(10),                -- 性别
        birth_date DATE,                   -- 出生日期
        company VARCHAR(100),              -- 公司
        title VARCHAR(100),                -- 职位
        phone VARCHAR(20),                 -- 当前手机号
        wechat VARCHAR(50)                 -- 微信号
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 插入 demo 数据
    const insertSql = `
      INSERT INTO friends (
        name,
        gender,
        birth_date,
        company,
        title,
        phone,
        wechat
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      "王经理", // name
      "男", // gender
      "1990-01-01", // birth_date
      "字节跳动", // company
      "产品经理/产品总监", // title
      "18612345678", // phone
      "wangjingli2024", // wechat
    ];

    const [result] = await connection.execute(insertSql, values);
    console.log(
      "成功创建数据库和表，并插入 demo 数据，插入ID：",
      result.insertId,
    );
  } catch (err) {
    console.error("执行出错：", err);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error("脚本运行失败：", err);
});
```

跑一下，插入一条数据

![image-20260804215645233](./img/image-20260804215645233.png)![image-20260804215801321](./img/image-20260804215801321.png)

### AI智能录入

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import mysql from "mysql2/promise";

// 初始化模型
const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
});

// 定义单个好友信息的 zod schema，匹配 friends 表结构
const friendSchema = z.object({
  name: z.string().describe("姓名"),
  gender: z.string().describe("性别（男/女）"),
  birth_date: z
    .string()
    .describe("出生日期，格式：YYYY-MM-DD，如果无法确定具体日期，根据年龄估算"),
  company: z.string().nullable().describe("公司名称，如果没有则返回 null"),
  title: z.string().nullable().describe("职位/头衔，如果没有则返回 null"),
  phone: z.string().nullable().describe("手机号，如果没有则返回 null"),
  wechat: z.string().nullable().describe("微信号，如果没有则返回 null"),
});

// 定义批量好友信息的 schema（数组）
const friendsArraySchema = z.array(friendSchema).describe("好友信息数组");

// 使用 withStructuredOutput 方法
const structuredModel = model.withStructuredOutput(friendsArraySchema);

// 数据库连接配置
const connectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  multipleStatements: true,
};

async function extractAndInsert(text) {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    // 切换到 hello 数据库
    await connection.query(`USE hello;`);

    // 使用 AI 提取结构化信息
    console.log("🤔 正在从文本中提取信息...\n");
    const prompt = `请从以下文本中提取所有好友信息，文本中可能包含一个或多个人的信息。请将每个人的信息分别提取出来，返回一个数组。

${text}

要求：
1. 如果文本中包含多个人，请为每个人创建一个对象
2. 每个对象包含以下字段：
   - 姓名：提取文本中的人名
   - 性别：提取性别信息（男/女）
   - 出生日期：如果能找到具体日期最好，否则根据年龄描述估算（格式：YYYY-MM-DD）
   - 公司：提取公司名称
   - 职位：提取职位/头衔信息
   - 手机号：提取手机号码
   - 微信号：提取微信号
3. 如果某个字段在文本中找不到，请返回 null
4. 返回格式必须是一个数组，即使只有一个人也要放在数组中`;

    const results = await structuredModel.invoke(prompt);

    console.log(`✅ 提取到 ${results.length} 条结构化信息:`);
    console.log(JSON.stringify(results, null, 2));
    console.log("");

    if (results.length === 0) {
      console.log("⚠️  没有提取到任何信息");
      return { count: 0, insertIds: [] };
    }

    // 批量插入数据库
    const insertSql = `
      INSERT INTO friends (
        name,
        gender,
        birth_date,
        company,
        title,
        phone,
        wechat
      ) VALUES ?;
    `;

    const values = results.map((result) => [
      result.name,
      result.gender,
      result.birth_date || null,
      result.company,
      result.title,
      result.phone,
      result.wechat,
    ]);

    const [insertResult] = await connection.query(insertSql, [values]);
    console.log(`✅ 成功批量插入 ${insertResult.affectedRows} 条数据`);
    console.log(
      `   插入的ID范围：${insertResult.insertId} - ${insertResult.insertId + insertResult.affectedRows - 1}`,
    );

    return {
      count: insertResult.affectedRows,
      insertIds: Array.from(
        { length: insertResult.affectedRows },
        (_, i) => insertResult.insertId + i,
      ),
    };
  } catch (err) {
    console.error("❌ 执行出错：", err);
    throw err;
  } finally {
    await connection.end();
  }
}

// 主函数
async function main() {
  // 示例文本（包含多个人的信息）
  const sampleText = `我最近认识了几个新朋友。第一个是张总，女的，看起来30出头，在腾讯做技术总监，手机13800138000，微信是zhangzong2024。第二个是李工，男，大概28岁，在阿里云做架构师，电话15900159000，微信号lee_arch。还有一个是陈经理，女，35岁左右，在美团做产品经理，手机号是18800188000，微信chenpm2024。`;

  console.log("📝 输入文本:");
  console.log(sampleText);
  console.log("");

  try {
    const result = await extractAndInsert(sampleText);
    console.log(`\n🎉 处理完成！成功插入 ${result.count} 条记录`);
    console.log(`   插入的ID：${result.insertIds.join(", ")}`);
  } catch (error) {
    console.error("❌ 处理失败：", error.message);
    process.exit(1);
  }
}

main();
```

这里我使用的是deepseek v4的模型，`getStructuredOutputMethod()` 对非 gpt-3/gpt-4 模型默认走 **`jsonSchema`** 方法， 即向 DeepSeek API 发送 `response_format: { type: "json_schema", json_schema: {...} }`。

DeepSeek API（`api.deepseek.com`）**不支持 `json_schema` 这个 response_format 类型**，所以返回 400。

改了几个地方：

![image-20260804222018566](./img/image-20260804222018566.png)

![image-20260804222037787](./img/image-20260804222037787.png)

运行后发现继续报错：

![image-20260804223005140](./img/image-20260804223005140.png)

注意：

![image-20260804223024665](./img/image-20260804223024665.png)

OpenAI 的函数调用规范（DeepSeek 是兼容实现）规定：**函数调用的 `arguments` 永远是 `{ ... }` 这种 JSON 对象**，因为调用一个函数就是把"参数名 → 参数值"传进去，不存在"一个函数就收一个数组"这种形态。所以 DeepSeek 直接拒绝：

```
schema must be a JSON Schema of 'type: "object"', got 'type: "a
```

> `functionCalling` 的做法是把你定义的结构转成一个**工具（function）**，发给模型。看一下 LangChain 源码的转换逻辑：
>
> ```js
> if (isInteropZodSchema(schema)) toolFunction = {
>   name: functionName,
>   description: ...,
>   parameters: asJsonSchema   // ← 直接把你的 zod schema 转成 JSON Schema 当参数
> };
> ```
>
> 也就是说，你的 `z.array(friendSchema)` 被原样转成了 `parameters: { type: "array", items: {...} }`。

修改代码：

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import mysql from "mysql2/promise";

// 初始化模型
const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  modelKwargs: {
    // 关闭 V4 的思考模式，否则和 function calling 冲突
    thinking: { type: "disabled" },
  },
});

// 定义单个好友信息的 zod schema，匹配 friends 表结构
const friendSchema = z.object({
  name: z.string().describe("姓名"),
  gender: z.string().describe("性别（男/女）"),
  birth_date: z
    .string()
    .describe("出生日期，格式：YYYY-MM-DD，如果无法确定具体日期，根据年龄估算"),
  company: z.string().nullable().describe("公司名称，如果没有则返回 null"),
  title: z.string().nullable().describe("职位/头衔，如果没有则返回 null"),
  phone: z.string().nullable().describe("手机号，如果没有则返回 null"),
  wechat: z.string().nullable().describe("微信号，如果没有则返回 null"),
});

// 定义批量好友信息的 schema（函数调用要求顶层必须是 object，所以把数组包一层）
const friendsArraySchema = z.object({
  friends: z.array(friendSchema).describe("好友信息数组"),
});

// 使用 withStructuredOutput 方法（DeepSeek 不支持 json_schema，改用 functionCalling）
const structuredModel = model.withStructuredOutput(friendsArraySchema, {
  method: "functionCalling",
});

// 数据库连接配置
const connectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  multipleStatements: true,
};

async function extractAndInsert(text) {
  const connection = await mysql.createConnection(connectionConfig);

  try {
    // 切换到 hello 数据库
    await connection.query(`USE hello;`);

    // 使用 AI 提取结构化信息
    console.log("🤔 正在从文本中提取信息...\n");
    const prompt = `请从以下文本中提取所有好友信息，文本中可能包含一个或多个人的信息。请将每个人的信息分别提取出来，返回一个数组。

${text}

要求：
1. 如果文本中包含多个人，请为每个人创建一个对象
2. 每个对象包含以下字段：
   - 姓名：提取文本中的人名
   - 性别：提取性别信息（男/女）
   - 出生日期：如果能找到具体日期最好，否则根据年龄描述估算（格式：YYYY-MM-DD）
   - 公司：提取公司名称
   - 职位：提取职位/头衔信息
   - 手机号：提取手机号码
   - 微信号：提取微信号
3. 如果某个字段在文本中找不到，请返回 null
4. 返回格式必须是一个数组，即使只有一个人也要放在数组中`;

    const results = await structuredModel.invoke(prompt);

    console.log(`✅ 提取到 ${results.friends.length} 条结构化信息:`);
    console.log(JSON.stringify(results, null, 2));
    console.log("");

    if (results.friends.length === 0) {
      console.log("⚠️  没有提取到任何信息");
      return { count: 0, insertIds: [] };
    }

    // 批量插入数据库
    const insertSql = `
      INSERT INTO friends (
        name,
        gender,
        birth_date,
        company,
        title,
        phone,
        wechat
      ) VALUES ?;
    `;

    const values = results.friends.map((result) => [
      result.name,
      result.gender,
      result.birth_date || null,
      result.company,
      result.title,
      result.phone,
      result.wechat,
    ]);

    const [insertResult] = await connection.query(insertSql, [values]);
    console.log(`✅ 成功批量插入 ${insertResult.affectedRows} 条数据`);
    console.log(
      `   插入的ID范围：${insertResult.insertId} - ${insertResult.insertId + insertResult.affectedRows - 1}`,
    );

    return {
      count: insertResult.affectedRows,
      insertIds: Array.from(
        { length: insertResult.affectedRows },
        (_, i) => insertResult.insertId + i,
      ),
    };
  } catch (err) {
    console.error("❌ 执行出错：", err);
    throw err;
  } finally {
    await connection.end();
  }
}

// 主函数
async function main() {
  // 示例文本（包含多个人的信息）
  const sampleText = `我最近认识了几个新朋友。第一个是张总，女的，看起来30出头，在腾讯做技术总监，手机13800138000，微信是zhangzong2024。第二个是李工，男，大概28岁，在阿里云做架构师，电话15900159000，微信号lee_arch。还有一个是陈经理，女，35岁左右，在美团做产品经理，手机号是18800188000，微信chenpm2024。`;

  console.log("📝 输入文本:");
  console.log(sampleText);
  console.log("");

  try {
    const result = await extractAndInsert(sampleText);
    console.log(`\n🎉 处理完成！成功插入 ${result.count} 条记录`);
    console.log(`   插入的ID：${result.insertIds.join(", ")}`);
  } catch (error) {
    console.error("❌ 处理失败：", error.message);
    process.exitCode = 1;
  }
}

main();
```

![image-20260804223317023](./img/image-20260804223317023.png)

![image-20260804223329745](./img/image-20260804223329745.png)

可以看到成功插入数据

流程如下：

- 给一段无规则文本，用大模型提取结构化的信息 
- 结构用 withStructuredOutput 指定，要求提取一个数组
- 数组里是好友对象的信息。  然后我们把数组里的结构化数据批量插入数据库表

### JSON Schema

withStructuredOutput 底层是 tool、output parser，其实还有一种特性 JSON Schema

同样的，这是OpenAI 的「原生 JSON Schema 结构化输出」模式

**OpenAI 官方系列**（这个参数本来就是 OpenAI 定义的「Structured Outputs」）：

- **GPT-5 系列**：GPT-5.5、GPT-5.4、GPT-5.4-mini/nano、GPT-5.2-Codex 等，全系列支持
- **GPT-4o 系列**：gpt-4o、gpt-4o-mini（2024-08-06 及之后的版本）
- **o 系列推理模型**：o1 / o3 / o4-mini 等
- 注意：`gpt-3.5-turbo`、老版 `gpt-4-0613` 不支持，只能用 `json_object` 或 function calling

第三方厂商里，**有没有按 OpenAI 兼容协议实现这个参数的**需要逐个验证——多数国内聚合/中转平台（像之前搜到的 [dmxapi.cn](https://errs.dmxapi.cn/detail.php?id=1222) 这类）会把各家模型包装成 OpenAI 格式，能不能用取决于平台是否实现了 `json_schema` 透传，不一定跟模型本身相关。

> DeepSeek 的 OpenAI 兼容接口**只支持 `json_object`（JSON 模式），不支持 `json_schema` 这种新的结构化输出格式**，所以服务器直接返回了 `400 This response_format type is unavailable now`（这种 response_format 类型目前不可用）。
>
> 注意：你的 `deepseek-v4-flash` 模型本身是能用的（没有报模型不存在），单纯是这个参数 DeepSeek 不认。
>
> 补充一个背景：`json_schema` 结构化输出是 OpenAI 后来推出的能力，DeepSeek 这类走「OpenAI 兼容协议」的厂商实现得慢，很多框架（LangChain 的 `withStructuredOutput` 默认就发 `json_schema`）踩的都是同一个坑。

json schema 就和 tool 的 args 一样，都是大模型层面支持的，会保证按照这个格式来返回，如果格式不对，会在模型层面重新生成正确的返回。  也就是说，withStructuredOutput 底层是 tool、json schema、output parser 这三者



看下模型支持`json_schema` 参数时的用法：

```js
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import chalk from "chalk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const scientistSchema = z
  .object({
    name: z.string().describe("科学家的全名"),
    birth_year: z.number().describe("出生年份"),
    field: z.string().describe("主要研究领域"),
    achievements: z.array(z.string()).describe("主要成就列表"),
  })
  .strict();

// 将 Zod 转换为原生的 JSON Schema 格式
const nativeJsonSchema = zodToJsonSchema(scientistSchema);

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  modelKwargs: {
    // 通过 modelKwargs 传入原生参数
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "scientist_info",
        strict: true,
        schema: nativeJsonSchema, // 这里的 nativeJsonSchema 就是转换后的对象
      },
    },
  },
});

async function testNativeJsonSchema() {
  console.log(chalk.bgMagenta("🧪 测试原生 JSON Schema 模式...\n"));

  const res = await model.invoke([
    new SystemMessage("你是一个信息提取助手，请直接返回 JSON 数据。"),
    new HumanMessage("介绍一下杨振宁"),
  ]);

  console.log(chalk.green("\n✅ 收到响应 (纯净 JSON):"));
  console.log(res.content);

  const data = JSON.parse(res.content);
  console.log(chalk.cyan("\n📋 解析后的对象:"));
  console.log(data);
}

testNativeJsonSchema().catch(console.error);
```

### 补充

#### deepseek v4 json结构化输出方案

##### 方案 A：Function Calling（最推荐，DeepSeek 原生支持）

靠工具调用机制约束输出，schema 由 API 强制，结果一定合法。

| 层次 | 写法                                                         | 对应你的脚本                                                 |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 高层 | `model.withStructuredOutput(schema, { method: "functionCalling" })`，结果直接是对象 | [with-structured-output.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/with-structured-output.mjs) |
| 低层 | `model.bindTools([{name, description, schema}])`，取 `response.tool_calls[0].args` | [tool-calls-args.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/tool-calls-args.mjs) |
| 流式 | `structuredModel.stream()`                                   | [stream-with-structured-output.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/stream-with-structured-output.mjs) |

⚠️ **关键前提**：V4 是推理模型，必须关掉思考模式，否则和 function calling 冲突。你已经踩过这个坑，注释写在 [with-structured-output.mjs:13](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/with-structured-output.mjs#L13)：



```js
modelKwargs: { thinking: { type: "disabled" } }
```

##### 方案 B：JSON 模式（`json_object`，最简单）

把 `structured-json-schema.mjs` 里的 `response_format` 从 `json_schema` 改成 `json_object` 就能跑：



```js
response_format: { type: "json_object" }
```

- 要求 prompt 里必须出现 "json" 字样，且 `max_tokens` 要给够防止截断
- ✅ 优点：DeepSeek 原生支持，改动最小
- ❌ 缺点：只保证输出是合法 JSON，**不保证字段和类型**。需要在客户端 `JSON.parse` 后用 Zod `schema.parse()` 校验，失败就重试

##### 方案 C：提示词 + 客户端解析（零 API 特性依赖）

不依赖任何 `response_format` 参数，任何模型都能跑：

| 脚本                                                         | 做法                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| [structured-output-parser2.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/structured-output-parser2.mjs) | `StructuredOutputParser.fromZodSchema()` 生成格式指令拼进 prompt，客户端 `JSON.parse` + Zod 校验 |
| [json-output-parser.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/json-output-parser.mjs) | `JsonOutputParser` 只保证是合法 JSON                         |
| [normal.mjs](vscode-webview://00tirqpivijkeevccub8cm2nirsjp6cdf8qlm02k6qktt68nep7h/output-parser-test/src/normal.mjs) | 纯提示词 + 手写 `JSON.parse`                                 |

- ❌ 最不可靠，输出容易漂移（多写注释、字段名变形、markdown 包裹），**必须加重试兜底**

##### 兜底套路：校验失败 → 重试/修复

无论上面哪种方案，生产上建议加这层：`JSON.parse` 或 `schema.parse` 失败时，把**解析错误信息回喂给模型**让它修复重出，而不是直接放弃。

##### 结论

| 方案                        | 可靠性          | 改动成本       | 推荐度      |
| --------------------------- | --------------- | -------------- | ----------- |
| A. Function Calling         | ⭐⭐⭐（API 约束） | 中             | **首选**    |
| B. json_object + 客户端校验 | ⭐⭐              | 最低（改一行） | 简单场景    |
| C. 提示词 + 解析            | ⭐               | 中             | 兜底/跨模型 |