import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type PostMetaType = {
    title: string
    emoji: string
    type: string
    topics: string[]
    published: boolean
}

export type PostType = {
    id: string
    title: string
    emoji: string
    type: string
    topics: string[]
    published: boolean
    contentHtml: string
}

const postDirectory = join(process.cwd(), "_posts")

export async function getPostSlugs() {
    return fs.readdirSync(postDirectory)
}

export async function getPostBySlug(slug: string) {
    const mdSlug = slug.replace(/\.md$/, '')
    const fullPath = join(postDirectory, `${mdSlug}.md`)
    const fullContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fullContents)

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content)
    const contentHtml = processedContent.toString();
    return {
        id: mdSlug,
        contentHtml,
        ...(matterResult.data as PostMetaType)
    }
}

export async function getAllPosts() {
    const slugs = await getPostSlugs()
    return slugs.map((slug) => {
        const mdSlug = slug.replace(/\.md$/, '')
        const fullPath = join(postDirectory, `${mdSlug}.md`)
        const fullContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fullContents)
        return { id: mdSlug, ...(matterResult.data as PostMetaType) }
    }).sort((a, b) => a.type > b.type ? 1 : -1)
}

// export async function getAllPosts(): Promise<PostType[]> {
//     const slugs = await getPostSlugs()
//     const posts = Promise.all(slugs.map((slug) => getPostBySlug(slug)).sort(async (a, b) => {

//     }))
//     return posts
// }