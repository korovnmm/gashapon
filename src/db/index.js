import { db } from '../firebase'
import {
    collection, 
    doc, 
    getDoc,
    getDocs,
    query,
    where,
    deleteDoc
} from 'firebase/firestore'

//import { useCollectionData } from 'react-firebase-hooks/firestore'

/** A dictionary that stores certain details from the user session to minimize database reads. */
var cache = {
    shopTag: null,
    ticketData: null,
    prizeData: null,
    uid: null
}

/**
 * Stores data to memory in the form of an array.
 * If the data is not an array, it will be converted to
 * an array of length 1 before proceeding.
 * @param {String} key identifier to store data under in the cache dictionary 
 * @param {Array | any} data 
 * @returns the array of data currently cached under the given key 
 */
function cacheAsArray(key, data) {
    // Make sure data is an array and convert if not
    if(!(data instanceof Array))
        data = [data];
    
    // Case 1: there's previously cached data
    if (cache[key]) { 
        for (let i = 0; i < data.length; i++) {
            data[i].id = cache[key].length+1;
            cache[key] = Array.prototype.concat(cache[key], data[i]);
        }
    }
    // Case 2: no cached data exists
    else {
        cache[key] = data;
    }

    return cache[key];
}

/** Clears the cache dictionary (shopTag, ticketData, and uid) */
export function clearCachedData() {
    cache = {};
}


/**
 * Saves ticket data to memory so that it can be accessed without reading from the database.
 * @param {*} data ticket data to cache
 * @returns an array of currently cached ticket data
 */
export function saveTicketsToMemory(data) {
    return cacheAsArray("ticketData", data);
}

/**
 * Saves prize data to memory so that it can be accessed without reading from the database.
 * @param {*} data prize data to cache
 * @returns an array of currently cached prize data
 */
export function savePrizesToMemory(data) {
    return cacheAsArray("prizeData", data);
}

/**
 * Retrieves JSON object info of a single ticket from the database
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} JSON data for the ticket
 */
export const getTicketByCode = async (code) => {
    let result;
    const ticketRef = doc(db, "ticket-info", code);
    const snap = await getDoc(ticketRef); // waits for the returned promise to resolve

    if (snap.exists()) {
        result = snap.data();
    }

    return result;
}

/**
 * Retrieves prize info for a corresponding ticket code
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} prize info in JSON/dictionary format
 */
export const getPrizeByCode = async (code) => {
    const ticketData = await getTicketByCode(code);
    
    let prizeInfo;
    if (ticketData && ticketData.prizeID)
        prizeInfo = await getPrizeInfo(ticketData.prizeID);

    return prizeInfo;
}

/**
 * Retrieves prize info for a corresponding ticket code
 * @param {string} code a ticket's play code (must exist on the database first)
 * @returns {Promise<any>} prize info in JSON/dictionary format
 */
export const getPrizeByCode = async (code) => {
    return { name: "NotImplementedError", message: "function not implemented yet!" };
}

/**
 * Queries the database for all tickets containing a specific prefix.
 * @param {*} prefix the prefix to query for
 * @returns an array list of tickets with the matching prefix, array is empty if no results were found
 */
export const getTicketsByPrefix = async (prefix) => {
    var len = prefix.length;
    var head = prefix.slice(0, len-1);
    var tail = prefix.slice(len-1, len);

    var start = prefix;
    var stop = head + String.fromCharCode(tail.charCodeAt(0) + 1);

    const ticketsRef = collection(db, "ticket-info");
    const q = query(ticketsRef,
            where("__name__", '>=', start),
            where("__name__", '<', stop));
    
    // Retrieve data snapshot, first from cache, then from server
    var data = [];
    if (cache.ticketData && cache.ticketData.length > 0) {
        data = cache.ticketData;
    } else {
        const snap = await getDocs(q);

        snap.forEach( (doc) => {
            var d = doc.data();
            d.id = data.length+1;
            d.code = doc.id;
            data.push(d);
        });

        saveTicketsToMemory(data);
    }
    return data;
}


/**
 * Grabs the given user's configured shop / organization display name.
 * @param {*} uid user id
 * @returns {string} the user's shop display name
 */
export const getShopName = async (uid) => {
    let name;
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
        name = snapshot.data().shopDisplayName;
    }

    return name;
}

/**
 * Grabs a user's current shop tag from the database.
 * @param {*} uid user id
 * @returns {string} the shop tag that belongs to the given user id
 */
export const getUserShopTag = async (uid) => {
    var tag;
    if (cache.shopTag) {
        tag = cache.shopTag
    } else {
        var ref = doc(db, "users", uid);
        var snapshot = await getDoc(ref);

        if (snapshot.exists()) {
            tag = snapshot.data().shopTag;
            cache.shopTag = tag;
        } else {
            alert("No shop tag set!");
            tag = null;
        }
    }    

    return tag;
}

/**
 * Takes an auth context user object and returns a list of tickets generated by that user.
 * @param {*} user the auth context user (provided by the auth module when the user signs in) 
 * @returns an array list of tickets generated by that user
 */
export const getTicketsGeneratedByUser = async (user) => {
    var prefix = await getUserShopTag(user.uid);
    return getTicketsByPrefix(prefix);
}


/**
 * @param {*} user 
 * @returns a list of prizes (info and metadata together) created by the given user
 */
export const getPrizesGeneratedByUser = async (user) => {
    const prizesRef = collection(db, "prizes");
    const q = query(prizesRef,
        where("creatorUserID", '==', user.uid));
    
    const snap = await getDocs(q); // returns a promise
    const prizes = [];
    
    if (cache.prizeData)
        return cache.prizeData;

    for (let i = 0; i < snap.size; i++) {
        const doc = snap.docs[i];
        const prizeMetaData = doc.data();
        const prizeInfoData = await getPrizeInfo(doc.id);
        
        // Combine the data together
        const fullPrizeData = {
            id: i+1,
            docId: doc.id,
            name: prizeInfoData.name,
            description: prizeInfoData.description,
            image: prizeInfoData.image,
            quantity: prizeMetaData.quantity,
            createdAt: prizeMetaData.createdAt
        }

        prizes.push(fullPrizeData);
    }
    savePrizesToMemory(prizes);
    return prizes;
}


/**
 * Returns info data for a prize from the 'prize-info' collection.
 * @param {*} id 
 * @returns a dictionary containing prize info data
 */
export const getPrizeInfo = async (id) => {
    let result;
    const prizesRef = doc(db,"prize-info", id);
    const snap = await getDoc(prizesRef); // waits for the returned promise to resolve

    if(snap.exists()){
        result = snap.data();
    }

    return result;
}

/**
 * Returns info data for a prize from the 'prize' collection.
 * @param {*} id 
 * @returns a dictionary containing prize data
 */
export const getPrizeMetaData = async (id) => {
    let result;
    const prizesRef = doc(db, "prizes", id);
    const snap = await getDoc(prizesRef); // waits for the returned promise to resolve

    if (snap.exists()) {
        result = snap.data();
    }

    return result;
}

/**
 * Deletes a prize from firestore and memory (cache).
 * @param {*} id document id for the prize
 * @returns true if a document was successfully deleted, otherwise false if nothing was deleted
 */
export const deletePrize = async (id) => {
    let itemDeleted = false;

    // Delete document from Firestore
    await deleteDoc(doc(db, "prizes", id));
    await deleteDoc(doc(db, "prize-info", id));

    // Delete from cache
    if (cache.prizeData) {  
        cache.prizeData = null;
    }

    itemDeleted = true;
    return itemDeleted;
}