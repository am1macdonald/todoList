import "./src/lib/component_imports.js";
import "./src/stylesheets/reset.css";
import "./src/stylesheets/style.css";
import {
  projectCreationMenu,
  renderBigDate,
  renderStaticElements,
  taskCreationMenu,
  signInPopup,
  renderListToNav, openSignIn
} from "./src/displayControl.js";
import {
  TaskLibrary,
  ProjectLibrary,
  populateFromLocalStorage,
  taskFromJSON,
  projectFromJSON, populateFromApi
} from "./src/libraryManagement.js";
import Session from "./src/classes/session.js";
import AppConfig from "./src/classes/appConfig.js";

const appConfig = new AppConfig();
const session = new Session();

const { updateTime: updateClock, stop: stopClock } = renderBigDate(appConfig);

renderStaticElements(appConfig);

updateClock();

const content = document.getElementById("content");
const page = document.getElementById("page");
const clock = document.getElementById("date-hero");
const allButtons = document.querySelectorAll("button");
const authEnabled = true;

const disableButtons = (bool) => {
  allButtons.forEach((button) => {
    button.disabled = bool;
  });
};

disableButtons(true);

const callListRenderers = () => {
  renderListToNav(TaskLibrary.show(), "task");
  renderListToNav(ProjectLibrary.show(), "project");
};

/**
 * @param {HTMLElement} target
 */
const wrapUpSignIn = (target = undefined) => {
  target?.remove();
  disableButtons(false);
};

/**
 *  @param {HTMLElement} target
 */
const localSessionCallback = (target) => {
  if (target) {
    wrapUpSignIn(target);
  }
  populateFromLocalStorage(TaskLibrary, "task", taskFromJSON);
  populateFromLocalStorage(ProjectLibrary, "project", projectFromJSON);
  callListRenderers();
};

const setupConnectedSession = () => {
  wrapUpSignIn(undefined);
  Promise.all([
    populateFromApi(appConfig, TaskLibrary, "tasks", taskFromJSON),
    populateFromApi(appConfig, ProjectLibrary, "projects", projectFromJSON)
  ]).then((res) => {
    console.log(res);
    callListRenderers();
  }).catch((e) => {
    console.log(e);
  });
};

const promptForSignIn = () => {
  signInPopup(
    page,
    () => {
    },
    localSessionCallback,
    () => disableButtons(false)
  );
};

session
  .isValid()
  .then(
    (signedIn) => {
      if (!signedIn) {
        openSignIn(page);
        return;
      }
      appConfig.session = session;
      setupConnectedSession();
    },
    () => {
      openSignIn(page);
    }
  )
  .catch(() => {
    openSignIn(page);
  });


// Observer puts the clock back up when the content is empty && setsState to false.
(() => {
  const config = { childList: true };
  const callback = function(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (content.childNodes.length === 0) {
          updateClock();
          content.appendChild(clock);
          contentState.setState(false);
        }
      }
    }
  };
  const observer = new MutationObserver(callback);
  observer.observe(content, config);
})();

const newTaskButton = document.getElementById("new-task-button");
newTaskButton.addEventListener("click", () => {
  stopClock();
  if (contentState.getState() === false) {
    taskCreationMenu(appConfig);
    clock.remove();
  }
  contentState.setState(true);
});

const newProjectButton = document.getElementById("new-project-button");
newProjectButton.addEventListener("click", () => {
  stopClock();
  if (contentState.getState() === false) {
    projectCreationMenu(appConfig);
    clock.remove();
  }
  contentState.setState(true);
});

const startButton = document.getElementById("start-button");
startButton.addEventListener("click", () => {
  contentState.setState(true);
});

const contentState = (() => {
  let state = false;
  const getState = () => state;
  const setState = (newState) => {
    if (typeof newState === "boolean") {
      state = newState;
    }
  };

  return {
    getState,
    setState
  };
})();
