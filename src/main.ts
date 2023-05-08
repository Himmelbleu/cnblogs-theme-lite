/* Import Vue */
import App from "@/App.vue";
import router from "@/router";
import { createApp } from "vue";
import { createPinia } from "pinia";
/* Import CSS */
import "uno.css";
import "@/style.scss";
import { useDirective } from "@/helpers/directive-helper";

/* Start */
const app = createApp(App);

app.use(router);
app.use(createPinia());

useDirective(app);
LiteUtils.useLite(
  () => app.mount("#app"),
  () => app.mount("#app")
);
