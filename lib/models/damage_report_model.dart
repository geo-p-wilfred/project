import 'package:cloud_firestore/cloud_firestore.dart';

class DamageReport {
  final String id;
  final String userId;
  final String userName;
  final String title;
  final String description;
  final String damageType;
  final String imageUrl;
  final double latitude;
  final double longitude;
  final String address;
  final ReportStatus status;
  final String? validatedBy;
  final DateTime createdAt;
  final DateTime? validatedAt;

  DamageReport({
    required this.id,
    required this.userId,
    required this.userName,
    required this.title,
    required this.description,
    required this.damageType,
    required this.imageUrl,
    required this.latitude,
    required this.longitude,
    required this.address,
    required this.status,
    this.validatedBy,
    required this.createdAt,
    this.validatedAt,
  });

  factory DamageReport.fromMap(Map<String, dynamic> map, String id) {
    return DamageReport(
      id: id,
      userId: map['userId'] ?? '',
      userName: map['userName'] ?? '',
      title: map['title'] ?? '',
      description: map['description'] ?? '',
      damageType: map['damageType'] ?? '',
      imageUrl: map['imageUrl'] ?? '',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 0.0,
      address: map['address'] ?? '',
      status: ReportStatus.fromString(map['status'] ?? 'pending'),
      validatedBy: map['validatedBy'],
      createdAt: (map['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      validatedAt: (map['validatedAt'] as Timestamp?)?.toDate(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'userName': userName,
      'title': title,
      'description': description,
      'damageType': damageType,
      'imageUrl': imageUrl,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'status': status.toString(),
      'validatedBy': validatedBy,
      'createdAt': Timestamp.fromDate(createdAt),
      'validatedAt': validatedAt != null ? Timestamp.fromDate(validatedAt!) : null,
    };
  }
}

enum ReportStatus {
  pending,
  validated,
  rejected;

  static ReportStatus fromString(String status) {
    switch (status.toLowerCase()) {
      case 'validated':
        return ReportStatus.validated;
      case 'rejected':
        return ReportStatus.rejected;
      default:
        return ReportStatus.pending;
    }
  }

  @override
  String toString() {
    switch (this) {
      case ReportStatus.pending:
        return 'pending';
      case ReportStatus.validated:
        return 'validated';
      case ReportStatus.rejected:
        return 'rejected';
    }
  }
}

