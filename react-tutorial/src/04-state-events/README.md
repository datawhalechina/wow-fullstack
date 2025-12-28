# State 与事件处理

## 📖 本节概述

State（状态）是组件的内部数据，它决定了组件在不同时刻的表现。事件处理让用户可以与应用交互。本节将深入介绍如何使用 `useState` Hook 管理状态，以及如何处理各种用户事件。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解 State 的概念和作用
- ✅ 掌握 `useState` Hook 的使用
- ✅ 学会管理不同类型的状态（基本类型、对象、数组）
- ✅ 理解状态不可变性原则
- ✅ 掌握函数式更新的方法
- ✅ 学会处理各种用户事件
- ✅ 理解事件处理中的常见陷阱
- ✅ 掌握表单处理的最佳实践

## 📚 核心知识点

### 1. 什么是 State？

State 是组件的"记忆"，用于存储随时间变化的数据。当 state 改变时，组件会重新渲染以反映新的状态。

#### State vs Props

| 特性     | State            | Props                  |
| -------- | ---------------- | ---------------------- |
| 定义位置 | 组件内部         | 父组件传递             |
| 可变性   | 可以修改         | 只读                   |
| 触发渲染 | 改变会触发重渲染 | Props 改变会触发重渲染 |
| 谁控制   | 组件自己         | 父组件                 |
| 用途     | 组件内部数据     | 组件间通信             |

### 2. useState Hook

`useState` 是 React 提供的一个 Hook，用于在函数组件中添加状态。

#### 2.1 基本语法

```tsx
import { useState } from "react";

function Component() {
  // [状态变量, 更新函数] = useState(初始值)
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**命名约定：**

- 状态变量：使用描述性名称（`count`, `user`, `isLoading`）
- 更新函数：使用 `set` + 状态变量名（`setCount`, `setUser`, `setIsLoading`）

#### 2.2 初始值

```tsx
// 直接值
const [count, setCount] = useState(0);
const [name, setName] = useState("Alice");
const [isActive, setIsActive] = useState(false);

// 对象
const [user, setUser] = useState({
  name: "Alice",
  age: 25,
});

// 数组
const [items, setItems] = useState([1, 2, 3]);

// 惰性初始化（初始值计算成本高时）
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation();
  return initialState;
});

// ❌ 错误 - 每次渲染都会调用函数
const [state, setState] = useState(someExpensiveComputation());

// ✅ 正确 - 只在初始渲染时调用
const [state, setState] = useState(() => someExpensiveComputation());
```

### 3. 更新 State

#### 3.1 基本更新

```tsx
const [count, setCount] = useState(0);

// 直接设置新值
setCount(5);

// 基于当前值更新
setCount(count + 1);
```

#### 3.2 函数式更新

当新状态依赖于前一个状态时，使用函数式更新：

```tsx
const [count, setCount] = useState(0);

// ❌ 可能出问题 - 使用旧的 count 值
const increment = () => {
  setCount(count + 1);
  setCount(count + 1); // 还是只加 1
};

// ✅ 正确 - 使用函数式更新
const increment = () => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1); // 正确加 2
};

// ✅ 异步情况下也安全
const incrementAsync = () => {
  setTimeout(() => {
    setCount((prev) => prev + 1); // 始终使用最新值
  }, 1000);
};
```

**何时使用函数式更新？**

- 新状态依赖于前一个状态
- 在异步操作中更新状态
- 多次连续更新状态
- 在事件处理器外部更新状态

### 4. 管理不同类型的 State

#### 4.1 对象状态

```tsx
const [user, setUser] = useState({
  name: "Alice",
  age: 25,
  email: "alice@example.com",
});

// ❌ 错误 - 直接修改对象
user.name = "Bob"; // 不会触发重渲染
setUser(user); // 引用没变，不会重渲染

// ✅ 正确 - 创建新对象（保持不可变性）
setUser({
  ...user,
  name: "Bob", // 只更新 name
});

// 更新嵌套对象
const [user, setUser] = useState({
  name: "Alice",
  address: {
    city: "Beijing",
    country: "China",
  },
});

setUser({
  ...user,
  address: {
    ...user.address,
    city: "Shanghai", // 只更新 city
  },
});
```

#### 4.2 数组状态

```tsx
const [items, setItems] = useState([1, 2, 3]);

// 添加元素
setItems([...items, 4]); // 末尾添加
setItems([0, ...items]); // 开头添加
setItems([...items.slice(0, 2), "new", ...items.slice(2)]); // 中间插入

