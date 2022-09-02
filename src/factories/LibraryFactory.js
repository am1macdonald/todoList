const LibraryFactory = () => {
  const library = {};

  const show = () => {
    const items = [];
    for (const item in library) {
      items.push(library[item]);
    }
    return items;
  };

  const add = (key, item) => {
    library[key] = item;
  };

  const remove = (key) => {
    delete library[key];
  };

  return {
    add,
    remove,
    show,
  };
};

export default LibraryFactory;
