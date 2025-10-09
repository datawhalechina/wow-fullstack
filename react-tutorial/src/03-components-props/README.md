# 组件与 Props

## 📖 本节概述

组件是 React 的核心概念，它让你可以将 UI 拆分成独立、可复用的部分。Props 是组件之间传递数据的方式。本节将深入介绍组件的设计、Props 的使用、组件组合等重要概念。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解组件的概念和作用
- ✅ 掌握函数组件的编写方法
- ✅ 学会使用 TypeScript 定义 Props 类型
- ✅ 理解 Props 的单向数据流
- ✅ 掌握组件组合的技巧
- ✅ 学会使用 children prop
- ✅ 理解 Props 的默认值和可选属性
- ✅ 掌握回调函数作为 Props 的使用

## 📚 核心知识点

### 1. 什么是组件？

组件是 React 应用的基本构建块，就像乐高积木一样，可以组合成复杂的用户界面。

#### 组件的特点

- **独立性**：每个组件有自己的逻辑和状态
- **可复用**：同一个组件可以在不同地方使用
- **可组合**：小组件可以组合成大组件
- **封装性**：组件封装了实现细节

#### 函数组件 vs 类组件

```tsx
// 函数组件（推荐，现代 React）
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 等价的箭头函数写法
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 类组件（传统方式，不推荐）
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**为什么推荐函数组件？**

- 代码更简洁
- 更容易理解和测试
- 可以使用 Hooks
- 性能略好

### 2. Props（属性）

Props（properties 的缩写）是组件的输入，类似于函数参数。

#### 2.1 基本使用

```tsx
// 定义组件
interface GreetingProps {
  name: string
}

const Greeting = ({ name }: GreetingProps) => {
  return <h1>Hello, {name}!</h1>
}

// 使用组件
<Greeting name="Alice" />
<Greeting name="Bob" />
```

#### 2.2 Props 类型定义

```tsx
// 基本类型
interface Props {
  // 字符串
  name: string;

  // 数字
  age: number;

  // 布尔值
  isActive: boolean;

  // 可选属性
  email?: string;

  // 数组
  tags: string[];

  // 对象
  user: {
    id: number;
    name: string;
  };

  // 函数
  onClick: () => void;
  onChange: (value: string) => void;

  // React 元素
  icon: React.ReactNode;

  // 子元素
  children: React.ReactNode;
}
```

#### 2.3 Props 解构

```tsx
// 方法 1：直接解构（推荐）
const UserCard = ({ name, age, email }: Props) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
};

// 方法 2：使用 props 对象
const UserCard = (props: Props) => {
  return (
    <div>
      <h3>{props.name}</h3>
      <p>Age: {props.age}</p>
      {props.email && <p>Email: {props.email}</p>}
    </div>
  );
};

// 方法 3：部分解构
const UserCard = ({ name, ...rest }: Props) => {
  return (
    <div>
      <h3>{name}</h3>
      {/* rest 包含其他所有 props */}
    </div>
  );
};
```

#### 2.4 默认值

```tsx
// 方法 1：在参数中设置默认值（推荐）
interface ButtonProps {
  text: string
  color?: string
  size?: 'small' | 'medium' | 'large'
}

const Button = ({
  text,
  color = 'blue',  // 默认值
  size = 'medium'  // 默认值
}: ButtonProps) => {
  return <button>{text}</button>
}

// 使用
<Button text="Click" />  // 使用默认的 color 和 size
<Button text="Click" color="red" size="large" />  // 覆盖默认值

// 方法 2：使用 defaultProps（旧方式，不推荐）
Button.defaultProps = {
  color: 'blue',
  size: 'medium'
}
```

### 3. Props 的重要特性

#### 3.1 Props 是只读的

```tsx
// ❌ 错误 - 不能修改 props
const Greeting = ({ name }: Props) => {
  name = "New Name"; // 错误！
  return <h1>Hello, {name}</h1>;
};

