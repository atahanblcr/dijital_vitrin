-- CreateEnum
CREATE TYPE "Sector" AS ENUM ('elektronik', 'butik', 'aksesuar', 'el_isi', 'oto_galeri');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'business_admin');

-- CreateEnum
CREATE TYPE "SortMode" AS ENUM ('random', 'manual');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('monthly', 'yearly');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('text', 'number', 'select');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('page_view', 'product_view', 'whatsapp_click', 'blog_view');

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "sector" "Sector" NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "theme_preset" VARCHAR(50),
    "theme_primary" CHAR(7) NOT NULL,
    "theme_accent" CHAR(7) NOT NULL,
    "slogan" VARCHAR(100),
    "about_text" TEXT,
    "maps_url" TEXT,
    "instagram_url" TEXT,
    "facebook_url" TEXT,
    "tiktok_url" TEXT,
    "max_images_per_product" INTEGER NOT NULL DEFAULT 7,
    "product_sort_mode" "SortMode" NOT NULL DEFAULT 'random',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "auto_deactivate" BOOLEAN NOT NULL DEFAULT false,
    "subscription_plan" "SubscriptionPlan" NOT NULL,
    "subscription_end" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHour" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "is_open" BOOLEAN NOT NULL,
    "open_time" VARCHAR(5),
    "close_time" VARCHAR(5),

    CONSTRAINT "BusinessHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "business_id" TEXT,
    "totp_secret" TEXT,
    "totp_enabled" BOOLEAN NOT NULL DEFAULT false,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryAttribute" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "AttributeType" NOT NULL,
    "unit" VARCHAR(20),
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "is_multiple" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategoryAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeOption" (
    "id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AttributeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "short_desc" VARCHAR(150),
    "long_desc" TEXT,
    "is_campaign" BOOLEAN NOT NULL DEFAULT false,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttributeValue" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "value_text" TEXT,
    "value_number" DECIMAL(10,2),
    "value_option_id" TEXT,

    CONSTRAINT "ProductAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttributeMultiValue" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "attribute_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,

    CONSTRAINT "ProductAttributeMultiValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170) NOT NULL,
    "content" TEXT NOT NULL,
    "cover_image_url" TEXT,
    "cover_image_pid" TEXT,
    "meta_description" VARCHAR(160),
    "status" "BlogStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT,
    "blog_post_id" TEXT,
    "event_type" "EventType" NOT NULL,
    "ip_hash" CHAR(64) NOT NULL,
    "is_mobile" BOOLEAN NOT NULL,
    "is_bot" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsDaily" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "product_id" TEXT,
    "date" DATE NOT NULL,
    "page_views" INTEGER NOT NULL DEFAULT 0,
    "unique_visitors" INTEGER NOT NULL DEFAULT 0,
    "product_views" INTEGER NOT NULL DEFAULT 0,
    "whatsapp_clicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AnalyticsDaily_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_slug_key" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_slug_idx" ON "Business"("slug");

-- CreateIndex
CREATE INDEX "Business_is_active_idx" ON "Business"("is_active");

-- CreateIndex
CREATE INDEX "Business_subscription_end_idx" ON "Business"("subscription_end");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHour_business_id_day_of_week_key" ON "BusinessHour"("business_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_business_id_idx" ON "User"("business_id");

-- CreateIndex
CREATE INDEX "Category_business_id_idx" ON "Category"("business_id");

-- CreateIndex
CREATE INDEX "CategoryAttribute_category_id_idx" ON "CategoryAttribute"("category_id");

-- CreateIndex
CREATE INDEX "AttributeOption_attribute_id_idx" ON "AttributeOption"("attribute_id");

-- CreateIndex
CREATE INDEX "Product_business_id_idx" ON "Product"("business_id");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product"("category_id");

-- CreateIndex
CREATE INDEX "Product_is_active_is_campaign_idx" ON "Product"("is_active", "is_campaign");

-- CreateIndex
CREATE UNIQUE INDEX "Product_business_id_slug_key" ON "Product"("business_id", "slug");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_product_id_idx" ON "ProductAttributeValue"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_product_id_attribute_id_key" ON "ProductAttributeValue"("product_id", "attribute_id");

-- CreateIndex
CREATE INDEX "ProductAttributeMultiValue_product_id_attribute_id_idx" ON "ProductAttributeMultiValue"("product_id", "attribute_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeMultiValue_product_id_attribute_id_option_i_key" ON "ProductAttributeMultiValue"("product_id", "attribute_id", "option_id");

-- CreateIndex
CREATE INDEX "ProductImage_product_id_idx" ON "ProductImage"("product_id");

-- CreateIndex
CREATE INDEX "BlogPost_business_id_status_idx" ON "BlogPost"("business_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_business_id_slug_key" ON "BlogPost"("business_id", "slug");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_business_id_created_at_idx" ON "AnalyticsEvent"("business_id", "created_at");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_business_id_event_type_idx" ON "AnalyticsEvent"("business_id", "event_type");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_product_id_idx" ON "AnalyticsEvent"("product_id");

-- CreateIndex
CREATE INDEX "AnalyticsDaily_business_id_date_idx" ON "AnalyticsDaily"("business_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsDaily_business_id_product_id_date_key" ON "AnalyticsDaily"("business_id", "product_id", "date");

-- AddForeignKey
ALTER TABLE "BusinessHour" ADD CONSTRAINT "BusinessHour_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryAttribute" ADD CONSTRAINT "CategoryAttribute_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOption" ADD CONSTRAINT "AttributeOption_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "CategoryAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "CategoryAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_value_option_id_fkey" FOREIGN KEY ("value_option_id") REFERENCES "AttributeOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsDaily" ADD CONSTRAINT "AnalyticsDaily_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
