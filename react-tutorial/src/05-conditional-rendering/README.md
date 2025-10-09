# 条件渲染

## 📖 本节概述

条件渲染是 React 中根据不同条件显示不同内容的技术。它让我们能够创建动态的、响应式的用户界面。本节将介绍多种条件渲染的方法，以及如何选择最合适的方式。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解条件渲染的概念和重要性
- ✅ 掌握 if-else 语句的使用
- ✅ 学会使用三元运算符
- ✅ 掌握逻辑 && 运算符的使用
- ✅ 了解 switch 语句的应用场景
- ✅ 学会使用元素变量
- ✅ 理解如何防止组件渲染
- ✅ 掌握条件渲染的最佳实践

## 📚 核心知识点

### 1. 什么是条件渲染？

条件渲染是指根据某些条件决定渲染什么内容。在 React 中，你可以使用 JavaScript 的所有条件语句。

```tsx
// 简单示例
function Greeting({ isLoggedIn }: Props) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }
  return <h1>Please sign up.</h1>;
}
```

### 2. 条件渲染的方法

#### 2.1 if-else 语句

最直接的方式，适合复杂的条件逻辑。

```tsx
function Component({ user }: Props) {
  if (!user) {
    return <div>Loading...</div>;
  }

  if (user.role === "admin") {
    return <AdminDashboard user={user} />;
  }

  if (user.role === "user") {
    return <UserDashboard user={user} />;
  }

  return <GuestDashboard />;
}

// 在 JSX 内部使用变量
function Component({ status }: Props) {
  let content;

  if (status === "loading") {
    content = <Spinner />;
  } else if (status === "error") {
    content = <ErrorMessage />;
  } else {
    content = <Data />;
  }

  return <div className="container">{content}</div>;
}
```

**优点：**

- 清晰易读
- 适合复杂逻辑
- 可以包含多行代码

**缺点：**

- 不能直接在 JSX 中使用
- 代码可能较冗长

#### 2.2 三元运算符

适合简单的二选一条件。

```tsx
function Component({ isLoggedIn }: Props) {
  return <div>{isLoggedIn ? <LogoutButton /> : <LoginButton />}</div>;
}

// 内联使用
<div className={isActive ? "active" : "inactive"}>
  {isActive ? "激活" : "未激活"}
</div>;

// 嵌套三元运算符（不推荐，难以阅读）
{
  isLoggedIn ? isAdmin ? <AdminPanel /> : <UserPanel /> : <LoginForm />;
}

// 更好的方式：使用 if-else 或提取成函数
function getPanel() {
  if (!isLoggedIn) return <LoginForm />;
  if (isAdmin) return <AdminPanel />;
  return <UserPanel />;
}

return <div>{getPanel()}</div>;
```

**优点：**

- 简洁
- 可以直接在 JSX 中使用
- 适合简单条件

**缺点：**

- 嵌套时难以阅读
- 只能处理二选一

#### 2.3 逻辑 && 运算符

当条件为真时显示内容，为假时不显示。

```tsx
function Component({ showWarning, messageCount }: Props) {
  return (
    <div>
      {/* 条件为真时显示 */}
      {showWarning && <Warning />}

      {/* 条件为真时显示，支持表达式 */}
      {messageCount > 0 && <div>You have {messageCount} new messages</div>}

      {/* 多个条件 */}
      {isLoggedIn && isVerified && <SecureContent />}
    </div>
  );
}
```

**⚠️ 常见陷阱：数字 0**

```tsx
const [count, setCount] = useState(0);

// ❌ 错误 - 当 count 为 0 时会显示 0
{
  count && <div>Count: {count}</div>;
}

// ✅ 正确 - 明确比较
{
  count > 0 && <div>Count: {count}</div>;
}

// ✅ 正确 - 使用 Boolean()
{
  Boolean(count) && <div>Count: {count}</div>;
}

// ✅ 正确 - 使用双感叹号
{
  !!count && <div>Count: {count}</div>;
}
```

**其他假值陷阱：**

```tsx
// 空字符串、null、undefined、NaN 都是假值
{text && <div>{text}</div>}  // text 为 '' 时不显示
{user && <UserCard user={user} />}  // user 为 null 时不显示

// 但在 JSX 中，null 和 undefined 不会渲染任何东西
<div>{null}</div>     // 不显示
<div>{undefined}</div> // 不显示
<div>{false}</div>    // 不显示
<div>{true}</div>     // 不显示
<div>{0}</div>        // 显示 0 ⚠️
<div>{''}</div>       // 不显示
```

**优点：**

- 非常简洁
- 适合单一条件
- 不需要 else 分支

**缺点：**

- 需要注意假值陷阱
- 不适合多分支条件

#### 2.4 switch 语句

适合多个条件分支的情况。

