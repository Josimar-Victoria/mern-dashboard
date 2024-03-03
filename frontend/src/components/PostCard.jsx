import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group relative border border-teal-500 hover:border-2 overflow-hidden rounded-lg flex flex-col transition-all">
      <Link to={`/post/${post.slug}`} className="block">
        <img
          src={post.image}
          alt="post cover"
          className="w-full h-48 object-cover group-hover:h-48 transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">
            <Link to={`/post/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="italic text-sm text-gray-600">{post.category}</p>
        </div>
        <Link
          to={`/post/${post.slug}`}
          className="border-t border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-b-md block"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
