import { useState } from 'react'
import './App.css'

// 导入所有教程模块
import BasicConcepts from './01-basic-concepts/BasicConcepts'
import JSXIntroduction from './02-jsx-introduction/JSXIntroduction'
import ComponentsProps from './03-components-props/ComponentsProps'
import StateEvents from './04-state-events/StateEvents'
import ConditionalRendering from './05-conditional-rendering/ConditionalRendering'
import ListsKeys from './06-lists-keys/ListsKeys'
import FormsInput from './07-forms-input/FormsInput'
import LifecycleEffects from './08-lifecycle-effects/LifecycleEffects'
import Routing from './09-routing/Routing'
import ProjectPractice from './10-project-practice/ProjectPractice'
import ReactHooks from './11-react-hooks/ReactHooks'

// 教程菜单配置（移到组件外避免重复创建）
const TUTORIAL_SECTIONS = [
  { id: 1, title: '01 - React 基础概念', component: BasicConcepts },
  { id: 2, title: '02 - JSX 语法介绍', component: JSXIntroduction },
  { id: 3, title: '03 - 组件与 Props', component: ComponentsProps },
  { id: 4, title: '04 - State 与事件处理', component: StateEvents },
  { id: 5, title: '05 - 条件渲染', component: ConditionalRendering },
  { id: 6, title: '06 - 列表与 Keys', component: ListsKeys },
  { id: 7, title: '07 - 表单与输入', component: FormsInput },
  { id: 8, title: '08 - 生命周期与副作用', component: LifecycleEffects },
  { id: 9, title: '09 - 路由导航', component: Routing },
  { id: 10, title: '10 - 项目实践', component: ProjectPractice },
  { id: 11, title: '11 - React 常用钩子', component: ReactHooks },
] as const

const App = () => {
  const [activeSection, setActiveSection] = useState(1)

  const ActiveComponent = TUTORIAL_SECTIONS.find(section => section.id === activeSection)?.component

  return (
    <div className="app">
      <header className="app-header">
        <h1>React 入门教程</h1>
        <p>从零开始学习 React - 注重基础，强化交互</p>
      </header>
      
      <div className="app-container">
        {/* 侧边导航栏 */}
        <nav className="sidebar" aria-label="教程章节导航">
          <h3>教程目录</h3>
          <ul className="nav-list">
            {TUTORIAL_SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.id)}
                  aria-current={activeSection === section.id ? 'page' : undefined}
                  aria-label={`切换到${section.title}`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 主内容区域 */}
        <main className="main-content">
          {ActiveComponent && <ActiveComponent />}
          
          {/* 底部固定显示的哲理文字 */}
          <footer className="main-footer">
            <p className="quote-text">
              "学习是一场持续的旅程，每一次实践都是成长的阶梯。保持好奇，勇于探索，你终将抵达理想的彼岸。"
            </p>
            <p className="quote-author">—— 致每一位努力前行的开发者</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App