# Migration `20201124234716-hospital1`

This migration has been generated at 11/25/2020, 12:47:16 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201124234327-hospital1..20201124234716-hospital1
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 model User {
   email     String     @unique
@@ -26,7 +26,7 @@
 model Hospital {
   id     Int    @id @default(autoincrement())
   name   String
-  User   User?  @relation(fields: [userId], references: [id])
+  user   User?  @relation(fields: [userId], references: [id])
   userId Int?
 }
```


