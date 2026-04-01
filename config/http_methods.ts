type AvailableRouterMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * HTTP Method.
 */
export const HTTP_METHOD: Record<AvailableRouterMethod, AvailableRouterMethod> =
  {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
  };