```tsx
function Component({ status }: Props) {
  const renderContent = () => {
    switch (status) {
      case "loading":
        return <Spinner />;
      case "error":
        return <ErrorMessage />;
      case "success":
        return <SuccessData />;
      case "empty":
        return <EmptyState />;
      default:
        return <div>Unknown status</div>;
    }
  };

  return <div className="container">{renderContent()}</div>;
}

// 或者使用对象映射（更简洁）
function Component({ status }: Props) {
  const contentMap = {
    loading: <Spinner />,
    error: <ErrorMessage />,
    success: <SuccessData />,
    empty: <EmptyState />,
  };

  return (
    <div className="container">
      {contentMap[status] || <div>Unknown status</div>}
    </div>
  );
}
```

**优点：**

- 清晰的多分支逻辑
- 易于维护和扩展

**缺点：**

- 代码较长
- 不能直接在 JSX 中使用

#### 2.5 元素变量

将 JSX 保存在变量中，然后根据条件选择。

```tsx
function Component({ language }: Props) {
  let greeting;

  switch (language) {
    case "zh":
      greeting = <div>你好</div>;
      break;
    case "en":
      greeting = <div>Hello</div>;
      break;
    case "es":
      greeting = <div>Hola</div>;
      break;
    default:
      greeting = <div>Hello</div>;
  }

  return <div className="container">{greeting}</div>;
}

// 使用对象字面量（更简洁）
function Component({ language }: Props) {
  const greetings = {
    zh: "你好",
    en: "Hello",
    es: "Hola",
    fr: "Bonjour",
  };

  return (
    <div className="container">
      <div>{greetings[language] || greetings.en}</div>
    </div>
  );
}
```

**优点：**

- 代码组织清晰
- 易于维护
- 可以包含复杂的 JSX

#### 2.6 立即执行函数 (IIFE)

在 JSX 中执行复杂逻辑。

```tsx
function Component({ status, data }: Props) {
  return (
    <div>
      {(() => {
        if (status === "loading") {
          return <Spinner />;
        }

        if (status === "error") {
          return <ErrorMessage />;
        }

        if (data.length === 0) {
          return <EmptyState />;
        }

        return <DataList data={data} />;
      })()}
    </div>
  );
}
```

**优点：**

- 可以在 JSX 中使用复杂逻辑

**缺点：**

- 可读性较差
- 通常有更好的替代方案

### 3. 防止组件渲染

组件可以返回 `null` 来阻止渲染。

```tsx
function Warning({ show }: Props) {
  // 不渲染任何内容
  if (!show) {
    return null;
  }

  return <div className="warning">This is a warning!</div>;
}

// 使用
<Warning show={showWarning} />;

// 在生命周期方法中也有效
function Component({ shouldShow }: Props) {
  if (!shouldShow) {
    return null; // 不渲染，也不会执行后续代码
  }

  // 只有 shouldShow 为 true 时才执行
  useEffect(() => {
    console.log("Component mounted");
  }, []);

  return <div>Content</div>;
}
```

**注意：**

- 返回 `null` 会完全阻止渲染
- 组件的生命周期方法仍会执行（如 useEffect）
- 不同于 `{false}`，返回 null 更明确

### 4. 条件样式

```tsx
function Component({ isActive, theme }: Props) {
  return (
    <div>
      {/* 条件类名 */}
      <div className={isActive ? "active" : "inactive"}>Status</div>
      {/* 多个条件类名 */}
      <div
        className={`base ${isActive ? "active" : ""} ${
          theme === "dark" ? "dark" : "light"
        }`}
      >
        Content
      </div>
      {/* 条件内联样式 */}
      <div
        style={{
          color: isActive ? "green" : "gray",
          fontWeight: isActive ? "bold" : "normal",
          backgroundColor: theme === "dark" ? "#333" : "#fff",
        }}
      >
        Text
      </div>
      {/* 使用 classnames 库（推荐） */}
      import classNames from 'classnames'
      <div
        className={classNames({
          base: true,
          active: isActive,
          disabled: !isEnabled,
          dark: theme === "dark",
        })}
      >
        Content
      </div>
    </div>
  );
}
```

### 5. 高级模式

#### 5.1 渲染 Props

```tsx
interface Props {
  render: (data: Data) => React.ReactNode;
}

function DataProvider({ render }: Props) {
  const [data, setData] = useState<Data>();

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  if (!data) {
    return <Spinner />;
  }

  return <>{render(data)}</>;
}

// 使用
<DataProvider
  render={(data) => (
    <div>
      {data.items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )}
/>;
```

#### 5.2 组件作为 Props

```tsx
interface Props {
  icon: React.ComponentType
  fallback?: React.ReactNode
}

function Card({ icon: Icon, fallback }: Props) {
  return (
    <div className="card">
      {Icon ? <Icon /> : fallback}
    </div>
  )
}

// 使用
<Card icon={CheckIcon} />
<Card fallback={<Spinner />} />
```

## 📝 最佳实践

### 1. 选择合适的方法

