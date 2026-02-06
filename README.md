# 每日热量摄入计算器 🥗

基于中国临床营养实践的健康热量助手，帮助您计算每日推荐的热量及三大营养素摄入量。

## ✨ 功能特点

- 📊 **科学计算** - 基于标准体重公式（身高-105）和活动水平
- 🥩 **三大营养素** - 自动计算碳水化合物、蛋白质、脂肪推荐摄入量
- 👨‍⚕️ **特殊模式** - 支持糖尿病、脑病、控碳等特殊人群
- 📱 **响应式设计** - 完美适配手机、平板、电脑
- 💾 **本地存储** - 自动保存您的输入数据
- 🎨 **清新界面** - 采用医疗健康风格配色

## 🚀 快速开始

### 方式一：直接打开

双击 `index.html` 文件，在浏览器中打开即可使用。

### 方式二：本地服务器（推荐）

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:8080
```

### 方式三：使用 Python

```bash
# Python 3
python -m http.server 8000

# 访问 http://localhost:8000
```

## 📦 部署到 Vercel / Netlify

### Vercel 部署

1. 安装 Vercel CLI：
```bash
npm install -g vercel
```

2. 在项目目录运行：
```bash
vercel
```

### Netlify 部署

1. 拖拽整个文件夹到 Netlify Drop
2. 或使用 Netlify CLI：
```bash
npm install -g netlify-cli
netlify deploy
```

### GitHub Pages

1. 将代码上传到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择主分支作为源

## 🧮 计算逻辑

### 标准体重
```
标准体重 (kg) = 身高 (cm) - 105
```

### 每日总热量
```
总热量 = 标准体重 × 活动系数
```

**活动系数：**
- 长期卧床：25 kcal/kg
- 轻体力：30 kcal/kg（肥胖时 25 kcal/kg）
- 中体力：35 kcal/kg（肥胖时 30 kcal/kg）
- 重体力：40 kcal/kg（肥胖时 35 kcal/kg）

### 三大营养素比例（默认）
- 碳水化合物：55%
- 蛋白质：15%
- 脂肪：30%

### 特殊人群调整
- **糖尿病**：碳水 45%，脂肪 40%
- **脑病**：脂肪 40%，碳水 45%
- **控碳模式**：碳水 50%，脂肪 35%

## 🎨 技术栈

- 纯 HTML5
- CSS3（Flexbox + Grid）
- 原生 JavaScript（ES6+）
- LocalStorage API

## 📁 项目结构

```
.
├── index.html      # 主页面
├── style.css       # 样式表
├── script.js       # 计算逻辑
├── package.json    # npm 配置
└── README.md       # 说明文档
```

## 🌐 浏览器兼容性

- Chrome/Edge（推荐）
- Firefox
- Safari
- Opera

## ⚖️ 免责声明

本工具基于公开营养学资料及临床经验总结，仅供健康科普与参考使用，不作为医疗诊断或治疗依据。糖尿病、脑病、肾病等特殊人群请务必在专业营养师或医生指导下调整饮食。

## 📄 许可证

MIT License

---

© 2024 每日热量摄入计算器 | 健康热量助手
