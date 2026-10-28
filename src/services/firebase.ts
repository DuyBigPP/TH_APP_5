import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

// Tạo bằng: npx firebase-tools apps:sdkconfig WEB <appId> -o src/services/firebaseConfig.json
import firebaseConfig from './firebaseConfig.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
