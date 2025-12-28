# 生命周期与副作用

## 📖 本节概述

`useEffect` 是 React 中最重要的 Hook 之一，用于处理副作用（side effects）。本节将深入讲解组件生命周期、useEffect 的使用方法、数据获取、订阅管理、以及如何避免常见陷阱。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解副作用的概念
- ✅ 掌握 useEffect Hook 的使用
- ✅ 理解依赖数组的作用
- ✅ 学会清理副作用
- ✅ 掌握数据获取模式
- ✅ 理解组件生命周期
- ✅ 避免常见的 useEffect 陷阱
- ✅ 掌握性能优化技巧

## 📚 核心知识点

### 1. 什么是副作用（Side Effects）？

副作用是指那些在函数组件渲染过程中进行的、与渲染输出无关的操作。

**常见的副作用：**

- 数据获取（API 调用）
- 订阅（WebSocket、事件监听）
- 手动修改 DOM
- 定时器（setTimeout、setInterval）
- 日志记录
- 本地存储操作

```tsx
function Component() {
  // ❌ 不应该在渲染时直接执行副作用
  document.title = "New Title"; // 副作用
  fetch("/api/data"); // 副作用

  return <div>Component</div>;
}

// ✅ 应该在 useEffect 中执行副作用
function Component() {
  useEffect(() => {
    document.title = "New Title"; // ✅ 正确
  }, []);

  useEffect(() => {
    fetch("/api/data"); // ✅ 正确
  }, []);

  return <div>Component</div>;
}
```

### 2. useEffect 基础

#### 2.1 基本语法

```tsx
useEffect(
  () => {
    // 副作用代码
    console.log("Effect runs");

    // 可选：返回清理函数
    return () => {
      console.log("Cleanup runs");
    };
  },
  [
    /* 依赖数组 */
  ]
);
```

#### 2.2 执行时机

```tsx
// 每次渲染后都执行
useEffect(() => {
  console.log("Runs after every render");
});

// 仅在首次渲染后执行（等同于 componentDidMount）
useEffect(() => {
  console.log("Runs only once after mount");
}, []);

// 当依赖项改变时执行
useEffect(() => {
  console.log("Runs when count changes");
}, [count]);

// 多个依赖项
useEffect(() => {
  console.log("Runs when count or name changes");
}, [count, name]);
```

### 3. 依赖数组详解

依赖数组决定了 effect 何时重新执行。

#### 3.1 无依赖数组

```tsx
useEffect(() => {
  console.log("Runs after every render");
});
// 每次组件渲染后都执行
```

**使用场景：**

- 很少使用
- 可能导致性能问题
- 大多数情况应该指定依赖

#### 3.2 空依赖数组

```tsx
useEffect(() => {
  console.log("Runs only once");
}, []);
// 仅在组件挂载时执行一次
```

**使用场景：**

- 初始化数据获取
- 设置事件监听
- 订阅外部数据源
- 类似于 `componentDidMount`

#### 3.3 指定依赖

```tsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Count changed:", count);
}, [count]);
// 仅在 count 改变时执行
```

**规则：**

- 包含 effect 中使用的所有外部变量
- ESLint 插件会帮助检查遗漏的依赖
- 不要"欺骗"依赖数组

```tsx
// ❌ 错误：遗漏依赖
useEffect(() => {
  console.log(count); // 使用了 count
}, []); // 但没有在依赖中声明

// ✅ 正确：包含所有依赖
useEffect(() => {
  console.log(count);
}, [count]); // 正确声明依赖
```

### 4. 清理副作用

某些副作用需要清理，以避免内存泄漏。

#### 4.1 清理函数

```tsx
useEffect(() => {
  // 设置副作用
  console.log("Effect setup");

  return () => {
    // 清理副作用
    console.log("Effect cleanup");
  };
}, []);
```

**执行时机：**

- 组件卸载时
- 下次 effect 执行前（如果有依赖变化）

#### 4.2 常见清理场景

