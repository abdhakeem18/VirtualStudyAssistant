# API Documentation

This covers all the endpoints used by the Virtual Study Assistant app. Base URL depends on environment:

```
Production: https://api.virtualstudyassistant.com/api/v1
Development: http://localhost:3001/api/v1
```

All requests (except auth) need the Bearer token in the header:

```javascript
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Authentication Endpoints

### POST /auth/login

Log in and get an access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "emailConfirmed": true
  }
}
```

Returns 401 if credentials are wrong, 400 if email/password is missing.

**Example:**
```javascript
const response = await axios.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

---

### POST /auth/signup

Create a new account.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "name": "Jane Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "name": "Jane Doe",
    "emailConfirmed": false
  }
}
```

Returns 409 if email already exists, 400 for invalid format.

---

### POST /auth/verify-email

Verify email with the OTP code sent after signup.

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## Document Endpoints

### GET /document/get

Get all documents for the logged-in user.

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "documents": [
    {
      "id": 1,
      "title": "Chapter 1 - Introduction",
      "group": "Mathematics",
      "created_at": "2025-11-01T10:00:00Z",
      "summaries": "{\"summary\":\"Course introduction...\"}"
    }
  ]
}
```

**Usage:**
```javascript
const api = API('v1');
const response = await api.get('/document/get');
const documents = response.data.documents;
```

---

### GET /document/get/:groupName

Get documents in a specific group.

**Parameters:**
- `groupName` - Name of the group

**Response (200):**
```json
{
  "success": true,
  "documents": [
    {
      "id": 1,
      "document_id": "doc_123",
      "title": "Chapter 1",
      "group": "Mathematics",
      "summaries": "{\"title\":\"Chapter 1\",\"summary\":\"Introduction to algebra...\"}"
    }
  ]
}
```

---

### POST /document/upload

Upload a new document. The server processes it and generates summaries/questions.

**Request (multipart/form-data):**
```
title: "Chapter 1 - Introduction"
group: "Mathematics"
file: [PDF file]
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document uploaded and processed successfully",
  "document": {
    "id": 5,
    "title": "Chapter 1 - Introduction",
    "group": "Mathematics"
  }
}
```

Returns 400 for invalid files, 413 if file is too large, 415 for unsupported file types.

**Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Chapter 1');
formData.append('group', 'Mathematics');
formData.append('file', {
  uri: fileUri,
  name: 'chapter1.pdf',
  type: 'application/pdf',
});

const response = await api.post('/document/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

---

### DELETE /document/group/:groupName

Delete an entire group and all its documents.

**Parameters:**
- `groupName` - Name of the group (URL encode if it has spaces)

**Response (200):**
```json
{
  "success": true,
  "message": "Group deleted successfully"
}
```

Returns 404 if group doesn't exist, 403 if you don't own it.

**Example:**
```javascript
const groupName = encodeURIComponent('Mathematics');
const response = await api.delete(`/document/group/${groupName}`);
```

---

### PUT /document/group/rename

Rename a group.

**Request:**
```json
{
  "oldName": "Mathematics",
  "newName": "Advanced Mathematics"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Group renamed successfully"
}
```

Returns 400 if new name already exists or is invalid, 404 if group doesn't exist.

---

## Quiz Endpoints

### GET /quiz/get/:docId

Get quiz questions for a document.

**Parameters:**
- `docId` - Document ID

**Response (200):**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What is 2 + 2?",
      "options": "[{\"text\":\"3\",\"position\":\"1\",\"explanation\":\"Incorrect\"},{\"text\":\"4\",\"position\":\"2\",\"explanation\":\"Correct!\"}]",
      "answer": "2"
    }
  ]
}
```

**Usage:**
```javascript
const docId = 5;
const response = await api.get(`/quiz/get/${docId}`);
const questions = response.data.questions;
```

---

## Flashcard Endpoints

### GET /flashcard/get/:docId

Get flashcards for a document.

**Parameters:**
- `docId` - Document ID

**Response (200):**
```json
{
  "success": true,
  "flashcards": [
    {
      "id": 1,
      "question": "Define algebra",
      "answer": "A branch of mathematics dealing with symbols and rules"
    }
  ]
}
```

---

## Attempt History Endpoints

### GET /attempts/get/:docId

Get quiz attempt history for a document.

**Parameters:**
- `docId` - Document ID

**Response (200):**
```json
{
  "success": true,
  "history": {
    "id": 10,
    "document_id": 5,
    "quizHistory": "[{\"score\":80,\"date\":\"2025-11-08T10:00:00Z\",\"streak\":3}]",
    "type": "quiz"
  }
}
```

---

### POST /attempts/save

Save a new quiz attempt.

**Request:**
```json
{
  "document_id": 5,
  "quiz_history": "[{\"score\":80,\"date\":\"2025-11-08T10:00:00Z\",\"streak\":3}]",
  "type": "quiz"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attempt saved successfully",
  "id": 11
}
```

---

### PUT /attempts/update/:recordId

Update an existing attempt record.

**Parameters:**
- `recordId` - The record ID

**Request:**
```json
{
  "document_id": 5,
  "quiz_history": "[{\"score\":80},{\"score\":90}]",
  "type": "quiz"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attempt updated successfully"
}
```

---

## User Profile Endpoints

### GET /user/profile

Get the current user's profile.

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

---

### PUT /user/profile

Update profile info.

**Request:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "john.smith@example.com",
    "name": "John Smith"
  }
}
```

---

### PUT /user/change-password

Change your password.

**Request:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

Returns 401 if current password is wrong, 400 if new password doesn't meet requirements.

---

## Error Format

All errors follow this structure:

```json
{
  "success": false,
  "code": 400,
  "message": "Detailed error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## Rate Limits

- Auth endpoints: 5 requests/minute per IP
- Upload endpoints: 10 requests/hour per user
- Other endpoints: 100 requests/minute per user

Hit the limit and you'll get a 429 response.

---

## Status Codes

- 200 - Success
- 201 - Created
- 400 - Bad request (invalid params)
- 401 - Not authorized
- 403 - Forbidden
- 404 - Not found
- 409 - Conflict (like duplicate email)
- 413 - File too large
- 429 - Rate limited
- 500 - Server error

---

## Usage Tips

1. Always check `response.data.success` before using the data
2. Handle errors with user-friendly messages
3. Store tokens securely (AsyncStorage for React Native)
4. Add retry logic for network failures
5. Validate input before sending requests

---

Updated: November 8, 2025
