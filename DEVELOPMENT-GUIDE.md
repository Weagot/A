# 开发指南

## 分阶段开发策略

本项目采用分阶段开发策略，避免早期认证配置问题影响基础功能开发。

### 第一阶段：基础功能开发（当前阶段）

**目标**: 完成所有核心业务功能，暂时禁用认证系统

#### 开发重点
1. **订单管理模块**
   - 订单创建、编辑、删除
   - 订单列表展示和搜索
   - 订单状态管理

2. **物流管理模块**
   - 物流信息录入
   - 运输状态跟踪
   - 物流轨迹查询

3. **仓储管理模块**
   - 入库管理
   - 出库管理
   - 库存查询

4. **财务管理模块**
   - 费用计算
   - 账单管理
   - 成本分析

#### 技术配置
- 暂时禁用 Firebase 认证
- 使用本地状态管理
- 模拟数据进行开发
- 专注于 UI/UX 和业务逻辑

#### 环境变量设置
```bash
# .env.local
NEXT_PUBLIC_ENABLE_AUTH=false
NEXT_PUBLIC_ENABLE_FIREBASE=false
```

### 第二阶段：认证系统集成

**目标**: 在基础功能稳定后，集成 Firebase 认证和权限系统

#### 开发重点
1. **用户认证**
   - 用户注册和登录
   - 密码重置
   - 用户信息管理

2. **权限管理**
   - 基于角色的访问控制
   - 页面级权限控制
   - 功能级权限控制

3. **数据安全**
   - 数据加密
   - 安全传输
   - 审计日志

#### 技术配置
- 启用 Firebase 认证
- 配置 Firestore 安全规则
- 实现路由保护
- 添加权限检查

#### 环境变量设置
```bash
# .env.local
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_FIREBASE=true

# Firebase 客户端配置
NEXT_PUBLIC_FIREBASE_PROJECT_ID=euro-ecommerce
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=euro-ecommerce.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=euro-ecommerce.appspot.com
# 其他 Firebase 配置项...

# Firebase Admin SDK 配置（服务端）
FIREBASE_ADMIN_PROJECT_ID=euro-ecommerce
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@euro-ecommerce.iam.gserviceaccount.com
# 服务账户密钥文件路径
GOOGLE_APPLICATION_CREDENTIALS=path/to/euro-ecommerce-firebase-adminsdk-fbsvc-60e3a23cd9.json
```

#### Firebase 密钥配置说明

**服务账户密钥文件位置**: 
`/c:/Users/Administrator/Downloads/euro-ecommerce-firebase-adminsdk-fbsvc-60e3a23cd9.json`

**安全注意事项**:
1. **开发环境**: 可以使用文件路径方式配置
2. **生产环境**: 必须使用环境变量，不要将密钥文件提交到代码仓库
3. **密钥管理**: 将密钥文件移动到项目外的安全位置
4. **权限控制**: 确保密钥文件只有必要的人员可以访问

**推荐的密钥配置方式**:
```bash
# 方式1: 使用文件路径（开发环境）
GOOGLE_APPLICATION_CREDENTIALS=../secrets/euro-ecommerce-firebase-adminsdk.json

# 方式2: 使用环境变量（生产环境）
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 开发最佳实践

### 1. 代码组织
```
components/
├── common/          # 通用组件
├── business/        # 业务组件
├── layout/          # 布局组件
└── forms/           # 表单组件

lib/
├── hooks/           # 自定义 Hooks
├── utils/           # 工具函数
├── types/           # 类型定义
└── constants/       # 常量定义
```

### 2. 状态管理
- 使用 React Context 进行全局状态管理
- 使用 useState 和 useReducer 进行本地状态管理
- 避免过度使用全局状态

### 3. 数据模拟
在第一阶段，使用模拟数据进行开发：

```typescript
// lib/mock-data.ts
export const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    status: 'pending',
    createDate: '2024-01-15',
    // ... 其他字段
  },
  // ... 更多模拟数据
];
```

### 4. 组件开发规范

```typescript
// 组件模板
import React from 'react';
import { Box, Typography } from '@mui/material';

interface ComponentProps {
  title: string;
  // 其他 props
}

const Component: React.FC<ComponentProps> = ({ title }) => {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
      {/* 组件内容 */}
    </Box>
  );
};

export default Component;
```

### 5. 错误处理

```typescript
// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

## 调试技巧

### 1. 开发工具
- 使用 React Developer Tools
- 使用 Chrome DevTools
- 启用 Next.js 调试模式

### 2. 日志记录
```typescript
// 开发环境日志
const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

### 3. 性能监控
```typescript
// 性能测量
const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
```

## 常见问题解决

### 1. 路由问题
- 确保文件命名正确（`page.tsx`, `layout.tsx`）
- 检查路由嵌套结构
- 重启开发服务器

### 2. 样式问题
- 检查 Material UI 主题配置
- 确认 CSS 优先级
- 使用浏览器开发工具调试

### 3. 类型错误
- 定义清晰的 TypeScript 接口
- 使用类型断言谨慎
- 启用严格模式

### 4. 性能问题
- 使用 React.memo 优化组件
- 实现虚拟滚动（大列表）
- 代码分割和懒加载

## 测试策略

### 1. 单元测试
```bash
# 安装测试依赖
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### 2. 集成测试
- 测试组件交互
- 测试数据流
- 测试用户场景

### 3. 端到端测试
```bash
# 使用 Playwright 或 Cypress
npm install --save-dev @playwright/test
```

## 部署准备

### 1. 构建优化
```bash
# 分析构建包大小
npm run build
npm run analyze
```

### 2. 环境配置
- 生产环境变量
- CDN 配置
- 缓存策略

### 3. 监控设置
- 错误监控
- 性能监控
- 用户行为分析

---

记住：**先让功能跑起来，再考虑完善细节！** 这样可以更快看到成果，保持开发动力。