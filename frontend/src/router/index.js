import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AdminView from "../views/AdminView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/admin",
			name: "admin",
			component: AdminView,
		},
		{
			path: "/bookings",
			name: "bookings",
			component: () => import("../views/BookingsView.vue"),
		},
	],
});

export default router;