// ✅ 正确 - 需要修改时使用 state
const Greeting = ({ initialName }: Props) => {
  const [name, setName] = useState(initialName);

  return (
    <div>
      <h1>Hello, {name}</h1>
      <button onClick={() => setName("New Name")}>Change Name</button>
    </div>
  );
};
```

**为什么 Props 是只读的？**

- 保证数据流向清晰（单向数据流）
- 使组件更可预测
- 便于调试和测试

#### 3.2 单向数据流

```
父组件 ──props──> 子组件
   ↑               │
   │             事件
   └──callback───┘
```

```tsx
// 父组件
const Parent = () => {
  const [count, setCount] = useState(0);

  return (
    <Child
      count={count} // 向下传递数据
      onIncrement={() => setCount(count + 1)} // 向上传递回调
    />
  );
};

// 子组件
interface ChildProps {
  count: number;
  onIncrement: () => void;
}

const Child = ({ count, onIncrement }: ChildProps) => {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
};
```

### 4. Children Prop

`children` 是一个特殊的 prop，代表组件开始和结束标签之间的内容。

#### 4.1 基本使用

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
};

// 使用
<Card title="My Card">
  <p>This is the content</p>
  <button>Click me</button>
</Card>;
```

#### 4.2 Children 的类型

```tsx
// 任何可渲染的内容
children: React.ReactNode;

// 单个元素
children: React.ReactElement;

// 字符串
children: string;

// 数字
children: number;

// 函数（render prop 模式）
children: (data: Data) => React.ReactNode;
```

#### 4.3 组件组合

```tsx
// 容器组件
const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="container">{children}</div>;
};

const Row = ({ children }: { children: React.ReactNode }) => {
  return <div className="row">{children}</div>;
};

const Column = ({ children }: { children: React.ReactNode }) => {
  return <div className="column">{children}</div>;
};

// 使用组合
<Container>
  <Row>
    <Column>Content 1</Column>
    <Column>Content 2</Column>
  </Row>
  <Row>
    <Column>Content 3</Column>
  </Row>
</Container>;
```

### 5. 回调函数作为 Props

子组件通过调用父组件传递的回调函数来与父组件通信。

#### 5.1 基本示例

```tsx
// 父组件
const Parent = () => {
  const [message, setMessage] = useState("");

  const handleButtonClick = (buttonName: string) => {
    setMessage(`You clicked ${buttonName}`);
  };

  return (
    <div>
      <p>{message}</p>
      <ChildButton name="Button 1" onClick={handleButtonClick} />
      <ChildButton name="Button 2" onClick={handleButtonClick} />
    </div>
  );
};

// 子组件
interface ButtonProps {
  name: string;
  onClick: (name: string) => void;
}

const ChildButton = ({ name, onClick }: ButtonProps) => {
  return <button onClick={() => onClick(name)}>{name}</button>;
};
```

#### 5.2 事件对象传递

```tsx
interface InputProps {
  value: string
  onChange: (value: string) => void
}

const Input = ({ value, onChange }: InputProps) => {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

// 使用
const [text, setText] = useState('')
<Input value={text} onChange={setText} />
```

### 6. Props 传递技巧

#### 6.1 展开运算符

```tsx
const user = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
}

// 方法 1：逐个传递
<UserCard name={user.name} age={user.age} email={user.email} />

// 方法 2：使用展开运算符（推荐）
<UserCard {...user} />

// 方法 3：混合使用
<UserCard {...user} isActive={true} />
```

#### 6.2 Props 转发

```tsx
interface ButtonProps {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

// 转发原生 button 的所有属性
const Button = ({
  variant,
  children,
  ...rest
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={variant} {...rest}>
      {children}
    </button>
  );
};

// 现在可以使用原生 button 的所有属性
<Button variant="primary" onClick={handleClick} disabled>
  Click me
</Button>;
```

#### 6.3 条件 Props

