import { generateOpenAPIDocument } from "./openapi-registry";

/**
 * Import route files to register paths in the OpenAPI registry
 * IMPORTANT: These imports must happen BEFORE generateOpenAPIDocument() is called
 */
import "../modules/reviews/reviews.routes";
import "../modules/reviews/reviews.nested.routes";

/**
 * Export OpenAPI specification generated from Zod schemas
 */
export const swaggerSpec = generateOpenAPIDocument();
