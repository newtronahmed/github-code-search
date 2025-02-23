# AI-Powered Code Sample Explorer

A web application that enhances GitHub code sample discovery through intelligent AI-powered search, retrieval, and code analysis. This project provides advanced code exploration tools with natural language processing and machine learning capabilities.

## 🌟 Features

- **Intelligent Code Search**: Natural language search powered by AI to find relevant code samples
- **Code Analysis**: AI-powered analysis of code samples with detailed explanations
- **GitHub Integration**: Direct access to GitHub repositories for code samples
- **Advanced Filtering**: Filter results by language, stars, and other metrics
- **Interactive UI**: Modern, responsive interface for seamless code exploration

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **AI Integration**: Hugging Face AI
- **API Integration**: GitHub API
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form
- **Routing**: Wouter
- **Type Safety**: Zod + TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- GitHub API token
- Hugging Face API token

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=postgresql://...
GITHUB_TOKEN=your_github_token
HUGGINGFACE_API_KEY=your_huggingface_token
```

4. Start the development server:
```bash
npm run dev
```

## 📊 Database Setup

The application uses PostgreSQL with Drizzle ORM. To set up the database:

1. Create a new PostgreSQL database
2. Set the `DATABASE_URL` environment variable
3. Run database migrations:
```bash
npm run db:push
```

## 🌍 Deployment Options

### 1. Vercel

Perfect for frontend deployment with serverless functions:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy using Vercel's automatic deployment

### 2. Railway

Great for full-stack deployment with PostgreSQL support:

1. Create a new Railway project
2. Add PostgreSQL plugin
3. Configure environment variables
4. Deploy from GitHub

### 3. DigitalOcean App Platform

Excellent for scalable full-stack applications:

1. Create a new App Platform app
2. Connect your repository
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

### 4. Render

Good option for full-stack deployment:

1. Create a new Web Service
2. Add PostgreSQL database
3. Configure environment variables
4. Deploy from GitHub

## 📝 API Documentation

### Search Endpoint
```
GET /api/search
```
Query parameters:
- `query`: Search query string
- `language`: Programming language filter (optional)

### Code Analysis Endpoint
```
POST /api/analyze
```
Body:
```json
{
  "code": "string",
  "language": "string"
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
