"""
SQLAlchemy database models
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    """
    User model for authentication
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def verify_password(self, password: str) -> bool:
        """Verify password against hash"""
        return pwd_context.verify(password, self.hashed_password)
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)

class Document(Base):
    """
    Document model for storing uploaded documents
    """
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    status = Column(String, nullable=False, default="NOT_STARTED")  # NOT_STARTED, PROCESSING, DONE, ERROR
    created_at = Column(DateTime, default=datetime.utcnow)
    ai_result_json = Column(Text, nullable=True)  # Store AI analysis result
    markdown_content = Column(Text, nullable=True)  # Store full text as markdown
    person_data = Column(Text, nullable=True)  # Store extracted person info (JSON string)
    vehicle_data = Column(Text, nullable=True)  # Store extracted vehicle info (JSON string)
    
    # Relationship with pages
    pages = relationship("Page", back_populates="document")

class Page(Base):
    """
    Page model for storing document pages
    """
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    page_index = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)
    
    # Relationship with document
    document = relationship("Document", back_populates="pages")

class Job(Base):
    """
    Job model for tracking processing jobs
    """
    __tablename__ = "jobs"
    
    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    status = Column(String, nullable=False, default="PROCESSING")  # PROCESSING, DONE, ERROR
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)

class InsurancePurchase(Base):
    """
    Insurance Purchase History model
    """
    __tablename__ = "insurance_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Insurance Package Information
    package_name = Column(String, nullable=False)  # Tên gói bảo hiểm
    package_type = Column(String, nullable=False)  # Loại: TNDS, Sức khỏe, Thiên tai, etc.
    insurance_company = Column(String, nullable=True)  # Công ty bảo hiểm
    
    # Customer Information
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_email = Column(String, nullable=True)
    customer_address = Column(Text, nullable=True)
    customer_id_number = Column(String, nullable=True)  # Số CCCD/CMND
    
    # Insurance Details
    coverage_amount = Column(String, nullable=True)  # Số tiền bảo hiểm
    premium_amount = Column(String, nullable=False)  # Phí bảo hiểm (VNĐ)
    payment_frequency = Column(String, nullable=True)  # Tần suất: Năm, Tháng, Quý
    
    # Dates
    start_date = Column(String, nullable=True)  # Ngày bắt đầu (DD/MM/YYYY)
    end_date = Column(String, nullable=True)  # Ngày kết thúc (DD/MM/YYYY)
    
    # Beneficiary Information (if applicable)
    beneficiary_name = Column(String, nullable=True)
    beneficiary_relationship = Column(String, nullable=True)
    
    # Vehicle Information (for vehicle insurance)
    vehicle_type = Column(String, nullable=True)  # Xe máy, Ô tô
    license_plate = Column(String, nullable=True)  # Biển số xe
    
    # Payment Information
    payment_method = Column(String, nullable=True)  # Tiền mặt, Chuyển khoản, Thẻ
    payment_status = Column(String, default="PENDING")  # PENDING, PAID, FAILED
    transaction_id = Column(String, nullable=True)  # Mã giao dịch
    
    # Document Reference
    document_id = Column(String, ForeignKey("documents.id"), nullable=True)  # Liên kết với tài liệu upload
    
    # Status
    policy_number = Column(String, nullable=True)  # Số hợp đồng bảo hiểm
    status = Column(String, default="ACTIVE")  # ACTIVE, EXPIRED, CANCELLED
    
    # Additional Data (JSON)
    additional_data = Column(Text, nullable=True)  # Thông tin bổ sung dạng JSON
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", backref="insurance_purchases")