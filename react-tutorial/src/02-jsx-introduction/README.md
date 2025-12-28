# JSX 语法介绍

## 📖 本节概述

JSX（JavaScript XML）是 React 中用于描述用户界面的语法扩展。它允许你在 JavaScript 代码中编写类似 HTML 的标记，使得代码更加直观和易读。本节通过**6 个交互式演示**和**丰富的代码示例**，帮助你全面掌握 JSX 的核心概念。

## ✨ 本节特色

- 🎨 **视觉优化**：全新的配色方案和布局设计
- 🎮 **交互丰富**：6 个可操作的实时演示
- 📝 **代码清晰**：重构的代码结构，更易理解
- 💡 **实用示例**：贴近真实开发场景的案例

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解 JSX 是什么以及它的优势
- ✅ 掌握 JSX 的基本语法规则和命名约定
- ✅ 学会在 JSX 中嵌入 JavaScript 表达式
- ✅ 掌握条件渲染的三种方式（三元、&&、if）
- ✅ 学会使用 map() 渲染列表并理解 key 的重要性
- ✅ 理解 JSX 中的动态样式处理
- ✅ 掌握多种事件处理方法
- ✅ 了解 Fragment 的使用场景
- ✅ 了解 JSX 的编译原理

## 🎮 交互式演示模块

本节包含 6 个精心设计的交互式演示：

### 1️⃣ 表达式嵌入演示

- 变量嵌入：直接在 JSX 中使用变量
- 表达式计算：在 JSX 中进行数学运算
- 函数调用：调用函数并显示结果
- 三元运算符：条件表达式的使用

### 2️⃣ 条件渲染演示

- 三元运算符 ( ? : )：两种情况的选择
- 逻辑 && 运算符：单一条件的显示/隐藏
- 嵌套条件：多层条件判断
- 实时交互：切换登录状态、用户角色

### 3️⃣ 列表渲染演示

- 任务列表：可点击切换完成状态
- 商品列表：带条件样式的复杂列表
- 优先级标记：动态颜色显示
- 库存状态：根据库存量改变样式

### 4️⃣ 样式处理演示

- 字体大小控制：实时调整字体
- 边框圆角控制：动态改变圆角
- 颜色选择器：自定义主题色
- 深色/浅色模式切换

### 5️⃣ 事件处理演示

- 点击事件：获取事件坐标
- 双击事件：双击触发
- 输入事件：实时获取输入内容
- 键盘事件：捕获按键信息
- 鼠标移动：跟踪鼠标位置
- 焦点事件：onFocus 和 onBlur

### 6️⃣ Fragment 演示

- Fragment 短语法 (<>...</>)
- Fragment 完整语法（带 key）
- 避免额外 DOM 节点的最佳实践

## 📚 核心知识点

### 1. 什么是 JSX？

JSX（JavaScript XML）是 JavaScript 的语法扩展，它让你可以在 JavaScript 中编写类似 HTML 的代码。

#### 为什么使用 JSX？

```tsx
// 不使用 JSX（纯 React API）
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, ",
  React.createElement("span", null, "World")
);

// 使用 JSX（更直观）
const element = (
  <h1 className="greeting">
    Hello, <span>World</span>
  </h1>
);
```

**JSX 的优势：**

- **直观**：看起来像 HTML，容易理解
- **强大**：可以嵌入任何 JavaScript 表达式
- **类型安全**：配合 TypeScript 提供完整的类型检查
- **防止注入攻击**：自动转义内容，防止 XSS 攻击

### 2. JSX 基本语法

#### 2.1 表达式嵌入

使用 `{}` 在 JSX 中嵌入 JavaScript 表达式：

```tsx
const name = "张三";
const age = 25;

const element = (
  <div>
    <h1>你好，{name}!</h1>
    <p>你今年 {age} 岁了</p>
    <p>明年你 {age + 1} 岁</p>
    <p>当前时间: {new Date().toLocaleTimeString()}</p>
  </div>
);
```

**可以嵌入的表达式：**

- 变量：`{name}`
- 运算：`{1 + 2}`
- 函数调用：`{getName()}`
- 三元运算符：`{isLoggedIn ? 'Welcome' : 'Login'}`
- 逻辑运算：`{showMessage && <div>Message</div>}`
- 数组方法：`{items.map(item => <div key={item.id}>{item.name}</div>)}`

**不能嵌入的内容：**

- 对象（除了 React 元素）：`{user}` ❌
- if 语句：`{if (condition) { ... }}` ❌
- for 循环：`{for (let i = 0; i < 10; i++) { ... }}` ❌

#### 2.2 JSX 也是表达式

