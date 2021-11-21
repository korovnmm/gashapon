import { db } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks'

/**
 * Retrieves JSON object info of a single ticket from the database
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} JSON data for the ticket
 */
export const getTicketByCode = async (code) => {
    throw { name: "NotImplementedError", message: "function not implemented yet!" };
}

export const getTicketsByPrefix = async (prefix) => {
    throw { name: "NotImplementedError", message: "function not implemented yet!" };

    var len = prefix.length;
    var head = prefix.slice(0, len-1);
    var tail = prefix.slice(len-1, len);

    var start = prefix;
    var stop = head + String.fromCharCode(tail.charCodeAt(0) + 1);

    const query = db.collection("ticket-info")
            .where(prefix, '>=', start)
            .where(prefix, '<', stop);
    
    return;
}