// Build base error clase that contain statuscode,errorcode and error message
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Use base class and build a class for confict error
export class ConflictError extends AppError{
    constructor(message = "Ticket must be soldout or Conflicts happened.Please Try Again."){
        super(409,"Conflict",message);
    }
}

// Use base class and build a class for not found error
export class NotFoundError extends AppError{
    constructor(message:"Resource is not found."){
        super(404,"Not Found",message);
    }
}

//-------Can extend add additional specific error classes while keeping middleware clean