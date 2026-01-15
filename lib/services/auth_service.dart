import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/user_model.dart';

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  User? get currentUser => _auth.currentUser;

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  Future<UserModel?> getUserData(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        return UserModel.fromMap(doc.data()!);
      }
      return null;
    } catch (e) {
      debugPrint('Error getting user data: $e');
      return null;
    }
  }

  Future<String?> signUp({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user == null) {
        return 'Failed to create user account';
      }

      final userModel = UserModel(
        uid: user.uid,
        email: email,
        name: name,
        role: UserRole.people, // Default role for all new signups
        createdAt: DateTime.now(),
      );

      await _firestore.collection('users').doc(user.uid).set(userModel.toMap());

      return null; // Success
    } on FirebaseAuthException catch (e) {
      return e.message;
    } catch (e) {
      return 'An error occurred: $e';
    }
  }

  Future<String?> signIn({
    required String email,
    required String password,
  }) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
      return null; // Success
    } on FirebaseAuthException catch (e) {
      return e.message;
    } catch (e) {
      return 'An error occurred: $e';
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  // Admin function to update user role
  // Note: Admin role cannot be assigned through this function - must be set manually in backend
  Future<String?> updateUserRole(String userId, UserRole newRole) async {
    try {
      // Prevent assigning admin role through UI
      if (newRole == UserRole.admin) {
        return 'Admin role cannot be assigned through the app. Please set it manually in the backend.';
      }

      await _firestore.collection('users').doc(userId).update({
        'role': newRole.toString(),
      });
      return null; // Success
    } catch (e) {
      return 'Error updating user role: $e';
    }
  }

  // Get all users (for admin)
  Stream<List<UserModel>> getAllUsers() {
    return _firestore
        .collection('users')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map(
          (snapshot) => snapshot.docs
              .map((doc) => UserModel.fromMap(doc.data()))
              .toList(),
        );
  }
}
