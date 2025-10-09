# React 项目实践

本章节通过三个完整的实战项目，帮助你综合运用所学的 React 知识，从理论走向实践。

## 🎯 学习目标

- 掌握如何将 React 概念应用到实际项目中
- 学会处理复杂的状态管理和用户交互
- 理解项目的架构设计和组件拆分
- 提升解决实际问题的能力

## 📚 项目概览

### 项目 1: Todo List 应用 📝

一个功能完整的待办事项管理应用，是学习 React 的经典入门项目。

**核心功能：**

- ✅ 添加待办事项
- ✏️ 编辑待办事项
- 🗑️ 删除待办事项
- ✔️ 标记完成状态
- 🏷️ 设置优先级（高/中/低）
- 🔍 过滤显示（全部/进行中/已完成）
- 📊 统计信息展示
- 🧹 批量清除已完成

**技术要点：**

```tsx
// 状态管理
const [todos, setTodos] = useState<Todo[]>([]);
const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

// 添加待办事项
const addTodo = () => {
  const newTodo: Todo = {
    id: Date.now(),
    text: inputText,
    completed: false,
    priority: priority,
    createdAt: new Date(),
  };
  setTodos([...todos, newTodo]);
};

// 切换完成状态
const toggleTodo = (id: number) => {
  setTodos(
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );
};

// 过滤逻辑
const filteredTodos = todos.filter((todo) => {
  if (filter === "active") return !todo.completed;
  if (filter === "completed") return todo.completed;
  return true;
});
```

**学习要点：**

1. **状态管理** - 使用 `useState` 管理多个相关状态
2. **数组操作** - 添加、删除、更新数组元素
3. **条件渲染** - 根据不同状态显示不同内容
4. **列表渲染** - 使用 `map` 渲染列表项
5. **表单处理** - 处理用户输入和提交
6. **组件拆分** - 将复杂组件拆分为多个小组件
7. **Props 传递** - 父子组件间的数据和函数传递

**扩展建议：**

- 使用 localStorage 持久化数据
- 添加拖拽排序功能
- 实现搜索和标签分类
- 添加截止日期和提醒功能

---

### 项目 2: 天气查询应用 🌤️

一个模拟天气查询的应用，展示如何处理异步操作和 API 调用。

**核心功能：**

- 🔍 城市天气查询
- 🌡️ 显示温度、天气状况
- 💧 显示湿度、风速等信息
- ⏳ 加载状态显示
- ❌ 错误处理
- 📜 搜索历史记录
- 🚀 快速城市选择

**技术要点：**

```tsx
// 异步数据获取
const searchWeather = async () => {
  setLoading(true);
  setError("");

  try {
    // 模拟 API 调用延迟
    setTimeout(() => {
      const data = mockWeatherData[city];

      if (data) {
        setWeather(data);
        setError("");
        // 更新搜索历史
        if (!history.includes(city)) {
          setHistory([city, ...history.slice(0, 4)]);
        }
      } else {
        setWeather(null);
        setError("未找到该城市的天气信息");
      }

      setLoading(false);
    }, 800);
  } catch (err) {
    setError("查询失败，请稍后重试");
    setLoading(false);
  }
};
```

**学习要点：**

1. **异步操作** - 处理异步数据获取
2. **加载状态** - 管理 loading 状态提升用户体验
3. **错误处理** - 优雅地处理和显示错误
4. **数据展示** - 格式化和美化数据呈现
5. **用户交互** - 实现搜索和快速选择功能
6. **历史记录** - 保存和展示用户操作历史

**扩展建议：**

- 集成真实天气 API（如 OpenWeatherMap）
- 添加多日天气预报
- 实现定位获取当前位置天气
- 添加天气图表和趋势分析
- 支持多语言切换

---

### 项目 3: 简单电商应用 🛍️

一个包含产品展示和购物车功能的电商应用，使用 useReducer 管理复杂状态。

**核心功能：**

- 📦 产品列表展示
- 🏷️ 产品分类过滤
- 🛒 购物车管理
- ➕ 添加到购物车
- ➖ 调整商品数量
- 🗑️ 移除商品
- 💰 实时计算总价
- 📊 库存管理
- 🎨 侧边栏购物车

**技术要点：**

