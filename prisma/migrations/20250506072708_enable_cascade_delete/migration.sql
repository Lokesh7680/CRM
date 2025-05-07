/*
  Warnings:

  - A unique constraint covering the columns `[campaignId,userId]` on the table `CampaignAnalytics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CampaignAnalytics" DROP CONSTRAINT "CampaignAnalytics_campaignId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAnalytics_campaignId_userId_key" ON "CampaignAnalytics"("campaignId", "userId");

-- AddForeignKey
ALTER TABLE "CampaignAnalytics" ADD CONSTRAINT "CampaignAnalytics_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
