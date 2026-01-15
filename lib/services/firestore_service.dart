import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/post_model.dart';
import '../models/damage_report_model.dart';

class FirestoreService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  static const String _postsCollection = 'posts';
  static const String _reportsCollection = 'reports';

  // --- Post Methods (for Cloudinary Example) ---

  /// Saves post data to Firestore.
  Future<bool> savePost(PostModel post) async {
    try {
      await _db.collection(_postsCollection).add(post.toMap());
      return true;
    } catch (e) {
      debugPrint("Firestore Save Error: $e");
      return false;
    }
  }

  /// Retrieves all posts from Firestore, ordered by creation date.
  Stream<List<PostModel>> getPosts() {
    return _db
        .collection(_postsCollection)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs.map((doc) {
            return PostModel.fromMap(doc.id, doc.data());
          }).toList();
        });
  }

  // --- Damage Report Methods (for Existing App) ---

  Future<void> createDamageReport(DamageReport report) async {
    try {
      await _db
          .collection(_reportsCollection)
          .doc(report.id)
          .set(report.toMap());
    } catch (e) {
      debugPrint("Error creating damage report: $e");
      rethrow;
    }
  }

  Stream<List<DamageReport>> getPendingReports() {
    return _db
        .collection(_reportsCollection)
        .where('status', isEqualTo: 'pending')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs
              .map((doc) => DamageReport.fromMap(doc.data(), doc.id))
              .toList();
        });
  }

  Future<void> updateReportStatus({
    required String reportId,
    required ReportStatus status,
    String? validatedBy,
  }) async {
    try {
      await _db.collection(_reportsCollection).doc(reportId).update({
        'status': status.toString(),
        'validatedAt': Timestamp.now(),
        if (validatedBy != null) 'validatedBy': validatedBy,
      });
    } catch (e) {
      debugPrint("Error updating report status: $e");
      rethrow;
    }
  }

  Stream<List<DamageReport>> getUserReports(String userId) {
    return _db
        .collection(_reportsCollection)
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) {
          return snapshot.docs
              .map((doc) => DamageReport.fromMap(doc.data(), doc.id))
              .toList();
        });
  }
}
