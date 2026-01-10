# Contentful Setup Guide

Since you have already switched to Contentful, please follow these steps to configure your content structure.

## 1. Set up Locales (Languages)
1. Go to your **Contentful Space Settings** > **Locales**.
2. You probably have `English (United States)` as default.
3. Click **Add locale**.
4. Choose `Japanese (Japan)` or just `Japanese`.
5. Code: `ja` (keep it simple).
6. Save.

## 2. Create Content Model
1. Go to **Content model** tab.
2. Click **Add content type**.
3. Name: `Blog Post`
4. API Identifier: `blogPost` (Important: must match exactly)
5. Description: `Blog posts for the website`
6. Click **Create**.

## 3. Add Fields
Add the following fields to your `Blog Post` model.
**Important:** For Title, Description, and Content, make sure to check **Enable localization for this field** in the settings of each field.

| Field Name | Type | Settings |
| --- | --- | --- |
| `Title` | **Text** (Short) | ✅ **Localization** (Enable in field settings) |
| `Slug` | **Text** (Short) | (No localization needed, usually shared. Or localize if you want translated URLs) |
| `Description` | **Text** (Long) | ✅ **Localization** |
| `Content` | **Rich Text** | ✅ **Localization** |
| `Published Date`| **Date and time** | |
| `Featured Image`| **Media** (One file) | |

## 4. Create a Test Post
1. Go to **Content** tab.
2. Click **Add entry** > **Blog Post**.
3. Fill in the content.
   - You will see "English" and "Japanese" tabs (or switchers) for the localized fields.
4. Click **Publish**.

---

## Next Steps
Once you have created at least one post, the website will automatically fetch and display it.
