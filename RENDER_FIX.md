# Fix for Render Isolated Containers Issue

## Problem

On Render, **Node.js and Python backends run in separate isolated containers**. 

When Node.js saves a file to `/tmp/uploads/file.csv` and sends the file path to Python, Python cannot access it because each container has its own isolated `/tmp` directory.

```
Node.js Container (rag-backend-k46a)     Python Container (rag-python-backend)
├── /tmp/uploads/                        ├── /tmp/uploads/
│   └── file.csv  ✅                    │   └── (empty) ❌
```

## Solution

**Send file content instead of file path!**

### Changes Made:

#### 1. Node.js Backend (`backend/src/controllers/dataset.controller.js`)
- Modified `callPython()` to read file content
- Convert file to base64
- Send `file_content` instead of `file_path`

#### 2. Python Backend (`python-backend/src/schemas/dataset.py`)
- Added `file_content` field to `UploadDatasetRequest`
- Accepts base64 encoded file content

#### 3. Python Backend (`python-backend/src/api/routes/upload_dataset.py`)
- Decode base64 content
- Save to temporary file
- Process the file
- Clean up temp file after processing

## How It Works Now:

```
1. User uploads file
   ↓
2. Node.js saves to /tmp/uploads/file.csv
   ↓
3. Node.js reads file content → converts to base64
   ↓
4. Node.js sends base64 content to Python (NOT file path)
   ↓
5. Python decodes base64 → saves to temp file
   ↓
6. Python processes temp file → generates chunks
   ↓
7. Python deletes temp file
   ↓
8. Chunks sent to vector database (Pinecone/Chroma)
```

## Deployment Steps:

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Fix isolated container issue: send file content instead of path"
   git push origin main
   ```

2. **Render auto-deploys** both backends

3. **Test**: Upload dataset - should work! ✅

## Files Modified:

- ✅ `backend/src/controllers/dataset.controller.js`
- ✅ `python-backend/src/schemas/dataset.py`
- ✅ `python-backend/src/api/routes/upload_dataset.py`

## Why This Works:

- ✅ No shared filesystem needed
- ✅ File content transferred via HTTP (base64)
- ✅ Each container processes files in its own `/tmp`
- ✅ Temporary files deleted after processing
- ✅ Permanent data stored in vector database, not filesystem
