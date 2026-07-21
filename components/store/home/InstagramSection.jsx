"use client";

import { MdFavoriteBorder as Heart, MdOutlineChat as MessageCircle } from 'react-icons/md';

// Custom Instagram SVG icon
const InstagramIcon = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const INSTAGRAM_POSTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "glowing_aurora",
    likes: 1243,
    comments: 89,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "julian_jewelry",
    likes: 876,
    comments: 45,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "maya_style",
    likes: 2104,
    comments: 156,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1611591437281-4bf5152ce8f2?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "ethan_designs",
    likes: 567,
    comments: 32,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "lila_accessories",
    likes: 1432,
    comments: 78,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "marcus_gems",
    likes: 987,
    comments: 54,
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "sophie_glow",
    likes: 765,
    comments: 43,
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&auto=format",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format",
    username: "alex_jewels",
    likes: 654,
    comments: 28,
  },
];

// Split posts into columns for marquee
const COLUMN_COUNT = 4;
const getColumnPosts = () => {
  const columns = Array.from({ length: COLUMN_COUNT }, () => []);
  INSTAGRAM_POSTS.forEach((post, index) => {
    columns[index % COLUMN_COUNT].push(post);
  });
  // Duplicate posts for seamless scroll
  return columns.map(col => [...col, ...col, ...col]);
};

export function InstagramSection() {
  const columns = getColumnPosts();

  return (
    <section className="py-16 md:py-24 bg-accent/5 border-t border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Follow Us on Instagram
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Join our community of jewelry lovers
            </p>
          </div>
          <a
            href="https://instagram.com/beglowing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 transition-all"
          >
            <InstagramIcon className="h-4 w-4" />
            @beglowing
          </a>
        </div>

        {/* Vertical Marquee with CSS Mask - exact match to screenshot */}
        <div
          className="relative overflow-hidden rounded-xl"
          style={{
            height: 520,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 h-full px-3">
            {columns.map((column, colIndex) => {
              const direction = colIndex % 2 === 0 ? "down" : "up";
              const duration = 20 + colIndex * 3;

              return (
                <div key={colIndex} className="relative overflow-hidden h-full">
                  <div
                    className={`flex flex-col gap-4 animate-marquee-${direction}`}
                    style={{
                      animationDuration: `${duration}s`,
                      animationDelay: `-${duration / 2}s`,
                    }}
                  >
                    {column.map((post, idx) => (
                      <div
                        key={`${colIndex}-${idx}`}
                        className="group relative flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden bg-muted">
                          <img
                            src={post.image}
                            alt={`Post by ${post.username}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-1.5 text-white">
                              <Heart className="h-4 w-4 fill-white" />
                              <span className="text-xs font-medium">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white">
                              <MessageCircle className="h-4 w-4 fill-white" />
                              <span className="text-xs font-medium">{post.comments}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white">
                          <img
                            src={post.avatar}
                            alt={post.username}
                            className="h-5 w-5 rounded-full object-cover border border-border/50"
                          />
                          <span className="text-xs font-medium text-foreground truncate flex-1">
                            {post.username}
                          </span>
                          <InstagramIcon className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes marquee-down {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes marquee-up {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-marquee-down {
          animation: marquee-down linear infinite;
        }
        .animate-marquee-up {
          animation: marquee-up linear infinite;
        }
      `}</style>
    </section>
  );
}