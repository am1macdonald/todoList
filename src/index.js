import './reset.css';
import './style.css';
import {renderBigDate, renderStaticElements, taskCreationMenu, render} from './pageControl.js';


renderStaticElements();
renderBigDate.updateTime();

const content = document.getElementById('content');
const clock = document.getElementById('date-hero');

const contentObserver = (() => {
    const config = { childList: true };
    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                if (content.childNodes.length === 0) {
                    renderBigDate.updateTime();
                    content.appendChild(clock);
                }; 
            };
        };
    };
    const observer = new MutationObserver(callback);
    observer.observe(content, config);
})();

const newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', () => {
    renderBigDate.stop();
    let checkForm = Array.from(document.getElementById('content').childNodes)
    .find((node) => node.id == 'form-container');
    if (!checkForm) {
        taskCreationMenu();
        clock.remove();
    };
    
});