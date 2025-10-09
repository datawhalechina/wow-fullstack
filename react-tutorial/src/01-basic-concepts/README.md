# React 基础概念

## 📖 本节概述

本节将介绍 React 的核心概念和基础知识，帮助你理解 React 的设计思想和工作原理。通过本节学习，你将了解什么是 React、为什么使用 React，以及 React 的核心特性。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解什么是 React 以及它解决了什么问题
- ✅ 掌握 React 的核心概念：组件、Props、State
- ✅ 理解声明式编程和命令式编程的区别
- ✅ 了解 Virtual DOM 的工作原理
- ✅ 理解单向数据流的概念
- ✅ 能够创建简单的 React 组件

## 📚 核心知识点

### 1. 什么是 React？

React 是一个用于构建用户界面的 **JavaScript 库**，由 Facebook（现 Meta）开发并维护。它的主要特点：

- **专注于视图层**：React 只关注 UI 的构建，不是一个完整的框架
- **组件化**：将 UI 拆分成独立、可复用的组件
- **声明式**：描述你想要什么，而不是如何实现
- **高效更新**：使用 Virtual DOM 实现高效的 DOM 更新

#### 为什么选择 React？

1. **组件复用**：编写一次，到处使用
2. **开发效率高**：声明式编程，代码更简洁
3. **性能优秀**：Virtual DOM 优化了 DOM 操作
4. **生态丰富**：大量第三方库和工具支持
5. **社区活跃**：庞大的开发者社区，问题容易解决
6. **职业前景**：React 是最受欢迎的前端技术之一

### 2. 核心概念

#### 2.1 组件（Components）

组件是 React 应用的基本构建块，就像乐高积木一样。

**函数组件**（推荐使用）：

```tsx
// 简单的函数组件
const Welcome = () => {
  return <h1>Hello, React!</h1>;
};

// 接收参数的组件
interface Props {
  name: string;
}

const Greeting = ({ name }: Props) => {
  return <h1>Hello, {name}!</h1>;
};
```

**组件的特点**：

- 独立性：每个组件管理自己的状态和逻辑
- 可复用：同一个组件可以在不同地方使用
- 可组合：小组件可以组合成大组件

#### 2.2 Props（属性）

Props 是父组件传递给子组件的数据，类似于函数参数。

```tsx
// 定义 Props 类型
interface UserCardProps {
  name: string;
  age: number;
  role: string;
}

// 使用 Props
const UserCard = ({ name, age, role }: UserCardProps) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>年龄: {age}</p>
      <p>职位: {role}</p>
    </div>
  );
};

// 使用组件并传递 Props
<UserCard name="张三" age={25} role="工程师" />;
```

**Props 的特点**：

- **只读**：子组件不能修改接收到的 props
- **单向数据流**：数据从父组件流向子组件
- **类型安全**：使用 TypeScript 可以定义 props 的类型

#### 2.3 State（状态）

State 是组件内部的数据，当 state 改变时，组件会重新渲染。

```tsx
import { useState } from "react";

const Counter = () => {
  // 声明一个状态变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
};
```

**State 的特点**：

- **可变**：组件可以修改自己的 state
- **触发重渲染**：state 改变会导致组件重新渲染
- **私有**：state 是组件内部的，其他组件无法直接访问

### 3. 声明式 vs 命令式

#### 命令式编程（传统 DOM 操作）

```javascript
// 命令式：告诉浏览器"如何做"
const button = document.createElement("button");
button.textContent = "点击我";
button.onclick = function () {
  const div = document.getElementById("content");
  div.textContent = "你点击了按钮";
  div.style.color = "blue";
};
document.body.appendChild(button);
```

#### 声明式编程（React）

```tsx
// 声明式：告诉 React "要什么"
const [clicked, setClicked] = useState(false);

return (
  <div>
    <button onClick={() => setClicked(true)}>点击我</button>
    {clicked && <div style={{ color: "blue" }}>你点击了按钮</div>}
  </div>
);
```

**声明式的优势**：

- 代码更简洁、更易读
- 更容易理解和维护
- React 自动处理 DOM 更新
- 减少 bug，提高代码质量

### 4. Virtual DOM

React 使用 Virtual DOM 来提高性能。

#### 工作原理：

1. **创建虚拟 DOM**：React 在内存中创建一个虚拟的 DOM 树
2. **状态改变**：当组件状态改变时，创建新的虚拟 DOM 树
3. **Diff 算法**：比较新旧虚拟 DOM，找出差异
4. **批量更新**：只更新实际改变的 DOM 节点

```
State 改变 → 新的 Virtual DOM → Diff 算法 → 最小化 DOM 更新
```

**为什么需要 Virtual DOM？**