// 删除元素
setItems(items.filter((item) => item !== 2)); // 删除值为 2 的元素
setItems(items.filter((_, index) => index !== 1)); // 删除索引为 1 的元素

// 更新元素
setItems(items.map((item) => (item === 2 ? 20 : item))); // 更新值
setItems(
  items.map(
    (item, index) => (index === 1 ? newValue : item) // 更新索引为 1 的元素
  )
);

// 排序（创建新数组）
setItems([...items].sort());

// ❌ 错误 - 直接修改数组
items.push(4); // 不会触发重渲染
items[0] = 10; // 不会触发重渲染
items.sort(); // 直接修改原数组
```

#### 4.3 复杂状态管理

```tsx
// 多个相关状态
const [user, setUser] = useState({
  name: "",
  email: "",
  age: 0,
});

// 统一更新函数
const updateUser = (field: string, value: any) => {
  setUser((prev) => ({
    ...prev,
    [field]: value,
  }));
};

// 使用
updateUser("name", "Alice");
updateUser("email", "alice@example.com");

// 或使用多个 useState
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [age, setAge] = useState(0);
```

### 5. State 的不可变性

#### 为什么要保持不可变性？

- **性能优化**：React 通过引用比较判断是否需要重渲染
- **时间旅行**：保留历史状态（用于调试、撤销等）
- **纯函数**：使组件行为更可预测
- **并发特性**：支持 React 18 的并发特性

#### 不可变更新模式

```tsx
// 对象
const updateObject = {
  ...oldObject,
  property: newValue,
};

// 嵌套对象
const updateNestedObject = {
  ...oldObject,
  nested: {
    ...oldObject.nested,
    property: newValue,
  },
};

// 数组 - 添加
const addToArray = [...oldArray, newItem];

// 数组 - 删除
const removeFromArray = oldArray.filter((item) => item.id !== id);

// 数组 - 更新
const updateArray = oldArray.map((item) =>
  item.id === id ? { ...item, property: newValue } : item
);

// 数组 - 插入
const insertIntoArray = [
  ...oldArray.slice(0, index),
  newItem,
  ...oldArray.slice(index),
];
```

### 6. 事件处理

#### 6.1 基本事件处理

```tsx
function Component() {
  // 方法 1：独立函数
  function handleClick() {
    console.log("Clicked!");
  }

  // 方法 2：箭头函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>

      {/* 内联箭头函数 */}
      <button onClick={() => console.log("Clicked!")}>Click</button>

      <input onChange={handleChange} />
    </div>
  );
}
```

#### 6.2 传递参数

```tsx
function Component() {
  const [items, setItems] = useState([...])

  // 方法 1：箭头函数包装（推荐）
  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => handleDelete(item.id)}  // 箭头函数包装
        >
          Delete
        </button>
      ))}
    </div>
  )
}

// 方法 2：使用 data 属性
function Component() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const id = e.currentTarget.dataset.id
    console.log('Clicked item:', id)
  }

  return (
    <button data-id={item.id} onClick={handleClick}>
      Click
    </button>
  )
}
```

#### 6.3 事件对象

```tsx
// React 事件是合成事件（SyntheticEvent）
function Component() {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.clientX, e.clientY); // 鼠标位置
    e.stopPropagation(); // 停止冒泡
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认行为
    console.log("Form submitted");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value); // 输入值
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("Enter pressed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

#### 6.4 常用事件类型

```tsx
// 鼠标事件
onClick: (e: React.MouseEvent) => void
onDoubleClick: (e: React.MouseEvent) => void
onMouseEnter: (e: React.MouseEvent) => void
onMouseLeave: (e: React.MouseEvent) => void
onMouseMove: (e: React.MouseEvent) => void
onMouseDown: (e: React.MouseEvent) => void
onMouseUp: (e: React.MouseEvent) => void

// 键盘事件
onKeyDown: (e: React.KeyboardEvent) => void
onKeyUp: (e: React.KeyboardEvent) => void
onKeyPress: (e: React.KeyboardEvent) => void

// 表单事件
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
onFocus: (e: React.FocusEvent) => void
onBlur: (e: React.FocusEvent) => void
onInput: (e: React.FormEvent) => void

// 其他事件
onScroll: (e: React.UIEvent) => void
onCopy: (e: React.ClipboardEvent) => void
onPaste: (e: React.ClipboardEvent) => void
onDrag: (e: React.DragEvent) => void
onDrop: (e: React.DragEvent) => void
```

### 7. 表单处理

#### 7.1 受控组件

```tsx
function Form() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: 0,
    gender: "male",
    agree: false,
  });

  // 统一处理函数
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? Number(value)
        : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
      />

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        type="checkbox"
        name="agree"
        checked={formData.agree}
        onChange={handleChange}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

#### 7.2 多个输入框

```tsx
// 方法 1：单个 state 对象
const [formData, setFormData] = useState({
  name: '',
  email: ''
})

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }))
}

