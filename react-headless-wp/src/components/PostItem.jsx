import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
export default function PostItem( { post, index, total } ){
	const [featuredImage, setFeaturedImage] = useState('https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg');
	const date = new Date(post.date).toLocaleDateString("it-IT", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	useEffect(() => {
		// Se non c'è featuredmedia, non fare la richiesta
		const mediaLink = post?._links?.["wp:featuredmedia"]?.[0]?.href;
		if (!mediaLink) {
			return;
		}
		axios
			.get(mediaLink)
			.then(res => {
				if (typeof res.data.source_url === "string") {
					setFeaturedImage(res.data.source_url);
				}
			})
			.catch(error => {
				// Se la richiesta fallisce, lascia l'immagine di default
				console.log(error);
			});
	}, [post]);
	return (
		<div className="w-full h-[80vh] md:h-[70vh] flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden bg-white/90">
			{/* Lato immagine + titolo sovraimpresso */}
			<div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center overflow-hidden">
				<img
					src={featuredImage}
					alt="featured"
					className="object-cover w-full h-full brightness-90"
				/>
				<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
					<h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
						<Link to={`/post/${post.slug}`} state={{ post }} className="hover:underline">
							<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
						</Link>
					</h2>
				</div>
			</div>
			{/* Lato dettagli */}
			<div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-center p-8 gap-4 text-center">
				<h2 className="text-2xl md:text-3xl font-extrabold text-yellow-800 mb-2">
					<span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
				</h2>
				<div className="text-xs text-gray-500 mb-2">
					{post._embedded?.author?.[0]?.name || 'Sconosciuto'}
					{" - "}
					{date}
					{typeof post.id === 'number' && (
						<CommentCount postId={post.id} />
					)}
				</div>
				<div className="text-gray-700 text-base md:text-lg post-excerpt mb-2" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
				<Link
					to={`/post/${post.slug}`}
					state={{ post }}
					className="inline-block px-8 py-3 rounded-full bg-yellow-500 text-white font-bold shadow-lg hover:bg-yellow-600 transition-colors text-lg tracking-wide mt-2 mb-4"
				>
					Vai al dettaglio
				</Link>
				{/* Freccia per scroll automatico avanti e indietro */}
				<div className="flex flex-row gap-4 justify-center mt-4">
					{/* Freccia indietro */}
					<button
						type="button"
						aria-label="Torna all'articolo precedente"
						className={`animate-bounce text-yellow-700 text-3xl hover:scale-125 transition-transform rotate-180 ${index === 0 ? 'text-gray-400 cursor-not-allowed opacity-50' : ''}`}
						onClick={() => {
							if (index === 0) return;
							const parent = document.querySelector('.snap-x');
							if (parent) {
								const all = Array.from(parent.querySelectorAll('.snap-center'));
								const target = all[index]; // -1 per articolo precedente, +1 per offset slide benvenuto
								if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center' });
							}
						}}
						disabled={index === 0}
					>
						<span className="block">→</span>
					</button>
					{/* Freccia avanti */}
					<button
						type="button"
						aria-label="Vai all'articolo successivo"
						className={`animate-bounce text-yellow-700 text-3xl hover:scale-125 transition-transform ${index === total - 1 ? 'text-gray-400 cursor-not-allowed opacity-50' : ''}`}
						onClick={() => {
							if (index === total - 1) return;
							const parent = document.querySelector('.snap-x');
							if (parent) {
								const all = Array.from(parent.querySelectorAll('.snap-center'));
								const target = all[index + 2]; // +1 per offset slide benvenuto, +1 per articolo successivo
								if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center' });
							}
						}}
						disabled={index === total - 1}
					>
						<span className="block">→</span>
					</button>
				</div>
			</div>
		</div>
	);
}

function CommentCount({ postId }) {
  const [count, setCount] = useState(null);
  useEffect(() => {
    axios.get(`/wp-json/wp/v2/comments?post=${postId}&status=approve`).then(res => {
      setCount(Array.isArray(res.data) ? res.data.length : 0);
    }).catch(() => setCount(0));
  }, [postId]);
  if (count === null) return null;
  return (
    <span className="text-yellow-700 font-semibold"> - {count} commenti</span>
  );
}
