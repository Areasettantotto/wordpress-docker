import { useEffect, useState } from "react";
import axios from "axios";
import PostItem from "./PostItem.jsx";
const baseUrl = import.meta.env.VITE_API_BASE_URL || '/wp-json/wp/v2';
const url = `${baseUrl}/posts?_fields=id,slug,date,title,excerpt,content,link,_links&_embed=author,wp:featuredmedia,comments&per_page=100`;
export default function Blog() {
  const [posts, setPosts] = useState([]);
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
  const paginatedPosts = posts;
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
      {paginatedPosts.map((item, idx) => (
        <div
          key={item.id}
          className="flex-shrink-0 w-screen h-screen flex items-center justify-center snap-center"
        >
          <PostItem post={item} index={idx} total={paginatedPosts.length} />
        </div>
      ))}
    </div>
  );
}
