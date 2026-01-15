import 'package:cloud_firestore/cloud_firestore.dart';

class PostModel {
  final String id;
  final String imageUrl;
  final String title;
  final String description;
  final String userId;
  final DateTime createdAt;

  PostModel({
    required this.id,
    required this.imageUrl,
    required this.title,
    required this.description,
    required this.userId,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'imageUrl': imageUrl,
      'title': title,
      'description': description,
      'userId': userId,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }

  factory PostModel.fromMap(String id, Map<String, dynamic> map) {
    return PostModel(
      id: id,
      imageUrl: map['imageUrl'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      userId: map['userId'] ?? '',
      createdAt: (map['createdAt'] as Timestamp).toDate(),
    );
  }
}
