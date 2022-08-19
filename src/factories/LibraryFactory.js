const LibraryFactory = () => {
  let arr = [];

  const show = () => arr;

  const addToLibrary = (task) => {
    arr.push(task);
    arr[arr.length - 1].summary();
  };

  const removeFromLibrary = (task) => {
    arr = arr.filter((storedTask) => {
      if (storedTask.identifier !== task.identifier) {
        return task;
      } else {
        return false;
      }
    });
  };

  return {
    addToLibrary,
    removeFromLibrary,
    show,
  };
};

export default LibraryFactory;