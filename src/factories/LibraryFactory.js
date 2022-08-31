const LibraryFactory = (database) => {
  const library = {};

  const dbRef = database;

  const show = () => library;

  const addToLibrary = async (item) => {
    const id = await dbRef.add(item);
    library[id] = item;
  };

  const removeFromLibrary = (itemId) => {
    delete library[itemId];
  };

  return {
    addToLibrary,
    removeFromLibrary,
    show,
  };
};

export default LibraryFactory;
