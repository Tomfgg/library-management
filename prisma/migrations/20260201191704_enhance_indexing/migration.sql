-- DropIndex
DROP INDEX "Borrowing_bookId_idx";

-- DropIndex
DROP INDEX "Borrowing_borrowerId_idx";

-- DropIndex
DROP INDEX "Borrowing_dueDate_idx";

-- CreateIndex
CREATE INDEX "Borrowing_borrowerId_bookId_returnedAt_idx" ON "Borrowing"("borrowerId", "bookId", "returnedAt");

-- CreateIndex
CREATE INDEX "Borrowing_borrowerId_returnedAt_idx" ON "Borrowing"("borrowerId", "returnedAt");

-- CreateIndex
CREATE INDEX "Borrowing_returnedAt_dueDate_idx" ON "Borrowing"("returnedAt", "dueDate");
