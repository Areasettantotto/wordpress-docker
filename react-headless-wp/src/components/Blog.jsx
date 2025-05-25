import { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "./PostItem.jsx";
const url = '/wp-json/wp/v2/posts?_fields=id,slug,date,title,excerpt,content,link,_links&_embed=author,wp:featuredmedia&per_page=100';
const POSTS_PER_PAGE = 3;
export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    axios
      .get(url)
      .then(res => {
        console.log('Risposta API:', res.data); // DEBUG
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(error => {
        console.log('Errore API:', error); // DEBUG
        setPosts([]);
      });
  }, []);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  return (
    <div className="w-screen h-screen flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth bg-yellow-300">
      {/* Sezione di benvenuto */}
      <section className="flex-shrink-0 w-screen h-screen flex flex-col items-center justify-center snap-center p-8 bg-yellow-300">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-900 drop-shadow-lg">Benvenuto nel Blog</h1>
        <p className="text-xl md:text-2xl text-yellow-800 mb-4">Scorri orizzontalmente per vedere gli articoli.</p>
        <div className="text-md md:text-lg text-yellow-700 font-semibold">Autore: WordPress Headless</div>
        <div className="mt-8 animate-bounce text-yellow-800 text-3xl">→</div>
      </section>
      {/* Articoli */}
      {paginatedPosts.map(item => (
        <div
          key={item.id}
          className="flex-shrink-0 w-screen h-screen flex items-center justify-center snap-center"
        >
          <PostItem post={item} />
        </div>
      ))}
      {/* Paginazione */}
      {totalPages > 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
          <button
            className="px-4 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`px-3 py-2 rounded-full font-bold shadow ${page === idx + 1 ? 'bg-yellow-700 text-white' : 'bg-yellow-200 text-yellow-700'}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-full bg-yellow-500 text-white font-bold shadow hover:bg-yellow-600 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
