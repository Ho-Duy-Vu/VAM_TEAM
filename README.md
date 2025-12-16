# VAM TEAM - Document Intelligence System
**Author:** Hồ Duy Vũ  
📧 **Email:** duyvu11092004@gmail.com

## Overview
A full-stack document intelligence system for processing and analyzing Animal Health Certificates and insurance documents using AI-powered document processing.

## Tech Stack

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database
- **PyMuPDF** - PDF processing
- **Pillow** - Image processing
- **Uvicorn** - ASGI server

### Frontend
- **React** - JavaScript library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Query** - Data fetching
- **Zustand** - State management
- **React Router** - Navigation

## Features

### Document Processing
- **Multi-format Support**: PDF, PNG, JPG, JPEG
- **PDF Page Extraction**: Automatically splits multi-page PDFs into individual pages
- **Image Processing**: Resize and optimize images for analysis
- **Real-time Status Tracking**: Monitor document processing progress

### Document Analysis
- **Structured Data Extraction**: Extract policy information, animal details, veterinary certification
- **Region Detection**: Identify text, tables, signatures, and other document regions
- **Visual Overlay**: Interactive document regions with highlighting
- **Export Options**: JSON and Markdown export

### User Interface
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Theme**: Toggle between themes
- **Real-time Updates**: Live progress tracking
- **Interactive Views**: Visual, JSON, and Markdown document views

## Project Structure

```
VUHO_VAM/
├── Backend/                 # FastAPI backend
│   ├── app/
│   │   ├── database.py     # Database setup
│   │   ├── models.py       # SQLAlchemy models
│   │   └── schemas.py      # Pydantic schemas
│   ├── data/               # File storage
│   │   ├── docs/          # PDF documents
│   │   └── images/        # Image files
│   ├── mock/              # Mock data
│   ├── main.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
│
└── Frontend/               # React frontend
    ├── public/            # Static assets
    ├── src/
    │   ├── api/          # API client
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── store/        # Zustand stores
    │   └── routes/       # React Router setup
    ├── package.json      # Node.js dependencies
    └── vite.config.ts    # Vite configuration
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## API Documentation

### Upload Document
```
POST /documents/upload
```
Upload a document file (PDF, PNG, JPG, JPEG)

### Process Document
```
POST /documents/{document_id}/process
```
Start AI processing for uploaded document

### Get Document Info
```
GET /documents/{document_id}
```
Retrieve document metadata and pages

### Get Document Regions
```
GET /documents/{document_id}/overlay
```
Get detected regions for visual overlay

### Get Extracted Data
```
GET /documents/{document_id}/json
```
Get structured extracted data

### Update Document Data
```
PUT /documents/{document_id}/json
```
Update extracted document data

## Document Types Supported

### Animal Health Certificate
- Policy information (carrier, issue date, certificate number)
- Animal details (species, identification, health status)
- Veterinary certification (veterinarian info, clinic details)
- Attestation (health examination, vaccination records)

### Insurance Policies
- Basic policy information
- Coverage details
- Customer information

## Development

### Running Tests
```bash
# Backend tests
cd Backend
python -m pytest

# Frontend tests
cd Frontend
npm test
```

### Building for Production
```bash
# Frontend build
cd Frontend
npm run build

# Backend deployment
cd Backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Team

VAM TEAM - Document Intelligence Specialists

## Support

For questions or support, please contact the development team.
