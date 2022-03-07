import { functions } from '../firebase'
import { httpsCallable } from '@firebase/functions';

const generateTicketsRef = httpsCallable(functions, 'generateTickets');

/**
 * Makes a direct api call, use ***only*** if there isn't a middle-man function for this already.
 * @param {string} functionName name of the endpoint function 
 * @param {*} data request data to send to the server function (dictionary / json format)
 * @returns {Promise<import('@firebase/functions').HttpsCallableResult>} response data
 */
export const call = async(functionName, data) => {
    let ref = httpsCallable(functions, functionName);
    return ref(data);
}

/**
 * Generates play tickets for the authenticated user's machine
 * @param {string} email customer email (***not*** the shopkeeper's)
 * @param {string} memo a personal note-to-self
 * @param {number} amount number of tickets to generate with the provided arguments
 * @returns {Promise<import('@firebase/functions').HttpsCallableResult>} generated ticket(s) info if successful.
 */
export const generateTickets = async (email, memo, amount) => {
    return generateTicketsRef({
        email,
        memo,
        amount
    });
}
/**
 * Generates new listings in inventory
 * @param {string} name of product
 * @param {string} description of product
 * @param {number} amount
 * @returns {Promise<import('@firebase/functions').HttpsCallableResult>} generated item(s) info if successful.
 */
export const addNewPrize = async (name, description, quantity) => {
    return call("addNewPrize", {
        name,
        description,
        quantity
    });
}