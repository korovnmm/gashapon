import { functions } from '../firebase'
import { httpsCallable } from '@firebase/functions';

const generateTicketsRef = httpsCallable(functions, 'generateTickets');
const generatePrizesRef = httpsCallable(functions, 'generatePrizes');

/**
 * Generates play tickets for the authenticated user's machine
 * @param {string} email customer email (***not*** the shopkeeper's)
 * @param {string} memo
 * @param {number} amount
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
export const generatePrizes = async (name, description, quantity) => {
    return generatePrizesRef({
        name,
        description,
        quantity
    });
}