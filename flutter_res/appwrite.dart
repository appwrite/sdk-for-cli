import 'package:appwrite/appwrite.dart';

final client = Client()
  .setEndpoint('{ENDPOINT}')
  .setProject('{PROJECT}');

final account = Account(client);
final databases = Databases(client);
final storage = Storage(client);

