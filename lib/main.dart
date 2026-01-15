import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'firebase_options.dart';
import 'screens/standalone_upload_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase (includes Storage)
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  // Verify Firebase Storage is initialized
  try {
    final storage = FirebaseStorage.instance;
    debugPrint('Firebase Storage initialized successfully');
    debugPrint('Storage bucket: ${storage.bucket}');
  } catch (e) {
    debugPrint('Warning: Firebase Storage initialization check failed: $e');
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Damage Reporter',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const StandaloneUploadScreen(),
    );
  }
}
