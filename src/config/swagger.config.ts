import { generateOpenAPIDocument } from "./openapi-registry";

/**
 * Import route files to register paths in the OpenAPI registry
 * IMPORTANT: These imports must happen BEFORE generateOpenAPIDocument() is called
 */
import "../modules/reviews/reviews.routes";
import "../modules/reviews/reviews.nested.routes";
import "../modules/attendances/attendances.routes";
import "../modules/attendances/attendances.nested.routes";
import "../modules/auth/auth.validation";
import "../modules/auth/auth.routes";
import "../modules/config/config.validation";
import "../modules/config/config.routes";
import "../modules/favorites/favorites.routes";
import "../modules/favorites/favorites.nested.routes";

/**
 * Export OpenAPI specification generated from Zod schemas
 */
export const swaggerSpec = generateOpenAPIDocument();
