### 🔐 Environment Variables Required for Google Cloud Storage

```bash
GCS_PROJECT_ID=your-gcs-project-id
GCS_BUCKET_NAME=your-bucket-name
GCS_KEY_FILENAME=path/to/your/service-account-key.json
GCS_SIGNED_URL_EXPIRES=3600
```

# Client create article with uploaded file

When user is creating an article
user chooses an uploaded file to Google Cloud Storage
user inputs title, content, etc.
user submits the form

## step 1

=> send POST /api/files/presigned-url to get presigned URL and fileId

```
POST /api/files/presigned-url
```

**Body:**

```json
{
  "filename": "document.pdf",
  "contentType": "application/pdf",
  "size": 1024000,
  "checksum": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
}
```

**Response:**

```json
{
  "fileId": 123,
  "key": "uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.pdf",
  "exists": false,
  "uploadUrl": "https://storage.googleapis.com/bucket-name/uploads/..."
}
```

## step 2

```
user uploads file to Google Cloud Storage using the presigned URL
=> if fails, show error message and stop
=> if succeeds, proceed to step 3
```

## step 3

=> send POST /api/articles to create article with key and fileId (do not use only fileId because use can submit some fileId not possible to access)

```
POST /api/articles
```

```json
{
  "title": "Article Title",
  "content": "Article content...",
  "fileId": 123,
  "key": "uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479.pdf"
}
```

# Server creates article and associates it with the uploaded file.

```
Find File by fileId and key
If not found, return error
If found, create Article and associate with File
```

### Example cURL command to upload file to Google Cloud Storage using presigned URL

```bash

curl -X PUT \
  -H "Content-Type: image/png" \
  -H "x-goog-content-length-range: 0,1461" \
  --upload-file ~/Downloads/doubt.png \
  "https://storage.googleapis.com/adonis-app/uploads/3535da02-5961-46f9-8115-3a316b1f145f.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=account-for-adonis-app%40skilful-charmer-453409-t5.iam.gserviceaccount.com%2F20250919%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250919T073940Z&X-Goog-Expires=3600&X-Goog-SignedHeaders=content-type%3Bhost%3Bx-goog-content-length-range&X-Goog-Signature=54c906f3e8854105f99c99c346ecb14c249865e5c63ca67340982f3230b03dff714d82d5067ff6d67c81d110fb9bf9619c77ea0fe614493b502fea63cbb45dbd9acc03e300684871f5279b38c85255551e72f0177f422c2bae6d2cd1311a23329ed764cf860aacfdfe611cc6877687404963b898b87a5813f4bdd68af2c7f37f5abd89304a294d0c482ba69991e245793233e5c5acabba38fb4ba8c6fb652bb0cc5393307763f7b01d2206cf8591ee1a4d3049d7b24793e5520a94b4c5832a2423c8ae02aa5cf2b55b5ee807749d45cc2ea2f7d2e3734bc21c36ddba81398e8eec48c22e6fe5a0e2ba702dc598fd1fa6eeddf0c465bd798543a6ce6aa1d088f4"
```

### URL for reading file

```bash
curl -X GET \
  "https://storage.googleapis.com/adonis-app/uploads/3535da02-5961-46f9-8115-3a316b1f145f.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=account-for-adonis-app%40skilful-charmer-453409-t5.iam.gserviceaccount.com%2F20250924%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250924T035028Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=12461ca659cd881b56f00af12a80a951694bc71ddf9262639b05a7af4821ccc3400cc93e99e36b49ab7b63aaf159195fccdc36557be222731fda390ea2b6dd009db6e9b8e0bb8f731cf74c63531802cd1e3a39970038ed01cb32885287a6a992a226e7da6bbfbe7b77d229095bfe0e40c45fe5535d087b6cb909d4ff2691bd9e9606f6674b72510368ceaf96143716d4a9b6240eaa906f232aa60fcc5df53da4d7d1921ef5a061eaa7344cc4e5897907f145d52a6b1244aafefedeba9d099bb480c69d275f22b05f798143d7f102c55b45fc0c02bcc72e9739d61561fc951fcf0a7e5aeaa3e48fac13b9cefca270834e62a7d5233af008592a488bb9cd1e036b"

```
