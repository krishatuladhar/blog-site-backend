CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR (100),
  password VARCHAR(255),
  name VARCHAR(120) NOT NULL,
  profile VARCHAR(120),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX if NOT EXISTS users_id_idx ON users(id);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(120),
  slug VARCHAR(200) NOT NULL UNIQUE,
  isFeatured boolean DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX if NOT EXISTS blogs_slug_idx ON blogs(slug);

CREATE TABLE if not EXISTS blog_likes (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, blog_id)
);

CREATE INDEX if NOT EXISTS blog_likes_blog_idx ON blog_likes(blog_id);
CREATE INDEX if NOT EXISTS blog_likes_user_idx ON blog_likes(user_id);

CREATE TABLE if not EXISTS comments (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);
CREATE INDEX if NOT EXISTS comments_blog_idx on comments(blog_id);
CREATE INDEX if NOT EXISTS comments_users_idx on comments(user_id);
