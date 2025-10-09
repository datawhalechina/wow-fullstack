# 列表与 Keys

## 📖 本节概述

在 React 中，我们经常需要渲染数据列表。掌握列表渲染和 Keys 的正确使用方法，对于构建高性能、可维护的应用至关重要。本节将深入讲解如何渲染列表、Keys 的作用、以及列表操作的最佳实践。

## 🎯 学习目标

学完本节后,你将能够：

- ✅ 理解如何使用 map() 渲染列表
- ✅ 掌握 Keys 的概念和重要性
- ✅ 学会选择合适的 Key 值
- ✅ 掌握列表的增删改操作
- ✅ 理解列表渲染的性能优化
- ✅ 学会处理嵌套列表
- ✅ 掌握列表过滤和排序

## 📚 核心知识点

### 1. 渲染列表

#### 1.1 基本列表渲染

使用 JavaScript 的 `map()` 方法将数组转换为 JSX 元素列表。

```tsx
const numbers = [1, 2, 3, 4, 5];

function NumberList() {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}
```

#### 1.2 渲染对象数组

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];

function UserList() {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 1.3 提取为组件

```tsx
interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

function UserList() {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

**注意**：Key 应该放在循环中直接返回的元素上（这里是 `<UserCard>`），而不是 `UserCard` 内部的元素。

### 2. Keys 的重要性

#### 2.1 什么是 Key？

Key 是一个特殊的字符串属性，用于帮助 React 识别哪些项发生了变化、被添加或被删除。

```tsx
// ❌ 没有 key - React 会警告
{
  items.map((item) => <div>{item}</div>);
}

// ✅ 有 key
{
  items.map((item) => <div key={item.id}>{item.name}</div>);
}
```

#### 2.2 为什么需要 Key？

**提高性能**：React 使用 Key 来优化 DOM 更新。

```tsx
// 场景：在列表开头插入新项
// 初始列表：[A, B, C]
// 新列表：[D, A, B, C]

// ❌ 没有 key：React 认为所有项都改变了
// - 更新 A → D
// - 更新 B → A
// - 更新 C → B
// - 添加新的 C

// ✅ 有 key：React 知道是插入了新项
// - 添加 D
// - 复用 A, B, C（不重新渲染）
```

**保持状态**：Key 确保组件状态正确对应。

```tsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React", completed: false },
    { id: 2, text: "Build App", completed: false },
  ]);

  return (
    <div>
      {todos.map((todo) => (
        // ✅ 正确的 key 确保 checkbox 状态不会错位
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

#### 2.3 选择合适的 Key

**使用唯一标识符**

```tsx
// ✅ 最佳：使用数据库 ID
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ✅ 好：使用唯一的稳定标识符
{
  items.map((item) => <Item key={item.uuid} item={item} />);
}
```

**避免使用索引作为 Key**

```tsx
// ⚠️ 谨慎使用：只有在以下所有条件都满足时才使用索引
// 1. 列表是静态的，不会改变
// 2. 列表不会重新排序
// 3. 列表不会被过滤
// 4. 列表项没有 ID
{
  staticList.map((item, index) => <div key={index}>{item}</div>);
}

// ❌ 不要这样：动态列表使用索引
{
  items.map((item, index) => <TodoItem key={index} todo={item} />);
}
```

**为什么索引不是好的 Key？**

```tsx
// 初始列表
// 0: "Apple"
// 1: "Banana"
// 2: "Cherry"

// 删除 "Banana" 后（使用索引作为 key）
// 0: "Apple"   ← 保持不变
// 1: "Cherry"  ← React 认为这是 "Banana" 变成了 "Cherry"
// 2: 被删除    ← React 认为 "Cherry" 被删除了

// 结果：React 可能重新渲染错误的项，或者组件状态错位
```

**生成唯一 Key**

```tsx
// 如果数据没有 ID，可以使用库生成
import { nanoid } from "nanoid";

const items = data.map((item) => ({
  ...item,
  id: nanoid(), // 生成唯一 ID
}));

// 或者在添加数据时生成
const addItem = (text: string) => {
  setItems([
    ...items,
    {
      id: Date.now(), // 简单场景可以用时间戳
      text,
    },
  ]);
};
```

### 3. 列表操作

#### 3.1 添加项

```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };

      // 在末尾添加
      setTodos([...todos, newTodo]);

      // 或在开头添加
      // setTodos([newTodo, ...todos])

      setInputValue("");
    }
  };

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>

      {todos.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

#### 3.2 删除项

```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.text}
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

#### 3.3 更新项

```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const updateTodoText = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.text}
          </span>
        </div>
      ))}
    </div>
  );
}
```

#### 3.4 排序和过滤

```tsx
function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  // 过滤
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all'
  });

  // 排序
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "date") {
      return b.id - a.id; // 最新的在前
    } else {
      return a.text.localeCompare(b.text); // 按名称排序
    }
  });

  return (
    <div>
      {/* 过滤按钮 */}
      <button onClick={() => setFilter("all")}>All</button>
      <button onClick={() => setFilter("active")}>Active</button>
      <button onClick={() => setFilter("completed")}>Completed</button>

      {/* 排序按钮 */}
      <button onClick={() => setSortBy("date")}>Sort by Date</button>
      <button onClick={() => setSortBy("name")}>Sort by Name</button>

      {/* 渲染列表 */}
      {sortedTodos.map((todo) => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

### 4. 嵌套列表

```tsx
interface Category {
  id: number;
  name: string;
  items: Item[];
}

interface Item {
  id: number;
  name: string;
}

function NestedList({ categories }: { categories: Category[] }) {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.items.map((item) => (
              // 注意：每个列表都需要独立的 key
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

**注意**：

- 外层循环和内层循环的 key 互不影响
- 每层的 key 只需要在同级中唯一即可
- 不同层级可以有相同的 key 值

### 5. 条件列表渲染

```tsx
function UserList({ users }: { users: User[] }) {
  // 空列表处理
  if (users.length === 0) {
    return <div>No users found</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name}
          {/* 条件渲染列表项内容 */}
          {user.isAdmin && <span> (Admin)</span>}
          {user.isPremium && <span>⭐</span>}
        </div>
      ))}
    </div>
  );
}
```

### 6. 列表性能优化

#### 6.1 虚拟滚动

对于大型列表（成千上万项），只渲染可见区域。

```tsx
// 使用 react-window 或 react-virtualized 库
import { FixedSizeList } from "react-window";

function VirtualList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={400} // 容器高度
      itemCount={items.length}
      itemSize={35} // 每项高度
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### 6.2 memo 优化

```tsx
import { memo } from "react";

// 使用 memo 避免不必要的重渲染
const TodoItem = memo(({ todo, onToggle }: TodoItemProps) => {
  console.log("Rendering:", todo.text);

  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </div>
  );
});

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const toggleTodo = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  return (
    <div>
      {todos.map((todo) => (
        // 只有被点击的项会重新渲染
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
      ))}
    </div>
  );
}
```

#### 6.3 分页

```tsx
function PaginatedList({ items }: { items: Item[] }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div>
      {currentItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}

      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## 📝 最佳实践

### 1. Key 的选择

```tsx
// ✅ 最佳：使用稳定的唯一 ID
{
  users.map((user) => <UserCard key={user.id} user={user} />);
}

// ⚠️ 可接受：数据没有 ID 时，生成唯一标识
{
  items.map((item, index) => (
    <Item key={`${item.name}-${index}`} item={item} />
  ));
}

// ❌ 避免：使用索引（除非列表是静态的）
{
  items.map((item, index) => <Item key={index} item={item} />);
}

// ❌ 避免：使用随机数或每次渲染都变化的值
{
  items.map((item) => <Item key={Math.random()} item={item} />);
}
```

### 2. 保持列表更新不可变

```tsx
// ✅ 正确：创建新数组
const addItem = (newItem: Item) => {
  setItems([...items, newItem]);
};

const removeItem = (id: number) => {
  setItems(items.filter((item) => item.id !== id));
};

// ❌ 错误：直接修改原数组
const addItem = (newItem: Item) => {
  items.push(newItem); // 不会触发重渲染
  setItems(items);
};
```

### 3. 提取列表项组件

```tsx
// ✅ 好：提取为单独的组件
function TodoItem({ todo, onToggle }: TodoItemProps) {
  return (
    <div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </div>
  );
}

function TodoList() {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />
      ))}
    </div>
  );
}

// ❌ 避免：在 map 中写大量 JSX
{
  todos.map((todo) => <div key={todo.id}>{/* 很多 JSX 代码... */}</div>);
}
```

### 4. 处理空列表

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  // ✅ 显式处理空状态
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

### 5. 避免在渲染中创建新数组

```tsx
// ❌ 不好：每次渲染都创建新数组
function Component() {
  return (
    <div>
      {[1, 2, 3].map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
  );
}

// ✅ 好：将静态数组移到组件外
const NUMBERS = [1, 2, 3];

function Component() {
  return (
    <div>
      {NUMBERS.map((n) => (
        <div key={n}>{n}</div>
      ))}
    </div>
  );
}
```

## ❓ 常见问题

### Q1: 为什么不能用索引作为 Key？

**A:** 索引作为 Key 会导致以下问题：

- **性能问题**：当列表重新排序时，React 无法正确识别项的移动，导致不必要的重渲染
- **状态错位**：组件的内部状态可能绑定到错误的项上
- **Bug**：在动态列表（添加、删除、排序）中会出现难以调试的 bug

```tsx
// 示例：为什么索引不安全
const [items, setItems] = useState([
  { id: 1, name: "A" },
  { id: 2, name: "B" },
]);

// 使用索引作为 key
{
  items.map((item, index) => <Input key={index} defaultValue={item.name} />);
}

// 删除第一项后
setItems(items.filter((item) => item.id !== 1));

// 问题：第二个 Input 的值现在显示在第一个位置
// 因为 React 认为 key=0 的组件还是原来的那个
```

### Q2: Fragment 中的列表需要 Key 吗？

**A:** 是的，如果 Fragment 是在 map 中返回的，需要 Key。

```tsx
// ✅ 正确
{
  items.map((item) => (
    <React.Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </React.Fragment>
  ));
}

// 或使用简写（但不能添加 key）
{
  items.map((item) => (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  )); // ❌ 会警告缺少 key
}
```

### Q3: Key 需要全局唯一吗？

**A:** 不需要。Key 只需要在其兄弟元素之间唯一即可。

```tsx
function App() {
  const list1 = [
    { id: 1, text: "A" },
    { id: 2, text: "B" },
  ];
  const list2 = [
    { id: 1, text: "C" },
    { id: 2, text: "D" },
  ]; // id 与 list1 重复，但没问题

  return (
    <div>
      {/* 两个列表的 key 可以相同 */}
      {list1.map((item) => (
        <div key={item.id}>{item.text}</div>
      ))}
      {list2.map((item) => (
        <div key={item.id}>{item.text}</div>
      ))}
    </div>
  );
}
```

### Q4: map() 中可以使用条件渲染吗？

**A:** 可以，有多种方式。

```tsx
// 方法 1：在 map 中使用条件运算符
{
  items.map((item) =>
    item.isVisible ? <div key={item.id}>{item.name}</div> : null
  );
}

// 方法 2：先过滤再渲染（推荐）
{
  items
    .filter((item) => item.isVisible)
    .map((item) => <div key={item.id}>{item.name}</div>);
}

// 方法 3：在 map 内部条件渲染内容
{
  items.map((item) => (
    <div key={item.id}>
      {item.name}
      {item.isSpecial && <span>⭐</span>}
    </div>
  ));
}
```

### Q5: 如何处理大型列表的性能问题？

**A:** 使用以下技术：

1. **虚拟滚动**：只渲染可见项（react-window, react-virtualized）
2. **分页**：分批次显示数据
3. **懒加载**：滚动时加载更多
4. **memo**：缓存列表项组件
5. **useMemo**：缓存计算结果（过滤、排序）

```tsx
import { useMemo } from "react";

function TodoList({ todos, filter }: Props) {
  // 缓存过滤结果
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
  }, [todos, filter]);

  return (
    <div>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
```

## 🔗 相关资源

- [React 列表渲染文档](https://zh-hans.react.dev/learn/rendering-lists)
- [为什么需要 Keys](https://zh-hans.react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [react-window 文档](https://react-window.vercel.app/)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **07 - 表单与输入**：学习表单处理
- **08 - 生命周期与副作用**：掌握 useEffect Hook
- **11 - React Hooks**：深入学习其他 Hooks

---

**💡 提示**：正确使用 Keys 是 React 性能优化的重要一环。记住：使用稳定的唯一标识符，避免使用索引（除非列表是静态的）！