// 方法 2：多个 state
const [name, setName] = useState('')
const [email, setEmail] = useState('')

// 方法 3：自定义 Hook
function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return { value, onChange: handleChange }
}

// 使用
const nameInput = useFormInput('')
const emailInput = useFormInput('')

<input {...nameInput} />
<input {...emailInput} />
```

## 📝 最佳实践

### 1. State 设计原则

```tsx
// ✅ 最小化 state
// 只存储必要的数据，派生数据通过计算得出
const [firstName, setFirstName] = useState("John");
const [lastName, setLastName] = useState("Doe");
const fullName = `${firstName} ${lastName}`; // 派生，不需要 state

// ❌ 避免冗余 state
const [firstName, setFirstName] = useState("John");
const [lastName, setLastName] = useState("Doe");
const [fullName, setFullName] = useState("John Doe"); // 冗余！

// ✅ 避免矛盾 state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [data, setData] = useState(null);

// ❌ 矛盾的 state
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false); // 可能同时为 true
```

### 2. 避免不必要的重渲染

```tsx
// ✅ 将不变的数据移到组件外
const OPTIONS = ["Option 1", "Option 2", "Option 3"];

function Component() {
  // 组件重渲染时，OPTIONS 不会重新创建
}

// ❌ 每次渲染都创建新数组
function Component() {
  const options = ["Option 1", "Option 2", "Option 3"]; // 每次都创建
}
```

### 3. 状态提升

```tsx
// 当多个组件需要共享状态时，将 state 提升到最近的共同父组件

// ❌ 各自管理状态（无法同步）
function ComponentA() {
  const [value, setValue] = useState("");
}

function ComponentB() {
  const [value, setValue] = useState("");
}

// ✅ 状态提升到父组件
function Parent() {
  const [value, setValue] = useState("");

  return (
    <>
      <ComponentA value={value} onChange={setValue} />
      <ComponentB value={value} onChange={setValue} />
    </>
  );
}
```

## ❓ 常见问题

### Q1: 为什么直接修改 state 不触发重渲染？

**A:** React 通过比较引用判断 state 是否改变。直接修改不会改变引用，所以 React 认为没有变化。

```tsx
// ❌ 不会重渲染
const [user, setUser] = useState({ name: "Alice" });
user.name = "Bob";
setUser(user); // 引用没变

// ✅ 会重渲染
setUser({ ...user, name: "Bob" }); // 新对象，引用改变
```

### Q2: 为什么 state 更新是异步的？

**A:**

- **性能优化**：批量更新多个 state，减少重渲染次数
- **一致性**：确保 props 和 state 在渲染时保持一致

### Q3: 什么时候使用对象 state，什么时候使用多个 state？

**A:**

- **相关数据**：使用对象 state（如表单数据）
- **独立数据**：使用多个 state（更新更方便）

```tsx
// 相关数据 - 使用对象
const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
});

// 独立数据 - 使用多个 state
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);
```

### Q4: 如何在 useEffect 中使用最新的 state？

**A:** 使用函数式更新或将 state 添加到依赖数组。

```tsx
// 方法 1：函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount((prev) => prev + 1); // 始终使用最新值
  }, 1000);
  return () => clearInterval(timer);
}, []);

// 方法 2：添加到依赖
useEffect(() => {
  // 使用 count
}, [count]);
```

## 🔗 相关资源

- [React State 官方文档](https://zh-hans.react.dev/learn/state-a-components-memory)
- [React 事件处理文档](https://zh-hans.react.dev/learn/responding-to-events)
- [useState Hook 文档](https://zh-hans.react.dev/reference/react/useState)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **05 - 条件渲染**：掌握各种渲染技巧
- **06 - 列表与 Keys**：深入理解列表渲染
- **08 - 生命周期与副作用**：学习 useEffect Hook

---

**💡 提示**：State 管理是 React 开发的核心技能。多练习，多思考如何合理地组织 state，会让你的代码更简洁、更高效！
