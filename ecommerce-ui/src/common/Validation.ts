export class Validation {
  #email: string = ''
  #password: string = ''
  #errorMessage: string = ''
  constructor(email: string, password: string) {
    this.#email = email
    this.#password = password
  }
  validateEmailAndPassword(): { errorMessage: string; isValid: boolean } {
    let isValid = true
    this.#errorMessage = ''

    if (!this.#email || !this.#email?.trim()) {
      this.#errorMessage = 'Please enter your email address.'
      isValid = false
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.#email)) {
      this.#errorMessage = 'Please enter a valid email address.'
      isValid = false
    } else if (!this.#password || !this.#password.trim()) {
      this.#errorMessage = 'Please enter your password.'
      isValid = false
    }

    return { errorMessage: this.#errorMessage, isValid }
  }
}
