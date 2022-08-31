const LibraryFactory = () => {
  const library = {};

  const show = () => library;

  const addToLibrary = (itemId, item) => {
    library[itemId] = item;
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
