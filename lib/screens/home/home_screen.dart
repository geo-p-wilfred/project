import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../../models/user_model.dart';
import '../people/report_damage_screen.dart';
import '../people/my_reports_screen.dart';
import '../authority/authority_dashboard_screen.dart';
import '../admin/admin_dashboard_screen.dart';
import '../standalone_upload_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _authService = AuthService();
  UserModel? _user;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    final user = _authService.currentUser;
    if (user != null) {
      final userData = await _authService.getUserData(user.uid);
      if (mounted) {
        setState(() => _user = userData);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    Widget body;
    List<BottomNavigationBarItem> navItems = [];

    switch (_user!.role) {
      case UserRole.people:
        body = _currentIndex == 0
            ? const ReportDamageScreen()
            : const MyReportsScreen();
        navItems = const [
          BottomNavigationBarItem(
            icon: Icon(Icons.add_circle),
            label: 'Report',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'My Reports'),
        ];
        break;
      case UserRole.authority:
        body = const AuthorityDashboardScreen();
        navItems = const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
        ];
        break;
      case UserRole.admin:
        body = const AdminDashboardScreen();
        navItems = const [
          BottomNavigationBarItem(
            icon: Icon(Icons.admin_panel_settings),
            label: 'Admin',
          ),
        ];
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Welcome, ${_user!.name}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.cloud_upload),
            tooltip: 'Cloudinary Demo',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const StandaloneUploadScreen(),
                ),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await _authService.signOut();
            },
          ),
        ],
      ),
      body: body,
      bottomNavigationBar: _user!.role == UserRole.people
          ? BottomNavigationBar(
              currentIndex: _currentIndex,
              onTap: (index) {
                setState(() => _currentIndex = index);
              },
              items: navItems,
            )
          : null,
    );
  }
}
