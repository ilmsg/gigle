import { getAllPosts, getPostSlugs, PostType } from "@/lib/get-posts";
import Link from "next/link";

export const Sidebar = async function () {
    const posts = await getAllPosts()
    return (
        <>
            <h2>one.ilmsg.in.th</h2>
            <ul className="list-group">
                <li key={99} className="list-group-item"><Link href="/">⛪ Home</Link></li>
                {/* <li key={98} className="list-group-item"><Link href="/posts">⛺ Posts</Link></li> */}
                {posts.map((post) => (
                    <li key={post.id} className="list-group-item">
                        {post.emoji} <span className="badge bg-primary">{post.type}</span>&nbsp;
                        <Link href={`/posts/${post.id}`} className="link-underline link-underline-opacity-0">
                            {post.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}