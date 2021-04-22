export class ResourceError extends Error {
  // Set default status to "Not Found"
  public statusError = 404;

  constructor(error: "missing" | "duplicate", type: "user" | "file") {
    // If error type is duplicate update the error message and status
    if (error === "duplicate") {
      super(`This '${type}' already exists.`);
      this.statusError = 409;
      return;
    }

    // Otherwise send the "resource was not found" error message
    super(`This '${type}' was not found.`);
  }
}

export class PropertyError extends Error {
  // Set status error to "Bad Request"
  public statusError = 400;

  constructor(
    type: "missing" | "email" | "length" | "password" | "extension",
    property: string,
  ) {
    // If type is missing update the error message
    if (type !== "missing") {
      super(`Property '${property}' does not meet the ${type} requirements.`);
      return;
    }

    // Otherwise send the "property is missing" error message
    super(`Property '${property}' is missing.`);
  }
}

export class AuthenticationError extends Error {
  // Set status error to "Unauthorized"
  public statusError = 401;

  constructor(error: "expired" | "missing" | "incorrect") {
    if (error === "expired") {
      super("JWT token has expired.");
      return;
    }
    if (error === "missing") {
      super("JWT token is missing");
      return;
    }
    super("The email address or password is incorrect.");
  }
}
  }
}
