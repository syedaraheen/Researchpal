# ResearchPal AI 2.0 – The AI Research Co-pilot

![ResearchPal Logo](https://img.shields.io/badge/ResearchPal-AI%20Research%20Co--pilot-blue?style=for-the-badge&logo=book&logoColor=white)

## 🎯 Overview

ResearchPal is a comprehensive full-stack web application designed to revolutionize academic research workflows. It combines AI-powered analysis with gamification elements to make research more engaging and efficient. The platform helps researchers search, analyze, and compare academic papers, identify research gaps, and visualize knowledge relationships through an intuitive RPG-style dashboard.

## ✨ Key Features

### 🔍 **Smart Paper Search**
- **Multi-source Search**: Integrates Semantic Scholar and arXiv APIs for comprehensive paper discovery
- **AI-powered Recommendations**: Uses Google Gemini AI to provide intelligent paper suggestions
- **Advanced Filtering**: Filter by publication date, citations, relevance, and more

### 📄 **Intelligent Paper Analysis**
- **PDF Upload & Processing**: Upload research papers and get instant AI-generated summaries
- **RAG-powered Q&A**: Ask specific questions about uploaded papers using Retrieval-Augmented Generation
- **Content Extraction**: Automatically extracts text, metadata, and key information from PDFs

### 🔬 **Research Tools**
- **Paper Comparison**: Side-by-side analysis of research papers with AI-generated insights
- **Research Gap Detection**: Identify unexplored areas and research opportunities
- **Knowledge Graph Visualization**: Interactive network graphs showing paper relationships
- **Timeline Generation**: Create chronological evolution of research topics
- **Debate Simulation**: AI-powered academic debate between different research perspectives

### 🎮 **Gamified Experience**
- **XP System**: Earn experience points for research activities
- **Quest System**: Complete research challenges and unlock achievements
- **Progress Tracking**: Visual progress bars and achievement badges
- **Level Progression**: Unlock new features as you advance

### 🔐 **User Management**
- **Secure Authentication**: JWT-based authentication with password hashing
- **User Profiles**: Track research interests, specialties, and achievements
- **Admin Panel**: Administrative controls for system management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Visualization**: Cytoscape.js, D3.js, Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLModel with SQLite (production-ready for PostgreSQL)
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: Google Gemini API
- **External APIs**: Semantic Scholar, arXiv
- **File Processing**: PyMuPDF for PDF extraction
- **Vector Search**: FAISS for RAG implementation

### Development Tools
- **Package Manager**: pnpm (frontend), pip (backend)
- **Environment**: Python 3.10+, Node.js 18+
- **Database Migrations**: Alembic

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and pnpm (or npm/yarn)
- **Python** 3.10+
- **Git** for version control

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ResearchPal
```

### 2. Environment Setup

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-google-gemini-api-key
SEMANTIC_SCHOLAR_API_KEY=your-semantic-scholar-api-key  # Optional
DATABASE_URL=sqlite:///./researchpal.db
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

#### Frontend Environment
```bash
cd frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv researchpalenv
source researchpalenv/bin/activate  # On Windows: researchpalenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations (if needed)
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
ResearchPal/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── routers/           # API route handlers
│   │   │   ├── auth.py        # Authentication endpoints
│   │   │   ├── papers.py      # Paper management
│   │   │   ├── analytics.py   # Analytics & insights
│   │   │   └── agent.py       # AI agent endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── gemini.py      # Google Gemini integration
│   │   │   ├── embeddings.py # Vector embeddings
│   │   │   └── rag.py         # RAG implementation
│   │   ├── tools/             # External tool integrations
│   │   │   └── paper_search.py # Paper search utilities
│   │   ├── utils/             # Utility functions
│   │   │   └── pdf.py         # PDF processing
│   │   ├── models.py          # Database models
│   │   ├── auth.py            # Authentication logic
│   │   ├── db.py              # Database configuration
│   │   └── main.py            # FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── researchpal.db         # SQLite database
├── frontend/                   # Next.js frontend
│   ├── app/                   # App Router pages
│   │   ├── dashboard/         # Main dashboard pages
│   │   │   ├── search/        # Paper search
│   │   │   ├── upload/        # Paper upload
│   │   │   ├── compare/       # Paper comparison
│   │   │   ├── gaps/          # Research gaps
│   │   │   ├── graph/         # Knowledge graph
│   │   │   ├── debate/        # Debate simulation
│   │   │   └── timeline/      # Timeline generation
│   │   ├── auth/              # Authentication pages
│   │   └── admin/             # Admin panel
│   ├── components/            # React components
│   │   ├── QuestCard.tsx      # Quest display
│   │   ├── XPBar.tsx          # XP progress bar
│   │   ├── RAGAsk.tsx         # RAG Q&A interface
│   │   ├── BubbleMap.tsx      # Gap visualization
│   │   └── TimelineChart.tsx  # Timeline visualization
│   ├── package.json           # Node.js dependencies
│   └── next.config.js         # Next.js configuration
└── README.md                  # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Papers
- `GET /papers/search` - Search papers from external sources
- `POST /papers/upload` - Upload and analyze PDF papers
- `POST /papers/compare` - Compare two papers
- `POST /papers/find-gaps` - Find research gaps

### AI Agent
- `POST /agent/decide` - AI-powered intent detection and tool selection
- `POST /timeline` - Generate research timeline
- `POST /debate` - Simulate academic debate

### RAG (Retrieval-Augmented Generation)
- `POST /rag/ingest` - Ingest paper into vector database
- `POST /rag/ask` - Ask questions about ingested papers

## 🎮 Gamification System

### XP (Experience Points)
- **Paper Upload**: +50 XP
- **Paper Analysis**: +25 XP
- **Gap Discovery**: +100 XP
- **Quest Completion**: Variable XP based on difficulty

### Quests
- **Research Explorer**: Find 3 highly cited papers
- **Gap Hunter**: Upload a paper and identify research gaps
- **Paper Detective**: Compare two papers and find differences
- **Knowledge Builder**: Create a knowledge graph with 5+ papers

### Achievements
- **First Steps**: Upload your first paper
- **Researcher**: Complete 10 research activities
- **Scholar**: Reach level 5
- **Expert**: Identify 5 research gaps

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render)
1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (Production)
- **Recommended**: PostgreSQL on Neon.tech or Supabase
- **Alternative**: Keep SQLite for MVP deployments

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Pydantic models for request validation
- **File Upload Security**: PDF validation and size limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for AI capabilities
- **Semantic Scholar** for academic paper data
- **arXiv** for open-access research papers
- **FastAPI** for the excellent Python web framework
- **Next.js** for the powerful React framework

## 📞 Support

For support, email support@researchpal.ai or join our Discord community.

---

**Made with ❤️ for the research community**# Researchpal
