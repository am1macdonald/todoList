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

const pending = document.createElement("template");

pending.innerHTML = `
<style>
.loading {
  font-size: 30px;
}

.loading:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4,end) 900ms infinite;      
  animation: ellipsis steps(4,end) 900ms infinite;
  content: "\\2026"; /* ascii code for the ellipsis character */
  width: 2px;
}

@keyframes ellipsis {
  to {
    width: 1.25em;    
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 1.25em;    
  }
}
</style>
<div class="flex flex-col justify-start items-start container py-4 px-8 bg-[hsl(45,29%,97%)] border-solid border-2 border-[hsla(302,16%,45%,1)] shadow-[9px_10px_0_hsla(302,16%,45%,1)]">
    <p class="loading w-[170px]">Sending link</p>
</div>
`;

const result = document.createElement("template");
result.innerHTML = `
<div class="flex flex-col justify-start items-start container py-4 px-8 bg-[hsl(45,29%,97%)] border-solid border-2 border-[hsla(302,16%,45%,1)] shadow-[9px_10px_0_hsla(302,16%,45%,1)]">
    <h3 class="mb-3">Success</h3>
    <p>A link has been sent to your inbox</p>
</div>
`;

const failed = document.createElement("template");
failed.innerHTML = `
<div class="flex flex-col justify-start items-start container py-4 px-8 bg-[hsl(45,29%,97%)] border-solid border-2 border-[hsla(302,16%,45%,1)] shadow-[9px_10px_0_hsla(302,16%,45%,1)]">
    <h3 class="mb-3">Failed</h3>
    <p>reason</p>
</div>
`;

class SignInModal extends HTMLElement {
  /**@private {HTMLButtonElement}*/
  submitButton;

  /**@private {string}*/
  formValue = "";

  clickEffect = (e) => {
    e.preventDefault();
    this.submit(this.input.value);
  };

  constructor() {
    super();
  }

  connectedCallback() {
    this.init();

  }

  init() {
    this.append(form.content.cloneNode(true));
    this.submitButton = this.querySelector("button");
    this.input = this.querySelector("input");
    this.input.value = this.formValue;
    this.submitButton.addEventListener("click", this.clickEffect);
  }

  /**
   * @param {string} email
   */
  submit(email) {
    this.formValue = this.input.value;
    this.innerHTML = "";
    this.append(pending.content.cloneNode(true));
    fetch("/api/v1/sign_in", {
      method: "POST",
      body: JSON.stringify({
        email
      })
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(() => {
      this.innerHTML = "";
      this.append(result.content.cloneNode(true));
    }).catch(() => {
      this.innerHTML = "";
      this.append(failed.content.cloneNode(true));
      setTimeout(() => {
        this.innerHTML = "";
        this.init();
      }, 3000);
    }).finally(() => {
      this.submitButton.removeEventListener("click", this.clickEffect)
    });


  }
}

window.customElements.define("app-sign-in-modal", SignInModal);
