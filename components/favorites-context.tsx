'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type FavoriteHouse = {
  house_id: number;
  image_url: string;
  price: number;
  address: string;
  structure: string;
  _title: string;
};

type FavoritesContextType = {
  favorites: FavoriteHouse[];
  addFavorite: (house: FavoriteHouse) => void;
  removeFavorite: (houseId: number) => void;
  isFavorite: (houseId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteHouse[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteHouse[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const addFavorite = (house: FavoriteHouse) => {
    if (!favorites.some((f) => f.house_id === house.house_id)) {
      saveFavorites([...favorites, house]);
    }
  };

  const removeFavorite = (houseId: number) => {
    saveFavorites(favorites.filter((f) => f.house_id !== houseId));
  };

  const isFavorite = (houseId: number) => {
    return favorites.some((f) => f.house_id === houseId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