**定时器：**

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // 清理定时器
  return () => {
    clearInterval(timer);
  };
}, []);
```

**事件监听：**

```tsx
useEffect(() => {
  const handleResize = () => {
    console.log("Window resized");
  };

  window.addEventListener("resize", handleResize);

  // 移除事件监听
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

**订阅：**

```tsx
useEffect(() => {
  const subscription = dataSource.subscribe((data) => {
    setData(data);
  });

  // 取消订阅
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

**中止请求：**

```tsx
useEffect(() => {
  const abortController = new AbortController();

  fetch("/api/data", { signal: abortController.signal })
    .then((response) => response.json())
    .then((data) => setData(data))
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("Request aborted");
      }
    });

  // 中止请求
  return () => {
    abortController.abort();
  };
}, []);
```

### 5. 数据获取

#### 5.1 基本数据获取

```tsx
function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/users/${userId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch");
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [userId]); // 当 userId 改变时重新获取

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
}
```

#### 5.2 使用 async/await

```tsx
useEffect(() => {
  // ❌ 错误：useEffect 回调不能是 async 函数
  // useEffect(async () => {
  //   const data = await fetch('/api/data')
  // }, [])

  // ✅ 正确：在内部定义 async 函数
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error);
    }
  };

  fetchData();
}, []);
```

#### 5.3 处理竞态条件

```tsx
useEffect(() => {
  let cancelled = false;

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/data/${userId}`);
      const data = await response.json();

      // 只有在未取消时才更新 state
      if (!cancelled) {
        setData(data);
      }
    } catch (error) {
      if (!cancelled) {
        setError(error);
      }
    }
  };

  fetchData();

  // 清理函数
  return () => {
    cancelled = true;
  };
}, [userId]);
```

### 6. 组件生命周期

#### 6.1 类组件生命周期对应

| 类组件生命周期         | 函数组件 Hook                             |
| ---------------------- | ----------------------------------------- |
| `componentDidMount`    | `useEffect(() => {}, [])`                 |
| `componentDidUpdate`   | `useEffect(() => {})`                     |
| `componentWillUnmount` | `useEffect(() => { return cleanup }, [])` |

#### 6.2 生命周期示例

```tsx
function Component({ prop }: Props) {
  const [state, setState] = useState(0);

  // 等同于 componentDidMount
  useEffect(() => {
    console.log("Component mounted");

    // 等同于 componentWillUnmount
    return () => {
      console.log("Component will unmount");
    };
  }, []);

  // 等同于 componentDidUpdate（仅在 prop 改变时）
  useEffect(() => {
    console.log("Prop changed:", prop);
  }, [prop]);

  // 等同于 componentDidUpdate（在任何更新时）
  useEffect(() => {
    console.log("Component updated");
  });

  return <div>{state}</div>;
}
```

### 7. 常见模式

#### 7.1 文档标题

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function Page() {
  useDocumentTitle("My Page Title");
  return <div>Page content</div>;
}
```

#### 7.2 localStorage 同步

```tsx
function useLocalStorage(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 使用
const [name, setName] = useLocalStorage("name", "");
```

#### 7.3 窗口尺寸监听

```tsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```

#### 7.4 防抖

```tsx
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// 使用
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);

useEffect(() => {
  // 只在用户停止输入 500ms 后才搜索
  if (debouncedSearchTerm) {
    searchAPI(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);
```

## 📝 最佳实践

### 1. 总是指定依赖数组

```tsx
// ❌ 避免：没有依赖数组（每次渲染都执行）
useEffect(() => {
  fetchData();
});

// ✅ 好：明确指定依赖
useEffect(() => {
  fetchData();
}, [userId]); // 仅在 userId 改变时执行
```

### 2. 不要"欺骗"依赖数组

```tsx
// ❌ 错误：遗漏依赖
useEffect(() => {
  console.log(count); // 使用了 count
}, []); // 但没有声明依赖

// ✅ 正确：包含所有依赖
useEffect(() => {
  console.log(count);
}, [count]);

// 或使用函数式更新避免依赖
useEffect(() => {
  const timer = setInterval(() => {
    setCount((c) => c + 1); // 不依赖外部 count
  }, 1000);
  return () => clearInterval(timer);
}, []); // 可以安全使用空数组
```

### 3. 清理副作用

```tsx
// ✅ 正确：清理定时器
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);
  return () => clearInterval(timer);
}, []);

// ✅ 正确：移除事件监听
useEffect(() => {
  const handler = () => console.log("Clicked");
  window.addEventListener("click", handler);
  return () => window.removeEventListener("click", handler);
}, []);
```

### 4. 分离关注点

```tsx
// ❌ 不好：一个 effect 做太多事
useEffect(() => {
  fetchUserData();
  setupWebSocket();
  trackPageView();
}, []);

// ✅ 好：分离为多个 effect
useEffect(() => {
  fetchUserData();
}, [userId]);

useEffect(() => {
  const ws = setupWebSocket();
  return () => ws.close();
}, []);

useEffect(() => {
  trackPageView();
}, [pathname]);
```

### 5. 处理竞态条件

```tsx
// ✅ 使用取消标志
useEffect(() => {
  let cancelled = false;

  fetchData().then((data) => {
    if (!cancelled) {
      setData(data);
    }
  });

  return () => {
    cancelled = true;
  };
}, [id]);

// ✅ 使用 AbortController
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== "AbortError") {
        setError(err);
      }
    });

  return () => controller.abort();
}, []);
```

### 6. 提取自定义 Hook

```tsx
// ✅ 复用逻辑的好方式
function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// 使用
function Component() {
  const { data, loading, error } = useFetch("/api/data");
  // ...
}
```

## ❓ 常见问题

### Q1: useEffect 为什么会执行两次？

**A:** 在开发模式下，React 18 的 Strict Mode 会故意重复执行 effect 来帮助发现 bug。

```tsx
// 开发模式下：
// 1. 挂载 → 运行 effect → 清理 effect
// 2. 重新挂载 → 运行 effect