```tsx
// ✅ 简单二选一 - 使用三元运算符
{
  isLoggedIn ? <Dashboard /> : <Login />;
}

// ✅ 单一条件 - 使用 &&
{
  showMessage && <Message />;
}

// ✅ 多个分支 - 使用 if-else 或 switch
function getContent() {
  if (status === "loading") return <Spinner />;
  if (status === "error") return <Error />;
  return <Content />;
}

// ✅ 复杂逻辑 - 提取成函数
function renderUserCard() {
  if (!user) return null;

  const { name, role, permissions } = user;

  if (!permissions.includes("view")) {
    return <AccessDenied />;
  }

  return <UserCard name={name} role={role} actions={getActions(role)} />;
}

return <div>{renderUserCard()}</div>;
```

### 2. 避免过度嵌套

```tsx
// ❌ 过度嵌套
{
  isLoggedIn ? (
    hasPermission ? (
      data ? (
        data.length > 0 ? (
          <DataList data={data} />
        ) : (
          <EmptyState />
        )
      ) : (
        <Loading />
      )
    ) : (
      <NoPermission />
    )
  ) : (
    <Login />
  );
}

// ✅ 提取成函数，使用早返回
function renderContent() {
  if (!isLoggedIn) return <Login />;
  if (!hasPermission) return <NoPermission />;
  if (!data) return <Loading />;
  if (data.length === 0) return <EmptyState />;
  return <DataList data={data} />;
}

return <div>{renderContent()}</div>;
```

### 3. 处理加载和错误状态

```tsx
function Component() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // 渲染不同状态
  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "error") {
    return <ErrorMessage error={error} />;
  }

  if (status === "success" && data) {
    return <DataView data={data} />;
  }

  return <button onClick={fetchData}>Load Data</button>;
}

// 或使用状态机
type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; error: Error };

function Component() {
  const [state, setState] = useState<State>({ status: "idle" });

  switch (state.status) {
    case "idle":
      return <button onClick={fetchData}>Load</button>;
    case "loading":
      return <Spinner />;
    case "success":
      return <DataView data={state.data} />;
    case "error":
      return <ErrorMessage error={state.error} />;
  }
}
```

### 4. 可读性优先

```tsx
// ✅ 使用描述性变量名
const hasUnreadMessages = messages.filter((m) => !m.read).length > 0;
const canEditPost = user.role === "admin" || post.authorId === user.id;
const shouldShowWelcome = isFirstVisit && !hasCompletedTutorial;

return (
  <div>
    {hasUnreadMessages && <MessageNotification />}
    {canEditPost && <EditButton />}
    {shouldShowWelcome && <WelcomeModal />}
  </div>
);

// ❌ 内联复杂条件
return (
  <div>
    {messages.filter((m) => !m.read).length > 0 && <MessageNotification />}
    {(user.role === "admin" || post.authorId === user.id) && <EditButton />}
  </div>
);
```

## ❓ 常见问题

### Q1: && 运算符和三元运算符该如何选择？

**A:**

- **单一条件，只有"显示"**：使用 `&&`
- **二选一（显示 A 或 显示 B）**：使用三元运算符

```tsx
{
  showMessage && <Message />;
} // 只有"显示"
{
  isLoggedIn ? <Dashboard /> : <Login />;
} // 二选一
```

### Q2: 为什么不能在 JSX 中直接使用 if 语句？

**A:** JSX 表达式必须有一个确定的值。if 语句是语句，不是表达式，没有返回值。可以使用：

- 三元运算符（表达式）
- && 运算符（表达式）
- 立即执行函数
- 在 JSX 外使用 if 语句

### Q3: 返回 null 和不渲染有什么区别？

**A:**

```tsx
// 返回 null - 组件存在但不渲染
function Component({ show }: Props) {
  if (!show) return null;
  return <div>Content</div>;
}

// 不渲染 - 组件不存在
{
  show && <Component />;
}
```

主要区别：

- 返回 null 时，组件的 Hook 仍会执行
- 条件渲染时，组件完全不存在

### Q4: 如何避免条件渲染中的性能问题？

**A:**

- 避免在列表中使用内联条件函数
- 使用 `React.memo` 缓存组件
- 将条件逻辑提取到组件外部

```tsx
// ❌ 每次都创建新函数
{
  items.map((item) => {
    const Component = getComponent(item.type);
    return <Component key={item.id} item={item} />;
  });
}

// ✅ 提取逻辑
const renderItem = (item) => {
  const Component = getComponent(item.type);
  return <Component key={item.id} item={item} />;
};

{
  items.map(renderItem);
}
```

## 🔗 相关资源

- [React 条件渲染文档](https://zh-hans.react.dev/learn/conditional-rendering)
- [JavaScript 逻辑运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Logical_AND)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **06 - 列表与 Keys**：深入理解列表渲染
- **07 - 表单与输入**：掌握表单处理
- **08 - 生命周期与副作用**：学习 useEffect Hook

---

**💡 提示**：条件渲染是构建动态 UI 的基础。选择合适的方法，保持代码清晰易读，是优秀 React 开发者的重要标志！
