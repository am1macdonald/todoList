/* eslint-disable curly */
import Project from "./classes/Project.js";
import Task from "./classes/Task.js";
import LibraryFactory from "./factories/LibraryFactory.js";
import { deleteProjectFromDatabase, sendProjectToDatabase, updateDatabaseProject } from "./database/Project.js";
import { deleteTaskFromDatabase, sendTaskToDatabase, updateDatabaseTask } from "./database/Task.js";
import moment from "moment";

const TaskLibrary = LibraryFactory();
const ProjectLibrary = LibraryFactory();

const populateLibrary = (libraryName, data) => {
  for (const key in data) {
    libraryName.add(key, data[key]);
  }
};

const populateAll = (taskData, projectData) => {
  populateLibrary(TaskLibrary, taskData);
  populateLibrary(ProjectLibrary, projectData);
};

const projectFromJSON = (item) => {
  const { title, description, deadline, notes, tasks, id, complete } =
    item;
  return new Project(
    title,
    description,
    deadline,
    notes,
    tasks,
    id,
    complete
  );
};

const taskFromJSON = (item) => {
  const {
    title,
    description,
    deadline,
    priority,
    notes,
    id,
    complete
  } = item;
  return new Task(
    title,
    description,
    deadline,
    priority,
    notes,
    id,
    complete
  );
};

const populateFromLocalStorage = (library, libraryType, converter) => {
  if (window.localStorage.getItem(`${libraryType}-library`)) {
    const storageMap = JSON.parse(
      window.localStorage.getItem(`${libraryType}-library`)
    );

    for (const item in storageMap) {
      library.add(item, converter(storageMap[item]));
    }
  }
};

/**
 * @param {AppConfig} appConfig
 * @param library
 * @param {string} libraryType
 * @param {function} converter
 * @returns {Promise<any>}
 */
const populateFromApi = async (appConfig, library, libraryType, converter) => {
  const response = await fetch(`/api/v1/${appConfig.session.userID}/${libraryType}`);
  if (!response.ok && response.status !== 200) {
    throw new Error("failed to fetch: " + libraryType);
  }
  const responseJson = await response.json();
  library.addItems("id", responseJson.map(converter));
};

const updateLocalStorage = (map, libraryType) => {
  window.localStorage.setItem(`${libraryType}-library`, JSON.stringify(map));
};

/**
 * @param {AppConfig} appConfig
 */
export const addNewTask = (appConfig, callback) => {
  // array from text-input nodes from the task form
  const nodeArr = Array.from(document.querySelectorAll(".task-creation-input"))
    .filter((node) => node.tagName === "INPUT" || node.tagName === "SELECT")
    .map((node) => {
      if (node.id === "deadline") {
        return (new Date(node.value).toISOString());
      } else {
        return node.value;
      }
    });
  // checks for contents of each child node
  for (let i = 0; i < nodeArr.length - 1; i++) {
    if (nodeArr[i].length === 0) {
      return console.error("err: missing fields");
    }
  }

  const newTask = new Task(...nodeArr);

  if (appConfig.session.isLocal) {
    TaskLibrary.add(crypto.randomUUID(), newTask);
    updateLocalStorage(TaskLibrary.get(), "task");
  } else {
    sendTaskToDatabase(appConfig, newTask).then((res) => {
      newTask.id = res.id;
      TaskLibrary.add(newTask.id, newTask);
      callback();
    }).catch((e) => {
      console.log(e);
    });
  }
};

export const saveEditTask = (appConfig, obj, callback) => {
  if (appConfig.session.isLocal) {
    updateLocalStorage(TaskLibrary.get(), "project");
  } else {
    updateDatabaseTask(appConfig, obj).then(() => {
      callback();
    }).catch(e => {
      console.log(e);
    });
  }
};

export const editTask = (appConfig, obj, callback) => {
  const description = document.getElementById("description").value;
  const deadline = new Date(document.getElementById("deadline").value).toISOString();
  const priority = document.getElementById("priority").value;
  const notes = document.getElementById("notes").value;
  const listItems = document.getElementsByClassName("checklist-item");
  const checklistObj = {};
  for (const item of listItems) {
    checklistObj[item.innerHTML.slice(2, item.innerHTML.length)] = false;
  }

  obj.edit(description, deadline, priority, notes, checklistObj);
  saveEditTask(appConfig, obj, callback);
};

