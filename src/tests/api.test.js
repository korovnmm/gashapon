import { generateTickets, call } from 'api'
import { 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    getAuth, 
    signOut
} from 'auth'

// Setup
let auth = getAuth();
let exampleUserEmail = "itsjoe@example.com";
let examplePassword = "superSecretPassword123";
afterAll(() => {
    return auth.currentUser.delete();
});

describe('Server', () => {
    
    it("is running (hello world)", () => {
        return call("helloWorld").then((json) => {
            expect(json).toEqual({ "data": "World!" });
            expect(json.data).toMatch("World!");
        });
    });

});



// Main Tests
describe('Shopkeeper', () => {

    it("can create a new user account", () => {
        return createUserWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
            .then(() => {
                return call("initUserAccount")
                    .then(() => {
                        return signOut(auth);
                    });
            });
    });

    it("can sign in", () => {
        return signInWithEmailAndPassword(auth, exampleUserEmail, examplePassword)
            .then(() => {
                expect(auth.currentUser.email).toMatch(exampleUserEmail);
            });
    });
    
    it("can generate a play ticket without errors", () => {
        return generateTickets("customer@example.com", "blank memo", 1)
            .then((result) => {
                let keys = Object.keys(result.data); 
                expect(keys.length).toBe(1);
                for (let key of keys) {
                    expect(key.substring(0,7)).toMatch("itsjo-");
                    expect(result.data[key]["email"]).toMatch("customer@example.com");
                    expect(result.data[key]["memo"]).toMatch("blank memo");
                }
            });
    });

    it("can generate multiple play tickets without errors", () => {
        return generateTickets("customer2@example.com", "", 10)
            .then((result) => {
                let keys = Object.keys(result.data);
                expect(keys.length).toBe(10);
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    expect(keys.slice(i+1).indexOf(key)).toBe(-1); // checks for duplicates
                    expect(key.substring(0, 7)).toMatch("itsjo-");
                    expect(result.data[key]["email"]).toMatch("customer2@example.com");
                    expect(result.data[key]["memo"]).toMatch("");
                }
            });
    });

});