# 表单与输入

## 📖 本节概述

表单是 Web 应用中用户交互的重要方式。在 React 中，表单处理有其独特的方式。本节将详细介绍受控组件、非受控组件、表单验证、以及各种表单处理的最佳实践。

## 🎯 学习目标

学完本节后，你将能够：

- ✅ 理解受控组件和非受控组件的区别
- ✅ 掌握各种表单元素的处理方法
- ✅ 学会表单验证技术
- ✅ 掌握表单提交处理
- ✅ 理解表单状态管理
- ✅ 学会处理复杂表单
- ✅ 掌握表单性能优化

## 📚 核心知识点

### 1. 受控组件 vs 非受控组件

#### 1.1 受控组件（Controlled Components）

受控组件是指表单数据由 React 组件的 state 管理的输入组件。

```tsx
function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <input
      type="text"
      value={value} // 由 state 控制
      onChange={(e) => setValue(e.target.value)} // 更新 state
    />
  );
}
```

**特点：**

- 表单数据存储在组件 state 中
- 通过 `onChange` 事件更新 state
- "单一数据源" - state 是唯一的数据来源
- 可以立即验证和格式化输入

**优点：**

- 完全控制输入值
- 可以实时验证
- 可以格式化输入
- 易于测试
- 符合 React 的数据流

**缺点：**

- 需要为每个输入编写处理函数
- 代码量较多
- 每次输入都会触发重渲染

#### 1.2 非受控组件（Uncontrolled Components）

非受控组件是指表单数据由 DOM 本身管理。

```tsx
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    // 通过 ref 获取值
    console.log(inputRef.current?.value);
  };

  return (
    <div>
      <input type="text" ref={inputRef} defaultValue="初始值" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

**特点：**

- 表单数据存储在 DOM 中
- 使用 `ref` 获取值
- 使用 `defaultValue` 设置初始值
- 更接近传统 HTML 表单

**优点：**

- 代码更简洁
- 不会频繁重渲染
- 适合简单表单
- 集成第三方 DOM 库更容易

**缺点：**

- 失去对输入的即时控制
- 难以实时验证
- 不符合 React 的单向数据流
- 测试相对困难

#### 1.3 如何选择？

| 场景                 | 推荐         |
| -------------------- | ------------ |
| 需要实时验证         | 受控组件     |
| 需要格式化输入       | 受控组件     |
| 需要动态禁用提交按钮 | 受控组件     |
| 简单表单，只需提交值 | 非受控组件   |
| 文件上传             | 非受控组件   |
| 集成第三方 DOM 库    | 非受控组件   |
| 大多数情况           | **受控组件** |

### 2. 各种表单元素

#### 2.1 文本输入

```tsx
function TextInput() {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本"
      />
      <p>你输入了: {text}</p>
    </div>
  );
}
```

#### 2.2 多行文本

```tsx
function TextareaInput() {
  const [text, setText] = useState("");

  return (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={4}
      placeholder="输入多行文本"
    />
  );
}
```

**注意**：React 中 `<textarea>` 使用 `value` 属性，而不是子元素。

```tsx
// ❌ HTML 方式（React 中不推荐）
<textarea>初始文本</textarea>

// ✅ React 方式
<textarea value={text} onChange={handleChange} />
```

#### 2.3 下拉选择

```tsx
function SelectInput() {
  const [selected, setSelected] = useState("apple");

  return (
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="apple">苹果</option>
      <option value="banana">香蕉</option>
      <option value="orange">橙子</option>
    </select>
  );
}
```

**多选下拉框：**

```tsx
function MultiSelect() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.selectedOptions;
    const values = Array.from(options).map((option) => option.value);
    setSelected(values);
  };

  return (
    <select multiple value={selected} onChange={handleChange}>
      <option value="apple">苹果</option>
      <option value="banana">香蕉</option>
      <option value="orange">橙子</option>
    </select>
  );
}
```

#### 2.4 复选框

```tsx
// 单个复选框
function Checkbox() {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      同意条款
    </label>
  );
}

