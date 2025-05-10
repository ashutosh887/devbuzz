-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
