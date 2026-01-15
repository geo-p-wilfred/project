import 'dart:io';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/post_model.dart';
import '../services/cloudinary_upload_service.dart';
import '../services/firestore_service.dart';

class UploadScreen extends StatefulWidget {
  const UploadScreen({super.key});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();

  File? _selectedImage;
  bool _isUploading = false;

  final CloudinaryUploadService _cloudinaryService = CloudinaryUploadService();
  final FirestoreService _firestoreService = FirestoreService();
  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  /// Picks an image from the specified source (camera or gallery).
  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        maxWidth: 1200, // Optional: limit size at pick-time too
      );

      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      _showSnackbar("Failed to pick image: $e");
    }
  }

  /// Handles the upload process: Cloudinary first, then Firestore.
  Future<void> _handleUpload() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedImage == null) {
      _showSnackbar("Please select an image first");
      return;
    }

    setState(() => _isUploading = true);

    try {
      // 1. Upload to Cloudinary
      final String imageUrl = await _cloudinaryService.uploadImage(
        _selectedImage!,
      );

      if (imageUrl == null) {
        _showSnackbar("Failed to upload image to Cloudinary");
        setState(() => _isUploading = false);
        return;
      }

      // 2. Prepare Post Data
      final currentUser = FirebaseAuth.instance.currentUser;
      if (currentUser == null) {
        _showSnackbar("User not authenticated");
        setState(() => _isUploading = false);
        return;
      }

      final post = PostModel(
        id: '', // Firestore generates ID
        imageUrl: imageUrl,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        userId: currentUser.uid,
        createdAt: DateTime.now(),
      );

      // 3. Save to Firestore
      final success = await _firestoreService.savePost(post);

      if (success) {
        _showSnackbar("Post uploaded successfully!");
        _resetForm();
      } else {
        _showSnackbar("Failed to save post data to Firestore");
      }
    } catch (e) {
      _showSnackbar("An error occurred: $e");
    } finally {
      setState(() => _isUploading = false);
    }
  }

  void _resetForm() {
    _titleController.clear();
    _descriptionController.clear();
    setState(() {
      _selectedImage = null;
    });
  }

  void _showSnackbar(String message) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Upload to Cloudinary & Firestore")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Image Preview Area
              GestureDetector(
                onTap: () => _pickImage(ImageSource.gallery),
                child: Container(
                  height: 200,
                  decoration: BoxDecoration(
                    color: Colors.grey[200],
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[400]!),
                    image: _selectedImage != null
                        ? DecorationImage(
                            image: FileImage(_selectedImage!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                  child: _selectedImage == null
                      ? const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.add_a_photo,
                              size: 50,
                              color: Colors.grey,
                            ),
                            Text("Tap to pick an image"),
                          ],
                        )
                      : null,
                ),
              ),
              const SizedBox(height: 16),

              // Image Picker Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => _pickImage(ImageSource.camera),
                    icon: const Icon(Icons.camera_alt),
                    label: const Text("Camera"),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _pickImage(ImageSource.gallery),
                    icon: const Icon(Icons.photo_library),
                    label: const Text("Gallery"),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Title Field
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: "Title",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.title),
                ),
                validator: (value) => (value == null || value.isEmpty)
                    ? "Please enter a title"
                    : null,
              ),
              const SizedBox(height: 16),

              // Description Field
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: "Description",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.description),
                ),
                maxLines: 3,
                validator: (value) => (value == null || value.isEmpty)
                    ? "Please enter a description"
                    : null,
              ),
              const SizedBox(height: 32),

              // Upload Button
              ElevatedButton(
                onPressed: _isUploading ? null : _handleUpload,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blueAccent,
                  foregroundColor: Colors.white,
                ),
                child: _isUploading
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(color: Colors.white),
                          SizedBox(width: 12),
                          Text("Uploading..."),
                        ],
                      )
                    : const Text("Upload Post", style: TextStyle(fontSize: 18)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
