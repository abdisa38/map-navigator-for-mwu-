"use client";

import { useEffect, useState } from 'react';
import { getBuildings, getCategories, createBuilding, updateBuilding, deleteBuilding } from '../../../lib/api';
import { Building, Category } from '../../../lib/types';

export default function ManageBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Form State
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
      name: '',
      category_id: '',
      latitude: '',
      longitude: '',
      description: '',
      image_url: ''
  });

  const fetchData = async () => {
      setLoading(true);
      try {
        const [bData, cData] = await Promise.all([getBuildings(), getCategories()]);
        setBuildings(bData);
        setCategories(cData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
      setFormData({
        name: '',
        category_id: '',
        latitude: '',
        longitude: '',
        description: '',
        image_url: ''
      });
      setIsEditing(false);
      setCurrentId(null);
      setFormError('');
      setShowForm(false);
  };

  const handleEdit = (building: Building) => {
      setFormData({
          name: building.name,
          category_id: building.category_id.toString(),
          latitude: building.latitude.toString(),
          longitude: building.longitude.toString(),
          description: building.description || '',
          image_url: building.image_url || ''
      });
      setCurrentId(building.id);
      setIsEditing(true);
      setShowForm(true);
  };

  const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this building?")) return;
      try {
          await deleteBuilding(id);
          fetchData();
      } catch (e) {
          console.error("Delete failed", e);
          alert("Failed to delete building");
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError('');

      try {
          const payload = {
              ...formData,
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude),
              category_id: parseInt(formData.category_id)
          };

          if (isEditing && currentId) {
              await updateBuilding(currentId, payload);
          } else {
              await createBuilding(payload);
          }
          await fetchData();
          resetForm();
      } catch (err: any) {
          console.error(err);
          setFormError("Failed to save. Check inputs.");
      }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Buildings</h1>
        <button 
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Building'}
        </button>
      </div>

      {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Building' : 'Add New Building'}</h2>
              {formError && <div className="text-red-500 mb-3">{formError}</div>}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input 
                        type="text" 
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select 
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        value={formData.category_id}
                        onChange={e => setFormData({...formData, category_id: e.target.value})}
                      >
                          <option value="">Select Category</option>
                          {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700">Latitude</label>
                      <input 
                        type="number" step="any" required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        value={formData.latitude}
                        onChange={e => setFormData({...formData, latitude: e.target.value})}
                      />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700">Longitude</label>
                      <input 
                        type="number" step="any" required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        value={formData.longitude}
                        onChange={e => setFormData({...formData, longitude: e.target.value})}
                      />
                  </div>
                  <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700">Description</label>
                       <textarea 
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                       />
                  </div>
                   <div className="md:col-span-2">
                       <label className="block text-sm font-medium text-gray-700">Image URL</label>
                       <input 
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={formData.image_url}
                            onChange={e => setFormData({...formData, image_url: e.target.value})}
                       />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                          {isEditing ? 'Update Building' : 'Create Building'}
                      </button>
                  </div>
              </form>
          </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buildings.map((building) => (
              <tr key={building.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{building.name}</div>
                  <div className="text-xs text-gray-500">Lat: {building.latitude}, Lng: {building.longitude}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{building.category?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(building)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(building.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
