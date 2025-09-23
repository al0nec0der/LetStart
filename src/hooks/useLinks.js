import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAppContext } from '../contexts/AppContext';

export const useLinks = () => {
  const { user } = useAppContext();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      // Check if Firebase is properly configured
      if (db.noop) {
        setLinks([]);
        setLoading(false);
        return;
      }

      if (!user) {
        setLinks([]);
        setLoading(false);
        return;
      }

      try {
        const linksCollection = collection(db, 'users', user.uid, 'links');
        const q = query(linksCollection, orderBy('title'));
        const linkSnapshot = await getDocs(q);
        
        const linksList = linkSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setLinks(linksList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching links:', error);
        setLoading(false);
      }
    };

    fetchLinks();
  }, [user]);

  const addCategory = async (title) => {
    // Check if Firebase is properly configured
    if (db.noop || !user || !title.trim()) return null;

    try {
      const linksCollection = collection(db, 'users', user.uid, 'links');
      const newCategoryDoc = {
        title: title.trim(),
        links: [],
      };

      const docRef = await addDoc(linksCollection, newCategoryDoc);
      const newCategory = { id: docRef.id, ...newCategoryDoc };
      setLinks([...links, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      return null;
    }
  };

  const addLink = async (categoryId, name, url) => {
    // Check if Firebase is properly configured
    if (db.noop || !user || !name.trim() || !url.trim()) return false;

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    const newLink = { name: name.trim(), url: formattedUrl };

    try {
      const categoryDocRef = doc(db, 'users', user.uid, 'links', categoryId);
      await updateDoc(categoryDocRef, {
        links: arrayUnion(newLink),
      });

      setLinks(links.map(category => {
        if (category.id === categoryId) {
          return { ...category, links: [...category.links, newLink] };
        }
        return category;
      }));

      return true;
    } catch (error) {
      console.error('Error adding link:', error);
      return false;
    }
  };

  const deleteLink = async (categoryId, linkToDelete) => {
    // Check if Firebase is properly configured
    if (db.noop || !user) return false;

    try {
      const categoryDocRef = doc(db, 'users', user.uid, 'links', categoryId);
      await updateDoc(categoryDocRef, {
        links: arrayRemove(linkToDelete),
      });

      setLinks(links.map(category => {
        if (category.id === categoryId) {
          const updatedLinks = category.links.filter(
            (link) => link.url !== linkToDelete.url
          );
          return { ...category, links: updatedLinks };
        }
        return category;
      }));

      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      return false;
    }
  };

  const deleteCategory = async (categoryId) => {
    // Check if Firebase is properly configured
    if (db.noop || !user) return false;

    try {
      const categoryDocRef = doc(db, 'users', user.uid, 'links', categoryId);
      // In a real app, you would delete the document here
      // For now, we'll just remove it from the local state
      setLinks(links.filter(category => category.id !== categoryId));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  return {
    links,
    loading,
    addCategory,
    addLink,
    deleteLink,
    deleteCategory
  };
};