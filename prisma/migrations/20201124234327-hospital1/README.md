# Migration `20201124234327-hospital1`

This migration has been generated at 11/25/2020, 12:43:27 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Hospital" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,

    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "email" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_User" ("email", "id", "name") SELECT "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201120000755-test..20201124234327-hospital1
--- datamodel.dml
+++ datamodel.dml
@@ -3,36 +3,30 @@
 }
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 model User {
-  email String  @unique
-  id    Int     @id @default(autoincrement())
-  name  String?
-  posts Post[]
+  email     String     @unique
+  id        Int        @id @default(autoincrement())
+  name      String?
+  posts     Post[]
+  hospitals Hospital[]
 }
-model Category {
-  id       Int        @id @default(autoincrement())
-  name     String?
-  Hospital Hospital[]
-}
-
-model Hospital {
-  categoryId Int?
-  id         Int       @id @default(autoincrement())
-  name       String?
-  address    String?
-  category   Category? @relation(fields: [categoryId], references: [id])
-}
-
 model Post {
   authorId  Int?
   content   String?
   id        Int     @id @default(autoincrement())
   published Boolean @default(false)
   title     String
   author    User?   @relation(fields: [authorId], references: [id])
 }
+
+model Hospital {
+  id     Int    @id @default(autoincrement())
+  name   String
+  User   User?  @relation(fields: [userId], references: [id])
+  userId Int?
+}
```


