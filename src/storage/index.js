import 'firebase/storage';  
import { getStorage } from "firebase/storage";
import { initializeApp} from "firebase/app";
import { firebaseConfig } from "config";



const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);


  

// export const handleUpload = () => {
//     const image = {handleChange};
//     const firebaseApp = initializeApp(firebaseConfig);
//     const storage = getStorage(firebaseApp);
   

//     const uploadTask = ref(storage,`images/${image.name}`);
//     uploadTask.on('state_changed', 
//     (snapshot) => {

//     }, 
//       () => {
//         ref(imageRef,'images').child(image.name).getDownloadURL().then(url => {
//           console.log(url);
//           state.url = url;
//           return state.url;
//           });
//       }
      
//     );
    
//   };
  

