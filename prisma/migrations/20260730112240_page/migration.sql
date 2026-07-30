-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Output" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "contributions" TEXT[],
    "limitations" TEXT[],
    "flashcards" JSONB NOT NULL,
    "uploadedFileId" TEXT NOT NULL,

    CONSTRAINT "Output_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Output_uploadedFileId_key" ON "Output"("uploadedFileId");

-- AddForeignKey
ALTER TABLE "Output" ADD CONSTRAINT "Output_uploadedFileId_fkey" FOREIGN KEY ("uploadedFileId") REFERENCES "UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
