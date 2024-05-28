import "./src/lib/component_imports.js";
import "./src/stylesheets/reset.css";
import "./src/stylesheets/style.css";
import {
  projectCreationMenu,
  renderBigDate,
  renderStaticElements,
  taskCreationMenu,
  signInPopup,
  renderListToNav,
} from "./src/displayControl.js";
import {
  populateAll,
  TaskLibrary,
  ProjectLibrary,
  populateFromLocalStorage,
  taskFromJSON,
  projectFromJSON,
} from "./src/libraryManagement.js";
import Session from "./src/classes/session.js";
import AppConfig from "./src/classes/appConfig.js";

const appConfig = new AppConfig();
const session = new Session();

renderStaticElements(appConfig);

renderBigDate.updateTime();

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

const wrapUpSignIn = (target) => {
  target.remove();
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

const promptForSignIn = () => {
  signInPopup(
    page,
    () => {},
    localSessionCallback,
    () => disableButtons(false),
  );
};

if (authEnabled) {
  session
    .isValid()
    .then(
      (signedIn) => {
        if (!signedIn) {
          promptForSignIn();
          return;
        }
        appConfig.session = session;
        disableButtons(false);
      },
      () => {
        promptForSignIn();
      },
    )
    .catch(() => {
      promptForSignIn();
    });
} else {
  localSessionCallback(undefined);
  disableButtons(false);
}

// Observer puts the clock back up when the content is empty && setsState to false.
(() => {
  const config = { childList: true };
  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        if (content.childNodes.length === 0) {
          renderBigDate.updateTime();
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
  renderBigDate.stop();
  if (contentState.getState() === false) {
    taskCreationMenu();
    clock.remove();
  }
  contentState.setState(true);
});

const newProjectButton = document.getElementById("new-project-button");
newProjectButton.addEventListener("click", () => {
  renderBigDate.stop();
  if (contentState.getState() === false) {
    projectCreationMenu();
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
    setState,
  };
})();
