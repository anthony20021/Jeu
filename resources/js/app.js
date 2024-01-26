
import { createApp } from 'vue';
import GameVue from './components/game/GameVue.vue';
import BoutiqueGame from './components/game/BoutiqueGame.vue'


const app = createApp(GameVue);
app.component('boutique-game', BoutiqueGame);
app.mount('#blabla');