编译后的 JSX 是普通的 JavaScript 对象，可以：

```tsx
// 赋值给变量
const element = <h1>Hello!</h1>;

// 从函数返回
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {user.name}!</h1>;
  }
  return <h1>Hello, Stranger!</h1>;
}

// 作为参数传递
renderElement(<h1>Hello!</h1>);

// 存储在数组中
const elements = [<h1 key="1">First</h1>, <h2 key="2">Second</h2>];
```

#### 2.3 属性

JSX 中的属性使用驼峰命名法：

```tsx
// HTML 属性 → JSX 属性
<div class="container">           // HTML
<div className="container">       // JSX

<label for="name">                // HTML
<label htmlFor="name">            // JSX

<button onclick="handleClick()">  // HTML
<button onClick={handleClick}>    // JSX

<input type="text" value="hello" readonly>  // HTML
<input type="text" value="hello" readOnly /> // JSX
```

**常见属性对照表：**

| HTML        | JSX         |
| ----------- | ----------- |
| class       | className   |
| for         | htmlFor     |
| tabindex    | tabIndex    |
| onclick     | onClick     |
| onchange    | onChange    |
| readonly    | readOnly    |
| maxlength   | maxLength   |
| cellpadding | cellPadding |
| cellspacing | cellSpacing |

**属性值类型：**

```tsx
// 字符串
<div className="container" id="main" />

// 数字（不用引号）
<input type="number" min={0} max={100} />

// 布尔值
<input type="checkbox" checked={true} disabled />

// 对象
<div style={{ color: 'red', fontSize: '16px' }} />

// 数组
<select>
  {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
</select>

// 函数
<button onClick={handleClick}>Click</button>
<button onClick={(e) => console.log(e)}>Click</button>
```

#### 2.4 子元素

JSX 标签可以包含子元素：

```tsx
// 文本子元素
<div>Hello World</div>

// 元素子元素
<div>
  <h1>Title</h1>
  <p>Content</p>
</div>

// 混合子元素
<div>
  <h1>Title</h1>
  Some text
  <p>Paragraph</p>
</div>

// 表达式子元素
<div>
  {user.name}
  {isLoggedIn && <p>Welcome back!</p>}
</div>

// 数组子元素
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
```

### 3. JSX 规则

#### 3.1 必须有一个根元素

```tsx
// ❌ 错误 - 多个根元素
return (
  <h1>Title</h1>
  <p>Content</p>
)

// ✅ 正确 - 使用 div 包装
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
)

// ✅ 更好 - 使用 Fragment（不会创建额外的 DOM 节点）
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)

// 完整写法
return (
  <React.Fragment>
    <h1>Title</h1>
    <p>Content</p>
  </React.Fragment>
)

// Fragment 可以有 key 属性（在列表中使用）
return items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.description}</dd>
  </React.Fragment>
))
```

#### 3.2 标签必须闭合

```tsx
// ❌ 错误 - 未闭合
<img src="image.jpg">
<input type="text">
<br>

// ✅ 正确 - 自闭合
<img src="image.jpg" />
<input type="text" />
<br />
```

#### 3.3 使用驼峰命名

```tsx
// ✅ 事件处理器
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit} />

// ✅ 样式属性
<div style={{
  backgroundColor: 'blue',
  fontSize: '16px',
  marginTop: '10px'
}} />

// ✅ 其他属性
<input maxLength={10} tabIndex={1} />
```

### 4. 条件渲染

#### 4.1 if-else 语句

```tsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  } else {
    return <h1>Please sign up.</h1>;
  }
}
```

#### 4.2 三元运算符

```tsx
// 简单条件
<div>
  {isLoggedIn ? <LogoutButton /> : <LoginButton />}
</div>

// 内联样式
<div style={{ color: isActive ? 'green' : 'gray' }}>
  {isActive ? 'Active' : 'Inactive'}
</div>

// 嵌套（不推荐，可读性差）
{isLoggedIn ? (
  isAdmin ? <AdminPanel /> : <UserPanel />
) : (
  <LoginForm />
)}
```

#### 4.3 逻辑 && 运算符

```tsx
// 条件为真时显示
{
  showWarning && <Warning />;
}
{
  messageCount > 0 && <div>You have {messageCount} messages</div>;
}

// ⚠️ 注意：避免使用数字 0 作为条件
{
  count && <div>Count: {count}</div>;
} // ❌ count为0时会显示0
{
  count > 0 && <div>Count: {count}</div>;
} // ✅ 正确
```

#### 4.4 防止渲染

```tsx
function Warning({ show }) {
  // 返回 null 不会渲染任何内容
  if (!show) {
    return null;
  }

  return <div>Warning!</div>;
}
```

