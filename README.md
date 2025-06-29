# 头程物流管理系统

## 1. 项目简介

本项目旨在开发一个现代化的头程物流管理系统，用于简化和自动化从海外供应商到最终仓库的物流流程。系统将覆盖订单管理、国际运输、清关、仓储和配送等关键环节，提高物流效率，降低运营成本，并提供实时的数据洞察。

## 2. 核心功能

- **订单管理**: 创建、跟踪和管理采购订单，支持多供应商和多SKU。
- **物流跟踪**: 实时跟踪货物从起运地到目的地的状态，包括海运、空运和陆运。
- **清关管理**: 管理报关文件，跟踪清关进度，确保合规性。
- **派送安排**: 智能化派送调度系统，优化配送路线，管理配送员和车辆资源。
- **库存管理**: 管理海外仓和本地仓的库存，支持入库、出库和盘点。
- **财务管理**: 自动计算运费、关税和其他杂费，生成对账单。
- **报表与分析**: 提供多维度的数据报表，如时效分析、成本分析和供应商绩效评估。
- **用户与权限**: 基于角色的访问控制，确保数据安全。

## 3. 技术选型

### 前端
- **框架**: Next.js 15 (React 19)
- **UI组件库**: Material UI (MUI) 7
- **状态管理**: React Hooks
- **表单处理**: React Hook Form + Yup
- **认证**: Firebase Authentication
- **样式**: Tailwind CSS + Emotion

### 后端
- **框架**: Node.js (NestJS) + TypeScript
- **数据库/认证**: Firebase（Firestore + Firebase Authentication）
- **缓存**: 可选（如需高并发可后续集成Redis）

### 部署
- **容器化**: Docker
- **编排**: Kubernetes
- **CI/CD**: GitHub Actions
- **监控**: Prometheus + Grafana

## 4. 项目结构

```
. 
├── docs/                # 项目文档
│   ├── api-design.md    # API设计文档
│   ├── database-design.md # 数据库设计文档
│   └── system-design.md # 系统设计文档
├── frontend/           # 前端代码 (Next.js)
│   ├── app/            # Next.js应用目录
│   │   ├── (auth)/     # 认证相关页面
│   │   └── (dashboard)/ # 仪表盘相关页面
│   ├── components/     # 可复用组件
│   ├── lib/            # 工具库和服务
│   └── public/         # 静态资源
├── backend/            # 后端代码
│   ├── src/            # 源代码
│   │   ├── modules/    # 业务模块
│   │   ├── common/     # 公共模块
│   │   └── main.ts     # 入口文件
│   └── prisma/         # Prisma配置和迁移
├── docker-compose.yml  # Docker配置
└── README.md           # 项目说明
```

## 5. 开发计划 (里程碑)

- **M1 (已完成)**: 
  - 搭建前后端基础架构
  - 实现用户认证和授权
  - 开发仪表盘基础界面

- **M2 (进行中)**: 
  - 开发订单管理模块
  - 开发物流跟踪模块
  - 开发库存管理模块
  - 集成Firebase服务

- **M3 (计划中)**: 
  - 开发清关管理模块
  - 开发财务管理模块
  - 完善报表与分析功能
  - 进行第一轮内部测试

- **M4 (计划中)**: 
  - 根据测试反馈进行优化
  - 完善文档和用户指南
  - 准备上线部署

## 6. 开发指南

### 开发策略

**重要提示**: 为了避免早期开发中的认证和权限问题影响基础功能开发，我们采用分阶段开发策略：

1. **第一阶段**: 完成所有基础功能（订单管理、物流跟踪、库存管理等），暂时禁用Firebase认证
2. **第二阶段**: 基础功能稳定后，再集成Firebase认证和权限系统

这样可以确保开发者能够快速看到功能效果，避免在认证配置上浪费时间。

### 环境要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 或 yarn >= 1.22.0
- **Git**: >= 2.30.0
- **浏览器**: Chrome 90+, Firefox 88+, Safari 14+

### 快速开始

#### 1. 克隆项目
```bash
git clone <repository-url>
cd E
```

