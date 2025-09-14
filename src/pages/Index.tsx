import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Content CMS Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/posts" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Posts</h2>
            <p className="text-gray-600">Manage your blog posts and articles</p>
          </Link>
          
          <Link to="/categories" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Categories</h2>
            <p className="text-gray-600">Organize content with categories</p>
          </Link>
          
          <Link to="/tags" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Tags</h2>
            <p className="text-gray-600">Tag your content for better organization</p>
          </Link>
          
          <Link to="/settings" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-600">Configure your application settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;