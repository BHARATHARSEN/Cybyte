// Creating a global context to store the selected database
const DatabaseContext = {
    selectedDatabase: 'database1' // Default database if none is selected
  };
  
  export const setDatabase = (database: string) => {
    DatabaseContext.selectedDatabase = database;
  };
  
  export const getDatabase = () => {
    return DatabaseContext.selectedDatabase;
  };