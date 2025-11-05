# Database Structure Documentation

## Overview

The SheRises platform uses MongoDB with separate collections for different types of data to ensure proper organization and scalability.

## Collections

### 1. **users** - User Accounts
Stores user account information, authentication data, and user preferences.

**Key Fields:**
- `name`, `email`, `password` (hashed)
- `role`: 'user', 'admin', 'seller'
- `avatar`: URL to profile image (references Media collection)
- `isMentor`, `mentorProfile`
- `enrolledCourses`, `cart`, `orders`

**Related Collections:**
- References: `Media` (profile images), `Order`, `Course`, `Product`

---

### 2. **sellerapplications** - Seller Applications ⭐ NEW
Separate collection for seller application submissions. This ensures applications are tracked independently from user accounts.

**Key Fields:**
- `user`: Reference to User (one application per user)
- `businessName`, `businessType`, `address`
- `status`: 'pending', 'approved', 'rejected'
- `reviewedBy`, `reviewedAt`, `rejectionReason`
- `documents`: Array of document references

**Use Cases:**
- Track seller application status
- Store business information
- Admin review and approval process
- Document management

**API Endpoints:**
- `POST /api/seller-applications` - Submit application
- `GET /api/seller-applications` - List all (Admin)
- `GET /api/seller-applications/my-application` - Get user's application
- `PATCH /api/seller-applications/:id/approve` - Approve (Admin)
- `PATCH /api/seller-applications/:id/reject` - Reject (Admin)

---

### 3. **media** - Media Files (Images & Documents) ⭐ NEW
Centralized storage for all uploaded files including profile images, product images, and documents.

**Key Fields:**
- `filename`, `originalName`, `mimeType`, `size`
- `url`: Accessible URL for the file
- `type`: 'profile_image', 'product_image', 'course_image', 'document', 'other'
- `uploadedBy`: Reference to User
- `associatedId`, `associatedModel`: Links to related entities
- `metadata`: Additional info (dimensions, alt text, etc.)
- `isActive`: Soft delete flag

**Use Cases:**
- Profile images for users
- Product images
- Course images
- Seller application documents
- Any other uploaded files

**API Endpoints:**
- `POST /api/media/upload` - Upload file
- `GET /api/media/profile/:userId` - Get user's profile images
- `GET /api/media/product/:productId` - Get product images
- `GET /api/media/:id` - Get single media file
- `DELETE /api/media/:id` - Delete media file

**Storage:**
- Files stored in `backend/uploads/` directory
- Served via `/uploads` static route
- Database stores metadata and references

---

### 4. **messages** - Private Messages ⭐ NEW
Separate collection for private messaging between users.

**Key Fields:**
- `sender`, `recipient`: References to User
- `content`: Message text
- `type`: 'text', 'image', 'file', 'system'
- `conversationId`: Groups messages between two users
- `attachments`: Array of file references
- `isRead`, `readAt`: Read status
- `isDeleted`, `deletedBy`: Soft delete tracking

**Use Cases:**
- Private messaging between users
- Mentor-mentee communication
- Support messages
- Community member conversations

**API Endpoints:**
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get messages with specific user
- `POST /api/messages` - Send message
- `PATCH /api/messages/:id/read` - Mark as read
- `DELETE /api/messages/:id` - Delete message
- `GET /api/messages/unread-count` - Get unread count

**Features:**
- Automatic conversation grouping
- Read receipts
- Soft delete (both users must delete)
- Unread message tracking

---

### 5. **products** - Marketplace Products
Stores product information for the marketplace.

**Key Fields:**
- `name`, `description`, `price`, `originalPrice`
- `category`: 'handicrafts', 'food', 'beauty', 'clothing', 'jewelry', 'other'
- `images`: Array of image URLs (can reference Media collection)
- `seller`: Reference to User (seller)
- `inStock`, `stockQuantity`
- `rating`, `reviews`, `reviewCount`
- `verified`, `fastDelivery`

**Related Collections:**
- References: `User` (seller), `Media` (product images), `Order`

---

### 6. **forumposts** - Community Forum Posts
Stores forum discussion posts and comments.

**Key Fields:**
- `title`, `content`
- `author`: Reference to User
- `category`: 'General', 'Business', 'Digital Skills', 'Traditional Crafts', 'Support'
- `likes`: Array of user references
- `comments`: Array of comment objects
- `likeCount`, `commentCount`
- `isDeleted`: Soft delete flag

**Related Collections:**
- References: `User` (author, likes, comments)

---

### 7. **orders** - Product Orders
Stores order information and transaction details.

**Key Fields:**
- `user`: Reference to User
- `items`: Array of order items
- `totalAmount`, `shippingAddress`
- `paymentMethod`, `orderStatus`
- `createdAt`, `updatedAt`

**Related Collections:**
- References: `User`, `Product`

---

### 8. **courses** - Skill Development Courses
Stores course information and content.

**Key Fields:**
- `title`, `description`, `instructor`
- `category`, `duration`, `price`
- `lessons`, `enrolledStudents`
- `rating`, `reviews`

**Related Collections:**
- References: `User` (instructor), `Media` (course images)

---

## Database Relationships

```
User
├── hasMany SellerApplication (one-to-one via unique constraint)
├── hasMany Media (profile images)
├── hasMany Product (as seller)
├── hasMany Order
├── hasMany Message (as sender/recipient)
└── hasMany ForumPost

SellerApplication
├── belongsTo User
└── hasMany Media (documents)

Media
├── belongsTo User (uploadedBy)
└── belongsTo Product/Course/User (via associatedId)

Message
├── belongsTo User (sender)
└── belongsTo User (recipient)

Product
├── belongsTo User (seller)
└── hasMany Media (images)

ForumPost
├── belongsTo User (author)
└── hasMany User (likes)
```

## Benefits of This Structure

1. **Separation of Concerns**: Each collection has a specific purpose
2. **Scalability**: Easy to scale individual collections
3. **Data Integrity**: Proper references and constraints
4. **Performance**: Indexed fields for faster queries
5. **Flexibility**: Easy to add new features
6. **Security**: Proper access control per collection

## Indexes

All collections have indexes on:
- Frequently queried fields
- Foreign key references
- Timestamp fields for sorting
- Status/type fields for filtering

## Best Practices

1. **Always use references** instead of embedding for related data
2. **Use soft deletes** (isDeleted flag) instead of hard deletes
3. **Store file metadata** in Media collection, not in user/product models
4. **Validate data** at the route level before saving
5. **Use transactions** for critical operations (e.g., order creation)

