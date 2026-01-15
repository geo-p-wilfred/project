import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/cloudinary_upload_service.dart';

class StandaloneUploadScreen extends StatefulWidget {
  const StandaloneUploadScreen({super.key});

  @override
  State<StandaloneUploadScreen> createState() => _StandaloneUploadScreenState();
}

class _StandaloneUploadScreenState extends State<StandaloneUploadScreen> {
  final _cloudinaryService = CloudinaryUploadService();
  final _picker = ImagePicker();

  // Controllers for Credential Inputs
  final _cloudNameController = TextEditingController();
  final _presetController = TextEditingController();

  File? _selectedFile;
  String? _uploadedUrl;
  bool _isLoading = false;
  bool _showConfig = true; // Toggle to show/hide credentials area

  @override
  void dispose() {
    _cloudNameController.dispose();
    _presetController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(
        source: source,
        imageQuality: 80,
      );

      if (pickedFile != null) {
        setState(() {
          _selectedFile = File(pickedFile.path);
          _uploadedUrl = null;
        });
      }
    } catch (e) {
      _showSnackbar('Failed to pick image: $e');
    }
  }

  Future<void> _handleUpload() async {
    if (_selectedFile == null) return;

    // Validate UI inputs
    if (_cloudNameController.text.isEmpty || _presetController.text.isEmpty) {
      _showSnackbar('Please enter Cloud Name and Upload Preset');
      setState(() => _showConfig = true);
      return;
    }

    setState(() => _isLoading = true);

    try {
      final url = await _cloudinaryService.uploadImage(
        _selectedFile!,
        cloudName: _cloudNameController.text.trim(),
        uploadPreset: _presetController.text.trim(),
      );

      setState(() {
        _uploadedUrl = url;
        _showConfig = false; // Hide config on success for better view
      });
      _showSnackbar('Upload Successful!', isError: false);
    } catch (e) {
      _showSnackbar('Upload Failed: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showSnackbar(String message, {bool isError = true}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('Senior Cloudinary Direct'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: Icon(
              _showConfig ? Icons.settings_applications : Icons.settings,
            ),
            onPressed: () => setState(() => _showConfig = !_showConfig),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
        child: Column(
          children: [
            // --- Credential Configuration (Collapsible) ---
            if (_showConfig) _buildConfigCard(),

            const SizedBox(height: 24),

            // --- Image Preview Area ---
            _buildImageCard(),

            const SizedBox(height: 32),

            // --- Capture Controls ---
            _buildSourceButtons(),

            const SizedBox(height: 32),

            // --- Main Action ---
            _buildUploadButton(),

            // --- Results Area ---
            if (_uploadedUrl != null) _buildResultSection(),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildConfigCard() {
    return Card(
      elevation: 4,
      shadowColor: Colors.blueAccent.withValues(alpha: 0.2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              children: [
                Icon(Icons.vpn_key, size: 18, color: Colors.blueAccent),
                SizedBox(width: 8),
                Text(
                  'Credentials',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _cloudNameController,
              decoration: const InputDecoration(
                labelText: 'Cloud Name',
                hintText: 'e.g. drtx1234',
                prefixIcon: Icon(Icons.cloud),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _presetController,
              decoration: const InputDecoration(
                labelText: 'Unsigned Upload Preset',
                hintText: 'e.g. ml_default',
                prefixIcon: Icon(Icons.upload),
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              '⚠️ Use an "Unsigned" preset from Cloudinary settings.',
              style: TextStyle(
                fontSize: 11,
                color: Colors.orange,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageCard() {
    return Container(
      height: 280,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: _buildPreviewContent(),
      ),
    );
  }

  Widget _buildPreviewContent() {
    if (_uploadedUrl != null) {
      return Stack(
        fit: StackFit.expand,
        children: [
          Image.network(_uploadedUrl!, fit: BoxFit.cover),
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.green,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                'LIVE PREVIEW',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      );
    }

    if (_selectedFile != null) {
      return Image.file(_selectedFile!, fit: BoxFit.cover);
    }

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.add_photo_alternate_outlined,
          size: 64,
          color: Colors.blueGrey[200],
        ),
        const SizedBox(height: 16),
        Text(
          'Tap below to select an image',
          style: TextStyle(color: Colors.blueGrey[400]),
        ),
      ],
    );
  }

  Widget _buildSourceButtons() {
    return Row(
      children: [
        Expanded(
          child: _SourceButton(
            onPressed: () => _pickImage(ImageSource.camera),
            icon: Icons.camera_enhance,
            label: 'Camera',
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _SourceButton(
            onPressed: () => _pickImage(ImageSource.gallery),
            icon: Icons.photo_size_select_actual,
            label: 'Gallery',
          ),
        ),
      ],
    );
  }

  Widget _buildUploadButton() {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      width: double.infinity,
      height: 60,
      child: ElevatedButton(
        onPressed: (_selectedFile == null || _isLoading) ? null : _handleUpload,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.blueAccent,
          foregroundColor: Colors.white,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: _isLoading
            ? const Center(
                child: CircularProgressIndicator(color: Colors.white),
              )
            : const Text(
                'UPLOAD SECURELY',
                style: TextStyle(
                  letterSpacing: 1.2,
                  fontWeight: FontWeight.w800,
                ),
              ),
      ),
    );
  }

  Widget _buildResultSection() {
    return Column(
      children: [
        const SizedBox(height: 32),
        const Row(
          children: [
            Expanded(child: Divider()),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'CLOUD URL',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Expanded(child: Divider()),
          ],
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.blueGrey[50],
            borderRadius: BorderRadius.circular(12),
          ),
          child: SelectableText(
            _uploadedUrl!,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
          ),
        ),
        TextButton.icon(
          onPressed: () {
            // Logic to apply a transformation (Senior Touch)
            final transformed = _cloudinaryService.getTransformedUrl(
              _uploadedUrl!,
              'w_200,h_200,c_thumb,g_auto,r_max',
            );
            showDialog(
              context: context,
              builder: (ctx) => AlertDialog(
                title: const Text('Thumbnail Version'),
                content: Image.network(transformed),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(ctx),
                    child: const Text('Close'),
                  ),
                ],
              ),
            );
          },
          icon: const Icon(Icons.auto_fix_high),
          label: const Text('See Transformed Version'),
        ),
      ],
    );
  }
}

class _SourceButton extends StatelessWidget {
  final VoidCallback onPressed;
  final IconData icon;
  final String label;

  const _SourceButton({
    required this.onPressed,
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.blueAccent),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }
}
