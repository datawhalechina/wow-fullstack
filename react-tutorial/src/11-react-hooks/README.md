# React Hooks 深入解析

React Hooks 是 React 16.8 引入的重要特性，让你在不编写 class 的情况下使用 state 和其他 React 特性。

## 🎯 学习目标

- 掌握所有常用 React Hooks 的使用方法
- 理解 Hooks 的工作原理和使用规则
- 学会使用 Hooks 进行性能优化
- 能够创建自定义 Hooks 复用逻辑

## 📚 核心 Hooks 详解

### 1. useState - 状态管理 🔄

最基本的 Hook，用于在函数组件中添加状态。

**基础用法：**

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

**函数式更新：**

```tsx
// 当新状态依赖于旧状态时，使用函数式更新
setCount((prevCount) => prevCount + 1);

// 避免闭包陷阱
useEffect(() => {
  const timer = setInterval(() => {
    setCount((c) => c + 1); // ✅ 正确
    // setCount(count + 1)   // ❌ 错误：count 永远是初始值
  }, 1000);
  return () => clearInterval(timer);
}, []); // 空依赖数组
```

**管理复杂状态：**

```tsx
// 对象状态
const [user, setUser] = useState({
  name: "",
  age: 0,
  email: "",
});

// 更新部分属性（需要展开运算符）
setUser({ ...user, name: "张三" });

// 数组状态
const [items, setItems] = useState<string[]>([]);

// 添加项目
setItems([...items, "新项目"]);

// 删除项目
setItems(items.filter((item, index) => index !== targetIndex));

// 更新项目
setItems(items.map((item, index) => (index === targetIndex ? "更新后" : item)));
```

**惰性初始化：**

```tsx
// 如果初始状态需要复杂计算，使用函数形式
const [state, setState] = useState(() => {
  const initialState = expensiveComputation();
  return initialState;
});
```

---

### 2. useEffect - 副作用处理 ⚡

用于处理副作用操作，如数据获取、订阅、手动修改 DOM 等。

**基础用法：**

```tsx
import { useEffect } from "react";

function Example() {
  // 1. 每次渲染后都执行（无依赖数组）
  useEffect(() => {
    console.log("组件已渲染");
  });

  // 2. 仅在挂载时执行（空依赖数组）
  useEffect(() => {
    console.log("组件已挂载");
    return () => console.log("组件将卸载");
  }, []);

  // 3. 依赖变化时执行
  useEffect(() => {
    console.log("count 已变化");
  }, [count]);
}
```

**清理函数：**

```tsx
useEffect(() => {
  // 订阅
  const subscription = someAPI.subscribe();

  // 清理函数（在组件卸载或依赖变化前执行）
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

**数据获取示例：**

```tsx
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();

    // 清理函数：防止组件卸载后更新状态
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return <div>{user?.name}</div>;
}
```

**常见陷阱：**

```tsx
// ❌ 错误：缺少依赖
useEffect(() => {
  console.log(count); // 使用了 count
}, []); // 但依赖数组为空

// ✅ 正确：包含所有依赖
useEffect(() => {
  console.log(count);
}, [count]);

// ❌ 错误：在 useEffect 中定义函数
useEffect(() => {
  function fetchData() {
    // ...
  }
  fetchData();
}, []);

