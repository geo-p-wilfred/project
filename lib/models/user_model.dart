import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String name;
  final UserRole role;
  final DateTime createdAt;

  UserModel({
    required this.uid,
    required this.email,
    required this.name,
    required this.role,
    required this.createdAt,
  });

  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      name: map['name'] ?? '',
      role: UserRole.fromString(map['role'] ?? 'people'),
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'name': name,
      'role': role.toString(),
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

enum UserRole {
  people,
  authority,
  admin;

  static UserRole fromString(String role) {
    switch (role.toLowerCase()) {
      case 'authority':
        return UserRole.authority;
      case 'admin':
        return UserRole.admin;
      default:
        return UserRole.people;
    }
  }

  @override
  String toString() {
    switch (this) {
      case UserRole.people:
        return 'people';
      case UserRole.authority:
        return 'authority';
      case UserRole.admin:
        return 'admin';
    }
  }
}

