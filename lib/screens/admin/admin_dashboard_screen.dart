import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../models/user_model.dart';
import '../../services/auth_service.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final _authService = AuthService();
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.purple,
            child: const Row(
              children: [
                Icon(Icons.admin_panel_settings, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  'Admin Dashboard',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: DefaultTabController(
              length: 2,
              child: Column(
                children: [
                  const TabBar(
                    tabs: [
                      Tab(text: 'All Reports'),
                      Tab(text: 'User Management'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        // All Reports Tab
                        StreamBuilder<QuerySnapshot>(
                          stream: FirebaseFirestore.instance
                              .collection('damage_reports')
                              .orderBy('createdAt', descending: true)
                              .snapshots(),
                          builder: (context, snapshot) {
                            if (snapshot.connectionState ==
                                ConnectionState.waiting) {
                              return const Center(
                                child: CircularProgressIndicator(),
                              );
                            }

                            if (snapshot.hasError) {
                              return Center(
                                child: Text('Error: ${snapshot.error}'),
                              );
                            }

                            final reports = snapshot.data?.docs ?? [];

                            if (reports.isEmpty) {
                              return const Center(
                                child: Text('No reports yet'),
                              );
                            }

                            return ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: reports.length,
                              itemBuilder: (context, index) {
                                final report = reports[index].data()
                                    as Map<String, dynamic>;
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  child: ListTile(
                                    title: Text(report['title'] ?? ''),
                                    subtitle: Text(
                                      '${report['damageType']} - ${report['status']}',
                                    ),
                                    trailing: Text(
                                      _formatTimestamp(report['createdAt']),
                                      style: const TextStyle(fontSize: 12),
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
                        // User Management Tab with Search
                        Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: TextField(
                                controller: _searchController,
                                decoration: InputDecoration(
                                  hintText: 'Search users by name or email...',
                                  prefixIcon: const Icon(Icons.search),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  filled: true,
                                  fillColor: Colors.grey[100],
                                ),
                                onChanged: (value) {
                                  setState(() {
                                    _searchQuery = value.toLowerCase();
                                  });
                                },
                              ),
                            ),
                            Expanded(
                              child: StreamBuilder<List<UserModel>>(
                                stream: _authService.getAllUsers(),
                                builder: (context, snapshot) {
                                  if (snapshot.connectionState ==
                                      ConnectionState.waiting) {
                                    return const Center(
                                      child: CircularProgressIndicator(),
                                    );
                                  }

                                  if (snapshot.hasError) {
                                    return Center(
                                      child: Text('Error: ${snapshot.error}'),
                                    );
                                  }

                                  final allUsers = snapshot.data ?? [];
                                  
                                  // Filter users based on search query (excluding admin role)
                                  final filteredUsers = allUsers.where((user) {
                                    if (user.role == UserRole.admin) {
                                      return false; // Don't show admin users in the list
                                    }
                                    if (_searchQuery.isEmpty) {
                                      return true;
                                    }
                                    return user.name
                                            .toLowerCase()
                                            .contains(_searchQuery) ||
                                        user.email
                                            .toLowerCase()
                                            .contains(_searchQuery);
                                  }).toList();

                                  if (filteredUsers.isEmpty) {
                                    return Center(
                                      child: Text(
                                        _searchQuery.isEmpty
                                            ? 'No users found'
                                            : 'No users match your search',
                                      ),
                                    );
                                  }

                                  return ListView.builder(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                    ),
                                    itemCount: filteredUsers.length,
                                    itemBuilder: (context, index) {
                                      final user = filteredUsers[index];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 8),
                                        child: ListTile(
                                          leading: CircleAvatar(
                                            child: Text(
                                              user.name[0].toUpperCase(),
                                            ),
                                          ),
                                          title: Text(user.name),
                                          subtitle: Text(user.email),
                                          trailing: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Chip(
                                                label: Text(
                                                  _getRoleDisplayName(user.role),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                                backgroundColor:
                                                    _getRoleColor(
                                                  user.role.toString(),
                                                ),
                                              ),
                                              const SizedBox(width: 8),
                                              PopupMenuButton<UserRole>(
                                                icon: const Icon(Icons.more_vert),
                                                onSelected: (UserRole newRole) {
                                                  _updateUserRole(
                                                    user.uid,
                                                    newRole,
                                                    user.name,
                                                  );
                                                },
                                                itemBuilder: (context) => [
                                                  if (user.role !=
                                                      UserRole.people)
                                                    const PopupMenuItem(
                                                      value: UserRole.people,
                                                      child: Row(
                                                        children: [
                                                          Icon(Icons.person,
                                                              size: 20),
                                                          SizedBox(width: 8),
                                                          Text('Set as Citizen'),
                                                        ],
                                                      ),
                                                    ),
                                                  if (user.role !=
                                                      UserRole.authority)
                                                    const PopupMenuItem(
                                                      value: UserRole.authority,
                                                      child: Row(
                                                        children: [
                                                          Icon(Icons
                                                              .verified_user,
                                                              size: 20),
                                                          SizedBox(width: 8),
                                                          Text(
                                                            'Set as Authority',
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    },
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _updateUserRole(
    String userId,
    UserRole newRole,
    String userName,
  ) async {
    final error = await _authService.updateUserRole(userId, newRole);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            error ?? 'User role updated successfully for $userName',
          ),
          backgroundColor: error != null ? Colors.red : Colors.green,
        ),
      );
    }
  }

  String _getRoleDisplayName(UserRole role) {
    switch (role) {
      case UserRole.people:
        return 'Citizen';
      case UserRole.authority:
        return 'Authority';
      case UserRole.admin:
        return 'Admin';
    }
  }

  Color _getRoleColor(String role) {
    switch (role) {
      case 'admin':
        return Colors.purple;
      case 'authority':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  String _formatTimestamp(dynamic timestamp) {
    if (timestamp == null) return 'Unknown';
    if (timestamp is Timestamp) {
      final date = timestamp.toDate();
      return '${date.day}/${date.month}/${date.year}';
    }
    return 'Unknown';
  }
}

