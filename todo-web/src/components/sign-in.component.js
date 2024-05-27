const form = document.createElement('template');
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
`

const result = document.createElement('template');
result.innerHTML = `
<div class="flex flex-col justify-start items-start container py-4 px-8 bg-[hsl(45,29%,97%)] border-solid border-2 border-[hsla(302,16%,45%,1)] shadow-[9px_10px_0_hsla(302,16%,45%,1)]">
    <h3 class="mb-3">Success</h3>
    <p>A link has been sent to your inbox</p>
</div>
`

class SignInModal extends HTMLElement {
    /**@private {HTMLButtonElement}*/
    submitButton;

    constructor() {
        super();
        // const shadow = this.attachShadow({mode: 'open'})
        // shadow.append(
    }

    connectedCallback() {
        this.append(form.content.cloneNode(true));
        this.submitButton = this.querySelector('button');
        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submit(this.querySelector('input').value)
        })
    }

    /**
     * @param {string} email
     */
    submit(email) {
        fetch("/api/v1/sign_in", {
            method: "POST",
            body: JSON.stringify({
                email
            })
        }).then((res) => {
            if (res.status !== 200) {
                throw new Error(res.statusText);
            }
            return res.json()
        }).then(() => {
            this.innerHTML = '';
            this.append(result.content.cloneNode(true))
        }).catch(() => {
            alert('failed to login')
        })


    }
}

window.customElements.define('app-sign-in-modal', SignInModal);
