import axios from 'axios';
import { Building, CampusBoundary, Category, RouteResponse } from './types';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await API.get('/categories');
  return data;
};

export const getBuildings = async (category?: string, search?: string): Promise<Building[]> => {
  const params: any = {};
  if (category) params.category = category;
  if (search) params.q = search;
  
  const { data } = await API.get('/buildings', { params });
  return data;
};

export const createBuilding = async (buildingData: any): Promise<Building> => {
    const { data } = await API.post('/buildings', buildingData);
    return data;
};

export const updateBuilding = async (id: number, buildingData: any): Promise<Building> => {
    const { data } = await API.put(`/buildings/${id}`, buildingData);
    return data;
};

export const deleteBuilding = async (id: number): Promise<void> => {
    await API.delete(`/buildings/${id}`);
};

export const getBuildingDetails = async (id: number): Promise<Building> => {
  const { data } = await API.get(`/buildings/${id}`);
  return data;
};

export const getCampusBoundary = async (): Promise<CampusBoundary> => {
  const { data } = await API.get('/campus-boundary');
  return data;
};

export const getRoute = async (from: [number, number], to: [number, number]): Promise<RouteResponse> => {
  const { data } = await API.get('/route', {
    params: {
      from: `${from[0]},${from[1]}`, // lat,lng
      to: `${to[0]},${to[1]}`,
    },
  });
  return data;
};

export const getDashboardStats = async () => {
  const { data } = await API.get('/stats');
  return data;
};

export const getUsers = async () => {
  const { data } = await API.get('/users');
  return data;
};

export const createUser = async (userData: any): Promise<any> => {
    const { data } = await API.post('/users', userData);
    return data;
};

export const updateUser = async (id: number, userData: any): Promise<any> => {
    const { data } = await API.put(`/users/${id}`, userData);
    return data;
};

export const deleteUser = async (id: number): Promise<void> => {
    await API.delete(`/users/${id}`);
};


