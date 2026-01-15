import 'package:flutter/foundation.dart';
import 'dart:typed_data';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:image_picker/image_picker.dart';

class StorageService {
  // Initialize Firebase Storage instance
  // This will use the default bucket configured in firebase_options.dart
  final FirebaseStorage _storage = FirebaseStorage.instance;

  // Get the storage bucket name for reference
  String get bucketName => _storage.bucket;

  Future<String> uploadDamageImage(
    XFile imageFile,
    Uint8List imageBytes,
    String reportId,
  ) async {
    try {
      // Clean file name to avoid issues with special characters
      String fileName = imageFile.name;
      if (fileName.isEmpty) {
        fileName = 'image_$reportId.jpg';
      }
      // Remove any path separators and special characters
      fileName = fileName.replaceAll(RegExp(r'[^\w\-_\.]'), '_');

      final ref = _storage.ref().child('damage_reports/$reportId/$fileName');

      debugPrint(
        'Uploading image: $fileName, size: ${imageBytes.length} bytes',
      );

      // Use putData with bytes for all platforms (more reliable)
      final uploadTask = ref.putData(
        imageBytes,
        SettableMetadata(contentType: 'image/jpeg'),
      );

      // Wait for upload to complete
      await uploadTask;

      final downloadUrl = await ref.getDownloadURL();
      debugPrint('Image uploaded successfully. URL: $downloadUrl');

      return downloadUrl;
    } catch (e, stackTrace) {
      print('Storage upload error: $e');
      print('Stack trace: $stackTrace');
      throw Exception('Error uploading image: $e');
    }
  }

  Future<void> deleteImage(String imageUrl) async {
    try {
      final ref = _storage.refFromURL(imageUrl);
      await ref.delete();
    } catch (e) {
      debugPrint('Error deleting image: $e');
    }
  }
}
