import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import "./assets/main.css";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAI8aDMdXaYHdZ8U_Kw11Q6XdibBJh2lB0",
	authDomain: "booking-service-nti.firebaseapp.com",
	projectId: "booking-service-nti",
	storageBucket: "booking-service-nti.appspot.com",
	messagingSenderId: "287477041419",
	appId: "1:287477041419:web:b20b19ba6f517e6898fa0e",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App);

app.use(router);

app.mount("#app");
