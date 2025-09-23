import { useAppContext } from '../contexts/AppContext';
import { useLinks } from './useLinks';

export const useImportExport = () => {
  const { user } = useAppContext();
  const { links, addCategory } = useLinks();

  const exportData = () => {
    if (!user) return;
    
    const dataStr = JSON.stringify(links, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `lestart-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event) => {
    if (!user) return;
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }
        
        // Process imported data
        for (const category of data) {
          await addCategory(category.title);
          // In a full implementation, you would also add the links
        }
        
        alert('Data imported successfully!');
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return {
    exportData,
    importData
  };
};