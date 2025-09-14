import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-6">Loading tags...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      <p className="mb-6">Tag your content for better organization</p>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Tags;