### 5. 列表渲染

#### 5.1 使用 map()

```tsx
const numbers = [1, 2, 3, 4, 5];

const listItems = numbers.map((number) => <li key={number}>{number}</li>);

return <ul>{listItems}</ul>;

// 或者内联写法
return (
  <ul>
    {numbers.map((number) => (
      <li key={number}>{number}</li>
    ))}
  </ul>
);
```

#### 5.2 key 的重要性

```tsx
// ✅ 好的 key - 使用稳定的 ID
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ⚠️ 可接受 - 使用索引（仅当列表不会重新排序时）
{
  items.map((item, index) => <div key={index}>{item}</div>);
}

// ❌ 不好 - 使用随机值
{
  items.map((item) => (
    <div key={Math.random()}>{item}</div> // 每次都会重新创建
  ));
}
```

**key 的作用：**

- 帮助 React 识别哪些元素改变了
- 提高列表渲染性能
- 必须在兄弟元素中唯一（不需要全局唯一）

#### 5.3 复杂列表

```tsx
const users = [
  { id: 1, name: "张三", role: "admin" },
  { id: 2, name: "李四", role: "user" },
  { id: 3, name: "王五", role: "user" },
];

return (
  <div>
    {users.map((user) => (
      <div key={user.id}>
        <h3>{user.name}</h3>
        <p>Role: {user.role}</p>
        {user.role === "admin" && <span>⭐ Admin</span>}
      </div>
    ))}
  </div>
);
```

### 6. 样式处理

#### 6.1 内联样式

```tsx
// 对象写法（推荐）
const divStyle = {
  color: 'blue',
  backgroundColor: 'lightgray',
  fontSize: '16px',
  padding: '10px'
}

<div style={divStyle}>Hello</div>

// 内联对象
<div style={{
  color: 'red',
  fontSize: '20px',
  marginTop: '10px'  // 驼峰命名
}}>
  Hello
</div>

// 动态样式
<div style={{
  color: isActive ? 'green' : 'gray',
  fontWeight: isImportant ? 'bold' : 'normal'
}}>
  Text
</div>
```

**注意事项：**

- 属性名使用驼峰命名：`backgroundColor` 而不是 `background-color`
- 数值自动添加 `px`：`fontSize: 16` → `font-size: 16px`
- 其他单位需要字符串：`width: '50%'`

#### 6.2 CSS 类名

```tsx
// 静态类名
<div className="container">Content</div>

// 动态类名
<div className={isActive ? 'active' : 'inactive'}>Item</div>

// 组合类名
<div className={`base-class ${isActive ? 'active' : ''}`}>Item</div>

// 条件类名
<div className={`item ${isSelected && 'selected'} ${isDisabled && 'disabled'}`}>
  Item
</div>
```

### 7. 事件处理

#### 7.1 基本事件处理

```tsx
function handleClick() {
  console.log('Clicked!')
}

<button onClick={handleClick}>Click</button>

// 箭头函数（创建新函数）
<button onClick={() => console.log('Clicked!')}>Click</button>
```

#### 7.2 传递参数

```tsx
// 方法 1：箭头函数
<button onClick={(e) => handleClick(id, e)}>Delete</button>

// 方法 2：bind（不推荐）
<button onClick={handleClick.bind(this, id)}>Delete</button>

// 完整示例
function handleClick(id: number, e: React.MouseEvent) {
  e.preventDefault()
  console.log('Delete item:', id)
}

<button onClick={(e) => handleClick(item.id, e)}>
  Delete
</button>
```

#### 7.3 事件对象

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value)
}

function handleSubmit(e: React.FormEvent) {
  e.preventDefault()  // 阻止默认行为
  console.log('Form submitted')
}

<input onChange={handleChange} />
<form onSubmit={handleSubmit}>...</form>
```

#### 7.4 常用事件类型

```tsx
// 鼠标事件
onClick;
onDoubleClick;
onMouseEnter;
onMouseLeave;
onMouseMove;

// 键盘事件
onKeyDown;
onKeyUp;
onKeyPress;

// 表单事件
onChange;
onSubmit;
onFocus;
onBlur;

// 其他事件
onScroll;
onLoad;
onError;
```

### 8. JSX 编译

JSX 会被 Babel 编译成 `React.createElement()` 调用：

```tsx
// JSX
const element = (
  <h1 className="greeting" style={{ color: "red" }}>
    Hello, {name}!
  </h1>
);

// 编译后
const element = React.createElement(
  "h1",
  {
    className: "greeting",
    style: { color: "red" },
  },
  "Hello, ",
  name,
  "!"
);

