import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState({ name: '' });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          name: newTag.name,
          slug: newTag.name.toLowerCase().replace(/\s+/g, '-')
        }]);
      
      if (error) throw error;
      setNewTag({ name: '' });
      fetchTags(); // Refresh the list
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  if (loading) return <div className="p-6">Loading tags...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      <p className="mb-6">Tag your content for better organization</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add New Tag</h2>
        <form onSubmit={handleAddTag} className="flex gap-4">
          <input
            type="text"
            value={newTag.name}
            onChange={(e) => setNewTag({ name: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tag name"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Tag
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tags;