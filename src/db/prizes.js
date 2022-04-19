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

import{cache, cacheAsArray} from "db"

/**
 * Saves prize data to memory so that it can be accessed without reading from the database.
 * @param {*} data prize data to cache
 * @returns an array of currently cached prize data
 */
 export function savePrizesToMemory(data) {
    return cacheAsArray("prizeData", data);
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