```tsx
// 使用 useReducer 管理购物车状态
type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(action.payload.quantity, item.stock)
              ),
            }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

// 使用 Reducer
const [cart, dispatch] = useReducer(cartReducer, []);

// 分发 Action
dispatch({ type: "ADD_ITEM", payload: product });
```

**学习要点：**

1. **useReducer** - 使用 Reducer 管理复杂状态逻辑
2. **购物车逻辑** - 实现添加、删除、更新商品
3. **数量控制** - 处理最小值、最大值限制
4. **库存管理** - 根据库存控制购买数量
5. **实时计算** - 动态计算商品总数和总价
6. **UI 交互** - 侧边栏、遮罩层、过渡动画
7. **条件禁用** - 根据状态禁用按钮

**扩展建议：**

- 添加商品详情页
- 实现优惠券和折扣功能
- 添加收藏和比较功能
- 实现订单提交流程
- 集成支付接口

---

## 🚀 通用最佳实践

### 1. 组件拆分原则

```tsx
// ❌ 不好：所有逻辑都在一个大组件中
function TodoApp() {
  // 300 行代码...
}

// ✅ 好：拆分为多个小组件
function TodoApp() {
  return (
    <>
      <TodoStats stats={stats} />
      <TodoInput onAdd={addTodo} />
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      <TodoList todos={filteredTodos} onToggle={toggleTodo} />
    </>
  );
}
```

**拆分建议：**

- 单一职责：每个组件只做一件事
- 可复用性：提取可复用的 UI 组件
- 合理粒度：避免过度拆分或组件过大

### 2. 状态管理策略

**简单状态 → useState**

```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState("");
```

**复杂状态 → useReducer**

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

**全局状态 → Context API**

```tsx
const ThemeContext = createContext()
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```

### 3. 性能优化

```tsx
// 1. 使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  // 处理点击
}, [dependencies]);

// 2. 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// 3. 使用 React.memo 避免不必要的重渲染
const TodoItem = React.memo(({ todo, onToggle }) => {
  // 组件逻辑
});
```

### 4. 错误处理

```tsx
// 始终处理可能的错误情况
try {
  const response = await fetchData();
  setData(response);
} catch (error) {
  setError("数据加载失败");
  console.error(error);
} finally {
  setLoading(false);
}
```

### 5. 类型安全

```tsx
// 使用 TypeScript 定义清晰的类型
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}
```

### 6. 代码组织

```
src/
  components/        # 可复用组件
    Button.tsx
    Input.tsx
  features/          # 功能模块
    todo/
      TodoList.tsx
      TodoItem.tsx
    weather/
      WeatherCard.tsx
  hooks/             # 自定义 Hooks
    useTodos.ts
    useWeather.ts
  types/             # 类型定义
    todo.ts
    weather.ts
  utils/             # 工具函数
    formatDate.ts
```

---

## 💡 进阶学习路径

### 阶段 1: 功能增强

- 添加数据持久化（localStorage）
- 实现撤销/重做功能
- 添加键盘快捷键支持

### 阶段 2: 用户体验优化

- 添加加载动画和过渡效果
- 实现响应式设计
- 添加暗黑模式

### 阶段 3: 性能优化

- 使用虚拟滚动处理大列表
- 实现懒加载和代码分割
- 优化重渲染性能

### 阶段 4: 工程化

- 集成真实后端 API
- 添加单元测试
- 配置 CI/CD 流程
- 部署到生产环境

---

## 🔗 相关资源

- [React 官方文档](https://react.dev/)
- [React Patterns](https://reactpatterns.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Awesome React](https://github.com/enaqx/awesome-react)

## 📝 练习建议

1. **独立实现**：尝试不看教程独立实现这些项目
2. **功能扩展**：为项目添加新功能
3. **代码重构**：优化代码结构和性能
4. **创建新项目**：基于所学创建自己的项目
5. **分享交流**：将项目部署并分享给他人

## 🎓 总结

通过这三个项目的实践，你应该已经掌握了：

- ✅ React 基础概念的综合应用
- ✅ 状态管理的多种方式
- ✅ 用户交互和事件处理
- ✅ 异步操作和错误处理
- ✅ 组件设计和代码组织
- ✅ 实际项目的开发流程

继续练习和探索，你会成为一名优秀的 React 开发者！🚀