// 多个复选框
function MultiCheckbox() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleChange = (value: string) => {
    setCheckedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checkedItems.includes("apple")}
          onChange={() => handleChange("apple")}
        />
        苹果
      </label>
      <label>
        <input
          type="checkbox"
          checked={checkedItems.includes("banana")}
          onChange={() => handleChange("banana")}
        />
        香蕉
      </label>
    </div>
  );
}
```

#### 2.5 单选按钮

```tsx
function RadioButtons() {
  const [selected, setSelected] = useState("male");

  return (
    <div>
      <label>
        <input
          type="radio"
          value="male"
          checked={selected === "male"}
          onChange={(e) => setSelected(e.target.value)}
        />
        男
      </label>
      <label>
        <input
          type="radio"
          value="female"
          checked={selected === "female"}
          onChange={(e) => setSelected(e.target.value)}
        />
        女
      </label>
    </div>
  );
}
```

#### 2.6 文件上传

```tsx
function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      console.log("上传文件:", file.name);
      // 处理文件上传
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 文件输入总是非受控的 */}
      <input type="file" ref={fileInputRef} />
      <button type="submit">上传</button>
    </form>
  );
}
```

**注意**：文件输入框由于安全原因，必须是非受控组件。

### 3. 处理多个输入

#### 3.1 使用单个对象 State

```tsx
function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: 0,
    gender: "male",
    agree: false,
  });

  // 统一处理函数
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("表单数据:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />
        同意条款
      </label>
      <button type="submit">提交</button>
    </form>
  );
}
```

#### 3.2 使用多个 State

```tsx
function Form() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 每个输入有自己的处理函数
  return (
    <form>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </form>
  );
}
```

### 4. 表单验证

#### 4.1 基本验证

```tsx
function ValidatedForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      return "邮箱不能为空";
    }
    if (!emailRegex.test(value)) {
      return "邮箱格式不正确";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }
    console.log("提交成功:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleChange} />
      {error && <span style={{ color: "red" }}>{error}</span>}
      <button type="submit">提交</button>
    </form>
  );
}
```

#### 4.2 完整表单验证

```tsx
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function CompleteForm() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // 验证规则
  const validate = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.username) {
      errors.username = "用户名不能为空";
    } else if (data.username.length < 3) {
      errors.username = "用户名至少 3 个字符";
    }

    if (!data.email) {
      errors.email = "邮箱不能为空";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "邮箱格式不正确";
    }

    if (!data.password) {
      errors.password = "密码不能为空";
    } else if (data.password.length < 6) {
      errors.password = "密码至少 6 个字符";
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "两次密码不一致";
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 实时验证
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors(newErrors);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });

    // 失焦时验证
    const newErrors = validate(formData);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 标记所有字段为已触摸
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // 验证
    const newErrors = validate(formData);
    setErrors(newErrors);

    // 如果没有错误，提交表单
    if (Object.keys(newErrors).length === 0) {
      console.log("提交成功:", formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.username && errors.username && <span>{errors.username}</span>}
      </div>
      {/* 其他字段... */}
      <button type="submit">提交</button>
    </form>
  );
}
```

#### 4.3 使用验证库

推荐使用成熟的验证库：

- **Formik** - 完整的表单解决方案
- **React Hook Form** - 轻量级，性能好
- **Yup** - Schema 验证库（配合 Formik）
- **Zod** - TypeScript 优先的验证库

```tsx
// React Hook Form 示例
import { useForm } from "react-hook-form";

