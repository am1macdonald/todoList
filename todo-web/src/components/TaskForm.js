const form = document.createElement("template");
form.innerHTML = `
<div class="flex flex-col justify-start items-start container py-4 px-8 bg-[hsl(45,29%,97%)] border-solid border-2 border-[hsla(302,16%,45%,1)] shadow-[9px_10px_0_hsla(302,16%,45%,1)]">
    <h3 class="mb-3">Login</h3>
    <div class="flex flex-col gap-6 pb-6">
        <p>Submit your email to have a link sent to your inbox</p>
        <div class="flex justify-between items-center gap-3">
            <input class="border-solid border-2 border-[hsla(302,16%,45%,1)] p-1" type="email" required>
            <button>Get magic link...</button>
        </div>
    </div>
</div>
`;

class TaskForm extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.init();

  }

  init() {
  }
}

window.customElements.define("app-sign-in-modal", TaskForm);