// 生产模式下：
// 仅执行一次
```

**解决方案：**

- 这是预期行为，不需要"修复"
- 确保正确实现清理函数
- 生产环境不会重复执行

### Q2: 如何在 useEffect 中使用 async/await？

**A:**

```tsx
// ❌ 错误：effect 回调不能是 async
useEffect(async () => {
  const data = await fetchData();
}, []);

// ✅ 正确：在内部定义 async 函数
useEffect(() => {
  const fetchData = async () => {
    const data = await fetch("/api/data");
    setData(data);
  };
  fetchData();
}, []);

// ✅ 或使用 IIFE
useEffect(() => {
  (async () => {
    const data = await fetch("/api/data");
    setData(data);
  })();
}, []);
```

### Q3: 依赖数组应该包含哪些内容？

**A:** 包含 effect 中使用的所有外部值：

- State 变量
- Props
- 父组件传递的函数
- 组件内定义的函数和变量

```tsx
function Component({ userId, onUpdate }: Props) {
  const [count, setCount] = useState(0);
  const multiplier = 2;

  useEffect(() => {
    // 使用了 userId, count, multiplier, onUpdate
    const result = count * multiplier;
    onUpdate(userId, result);
  }, [userId, count, multiplier, onUpdate]); // 全部包含
}
```

### Q4: 如何避免无限循环？

**A:**

```tsx
// ❌ 无限循环：依赖对象每次都是新的
const options = { key: "value" };
useEffect(() => {
  fetchData(options);
}, [options]); // options 每次渲染都是新对象

// ✅ 解决方案1：移到 effect 内部
useEffect(() => {
  const options = { key: "value" };
  fetchData(options);
}, []);

// ✅ 解决方案2：使用 useMemo
const options = useMemo(() => ({ key: "value" }), []);
useEffect(() => {
  fetchData(options);
}, [options]);

// ✅ 解决方案3：解构依赖
useEffect(() => {
  fetchData({ key: key });
}, [key]); // 只依赖原始值
```

### Q5: 清理函数什么时候执行？

**A:**

- 组件卸载时
- 下次 effect 执行前（如果依赖改变）

```tsx
useEffect(() => {
  console.log("Effect runs");
  return () => {
    console.log("Cleanup runs");
  };
}, [dep]);

// 执行顺序：
// 1. 首次渲染：Effect runs
// 2. dep 改变：Cleanup runs → Effect runs
// 3. 再次改变：Cleanup runs → Effect runs
// 4. 组件卸载：Cleanup runs
```

## 🔗 相关资源

- [React useEffect 文档](https://zh-hans.react.dev/reference/react/useEffect)
- [使用 Effect 同步](https://zh-hans.react.dev/learn/synchronizing-with-effects)
- [你可能不需要 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **09 - 路由**：学习 React Router
- **10 - 项目实践**：综合运用所学知识
- **11 - React Hooks**：深入学习更多 Hooks

---

**💡 提示**：useEffect 是强大但复杂的 Hook。理解依赖数组、清理函数和常见陷阱，是掌握 React 的关键！记住：总是指定依赖数组，不要"欺骗"依赖检查！
