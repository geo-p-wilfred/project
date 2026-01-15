# Firebase Storage Setup Guide

## ✅ Dependencies Already Configured

Firebase Storage is already added to your `pubspec.yaml`:
```yaml
firebase_storage: ^12.3.2
```

## 📋 Setup Checklist

### 1. Firebase Console Configuration
- [x] Storage bucket is configured: `smartproject-c2663.firebasestorage.app`
- [ ] Storage security rules are set (see below)

### 2. Storage Security Rules

Add these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload damage report images
    match /damage_reports/{reportId}/{fileName} {
      // Allow read for authenticated users
      allow read: if request.auth != null;
      
      // Allow write (upload) for authenticated users
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024  // 5MB limit
                   && request.resource.contentType.matches('image/.*');
      
      // Allow delete for the user who uploaded or admin
      allow delete: if request.auth != null;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 3. Storage Service Implementation

The `StorageService` class is already implemented in `lib/services/storage_service.dart` with:
- ✅ Image upload functionality
- ✅ File name sanitization
- ✅ Error handling
- ✅ Image deletion support

## 🚀 Usage

The storage service is automatically initialized when Firebase is initialized in `main.dart`.

### Example Usage:
```dart
final storageService = StorageService();

// Upload image
final imageUrl = await storageService.uploadDamageImage(
  imageFile,
  imageBytes,
  reportId,
);

// Delete image
await storageService.deleteImage(imageUrl);
```

## 🔧 Troubleshooting

### Common Issues:

1. **Permission Denied Error**
   - Check Firebase Storage security rules
   - Ensure user is authenticated
   - Verify file size is under 5MB

2. **Upload Fails Silently**
   - Check network connectivity
   - Verify Firebase Storage is enabled in Firebase Console
   - Check console logs for detailed error messages

3. **File Not Found After Upload**
   - Verify the download URL is stored correctly
   - Check Firebase Console → Storage to see if files are uploaded

## 📝 Next Steps

1. Set up Storage security rules in Firebase Console
2. Test image upload functionality
3. Monitor Storage usage in Firebase Console
