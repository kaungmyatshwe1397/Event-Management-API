import { AsyncLocalStorage } from "node:async_hooks";
import pino from "pino";

// Create a storage for keeping things want to use globally by using nodejs built in asynclocalstorage
export const asyncStorage = new AsyncLocalStorage<{correlationId:string}>();

// Call pino for logging and use pino pretty for more easier reading
export const logger = pino({
    transport:{
        target: 'pino-pretty'
    }
});

// Use this function instead of logger so correlation Id can use anywher
export function getLogger(){
    // Find correlactionId inside storage ,if not find so show this 'no-id' when undefined by optional chaining.
    const correlationId = asyncStorage.getStore()?.correlationId ?? 'no-id';
    return logger.child({correlationId});
}