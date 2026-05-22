/*
  Warnings:

  - You are about to drop the column `ingredientes` on the `Receta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Receta" DROP COLUMN "ingredientes";

-- CreateTable
CREATE TABLE "Ingrediente" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,

    CONSTRAINT "Ingrediente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecetaIngrediente" (
    "id" SERIAL NOT NULL,
    "cantidad" VARCHAR(100) NOT NULL,
    "receta_id" INTEGER NOT NULL,
    "ingrediente_id" INTEGER NOT NULL,

    CONSTRAINT "RecetaIngrediente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingrediente_nombre_key" ON "Ingrediente"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "RecetaIngrediente_receta_id_ingrediente_id_key" ON "RecetaIngrediente"("receta_id", "ingrediente_id");

-- AddForeignKey
ALTER TABLE "RecetaIngrediente" ADD CONSTRAINT "RecetaIngrediente_receta_id_fkey" FOREIGN KEY ("receta_id") REFERENCES "Receta"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecetaIngrediente" ADD CONSTRAINT "RecetaIngrediente_ingrediente_id_fkey" FOREIGN KEY ("ingrediente_id") REFERENCES "Ingrediente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