// 最终创建的对象（简化版）
const element = {
  type: "h1",
  props: {
    className: "greeting",
    style: { color: "red" },
    children: ["Hello, ", name, "!"],
  },
};
```

## 📝 最佳实践

### 1. 代码组织

```tsx
// ✅ 好的做法
function UserCard({ user }: Props) {
  // 提取复杂逻辑到函数
  const getStatusColor = () => {
    return user.isActive ? "green" : "gray";
  };

  // 提取复杂 JSX 到变量
  const userInfo = (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );

  return (
    <div style={{ borderColor: getStatusColor() }}>
      {userInfo}
      <button onClick={() => handleEdit(user.id)}>Edit</button>
    </div>
  );
}
```

### 2. 条件渲染

```tsx
// ✅ 清晰的条件渲染
function Component({ status }: Props) {
  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return <Error />;
  }

  return <Content />;
}

// ❌ 避免过度嵌套
{
  condition1 ? condition2 ? condition3 ? <A /> : <B /> : <C /> : <D />;
}
```

### 3. 列表渲染

```tsx
// ✅ 使用稳定的 key
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ✅ 空列表处理
{
  users.length > 0 ? (
    users.map((user) => <UserCard key={user.id} user={user} />)
  ) : (
    <EmptyState />
  );
}
```

## ❓ 常见问题

### Q1: JSX 是必需的吗？

**A:** 不是必需的，但强烈推荐。你可以使用 `React.createElement()`，但 JSX 更直观易读。

### Q2: 为什么要使用 className 而不是 class？

**A:** 因为 `class` 是 JavaScript 的保留字。JSX 最终会转换成 JavaScript，所以要避免使用保留字。

### Q3: 为什么列表渲染需要 key？

**A:** key 帮助 React 识别哪些元素改变了，提高性能和避免 bug。没有 key 时，React 会发出警告。

### Q4: 可以在 JSX 中使用 if 语句吗？

**A:** 不能直接使用。可以使用三元运算符、逻辑 &&，或在 JSX 外使用 if 语句。

### Q5: 样式对象的属性为什么用驼峰命名？

**A:** 因为 JSX 编译后是 JavaScript 对象，JavaScript 对象的属性使用驼峰命名。

## 🔗 相关资源

- [React JSX 官方文档](https://zh-hans.react.dev/learn/writing-markup-with-jsx)
- [JSX In Depth](https://zh-hans.react.dev/learn/javascript-in-jsx-with-curly-braces)
- [Babel REPL](https://babeljs.io/repl) - 查看 JSX 编译结果

## 🆕 本次优化内容

### 代码优化

- ✨ **样式系统重构**：提取公共样式到 `styles` 对象，减少代码重复
- 🎨 **视觉升级**：全新的配色方案和渐变效果
- 📦 **组件结构优化**：将演示分为 6 个独立的功能模块
- 💪 **TypeScript 增强**：更严格的类型定义和 CSSProperties 类型

### 交互增强

- 🖱️ **鼠标追踪**：添加鼠标位置实时跟踪演示
- ⌨️ **键盘事件**：新增键盘按键捕获演示
- 🎯 **焦点管理**：展示 onFocus 和 onBlur 事件
- ✅ **任务切换**：可点击的任务完成状态切换
- 🎨 **颜色选择器**：实时调整主题颜色

### 新增功能

- 🔷 **Fragment 演示**：展示如何避免额外 DOM 节点
- 📊 **实时状态显示**：点击次数、按键、鼠标位置统计
- 💡 **代码提示**：每个演示都配有相应的代码示例
- 📝 **详细说明**：为每个概念添加了清晰的解释

### 用户体验

- 🎮 **更多交互**：从 5 个演示增加到 6 个
- 📱 **响应式布局**：使用 Grid 自适应布局
- 🌈 **视觉反馈**：按钮悬停、过渡动画等
- 📚 **学习路径清晰**：从基础到进阶的递进式设计

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **03 - 组件与 Props**：深入学习组件设计和 Props 传递
- **04 - State 与事件处理**：掌握状态管理
- **05 - 条件渲染**：深入学习各种渲染技巧

---

**💡 提示**：JSX 看起来像 HTML，但实际上是 JavaScript。理解这一点对掌握 React 非常重要！通过本节的交互式演示，你可以实时看到 JSX 的强大之处。多练习，多实验，很快你就会熟练使用 JSX！

**🎯 练习建议**：

1. 尝试修改演示中的代码，观察变化
2. 创建自己的列表渲染案例
3. 实现一个带有条件渲染的小组件
4. 练习使用不同的事件处理器
