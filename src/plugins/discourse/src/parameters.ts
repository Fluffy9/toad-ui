import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

/**
 * Discourse Search
 */
export class getDiscourseSearchParameters extends createToolParameters(
//     The query string needs to be url encoded and is made up of the following options:

// Search term. This is just a string. Usually it would be the first item in the query.
// @<username>: Use the @ followed by the username to specify posts by this user.
// #<category>: Use the # followed by the category slug to search within this category.
// tags:: api,solved or for posts that have all the specified tags api+solved.
// before:: yyyy-mm-dd
// after:: yyyy-mm-dd
// order:: latest, likes, views, latest_topic
// assigned:: username (without @)
// in:: title, likes, personal, messages, seen, unseen, posted, created, watching, tracking, bookmarks, assigned, unassigned, first, pinned, wiki
// with:: images
// status:: open, closed, public, archived, noreplies, single_user, solved, unsolved
// group:: group_name or group_id
// group_messages:: group_name or group_id
// min_posts:: 1
// max_posts:: 10
// min_views:: 1
// max_views:: 10
    z.object({
        q: z.string().describe("The query to search for"),
        username: z.string().describe("The username to search for (with @)"),
        category: z.string().describe("The category to search for (with #)"),
        tags: z.string().describe("The tags to search for"),
        before: z.string().describe("The date to search for (format: yyyy-mm-dd)"),
        after: z.string().describe("The date to search for (format: yyyy-mm-dd)"),
        order: z.string().describe("The order to search for (latest, likes, views, latest_topic)"),
        assigned: z.string().describe("The assigned user to search for (without @)"),
        in: z.string().describe("The in to search for. Could be title, likes, personal, messages, seen, unseen, posted, created, watching, tracking, bookmarks, assigned, unassigned, first, pinned, wiki"),
        with: z.string().describe("The with to search for. Could be images"),
        status: z.string().describe("The status to search for. Could be open, closed, public, archived, noreplies, single_user, solved, unsolved"),
        group: z.string().describe("The group to search for"),
        group_messages: z.string().describe("The group messages to search for"),
        min_posts: z.number().describe("The min posts to search for"),
        max_posts: z.number().describe("The max posts to search for"),
        min_views: z.number().describe("The min views to search for"),
        max_views: z.number().describe("The max views to search for"),
    }),
) {}

export class getLatestPostsParameters extends createToolParameters(
    z.object({
        before: z.number().describe("The discourse post id to get posts after"),
    }),
) {}
export class getPostParameters extends createToolParameters(
    z.object({
        post_id: z.number().describe("The discoursepost id"),
    }),
) {}
export class getPostRepliesParameters extends createToolParameters(
    z.object({
        post_id: z.number().describe("The discourse post id"),
    }),
) {}


