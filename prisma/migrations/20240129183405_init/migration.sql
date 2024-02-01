-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
