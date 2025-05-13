export class HttpError extends Error {
	public statusCode: number;
	constructor(message: string, statusCode: number){
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name; /* Helps in debugging */
		Object.setPrototypeOf(this, HttpError.prototype);
		Error.captureStackTrace(this, this.constructor);
	}
}
