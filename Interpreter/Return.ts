export class Return extends Error {
  value: unknown;

  constructor(value: unknown) {
    super(); // Call the Error constructor
    this.name = "Return"; // Set the class name as "Return"
    this.value = value;
    Object.setPrototypeOf(this, Return.prototype); // Ensure proper prototype chain
  }
}
