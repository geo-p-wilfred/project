import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';

/// A senior-level service for handling Cloudinary uploads with robust error handling.
class CloudinaryUploadService {
  // Configuration constants
  // ACTION REQUIRED: Replace these with your actual Cloudinary credentials
  static const String _cloudName = "your_cloud_name";
  static const String _uploadPreset = "your_unsigned_preset";

  /// Uploads a [File] to Cloudinary using Unsigned Upload mode.
  ///
  /// [cloudName] and [uploadPreset] can be provided dynamically.
  /// Returns the secure_url [String] if successful.
  /// Throws an [Exception] with details if the upload fails.
  Future<String> uploadImage(
    File imageFile, {
    String? cloudName,
    String? uploadPreset,
  }) async {
    final activeCloudName = cloudName ?? _cloudName;
    final activeUploadPreset = uploadPreset ?? _uploadPreset;

    if (activeCloudName == "your_cloud_name" ||
        activeUploadPreset == "your_unsigned_preset") {
      throw Exception('Please provide valid Cloudinary credentials.');
    }

    // 1. Validation (Size & Format)
    final int fileSizeInBytes = await imageFile.length();
    final double fileSizeInMB = fileSizeInBytes / (1024 * 1024);

    if (fileSizeInMB > 10) {
      throw Exception(
        'File size exceeds 10MB limit. Optimized uploads recommended.',
      );
    }

    final String extension = imageFile.path.split('.').last.toLowerCase();
    if (!['jpg', 'jpeg', 'png', 'webp'].contains(extension)) {
      throw Exception(
        'Unsupported file format: .$extension. Use JPG, PNG, or WebP.',
      );
    }

    try {
      // 2. Pre-upload optimization (Compression)
      final File optimizedFile = await _optimizeImage(imageFile);

      // 3. Prepare the payload
      final String uploadUrl =
          "https://api.cloudinary.com/v1_1/$activeCloudName/image/upload";
      final request = http.MultipartRequest("POST", Uri.parse(uploadUrl));

      request.fields['upload_preset'] = activeUploadPreset;
      request.files.add(
        await http.MultipartFile.fromPath('file', optimizedFile.path),
      );

      // 4. Execute request
      final streamedResponse = await request.send().timeout(
        const Duration(seconds: 30),
        onTimeout: () =>
            throw Exception('Upload timed out. Check your connection.'),
      );

      final response = await http.Response.fromStream(streamedResponse);

      // 4. Handle Response
      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final String secureUrl = data['secure_url'];

        debugPrint('Cloudinary: Successfully uploaded image. URL: $secureUrl');
        return secureUrl;
      } else {
        // Detailed error parsing
        final Map<String, dynamic> errorData = jsonDecode(response.body);
        final String errorMessage =
            errorData['error']?['message'] ?? 'Unknown Cloudinary error';
        throw Exception(
          'Cloudinary Error (${response.statusCode}): $errorMessage',
        );
      }
    } on SocketException {
      throw Exception('No Internet connection. Please check your network.');
    } catch (e) {
      rethrow;
    }
  }

  /// Compresses the image to ensure faster uploads and lower storage costs.
  Future<File> _optimizeImage(File file) async {
    try {
      final tempDir = await getTemporaryDirectory();
      final targetPath =
          "${tempDir.path}/optimized_${DateTime.now().millisecondsSinceEpoch}.jpg";

      final compressedXFile = await FlutterImageCompress.compressAndGetFile(
        file.absolute.path,
        targetPath,
        quality: 75, // 75% quality is the sweet spot for web delivery
        format: CompressFormat.jpeg,
      );

      return compressedXFile != null ? File(compressedXFile.path) : file;
    } catch (e) {
      debugPrint('Optimization failed, proceeding with original file: $e');
      return file;
    }
  }

  /// Utility to apply transformations via URL manipulation.
  /// e.g., transformations = 'w_500,c_fill'
  String getTransformedUrl(String originalUrl, String transformations) {
    if (!originalUrl.contains("/upload/")) return originalUrl;
    final parts = originalUrl.split("/upload/");
    return "${parts[0]}/upload/$transformations/${parts[1]}";
  }
}
