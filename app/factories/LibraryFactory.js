const LibraryFactory = () => {
  const library = {};

  const show = () => {
    const items = [];
    for (const item in library) {
      library[item].key = item;
      items.push(library[item]);
    }
    return items;
  };

  const get = () => library;

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
    get,
  };
};

export default LibraryFactory;
