import { functions } from '../firebase'
import { httpsCallable } from '@firebase/functions';

const generateTicketsRef = httpsCallable(functions, 'generateTickets');

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