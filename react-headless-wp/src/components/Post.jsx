import { Link, useLocation } from "react-router-dom";
export default function Post() {
  const location = useLocation();
  // Supporta sia location.state.post che location.state.post.item
  const post = location?.state?.post?.item || location?.state?.post;

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Nessun dato articolo trovato</h2>
        <Link to="/" className="text-yellow-700 underline">Torna alla Home</Link>
      </div>
    );
  }

  const date = new Date(post.date).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="single flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300">
      <div className="post-container w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <div className="post-content" id={post.slug}>
          <div className="top mb-4">
            <Link to="/" className="text-yellow-700 underline">Back</Link>
          </div>
          <h2 className="title text-3xl font-bold mb-2">
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </h2>
          <div className="date text-xs text-gray-500 mb-4">{date}</div>
          <div
            className="content text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
          <div className="bottom mt-4">
            <Link to="/" className="text-yellow-700 underline">Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