// ✅ 正确：将函数移到外部或使用 useCallback
const fetchData = useCallback(() => {
  // ...
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

---

### 3. useContext - 上下文订阅 🌐

用于订阅 React Context，避免 props drilling（多层传递）。

**创建和使用 Context：**

```tsx
import { createContext, useContext, useState } from "react";

// 1. 创建 Context
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. 创建 Provider 组件
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 创建自定义 Hook（可选但推荐）
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// 4. 使用 Context
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      切换主题
    </button>
  );
}

// 5. 在应用中使用
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

**多个 Context 组合：**

```tsx
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <MainApp />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

---

### 4. useReducer - 复杂状态管理 🎛️

适用于复杂状态逻辑，类似于 Redux 的 reducer。

**基础用法：**

```tsx
import { useReducer } from "react";

// 1. 定义状态类型
interface State {
  count: number;
  step: number;
}

// 2. 定义 Action 类型
type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "set_step"; payload: number };

// 3. 定义 Reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { ...state, count: state.count + state.step };
    case "decrement":
      return { ...state, count: state.count - state.step };
    case "reset":
      return { ...state, count: 0 };
    case "set_step":
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

// 4. 使用 useReducer
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>重置</button>
    </div>
  );
}
```

**与 Context 结合使用（全局状态管理）：**

```tsx
// 创建全局状态管理
const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch<Action> | undefined>(undefined);

function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 自定义 Hooks
function useState() {
  const context = useContext(StateContext);
  if (!context) throw new Error("useState must be used within StateProvider");
  return context;
}

function useDispatch() {
  const context = useContext(DispatchContext);
  if (!context)
    throw new Error("useDispatch must be used within StateProvider");
  return context;
}
```

---

### 5. useCallback - 函数缓存 🔖

返回一个 memoized 回调函数，只在依赖变化时才会更新。

**基础用法：**

```tsx
import { useCallback, memo } from "react";

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ❌ 每次渲染都创建新函数
  const handleClick = () => {
    console.log("clicked");
  };

  // ✅ 使用 useCallback 缓存函数
  const handleClickMemoized = useCallback(() => {
    console.log("clicked");
  }, []); // 依赖为空，函数永远不变

  // 依赖 count 的函数
  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // 使用函数式更新，不需要依赖 count

  return (
    <div>
      <Child onClick={handleClickMemoized} />
    </div>
  );
}

// 使用 memo 包裹子组件
const Child = memo(({ onClick }: { onClick: () => void }) => {
  console.log("Child rendered");
  return <button onClick={onClick}>点击</button>;
});
```

**何时使用 useCallback：**

- 传递给使用 `React.memo` 包裹的子组件
- 作为其他 Hook 的依赖（如 useEffect）
- 传递给自定义 Hook

**注意事项：**

```tsx
// ❌ 不必要的 useCallback
const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
// 如果没有传递给子组件或作为依赖，不需要使用 useCallback

// ✅ 有意义的使用
<ExpensiveChild onClick={handleClick} />;
```

---

### 6. useMemo - 值缓存 💾

返回一个 memoized 值，只在依赖变化时才会重新计算。

**基础用法：**

```tsx
import { useMemo } from "react";

function Example() {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const [filter, setFilter] = useState("");

  // ❌ 每次渲染都计算
  const expensiveValue = items.reduce((sum, item) => sum + item * item, 0);

  // ✅ 使用 useMemo 缓存计算结果
  const expensiveValueMemoized = useMemo(() => {
    console.log("计算中...");
    return items.reduce((sum, item) => sum + item * item, 0);
  }, [items]); // 只在 items 变化时重新计算

  // 过滤列表
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.toString().includes(filter));
  }, [items, filter]);

  return (
    <div>
      <p>平方和: {expensiveValueMemoized}</p>
      <ul>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

**useCallback vs useMemo：**

```tsx
// useCallback 缓存函数
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// useMemo 缓存值（也可以缓存函数）
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 等价写法
const memoizedCallback = useMemo(() => {
  return () => {
    doSomething(a, b);
  };
}, [a, b]);
```

---

### 7. useRef - 引用管理 📌

返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。

**DOM 引用：**

```tsx
import { useRef, useEffect } from "react";

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 自动聚焦
    inputRef.current?.focus();
  }, []);

  const handleClick = () => {
    // 访问 DOM 元素
    console.log(inputRef.current?.value);
    inputRef.current?.select();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>聚焦并选中</button>
    </div>
  );
}
```

**存储可变值（不触发重渲染）：**

```tsx
function Timer() {
  const intervalRef = useRef<number>();
  const countRef = useRef(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      countRef.current += 1;
      console.log("Count:", countRef.current);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <div>查看控制台</div>;
}
```

**保存上一次的值：**

```tsx
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// 使用
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前: {count}</p>
      <p>上一次: {prevCount}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </div>
  );
}
```

**useRef vs useState：**

```tsx
// useState: 值变化会触发重渲染
const [count, setCount] = useState(0);
setCount(1); // 触发重渲染

