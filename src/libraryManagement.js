/* eslint-disable curly */
import { compareAsc, parseISO } from "date-fns";
import Project from "./classes/projectClass.js";
import Task from "./classes/taskClass.js";
import LibraryFactory from "./factories/LibraryFactory.js";
import {
  addToDatabase,
  projectConverter,
  taskConverter,
} from "./firebase_files/firebase.js";

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

// const populateFromLocalStorage = (arr, libType) => {
//   if (window.localStorage.getItem(`${libType}-library`)) {
//     arr = JSON.parse(window.localStorage.getItem(`${libType}-library`)).map(
//       (item) => {
//         if (libType === "Task") {
//           console.log("task");
//           return new Task({ ...item });
//         } else if (libType === "Project") {
//           console.log("project");
//           return new Task({ ...item });
//         } else return null;
//       }
//     );
//   }
// };

// const updateLocalStorage = (arr) => {
//   window.localStorage.setItem("task-library", JSON.stringify(arr));
// };


export const addNewTask = async (callback) => {
  let taskForm = "";

  if (document.getElementById("task-form") !== null) {
    taskForm = document.getElementById("task-form");
  } else {
    console.error("not a task");
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

  // new code

  const taskID = await addToDatabase(newTask, "tasks", taskConverter);

  TaskLibrary.add(taskID, newTask);
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
  // taskLibrary.updateLocalStorage();
};
export const addNewProject = async (callback) => {
  let projectForm = "";

  if (document.getElementById("project-form") !== null) {
    projectForm = document.getElementById("project-form");
  } else {
    console.error("not a project");
    return false;
  }

  // array from text-input nodes from the project form
  const nodeArr = Array.from(projectForm.childNodes)
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

  // new code

  const projectID = await addToDatabase(
    newProject,
    "projects",
    projectConverter
  );

  ProjectLibrary.add(projectID, newProject);
  ProjectLibrary.show();
  callback();
};

export const editProject = (obj) => {
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
  // projectLibrary.updateLocalStorage();
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
    setAdded,
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
    timeAsc,
  };
})();

export { populateAll, ProjectLibrary, TaskLibrary };
