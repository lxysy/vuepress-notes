---
title: mdbook
date: 2024-04-08
categories:
  - mdbook
  - 离线文档
tags:
  - mdbook
---

参考资料：

https://books.niqin.com/read/mdbook-guide/zh-cn/guide/installation.html

https://course.rs/first-try/installation.html

# mdbook 安装(ubuntu)

**安装`rust`**

https://www.rust-lang.org/tools/install

```shell
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

可从源代码构建`mdbook`，您首先需要安装 Rust 和 Cargo。按照屏幕上的说明操作[Rust installation page](https://www.rust-lang.org/tools/install)。mdBook 当前至少需要 Rust 1.46。

**安装 Rust 后，可以使用以下命令，构建和安装 mdBook：**

```shell
cargo install mdbook
```

**报错：**

```shell
error: linker cc not found
|
= note: No such file or directory (os error 2)

error: could not compile proc-macro2 (build script) due to 1 previous error
warning: build failed, waiting for other jobs to finish...
error: could not compile libc (build script) due to 1 previous error
error: could not compile libc (build script) due to 1 previous error
error: failed to compile mdbook v0.4.37, intermediate artifacts can be found at /home/lx/cargo_target.
To reuse those artifacts with a future compilation, set the environment variable CARGO_TARGET_DIR to that path.
lx@lx-TM1701:~
�
�
ℎ
�
echoCARGO_TARGET_DIR
/home/lx/cargo_target
```

**设置了环境变量后依旧报错**

这个错误提示是因为 `cargo install` 命令默认会将编译产生的临时文件放在系统默认的目录中，而该目录可能需要管理员权限才能访问。为了解决这个问题，你可以通过设置 `CARGO_TARGET_DIR` 环境变量来指定一个可写的目录来保存编译产生的临时文件。

你可以按照以下步骤进行操作：

1. 首先，选择一个你有写权限的目录。你可以在你的用户主目录中创建一个新的目录，比如 `~/cargo_target`。
2. 设置 `CARGO_TARGET_DIR` 环境变量，将其指向你选择的目录。你可以在你的 shell 配置文件中添加以下行：

```shell
export CARGO_TARGET_DIR="$HOME/cargo_target"
```

1. 保存并关闭文件。
2. 重新打开一个终端窗口，或者执行以下命令使更改生效：

```
source ~/.bashrc
```

这样，再次运行 `cargo install mdbook` 应该就不会报错了。

**安装依赖：**

```shell
sudo apt update
sudo apt install build-essential
```

解决报错，正常安装`mdbook`

## 新建书籍

新建目录mdbook，在该目录执行

```shell
mdbook init
```

此时会根据`SUMMARY.md`文件生成目录

使用`mdbook watch`可实时监听`SUMMARY.md`文件变化生成目录

## 构建

```shell
mdbook build
```