- DOM 操作很慢（浏览器重排和重绘成本高）
- Virtual DOM 在内存中，操作很快
- 批量更新减少了实际的 DOM 操作次数
- 使开发者不用关心性能优化

### 5. 单向数据流

React 遵循单向数据流原则：

```
父组件 (props) → 子组件
    ↑              ↓
   state       callback
```

**数据流动规则**：

- 数据从父组件通过 props 传递给子组件
- 子组件通过回调函数通知父组件更新数据
- 数据永远是从上往下流动的

**优势**：

- 数据流向清晰，易于理解
- 便于调试，容易追踪数据来源
- 减少副作用，提高代码可维护性

## 🛠️ 开发环境设置

### 必备工具

1. **Node.js**（版本 16 或更高）

   - 下载地址：https://nodejs.org/
   - 验证安装：`node --version`

2. **代码编辑器**（推荐 VS Code）

   - 下载地址：https://code.visualstudio.com/
   - 推荐插件：
     - ES7+ React/Redux/React-Native snippets
     - Prettier - Code formatter
     - ESLint

3. **浏览器**（推荐 Chrome）
   - React Developer Tools 扩展

### 创建 React 项目

#### 使用 Vite（推荐，快速）

```bash
# 创建项目
npm create vite@latest my-react-app -- --template react-ts

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 使用 Create React App（传统方式）

```bash
npx create-react-app my-app --template typescript
cd my-app
npm start
```

### 项目结构

```
my-react-app/
├── node_modules/     # 依赖包
├── public/           # 静态资源
├── src/              # 源代码
│   ├── App.tsx       # 主组件
│   ├── main.tsx      # 入口文件
│   └── index.css     # 全局样式
├── index.html        # HTML 模板
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript 配置
└── vite.config.ts    # Vite 配置
```

## 📝 实践练习

### 练习 1：创建第一个组件

创建一个简单的欢迎组件：

```tsx
const Welcome = () => {
  return (
    <div>
      <h1>欢迎学习 React!</h1>
      <p>这是我的第一个 React 组件</p>
    </div>
  );
};
```

### 练习 2：使用 Props

创建一个接收名字的问候组件：

```tsx
interface Props {
  name: string;
  age?: number; // 可选属性
}

const Greeting = ({ name, age }: Props) => {
  return (
    <div>
      <h2>你好，{name}!</h2>
      {age && <p>你今年 {age} 岁了</p>}
    </div>
  );
};

// 使用
<Greeting name="张三" age={25} />;
```

### 练习 3：使用 State

创建一个简单的计数器：

```tsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>当前计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount(count - 1)}>减少</button>
      <button onClick={() => setCount(0)}>重置</button>
    </div>
  );
};
```

## ❓ 常见问题

### Q1: React 是框架还是库？

**A:** React 是一个库，不是框架。它只关注 UI 层的构建，不像 Angular 那样提供完整的解决方案。这给了开发者更多的灵活性。

### Q2: 为什么要使用组件？

**A:** 组件化的好处：

- **复用性**：同一个组件可以在多个地方使用
- **可维护性**：每个组件职责单一，易于维护
- **可测试性**：独立的组件更容易测试
- **协作性**：团队成员可以并行开发不同的组件

### Q3: Props 和 State 有什么区别？

**A:** 主要区别：

| 特性     | Props            | State            |
| -------- | ---------------- | ---------------- |
| 来源     | 父组件传递       | 组件内部定义     |
| 是否可变 | 只读，不可修改   | 可以修改         |
| 触发渲染 | Props 改变会触发 | State 改变会触发 |
| 作用域   | 外部控制         | 内部控制         |

### Q4: 什么时候使用 State？

**A:** 以下情况需要使用 State：

- 用户输入（表单、搜索框等）
- UI 状态（模态框开关、tab 切换等）
- 异步数据（从服务器获取的数据）
- 计算结果（需要根据用户操作动态变化的值）

### Q5: Virtual DOM 真的比真实 DOM 快吗？

**A:** 准确地说，Virtual DOM 本身不比真实 DOM 快。它的优势在于：

- **批量更新**：减少了 DOM 操作次数
- **精确更新**：只更新实际改变的部分
- **开发体验**：让开发者不用手动优化 DOM 操作

## 🔗 相关资源

- [React 官方文档（中文）](https://zh-hans.react.dev/)
- [React TypeScript 文档](https://react-typescript-cheatsheet.netlify.app/)
- [Vite 官方文档](https://cn.vitejs.dev/)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **02 - JSX 语法介绍**：深入了解 React 的模板语法
- **03 - 组件与 Props**：深入学习组件设计
- **04 - State 与事件处理**：掌握状态管理和交互

---

**💡 提示**：React 的学习曲线可能一开始有点陡峭，但不要气馁！理解了核心概念后，你会发现 React 的设计非常优雅和强大。多练习、多实践是掌握 React 的关键！