#### 2. 前端开发

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器将在 [http://localhost:3000](http://localhost:3000) 启动（如果3000端口被占用，会自动使用3001等其他端口）。

#### 3. 环境配置（可选）

在开发初期，Firebase配置是可选的。如果需要配置：

```bash
# 复制环境变量模板（如果存在）
cp frontend/.env.example frontend/.env.local

# 编辑环境变量文件
# NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 4. 后端开发

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置Firebase Admin环境变量
cp .env.example .env
# 编辑.env文件，填入你的Firebase服务账号信息

# 启动开发服务器（如有）
# npm run start:dev
```

> 当前后端以Firebase为唯一数据库和认证方案，后端如需扩展API可直接基于firebase-admin开发，无需额外数据库部署。


### 常见问题解决

#### 前端开发问题

**1. 端口冲突**
```bash
# 如果默认端口被占用，指定其他端口
npm run dev -- -p 3001
```

**2. 依赖安装失败**
```bash
# 清除缓存重新安装
npm cache clean --force
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules && del package-lock.json
npm install
```

**3. 路由404问题**
- 检查文件命名是否符合 Next.js 约定（`page.tsx`, `layout.tsx`）
- 确认路由组织结构正确（使用括号分组路由如 `(dashboard)`）
- 重启开发服务器强制重新编译：`Ctrl+C` 然后 `npm run dev`
- 检查文件是否有语法错误

**4. TypeScript 类型错误**
```bash
# 重新生成类型文件
npm run build
```

**5. Firebase 配置问题（第二阶段）**
- 确保 `.env.local` 文件中的 Firebase 配置正确
- 检查 Firebase 项目权限设置
- 验证 Firebase 服务是否已启用
- 在开发初期可以暂时禁用 Firebase 相关功能

### 开发工作流

#### 代码规范
```bash
# 代码检查
npm run lint

# 类型检查
npx tsc --noEmit
```

#### Git 工作流
1. 从 main 分支创建功能分支：`git checkout -b feature/功能名称`
2. 开发完成后提交代码：`git commit -m "feat: 添加功能描述"`
3. 推送到远程仓库：`git push origin feature/功能名称`
4. 创建 Pull Request
5. 代码审查通过后合并

### 部署指南

#### Vercel 部署（推荐）
1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

#### 手动部署
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

#### Docker 部署
```bash
# 构建镜像
docker build -t logistics-frontend .

# 运行容器
docker run -p 3000:3000 logistics-frontend
```

### 项目特色

- **分阶段开发**: 先完成基础功能，后集成认证系统，避免早期开发阻塞
- **现代技术栈**: Next.js 15 + React 19 + Material UI 7
- **类型安全**: 全面使用 TypeScript
- **响应式设计**: 支持桌面和移动端
- **模块化架构**: 清晰的目录结构和组件分离
- **开发友好**: 热重载、代码检查、类型提示

### API 文档

- [API 设计文档](./docs/api-design.md)
- [数据库设计](./docs/database-design.md)
- [系统架构](./docs/system-design.md)
- [项目结构说明](./frontend/PROJECT-STRUCTURE.md)

## 7. 贡献指南

### 开发环境设置
1. Fork 项目仓库
2. 克隆到本地：`git clone <your-fork-url>`
3. 安装依赖：`cd E/frontend && npm install`
4. 创建功能分支：`git checkout -b feature/功能名称`

### 代码提交规范
使用 Conventional Commits 规范：
- `feat:` 新功能
- `fix:` 修复bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

### Pull Request 流程
1. 确保代码通过 lint 检查：`npm run lint`
2. 确保没有 TypeScript 错误：`npx tsc --noEmit`
3. 更新相关文档
4. 填写详细的 PR 描述
5. 等待代码审查

### 开发路线图

#### 当前版本 (v0.1.0)
- ✅ 基础项目架构搭建
- ✅ Next.js + React + Material UI 集成
- ✅ 基础路由结构
- 🔄 仪表盘基础界面开发

#### 下一版本 (v0.2.0)
- 📋 订单管理模块
  - 订单创建和编辑
  - 订单列表和搜索
  - 订单状态跟踪
- 🚚 派送安排模块
  - 派送任务创建和分配
  - 配送员和车辆管理
  - 路线优化和调度
  - 派送状态实时跟踪
- 📦 物流管理模块
  - 物流信息录入
  - 运输状态更新
  - 物流轨迹查询

#### 未来版本 (v0.3.0+)
- 🏭 仓储管理模块
- 💰 财务管理模块
- 📊 报表与分析
- 🔐 Firebase 认证集成
- 👥 用户权限管理

### 派送安排模块详细功能

#### 核心功能
1. **派送任务管理**
   - 基于已清关订单自动生成派送任务
   - 支持手动创建和批量创建派送任务
   - 任务优先级设置和紧急派送处理
   - 派送时间窗口管理（客户指定时间段）

2. **配送资源管理**
   - **配送员管理**: 配送员信息、工作状态、技能标签
   - **车辆管理**: 车辆信息、载重限制、车型分类
   - **仓库管理**: 配送起点、货物存储位置
   - **资源调度**: 智能分配配送员和车辆

3. **路线优化**
   - 基于地理位置的智能路线规划
   - 考虑交通状况和配送时间窗口
   - 多点配送路线优化
   - 配送成本计算和优化

4. **实时跟踪**
   - 配送员位置实时跟踪
   - 派送状态更新（已取货、配送中、已送达、异常等）
   - 客户通知和配送进度推送
   - 配送异常处理和重新调度

5. **客户服务**
   - 配送预约和时间确认
   - 配送进度查询
   - 签收确认和电子签名
   - 客户评价和反馈收集

#### 数据结构设计

**派送任务 (DeliveryTask)**
- 任务ID、订单关联、客户信息
- 配送地址、联系方式、特殊要求
- 货物信息、重量体积、包装要求
- 时间窗口、优先级、状态
- 分配的配送员和车辆

**配送员 (DeliveryDriver)**
- 基本信息、联系方式、工作状态
- 技能标签、服务区域、载重能力
- 当前位置、工作计划、历史绩效

**车辆 (DeliveryVehicle)**
- 车辆信息、载重限制、燃油类型
- 当前状态、维护记录、使用成本
- GPS设备、保险信息

**配送路线 (DeliveryRoute)**
- 路线规划、预计时间、实际耗时
- 途经点、距离计算、成本分析
- 优化建议、历史数据

#### 界面设计要点

1. **派送调度中心**
   - 地图视图显示所有派送任务和配送员位置
   - 任务列表支持拖拽分配和批量操作
   - 实时状态监控和异常告警

2. **任务管理界面**
   - 任务创建向导，支持从订单导入
   - 任务详情页面，包含完整配送信息
   - 批量操作支持（批量分配、状态更新等）

3. **资源管理界面**
   - 配送员和车辆的统一管理
   - 工作计划和排班管理
   - 绩效统计和评估

4. **移动端配送员应用**
   - 任务接收和状态更新
   - 导航和路线指引
   - 客户沟通和签收确认

#### 技术实现要点

1. **地图集成**: 集成高德地图或百度地图API
2. **路线优化算法**: 实现TSP（旅行商问题）求解算法
3. **实时通信**: WebSocket实现实时位置和状态更新
4. **移动端支持**: PWA或React Native开发配送员应用
5. **数据分析**: 配送效率分析和成本优化建议

### 技术支持

如果在开发过程中遇到问题：

1. **查看文档**: 首先查看项目文档和常见问题解决部分
2. **检查日志**: 查看浏览器控制台和终端输出
3. **重启服务**: 尝试重启开发服务器
4. **清除缓存**: 清除 npm 缓存和 node_modules

### 开发建议

- **优先级**: 先完成核心业务功能，再考虑认证和权限
- **数据展示规则**: 
  - **详情页面**: 必须包含实体的所有完整信息（如订单详情应包含所有订单字段：基本信息、海运信息、文件信息、产品信息等）
  - **列表页面**: 仅展示关键摘要信息，从详情页面的完整数据中提取部分字段显示
  - **数据一致性**: 确保详情页面是数据的完整来源，列表页面是其子集
- **测试**: 每个功能模块完成后进行基础测试
- **文档**: 及时更新代码注释和文档
- **版本控制**: 频繁提交，保持代码历史清晰

## 8. 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 9. 联系我们

- **项目维护者**: 开发团队
- **问题反馈**: [GitHub Issues](https://github.com/your-repo/issues)
- **功能建议**: 欢迎通过 Issues 提出改进建议
- **技术交流**: 欢迎 Fork 项目并提交 Pull Request

---

**开始您的物流管理系统开发之旅！** 🚀

记住：先让基础功能跑起来，再完善细节。这样可以更快看到成果，保持开发动力！