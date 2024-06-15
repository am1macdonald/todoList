class Library {
  library = {};

  show() {
    const items = [];
    for (const item in this.library) {
      this.library[item].key = item;
      items.push(this.library[item]);
    }
    return items;
  };

  get() {
    return this.library;
  };

  addItem(key, item) {
    this.library[key] = item;
  };

  addItems = (key, arr) => {
    arr.forEach((item) => {
      this.library[item[key]] = item;
    });

  };

  remove = (key) => {
    delete this.library[key];
  };
}

export default Library;
