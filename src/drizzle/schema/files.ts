import { pgTable, text, uuid, timestamp, integer } from 'drizzle-orm/pg-core';

export const files = pgTable('files', {
    id: text('id').primaryKey(),
    path: text('path').notNull(),
    filename: text('filename').notNull(),
    mimetype: text('mimetype').notNull(),
    size: integer('size').notNull(),
    url: text('url').notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow(),
})