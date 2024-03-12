/**
 * Custom error class for inscription errors.
 */
export class InscriptionError extends Error {
  /**
   * Creates an instance of InscriptionError.
   * @param {string | undefined} message The error message.
   * @param {string} [name='unknown'] The error name.
   * @param {number} [status] The HTTP status code associated with the error.
   */
  constructor(
    message: string | undefined,
    public name: string = 'unknown',
    public status?: number
  ) {
    super(message)
  }
}