```tsx
interface Props {
  name: string
  age?: number
}

const UserCard = ({ name, age }: Props) => {
  return (
    <div>
      <h3>{name}</h3>
      {/* 只在 age 存在时渲染 */}
      {age !== undefined && <p>Age: {age}</p>}
    </div>
  )
}

// 使用
<UserCard name="Alice" />  // 不显示年龄
<UserCard name="Bob" age={25} />  // 显示年龄
```

## 📝 最佳实践

### 1. Props 类型定义

```tsx
// ✅ 好的做法 - 使用 interface
interface UserCardProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// ✅ 也可以使用 type
type ButtonProps = {
  variant: "primary" | "secondary";
  size: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: () => void;
};
```

### 2. 组件设计原则

```tsx
// ✅ 单一职责 - 组件只做一件事
const UserAvatar = ({ url, alt }: Props) => {
  return <img src={url} alt={alt} className="avatar" />;
};

const UserName = ({ name }: Props) => {
  return <h3>{name}</h3>;
};

// 组合使用
const UserCard = ({ user }: Props) => {
  return (
    <div>
      <UserAvatar url={user.avatar} alt={user.name} />
      <UserName name={user.name} />
    </div>
  );
};

// ❌ 避免 - 组件做太多事情
const UserCard = ({ user, posts, comments, ...manyOtherThings }: Props) => {
  // 过于复杂
};
```

### 3. Props 验证

```tsx
// 使用 TypeScript 的类型系统
interface Props {
  // 必需属性
  name: string;
  age: number;

  // 可选属性
  email?: string;

  // 联合类型
  status: "active" | "inactive" | "pending";

  // 函数签名
  onClick: (id: number) => void;
}

// TypeScript 会在编译时检查类型
<UserCard
  name="Alice"
  age={25}
  status="active"
  onClick={(id) => console.log(id)}
/>;
```

### 4. 避免 Props 钻取

当需要将 props 传递多层时，考虑使用：

```tsx
// ❌ Props 钻取（Prop Drilling）
<GrandParent user={user}>
  <Parent user={user}>
    <Child user={user}>
      <GrandChild user={user} />
    </Child>
  </Parent>
</GrandParent>

// ✅ 使用 Context（后续章节会学习）
// 或者重新设计组件结构
```

## ❓ 常见问题

### Q1: Props 和 State 有什么区别？

**A:**
| 特性 | Props | State |
|------|-------|-------|
| 来源 | 从父组件传递 | 组件内部定义 |
| 可变性 | 只读，不可修改 | 可以修改 |
| 谁控制 | 父组件 | 组件自己 |
| 用途 | 组件间通信 | 组件内部数据 |

### Q2: 如何在子组件中修改父组件的数据？

**A:** 通过回调函数：

```tsx
// 父组件传递回调函数
<Child onChange={(value) => setParentState(value)} />

// 子组件调用回调函数
<input onChange={(e) => props.onChange(e.target.value)} />
```

### Q3: 什么时候使用 children？

**A:** 当你想要创建可复用的容器组件时：

- 布局组件（Container, Card, Modal）
- 包装组件（可以包含任意内容）
- 高阶组件

### Q4: Props 可以传递任何类型的数据吗？

**A:** 是的，可以传递：

- 基本类型（string, number, boolean）
- 对象和数组
- 函数
- React 元素
- 甚至其他组件

### Q5: 如何处理可选的 Props？

**A:** 使用可选属性和默认值：

```tsx
interface Props {
  name: string;
  age?: number; // 可选
}

const Component = ({ name, age = 18 }: Props) => {
  // age 如果没传，默认是 18
};
```

## 🔗 相关资源

- [React 组件文档](https://zh-hans.react.dev/learn/passing-props-to-a-component)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **04 - State 与事件处理**：学习组件内部状态管理
- **05 - 条件渲染**：掌握各种条件渲染技巧
- **06 - 列表与 Keys**：深入理解列表渲染

---

**💡 提示**：理解组件和 Props 是掌握 React 的关键。多练习组件设计，思考如何将 UI 拆分成合理的组件结构！
