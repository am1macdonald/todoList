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

  const addItem = (key, item) => {
    library[key] = item;
  };

  const addItems = (key, arr) => {
    arr.forEach((item) => {
      library[item[key]] = item;
    })

  }

  const remove = (key) => {
    delete library[key];
  };

  return {
    add: addItem,
    addItems,
    remove,
    show,
    get,
  };
};

export default LibraryFactory;
