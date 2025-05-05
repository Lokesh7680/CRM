-- CreateTable
CREATE TABLE "CampaignAnalytics" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "linkId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAnalytics_campaignId_userId_key" ON "CampaignAnalytics"("campaignId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAnalytics_campaignId_userId_linkId_key" ON "CampaignAnalytics"("campaignId", "userId", "linkId");

-- AddForeignKey
ALTER TABLE "CampaignAnalytics" ADD CONSTRAINT "CampaignAnalytics_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
