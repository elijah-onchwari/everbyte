
/**
 * Represents a serialized version of a request context.
 */
export type SerializedRequestContext = {
    _req?: any;               // Serialized request object
    _isAuthorized?: boolean;  // Serialized authorization status
};
