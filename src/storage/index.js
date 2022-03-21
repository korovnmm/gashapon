import 'firebase/storage';  
import { getStorage } from "firebase/storage";
import { initializeApp} from "firebase/app";
import { firebaseConfig } from "config";
const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);