function FormWithLibrary() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "邮箱不能为空",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "邮箱格式不正确",
          },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">提交</button>
    </form>
  );
}
```

### 5. 表单提交

#### 5.1 基本提交

```tsx
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认提交行为

    // 处理表单数据
    console.log("表单提交");
  };

  return <form onSubmit={handleSubmit}>{/* 表单字段 */}</form>;
}
```

#### 5.2 异步提交

```tsx
function AsyncForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("提交失败");
      }

      console.log("提交成功");
    } catch (error) {
      setSubmitError("提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表单字段 */}
      {submitError && <div style={{ color: "red" }}>{submitError}</div>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

### 6. 输入格式化

```tsx
function FormattedInput() {
  const [phone, setPhone] = useState("");

  const formatPhone = (value: string) => {
    // 只保留数字
    const numbers = value.replace(/\D/g, "");

    // 格式化为 XXX-XXXX-XXXX
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
      7,
      11
    )}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <input
      type="tel"
      value={phone}
      onChange={handleChange}
      placeholder="XXX-XXXX-XXXX"
    />
  );
}
```

### 7. 自定义表单 Hook

```tsx
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues({
      ...values,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return { values, handleChange, resetForm };
}

// 使用
function MyForm() {
  const { values, handleChange, resetForm } = useForm({
    username: "",
    email: "",
  });

  return (
    <form>
      <input name="username" value={values.username} onChange={handleChange} />
      <input name="email" value={values.email} onChange={handleChange} />
      <button type="button" onClick={resetForm}>
        重置
      </button>
    </form>
  );
}
```

## 📝 最佳实践

### 1. 优先使用受控组件

```tsx
// ✅ 推荐：受控组件
<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// ⚠️ 仅在必要时使用非受控组件
<input ref={inputRef} defaultValue="初始值" />
```

### 2. 合理组织表单 State

```tsx
// ✅ 相关数据组合在一起
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
});

// ❌ 避免过度拆分
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
// ... 太多 state
```

### 3. 实现良好的用户体验

```tsx
function GoodUXForm() {
  return (
    <form>
      {/* 清晰的标签 */}
      <label htmlFor="email">邮箱</label>
      <input id="email" type="email" />

      {/* 有用的占位符 */}
      <input placeholder="例如: user@example.com" />

      {/* 即时反馈 */}
      {error && <span style={{ color: "red" }}>{error}</span>}

      {/* 禁用状态提示 */}
      <button disabled={isSubmitting}>
        {isSubmitting ? "提交中..." : "提交"}
      </button>
    </form>
  );
}
```

### 4. 性能优化

```tsx
// 使用 useCallback 避免重新创建函数
const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
}, []);

// 防抖验证
const debouncedValidate = useMemo(
  () =>
    debounce((value: string) => {
      // 验证逻辑
    }, 500),
  []
);
```

## ❓ 常见问题

### Q1: 受控组件和非受控组件哪个更好？

**A:** 大多数情况下推荐使用受控组件：

- 提供更好的控制和验证
- 符合 React 的数据流
- 更容易测试

但在以下情况可以考虑非受控组件：

- 简单表单，只需要提交时的值
- 文件上传（必须非受控）
- 性能要求极高的大型表单

### Q2: 如何处理表单性能问题？

**A:**

- 使用 `useCallback` 缓存事件处理函数
- 大型表单考虑分页或分步骤
- 使用 React Hook Form 等性能优化的库
- 避免不必要的验证（如输入时验证，改为失焦验证）

### Q3: 如何重置表单？

**A:**

```tsx
function Form() {
  const initialValues = { username: "", email: "" };
  const [formData, setFormData] = useState(initialValues);

  const resetForm = () => {
    setFormData(initialValues);
  };

  return (
    <form>
      {/* 表单字段 */}
      <button type="button" onClick={resetForm}>
        重置
      </button>
    </form>
  );
}
```

### Q4: 如何处理嵌套对象的表单数据？

**A:**

```tsx
const [user, setUser] = useState({
  name: "",
  address: {
    city: "",
    country: "",
  },
});

const handleChange = (field: string, value: string) => {
  if (field.includes(".")) {
    // 嵌套字段
    const [parent, child] = field.split(".");
    setUser({
      ...user,
      [parent]: {
        ...user[parent],
        [child]: value,
      },
    });
  } else {
    setUser({ ...user, [field]: value });
  }
};

// 使用
handleChange("address.city", "Beijing");
```

## 🔗 相关资源

- [React 表单文档](https://zh-hans.react.dev/reference/react-dom/components/input)
- [React Hook Form](https://react-hook-form.com/)
- [Formik](https://formik.org/)
- [Yup 验证库](https://github.com/jquense/yup)

## ⏭️ 下一步

完成本节学习后，建议继续学习：

- **08 - 生命周期与副作用**：学习 useEffect Hook
- **09 - 路由**：掌握 React Router
- **11 - React Hooks**：深入学习更多 Hooks

---

**💡 提示**：表单处理是 React 开发的常见任务。掌握受控组件和验证技术，能让你构建出用户体验良好的应用！
