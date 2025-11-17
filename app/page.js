import PostCard from "../components/PostCard.jsx";
import PostForm from "../components/PostForm.js";
import PostsList from "../components/PostList.js";

export default async function HomePage() {
  const res = await fetch(`https://dummyjson.com/posts`);
  const data = await res.json();
  const posts = data.posts;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostForm />
      <PostsList />
      {
        //{posts.map((post) => (
        //  <PostCard key={post.id} post={post} />
        //))}
      }
    </div>
  );
}
