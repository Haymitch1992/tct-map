import { createRouter,createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
   {
    path: "/",
    name: "Home",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/terminal/createProject.vue"),
  },
  {
    path: "/createProject",
    name: "createProject",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/terminal/createProject.vue"),
  },
  {
    path: "/flightReplay",
    name: "flightReplay",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/terminal/flightReplay.vue"),
  },
  {
    path: "/setWayLine",
    name: "setWayLine",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/terminal/setWayLine.vue"),
  },
  {
    path: "/editLine",
    name: "editLine",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/terminal/editLine.vue"),
  },
  {
    path: "/aircraft",
    name: "aircraft",
    component: () =>
    import(/* webpackChunkName: "about" */ "../views/centre/aircraft.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;