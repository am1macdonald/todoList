/* eslint-disable curly */
import { compareAsc, parseISO } from "date-fns";
import Project from "./classes/Project.js";
import Task from "./classes/Task.js";
import LibraryFactory from "./factories/LibraryFactory.js";
import { sendProjectToDatabase } from "./database/Project.js";
import { sendTaskToDatabase } from "./database/Task.js";

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
  const { title, description, deadline: dueDate, notes, tasks, id, complete } =
    item;
  return new Project(
    title,
    description,
    dueDate,
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
    deadline: dueDate,
    priority,
    notes,
    checklist,
    id,
    complete
  } = item;
  return new Task(
    title,
    description,
    dueDate,
    priority,
    notes,
    checklist,
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
 * @returns {Promise<void|boolean>}
 */
export const addNewTask = async (appConfig) => {
  let taskForm = "";

  if (document.getElementById("task-form") !== null) {
    taskForm = document.getElementById("task-form");
  } else {
    console.error("cannot find task form");
    return false;
  }

  // array from text-input nodes from the task form
  const nodeArr = Array.from(taskForm.childNodes)
    .filter((node) => node.tagName === "INPUT" || node.tagName === "SELECT")
    .map((node) => {
      if (node.id === "due-date") {
        return node.valueAsDate;
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

  // gets contents of the checklist and stores them in an object
  const listItems = document.getElementsByClassName("checklist-item");
  const checklistObj = {};
  for (const item of listItems) {
    checklistObj[item.innerHTML.slice(2, item.innerHTML.length)] = false;
  }
  const newTask = new Task(...nodeArr, checklistObj, Date.now());

  // if (getUser()) {
  //   const taskID = await addToDatabase(newTask, "tasks", taskConverter);
  //   TaskLibrary.add(taskID, newTask);
  // } else {
  TaskLibrary.add(crypto.randomUUID(), newTask);
  updateLocalStorage(TaskLibrary.get(), "task");
  // }
  TaskLibrary.show();
  callback();
};

export const editTask = (obj) => {
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const notes = document.getElementById("notes").value;
  const listItems = document.getElementsByClassName("checklist-item");
  const checklistObj = {};
  for (const item of listItems) {
    checklistObj[item.innerHTML.slice(2, item.innerHTML.length)] = false;
  }

  obj.edit(description, dueDate, priority, notes, checklistObj);
  updateDocument(obj, "tasks", taskConverter);
  updateLocalStorage(TaskLibrary.get(), "task");
};

/**
 * @param {AppConfig} appConfig
 * @returns {Promise<void|boolean>}
 */
export const addNewProject = async (appConfig) => {
  // array from text-input nodes from the project form
  const nodeArr = Array.from(document.querySelectorAll(".project-creation-input"))
    .filter((node) => node.tagName === "INPUT" || node.tagName === "SELECT")
    .map((node) => {
      if (node.id === "due-date") {
        return node.valueAsDate;
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
  } else {
    sendProjectToDatabase(appConfig, newProject).then((res) => {
      console.log(res)
      newProject.id = res.id;
      ProjectLibrary.show(ProjectLibrary.show(), "project");
    }).catch((e) => {
      console.log(e);
    });
  }
};

export const editProject = async (obj) => {
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const notes = document.getElementById("notes").value;
  const tasks = Array.from(document.getElementsByClassName("task-list-item"))
    .filter((item) => {
      return item.firstChild.checked === true;
    })
    .map((item) => {
      return item.firstChild.id;
    });
  obj.edit(description, dueDate, notes, tasks);
  // TODO: Fix
  // if (getUser()) {
  //   updateDocument(obj, "projects", projectConverter);
  // } else {
  updateLocalStorage(ProjectLibrary.get(), "project");
  // }
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
          const test = compareAsc(
            parseISO(item.dueDate),
            parseISO(tempArr[i].dueDate)
          );
          if (test === 1 || test === 0) {
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