// useRef: 值变化不会触发重渲染
const countRef = useRef(0);
countRef.current = 1; // 不触发重渲染
```

---

## 🚀 Hooks 使用规则

### 两条核心规则：

1. **只在顶层调用 Hooks**

   ```tsx
   // ❌ 错误：在条件语句中
   if (condition) {
     const [state, setState] = useState(0);
   }

   // ❌ 错误：在循环中
   for (let i = 0; i < 10; i++) {
     useEffect(() => {});
   }

   // ✅ 正确：在顶层
   const [state, setState] = useState(0);
   useEffect(() => {
     if (condition) {
       // 条件逻辑放在 Hook 内部
     }
   });
   ```

2. **只在 React 函数中调用 Hooks**
   ```tsx
   // ✅ 在函数组件中
   function MyComponent() {
     const [state, setState] = useState(0);
   }
   // ✅ 在自定义 Hook 中
   function useCustomHook() {
     const [state, setState] = useState(0);
   }
   // ❌ 在普通函数中
   function regularFunction() {
     const [state, setState] = useState(0); // 错误！
   }
   ```

---

## 💡 自定义 Hooks

自定义 Hooks 是一个函数，名称以 "use" 开头，可以调用其他 Hooks。

**示例 1: 表单处理**

```tsx
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const reset = () => setValues(initialValues);

  return { values, handleChange, reset };
}

// 使用
function LoginForm() {
  const { values, handleChange, reset } = useForm({
    username: "",
    password: "",
  });

  return (
    <form>
      <input name="username" value={values.username} onChange={handleChange} />
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
      />
      <button type="button" onClick={reset}>
        重置
      </button>
    </form>
  );
}
```

**示例 2: 数据获取**

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();

        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}

// 使用
function UserProfile({ userId }: { userId: number }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${userId}`);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;
  return <div>{data?.name}</div>;
}
```

**示例 3: LocalStorage 同步**

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setStoredValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(value) : value;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [value, setStoredValue] as const;
}

// 使用
function App() {
  const [name, setName] = useLocalStorage("name", "");

  return (
    <input value={name} onChange={(e) => setName(e.target.value)} />
    // 值会自动保存到 localStorage
  );
}
```

---

## 🎯 最佳实践总结

### 1. 依赖数组管理

- ✅ 包含所有使用的外部变量
- ✅ 使用 ESLint 插件 `eslint-plugin-react-hooks`
- ✅ 考虑使用函数式更新避免依赖

### 2. 性能优化

- ⚠️ 不要过早优化
- ✅ 先测量性能问题
- ✅ 在确实需要时才使用 `useMemo`/`useCallback`
- ✅ 配合 `React.memo` 使用

### 3. 自定义 Hooks

- ✅ 提取可复用的逻辑
- ✅ 以 "use" 开头命名
- ✅ 可以组合多个内置 Hooks
- ✅ 返回数组或对象

### 4. 常见陷阱

- ❌ 在条件语句中使用 Hooks
- ❌ useEffect 缺少依赖
- ❌ 过度使用 useMemo/useCallback
- ❌ 在 useEffect 中直接使用 async 函数

---

## 🔗 相关资源

- [React Hooks 官方文档](https://react.dev/reference/react)
- [Hooks FAQ](https://react.dev/learn#using-hooks)
- [自定义 Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Hooks API 参考](https://react.dev/reference/react/hooks)

## 📝 练习建议

1. 将一个 class 组件改写为函数组件（使用 Hooks）
2. 创建自己的自定义 Hooks（表单、数据获取等）
3. 使用 useReducer 和 useContext 实现简单的状态管理
4. 练习使用 useMemo 和 useCallback 优化性能
5. 阅读优秀开源项目中的 Hooks 使用

继续练习和探索，你会更加熟练地使用 React Hooks！🚀
