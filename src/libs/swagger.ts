import swaggerJsdoc from "swagger-jsdoc";

// Create options json object for our API title and version
const options = {
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Event Management API",
            version: "1.0.0"
        },

    },
    apis:["./src/routes/*.ts","./src/index.ts"], // Read JSDocs comment from route files
}

export const swaggerSpec = swaggerJsdoc(options);

// Links for how to set up swagger
// Install swagger-jsdoc and create base obj
// https://github.com/Surnet/swagger-jsdoc
// Set up UI by using swagger-ui-express
// https://www.npmjs.com/package/swagger-ui-express
