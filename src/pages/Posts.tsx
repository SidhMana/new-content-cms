import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(name, color)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      // Get user ID or use null
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          excerpt: newPost.excerpt,
          category_id: newPost.category_id || null,
          status: newPost.status,
          slug: newPost.title.toLowerCase().replace(/\s+/g, '-'),
          author_id: user?.id || null
        }]);
      
      if (error) throw error;
      
      // Trigger n8n webhook if post is published
      if (newPost.status === 'published') {
        try {
          await fetch('https://your-n8n-instance.com/webhook/cms-post-published', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: newPost.title,
              excerpt: newPost.excerpt,
              content: newPost.content,
              slug: newPost.title.toLowerCase().replace(/\s+/g, '-'),
              published_at: new Date().toISOString()
            })
          });
        } catch (webhookError) {
          console.log('Webhook failed (this is okay for now):', webhookError);
        }
      }
      
      setNewPost({ title: '', content: '', excerpt: '', category_id: '', status: 'draft' });
      fetchPosts();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  if (loading) return <div className="p-6">Loading posts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <p className="mb-6">Manage your blog posts and articles</p>
      
      <div className="grid gap-4 mb-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: post.categories?.color || '#gray' }}
              ></div>
              <span className="text-sm text-gray-500">{post.categories?.name || 'Uncategorized'}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.status}</span>
            </div>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.excerpt}</p>
            <p className="text-sm text-gray-500">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add New Post</h2>
        <form onSubmit={handleAddPost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={newPost.excerpt}
              onChange={(e) => setNewPost({...newPost, excerpt: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post excerpt"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post content"
              rows={4}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newPost.category_id}
                onChange={(e) => setNewPost({...newPost, category_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={newPost.status}
                onChange={(e) => setNewPost({...newPost, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Posts;