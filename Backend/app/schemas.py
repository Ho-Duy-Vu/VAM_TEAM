"""
Pydantic schemas for API request/response validation
"""

from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

# Authentication Schemas
class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    password: str
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        if len(v) < 3:
            raise ValueError('Full name must be at least 3 characters')
        return v
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response"""
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UploadResponse(BaseModel):
    """Response for document upload"""
    document_id: str

class ProcessingRequest(BaseModel):
    """Request for document processing"""
    document_id: str

class JobResponse(BaseModel):
    """Response for job status"""
    status: str  # PROCESSING, DONE, ERROR
    progress: int  # 0-100

class PageResponse(BaseModel):
    """Response for document page"""
    page_index: int
    image_url: str

class DocumentResponse(BaseModel):
    """Response for document metadata"""
    document_id: str
    status: str
    pages: List[PageResponse]

class RegionData(BaseModel):
    """Individual region in overlay data"""
    id: str
    type: str
    page: int
    text: str
    bbox: List[int]  # [x, y, width, height]

class RegionResponse(BaseModel):
    """Response for document overlay regions"""
    regions: List[RegionData]

class DocumentFieldsResponse(BaseModel):
    """Response for structured document fields"""
    policy: Dict[str, Any]
    animals: List[Dict[str, Any]]
    attestation: Dict[str, Any]

# Error response models
class ErrorDetail(BaseModel):
    """Error detail structure"""
    message: str
    code: Optional[str] = None

class ErrorResponse(BaseModel):
    """Standard error response"""
    detail: str
    errors: Optional[List[ErrorDetail]] = None