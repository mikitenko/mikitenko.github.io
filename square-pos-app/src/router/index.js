import Vue from "vue";
import VueRouter from "vue-router";
import { postToParentPath } from "../services/postToParentPath";

Vue.use(VueRouter);

const routes = [
  {
    path: "/pos/show/:id",
    name: "home",
    component: resolve => require(["@/components/Home/Home.vue"], resolve),
    meta: {
      title: "Menu"
    }
  },
  {
    path: "/pos/show/:id/location",
    name: "location",
    component: resolve =>
      require(["@/components/Location/Location.vue"], resolve),
    meta: {
      title: "Location"
    }
  },
  {
    path: "/pos/show/:id/cart",
    name: "cart",
    component: resolve => require(["@/components/Cart/Cart.vue"], resolve),
    meta: {
      title: "Cart"
    }
  },
  {
    path: "/pos/show/:id/order-details/:orderId",
    name: "order-details",
    component: resolve =>
      require(["@/components/OrderDetails/OrderDetails.vue"], resolve),
    meta: {
      title: "Order details"
    }
  },
  {
    name: "404",
    path: "/404",
    component: resolve =>
      require(["@/components/Global/AppError.vue"], resolve),
    meta: {
      title: "404"
    }
  },
  {
    name: "disconnected",
    path: "/disconnected",
    component: resolve =>
      require(["@/components/Global/AppError.vue"], resolve),
    meta: {
      title: "Disconnected"
    }
  },
  {
    name: "redirect",
    path: "*",
    redirect: "/404"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.VUE_APP_BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  postToParentPath(to);
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  return next();
});

export default router;
