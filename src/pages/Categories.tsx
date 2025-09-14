import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: newCategory.name,
          description: newCategory.description,
          color: newCategory.color,
          slug: newCategory.name.toLowerCase().replace(/\s+/g, '-')
        }]);
      
      if (error) throw error;
      setNewCategory({ name: '', description: '', color: '#3B82F6' });
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  if (loading) return <div className="p-6">Loading categories...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <p className="mb-6">Organize content with categories</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded-lg shadow">
            <div 
              className="w-4 h-4 rounded-full mb-2" 
              style={{ backgroundColor: category.color }}
            ></div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500">Slug: {category.slug}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category description"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default Categories;