export const deleteTask = (appConfig, obj, callback) => {
  console.log(obj);
  TaskLibrary.remove(obj.key);
  if (appConfig.session.isLocal) {
    // TODO: local removal
    // updateLocalStorage(TaskLibrary.get(), "task");
    // TaskLibrary.show(TaskLibrary.show(), "task");
  } else {
    deleteTaskFromDatabase(appConfig, obj.id).then(() =>
      TaskLibrary.show(TaskLibrary.show(), "project")
    );
  }
  callback();
};

/**
 * @param {AppConfig} appConfig
 */
export const addNewProject = (appConfig, callback) => {
  // array from text-input nodes from the project form
  const nodeArr = Array.from(document.querySelectorAll(".project-creation-input"))
    .filter((node) => node.tagName === "INPUT" || node.tagName === "SELECT")
    .map((node) => {
      if (node.id === "deadline") {
        return (node.value);
      } else {
        return node.value;
      }
    });

  const tasks = Array.from(document.getElementsByClassName("task-list-item"))
    .filter((item) => {
      return item.firstChild.checked === true;
    })
    .map((item) => {
      return item.firstChild.id;
    });

  // checks for contents of each child node
  for (let i = 0; i < nodeArr.length - 1; i++) {
    if (nodeArr[i].length === 0) {
      return console.error("err: missing fields");
    }
  }
  const newProject = new Project(...nodeArr, tasks);

  if (appConfig.session.isLocal) {
    ProjectLibrary.add(crypto.randomUUID(), newProject);
    updateLocalStorage(ProjectLibrary.get(), "project");
    ProjectLibrary.show(ProjectLibrary.show(), "project");
    callback();
  } else {
    sendProjectToDatabase(appConfig, newProject).then((res) => {
      newProject.id = res.id;
      ProjectLibrary.add(newProject.id, newProject);
      callback();
    }).catch((e) => {
      console.log(e);
    });
  }
};

export const deleteProject = (appConfig, obj, callback) => {
  ProjectLibrary.remove(obj.key);
  if (appConfig.session.isLocal) {
    // TODO: fix delete from local
    updateLocalStorage(ProjectLibrary.get(), "project");
    ProjectLibrary.show(ProjectLibrary.show(), "project");
  } else {
    deleteProjectFromDatabase(appConfig, obj.id).then(() =>
      ProjectLibrary.show(ProjectLibrary.show(), "project")
    );
  }
  callback();
};

export const saveEditProject = (appConfig, obj, callback) => {
  if (appConfig.session.isLocal) {
    updateLocalStorage(ProjectLibrary.get(), "project");
  } else {
    updateDatabaseProject(appConfig, obj).then(() => {
      callback();
    });
  }
}

/**
 *
 * @param {AppConfig} appConfig
 * @param  {Project} obj
 * @param {function} callback
 */
export const editProject = (appConfig, obj, callback) => {
  const description = document.getElementById("description").value;
  const deadline = new Date(document.getElementById("deadline").value).toISOString();
  const notes = document.getElementById("notes").value;
  const tasks = Array.from(document.getElementsByClassName("task-list-item"))
    .filter((item) => {
      return item.firstChild.checked === true;
    })
    .map((item) => {
      return item.firstChild.id;
    });
  obj.edit(description, deadline, notes, tasks);
  saveEditProject(appConfig, obj, callback);
};

export const stateManager = (() => {
  // state for adding things to the libraries
  let _added = false;
  const getAdded = () => _added;
  const setAdded = (newState) => {
    if (typeof newState === "boolean") {
      _added = newState;
    }
  };
  return {
    getAdded,
    setAdded
  };
})();

// module for sorting algorithms
export const sortAlg = (() => {
  // sorts by time ascending
  const timeAsc = (library) => {
    const temp = [...library];
    const tempArr = [];
    temp.forEach((item) => {
      if (tempArr.length === 0) {
        tempArr.push(item);
      } else {
        for (let i = tempArr.length - 1; i >= 0; i--) {
          const test = moment(item.deadline).isSameOrAfter(
            tempArr[i].deadline
          );
          if (test) {
            tempArr.splice(i + 1, 0, item);
            break;
          } else if (i === 0) {
            tempArr.unshift(item);
          }
        }
      }
    });
    return tempArr;
  };
  return {
    timeAsc
  };
})();

export {
  populateAll,
  ProjectLibrary,
  TaskLibrary,
  populateFromLocalStorage,
  populateFromApi,
  taskFromJSON,
  projectFromJSON,
  updateLocalStorage
};
