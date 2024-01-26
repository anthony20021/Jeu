<template>
    <div id="game_vue">
        <button class="btn btn-primary" id='startingButton' @click="start()">Commencer</button>
        <button class="btn btn-outline-light" v-if="textIndex==0 && showText==true" @click="nbXP=2, next()">Facile</button>
        <button class="btn btn-outline-light" v-if="textIndex==0 && showText==true" @click="nbXP=1, next()">Normal</button>

        <!-- Affichage donnée joueur -->
        <h2>{{ player.class }} {{ player.name }}</h2>
        <div class="d-flex flex-row text-center justify-content-around" v-if="textIndex>4">
            <div class="d-flex flex-column " >
                <label for="level">Niveau {{ player.level }} XP : {{ Math.round(player.xp) }}/{{ Math.round(10+this.player.level**1.5) }}</label>
                <progress class="progress" id="level" :max=10+player.level**1.5 :value=player.xp></progress>
                <label for="pv">PV {{ Math.round(player.pv) }}/{{ Math.round(player.pvMax) }}</label>
                <progress class="progress" id="pv" :max=player.pvMax :value="player.pv"></progress>
                <label for="pm">PM {{ Math.round(player.pm) }}/{{ Math.round(player.pmMax) }}</label>
                <progress id="pm" class="progress" :max=player.pmMax :value="player.pm" ></progress><br>
            </div>
            <div>
                <img v-if="player.class=='Guerrier'" src="../../../pictures/Guerrier.png" style="max-width: 40%; height: auto;">
                <img v-if="player.class=='Voleur'" src="../../../pictures/Voleur.png" style="max-width: 40%; height: auto;">
                <img v-if="player.class=='Mage'" src="../../../pictures/Sorcier.png" style="max-width: 70%; height: auto;">
            </div>
            <div>
                <img v-if="(textIndex>22 && textIndex<31) || (textIndex>50 && textIndex<53) || (textIndex>33 && textIndex<38) || (textIndex>57 && textIndex<72)" src="../../../pictures/Henri.png" style="max-width: 70%;bottom: -7%; height: auto; position: relative;">
                <img v-if="ennemieCurrent=='brigant' || (textIndex>12 && textIndex<16)" src="../../../pictures/Brigant.png" style="max-width: 20%; height: auto; position: relative;">
                <img v-if="ennemieCurrent=='goblin'" src="../../../pictures/Goblin.png" style="max-width: 10%; height: auto; bottom: -65%; position: relative;">
                <img v-if="ennemieCurrent=='Chef'" src="../../../pictures/RoiGoblin.png" style="max-width: 100%; height: auto; bottom: +15%; position: relative;">
                <img v-if="ennemieCurrent=='Ombre1' || ennemieCurrent=='Ombre2' || (textIndex>75 && textIndex<81)" src="../../../pictures/Ombre.png" style="max-width: 100%; height: auto; bottom: +15%; position: relative;">

            </div>
            <div class="d-flex flex-column">
                <p>Attaque : {{ Math.round(player.atk) }}</p>
                <p>Defense : {{ Math.round(player.def) }}</p>
                <p>Bourse d'écus : {{ Math.round(player.ecu) }}</p>
                <p>Armure : {{ this.player.armure }}</p>
            </div>
        </div>

        <!-- Affichage du text et btn suivant-->
        <h1 id='textArea' v-show="showText">{{ text }}</h1>
        <button class="btn btn-primary" v-if="player.pv<=0 && textIndex>2" @click="start()">Recommencer</button>
        <button class="btn btn-outline-light" v-if="textIndex!=0 && textIndex!=2 && textIndex!=3 && textIndex!=7 && textIndex!=16 && textIndex!=19 && textIndex!=32 && textIndex!=38 &&textIndex!=34 &&textIndex!=42 && textIndex!=49 && textIndex!=55 && textIndex!=52 &&textIndex!=69 &&textIndex!=77"   v-show="showNextButton" @click="next()">Suivant</button>

        <!-- Affichage des boutons avant de faire les choix -->
        <button class="btn btn-outline-light" v-if="textIndex==7" @click="choixNb(2, ['Aller à gauche','Aller à droite'], [{name: 'degat', nb : lancerDe()},{name:'levelUp', nb : lancerDe()}], [['Vous allez à gauche','Vous tomber dans les ronces','aie', 'Vous avez subit des dégats'],['Vous allez à droite', 'Une bête approche','Elle vous attaque mais vous finissez par vaincre','+XP']])"> Suivant </button>
        <button class="btn btn-outline-light" v-if="textIndex==16" @click="choixNb(2,['Oui','Non'], [{name:'degat',nb:player.pv},{name:'combat', nb:'brigant'}],[['Il vous rattrape et il vous tue'],['Le combat était fatiguant','Vous entrez dans le village']])">Suivant</button>
        <button class="btn btn-outline-light" v-if="textIndex==19" @click="choixNb(2,['Oui','Non'],[{name:'heal'},{name:''}],[['Vous vous sentez mieux'],['Vous passez votre chemin']])">Suivant</button>
        <button class="btn btn-outline-light" v-if="textIndex==32" @click="combat('goblin'), next()">À l'attaque !</button>
        <button class="btn btn-outline-light" v-if="textIndex==38" @click="heal(), next()">Dormir</button>
        <button class="btn btn-outline-light" v-if="textIndex==34 && this.player.class!='Voleur'" @click="attaquePlus(2), ecuPlus(10), gameTexts.splice(textIndex+1, 0, player.class == 'Guerrier' ? 'Vous avez reçu une épée' : 'Vous avez reçu un sceptre'); next()">Merci</button>
        <button class="btn btn-outline-light" v-if="textIndex==34 && this.player.class=='Voleur'" @click="attaquePlus(5), ecuPlus(10), gameTexts.splice(textIndex+1, 0, 'Vous avez reçu un poignard'); next()">Merci</button>
        <button class="btn btn-outline-light" v-if="textIndex==42" @click="combat('Ombre1'), next()">Defendez-vous</button>
        <button class="btn btn-outline-light" v-if="textIndex==49" @click="combatGoblin(), next()">À l'attaque !</button>
        <button class="btn btn-outline-light" v-if="textIndex==55" @click="combat('Chef'), next()">À l'attaque !</button>
        <button class="btn btn-outline-light" v-if="textIndex==52" @click="heal(), next()">Boire</button>
        <button class="btn btn-outline-light" v-if="textIndex==69" @click="choixNb(2,['Oui','Non'],[{name:'', nb:1},{name:'degat',nb:player.pv}],[['Merci infiniment'],['Alors meurs']])">Suivant</button>
        <button class="btn btn-outline-light" v-if="textIndex==77" @click="combat('Ombre2'), next()">À l'attaque !</button>


        <button class="btn btn-outline-light" v-if="textIndex>25" @click="boutique()">Boutique</button>
        <br>
        <div class="d-flex flex-column">
            <button class="btn btn-outline-light" v-if="player.items.potionPV>0" @click="healPV(), player.items.potionPV = player.items.potionPV-1">Boire la potion de PV. <img src="../../../pictures/potionPV.png" style="max-width: 8%; height: auto;"> {{ player.items.potionPV }}</button>
            <button class="btn btn-outline-light" v-if="player.items.potionPM>0" @click="healPM(), player.items.potionPM = player.items.potionPM-1">Boire la potion de PM. <img src="../../../pictures/potionPM.png" style="max-width: 8%; height: auto;">{{ player.items.potionPM }}</button>
        </div>

        <!-- Choix classe  -->
        <div v-if="textIndex==2">
            <fieldset>
                <input type="radio" id="Guerrier" value="Guerrier" v-model="player.class">
                <label for="Guerrier">Guerrier</label>
                <input type="radio" id="Mage" value="Mage" v-model="player.class">
                <label for="Mage">Mage</label>
                <input type="radio" id="Voleur" value="Voleur" v-model="player.class">
                <label for="Voleur">Voleur</label>
            </fieldset>
            <button class="btn btn-outline-light" @click="choixClasse()">choisir</button>
        </div>
        <div v-if="textIndex==3">
            <input type="text" v-model="player.name"/>
            <button class="btn btn-outline-light" @click="choixPrenom()">Entrer</button>
        </div>

        <!-- Affichage btn btn-outline-light choix -->
        <div id="choix">
            <div v-if="choixNbr>1">
                <button class="btn btn-outline-light" @click="choixDone(choixDoes[0].name, choixDoes[0].nb, choixText[0])">{{ choixName[0] }}</button>
                <button class="btn btn-outline-light" @click="choixDone(choixDoes[1].name, choixDoes[1].nb,choixText[1])">{{ choixName[1] }}</button>
            </div>
            <button class="btn btn-outline-light" v-if="choixNbr>2" @click="choixDone(choixDoes[2].name, choixDoes[2].nb,choixText[2])">{{ choixName[2] }}</button>
            <button class="btn btn-outline-light" v-if="choixNbr>3" @click="choixDone(choixDoes[3].name, choixDoes[3].nb,choixText[3])">{{ choixName[3] }}</button>

        </div>

        <boutique-game :player="player"></boutique-game>
    </div>

</template>

<script>

import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
export default {
    data() {
        return {
            text: "",
            textIndex: 0,
            showText: false,
            showNextButton: false,
            gameTexts: [],
            player: {
                pv: 0,
                pm: 0,
                atk: 0,
                def: 0,
                pvMax: 0,
                pmMax: 0,
                class: "",
                name: "",
                level: 1,
                xp: 0,
                ecu: 0,
                items: {
                    potionPV: 0,
                    potionPM: 0
                },
                armure:""
            },
            choixName:[],
            choixDoes:[{name : "", nb : 1}, {name : "", nb : 1}, {name : "", nb : 1}, {name : "", nb : 1}],
            choixText:[],
            choixNbr:0,
            ennemies:[{
                name:'brigant',
                pv:2,
                atk:2
            },{
                name:'goblin',
                pv:1.5,
                atk:4,
            },{
                name:'Ombre1',
                pv:3,
                atk:6,
            },{
                name:'Chef',
                pv:10,
                atk:6,
            },{
                name:'Ombre2',
                pv:13,
                atk:8,
            },],
            degatAtk:0,
            ennemieCurrent:""
        };
    },
    methods: {
        async start() {
            const startButton = document.getElementById('startingButton');
            startButton.style.display = 'none';
            this.textIndex=0;
            this.showText = true;
            this.text = this.gameTexts[this.textIndex];
            this.showNextButton = true;
            this.player={
                pv:0,
                pm:0,
                atk:0,
                def:0,
                pvMax:0,
                pmMax:0,
                class:"",
                name:"",
                level:1,
                xp:0,
                ecu:0,
                items: {
                    potionPV: 0,
                    potionPM: 0
                },
                armure:"",
                nbXP:1
            }
            this.gameTexts=[
                "Bienvenue, choisissez la difficultée",
                "Vous allez entrer dans un nouveau monde",
                "choisissez votre classe",
                "Bien. Maintenant entrez votre nom",
                "Vous entrez dans le monde",
                "Vous êtes dans une forêt, perdu.",
                "Vous criez mais personne vous entend",
                "Vers quel direction voulez-vous aller ?",
                "Vous sortez de la forêt",
                "Vous trouvez un chemin vers un village mais un homme vous arrête",
                '"Alte là ! Donnez moi votre bourse."',
                '"Quoi? Vous avez rien. Alors mourez."',
                "Voulez-vous fuir ?",
                "Vous voyez une auberge, voulez vous y entrer pour vous reposer ?",
                "Non loin de l'Auberge vous appercevez une boutique",
                "Vous entrez",
                "Le propriétaire vous parle :",
                "Bienvenue ! Vous n'êtes pas du coin je présume ? Je m'appel Henri",
                "Henri : J'ai la seule boutique de village. C'est remplie de forêt tout autour alors on voit peu de visiteur.",
                "Henri : J'ai quelques armes, potions et outils si tu as quelques écus, il te suffira de cliquer sur 'Boutique' qui va s'afficher sur ton écran",
                "Henri : Tu m'as l'air bien fort, Puis-je te demander un service ?",
                "Henri : J'ai besoin de quelques ingrédients de la forêt pour faire quelques nouvelles potions. Tu seras payé biensûre.",
                "Vous acceptez",
                "Henri : Merci beaucoup !",
                "Vous vous hâtez vers le forêt. Vous tombez sur une étrange créature",
                "Elle vous attaque",
                "Vous trouvez les plantes dont vous a parlé Henri",
                "Vous tendez les plantes à Henri, il vous remmercie et vous donnes 10 ecus et une arme",
                "Grâce à cette arme, tu vaincras tout tes ennemies. Elle t'étais déjà destiné avant ta naissance.",
                "Bien assez parlé. Si tu as besoin de quoi que ce soit hésite pas, mais aujourd'hui il est l'heure de fermer boutique",
                "Vous partez et vous vous dirigez vers l'Auberge pour la nuit",
                "Vous faites un cauchemar dans la forêt",
                "Cela parait si réelle, est-ce une vision",
                "Vous sentez une présence obscure, mais que ce passe t'il dans cette forêt ?",
                "La présence vous attaque !",
                "Vous vous réveillez",
                "Vous entendez des cries, vous descendez de votre chambre d'auberge",
                "La gérante de l'auberge vous parle :",
                '"Mon dieu, Le village est attaqué ! Aidez nous !"',
                "Vous prenez votre épé et vous vous hâtez dehors",
                "Les goblins de la forêt ont commencé a piller le village",
                "Vous vous interposez, 3 goblins vous attaque",
                "Vous entendez la voie d'henri au loin", //50
                '"Vite ! attrapez ! "',
                "Henri vous a envoyé une potion de soin soin total.",
                "Vous vous empressez de la boire",
                "Un goblin géant vous attaque",
                "C'est leurs chefs !", //55
                "Bravo",
                "Vous avez sauvé le village",
                "Henri vient vous voir",
                "Henri : Je dois vous raconter quelque chose",
                "Henri : Suivez moi Jusqu'à ma boutique", //60
                "Vous arrivez à la boutique",
                "Henri :Jadis, la forêt était calme et sans danger.",
                "Henri : Elle nous protegeait des danger en formant une barrière",
                "Henri : Mais un jour, une ombre c'est abattu sur celle-ci,",
                "Henri : Les arbres ont alors commencer à mourrir un par un par manque de lumière", //65
                "Henri : Les goblins qui campent de l'autre coté de la forêt peuvent maintenant la traverser !",
                "Henri : Ce n'est pas la première fois qu'ils tentent de piller de village mais cette fois ils ont envoyé un de leurs chefs",
                "Henri : La légende raconte qu'un jour un(e) héro viendra nous chasser de cette ombre.",
                "Henri : Pouvez vous aider le village ?",
                "Henri : Commencez à aller explorer la forêt pour en savoir plus",//70
                "Vous allez dans la forêt",//72?
                "Vous voyez une ombre se propager vers vous",
                "Elle est semblable à celle de la nuit dernière",
                "Elle se dresse contre vous",
                "L'Ombre : Que fais tu ici intrue ? Tu es dans mon domaine.", //76??
                "L'Ombre : Cela fait des années que cette forêt m'empêche d'étendre mon pouvoir. Et je vais la détruire !",
                "L'Ombre vous attaque", //78??
                "Elle vous met à terre et s'enfuie",
                "L'Ombre : Sale humain ! Je viendrai te tuer.",
                "Vous retounez voir Henri pour lui faire part de votre affrontement",
                "Henri : C'était l'ombre ! Elle se mefie de vous...",
                "Henri : dans l'immédiat il faudrait se défaire de ces goblins",
                "Henri : Voici une carte avec la position du camp goblin",
                "Henri : Je vous laisse vous en occuper, bonne chance",


            ];
                this.text="Bienvenue, choisissez la difficultée";
            },

        async next() {
            this.textIndex++;
            if (this.textIndex < this.gameTexts.length) {
                this.text = this.gameTexts[this.textIndex];
            } else {
                // Vous avez atteint la fin du jeu, ajustez en conséquence
                this.showNextButton = false;
            }
        },
        lancerDe() {
            // Générer un nombre aléatoire entre 1 et 6

                const resultat = Math.floor(Math.random() * 6) + 1;
                return resultat;


            },


        async choixClasse(){
            if(this.player.class=="Guerrier"){
                this.player.pvMax=12*this.nbXP;
                this.player.pmMax=6*this.nbXP;
                this.player.atk=8*this.nbXP;
                this.player.def=12*this.nbXP;
            }
            if(this.player.class=="Mage"){
                this.player.pvMax=8*this.nbXP;
                this.player.pmMax=10*this.nbXP;
                this.player.atk=12*this.nbXP;
                this.player.def=8*this.nbXP;
            }
            if(this.player.class=="Voleur"){
                this.player.pvMax=9.5*this.nbXP;
                this.player.pmMax=10.5*this.nbXP;
                this.player.atk=8*this.nbXP;
                this.player.def=10*this.nbXP;
            }
            if(this.player.class!=""){
                this.heal()
                this.next();
            }
            else{
                alert('choisissez votre classe')
            }
        },

        async choixPrenom(){
            if(this.player.name!=""){

                this.next();
            }
            else{
                alert('Entrez votre nom')
            }
        },

        //Augmenter ou baisse le nombre d'écu de nb
        async ecuPlus(nb){
            this.player.ecu=this.player.ecu+nb;
        },

        //Augmente l'attaque ou baisse de Nb
        async attaquePlus(nb){
            this.player.atk=this.player.atk+nb;
        },

        //Remonte les pv et pm au max
        async heal(){
            this.player.pv=this.player.pvMax;
            this.player.pm=this.player.pmMax;
        },
        //Juste les PV
        async healPV(){
            this.player.pv=this.player.pvMax;
        },
        //Juste les PM
        async healPM(){
            this.player.pm=this.player.pmMax;
        },

        //Retire des pv
        async degat(nb){
            this.player.pv=this.player.pv-nb
            if(this.player.pv<=0){
                await Swal.fire({
                    title:'Game Over',
                    text:'Vous êtes mort',
                    icon:'error'
                })
                this.showNextButton = false;
            }
        },
        //Donne de l'experience et augmente le niveau si besoin
        async levelUp(nb){
            let ancienlvl=this.player.level
            this.player.xp=this.player.xp+(nb*this.nbXP);
            let nbPv, nbAtk, nbPm, nbDef, xpSup = 0;
            while(this.player.xp >10+this.player.level**1.5){
                xpSup = this.player.xp-(10+this.player.level**1.5);
                this.player.level++;
                this.player.xp=xpSup;
                if(this.player.class=='Guerrier'){
                     nbPv=1.33
                     nbAtk=1
                     nbPm=1.33
                     nbDef=1.33
                }
                if(this.player.class=='Mage'){
                     nbPv=1
                     nbAtk=1.5
                     nbPm=1.5
                     nbDef=1
                }
                if(this.player.class=='Voleur'){
                     nbPv=1.5
                     nbAtk=1
                     nbPm=1.5
                     nbDef=1
                }

                this.player.pvMax=this.player.pvMax+nbPv;
                this.player.pv=this.player.pv+nbPv;
                this.player.pmMax=this.player.pmMax+nbPm;
                this.player.pm=this.player.pm+nbPm;
                this.player.atk=this.player.atk+nbAtk;
                this.player.def=this.player.def+nbDef;

            }
            if(ancienlvl!=this.player.level)
            Swal.fire({
                    icon:'success',
                    title:'Niveau suppérieur',
                    text:'Vous êtes passé niveau '+this.player.level,
                })
        },

        //lance un combat. Mettre le nom de l'adversaire en prop ex 'soldat'
        async combat(ennemieName) {
            let pvMaxEnnemie = 0;
            let degatEnnemie;
            let degatAllie;
            let ennemiCible;

            // Recherche de l'ennemi cible
            this.ennemies.forEach(ennemie => {
                if (ennemie.name == ennemieName)
                    ennemiCible = {...ennemie};
            });

            // Vérification si l'ennemi cible a été trouvé
            if (!ennemiCible) {
                console.log("L'ennemi spécifié n'a pas été trouvé.");
                return;
            }

            await this.infoCombat('Combat contre ' + ennemiCible.name);

            // Modification de l'ennemi cible
            ennemiCible.pv = Math.round(ennemiCible.pv * (this.lancerDe() * 2.5));
            ennemiCible.atk = Math.round(ennemiCible.atk * (this.lancerDe()));
            this.ennemieCurrent=ennemiCible.name;

            await this.infoCombat('PV : ' + ennemiCible.pv + ' Attaque : ' + ennemiCible.atk);

            pvMaxEnnemie = ennemiCible.pv;
            while (ennemiCible.pv> 0 && this.player.pv > 0) {
                if (ennemiCible.pv < pvMaxEnnemie / 3) {
                    await this.infoCombat("L'ennemie est faible, lâchez rien !")
                }
                if (this.player.pv < this.player.pvMax / 3) {
                    await this.infoCombat("Attention vous êtes en mauvaise posture.")
                }
                await this.combatCoupSpecial();
                degatAllie=this.degatAtk
                ennemiCible.pv = ennemiCible.pv - degatAllie;
                await this.infoCombat('Vous infligez ' + Math.round(degatAllie) + " dommage à l'ennemie. Pv restant : " + Math.round(ennemiCible.pv) + '/' + pvMaxEnnemie)
                if (ennemiCible.pv <= 0) {
                    break;
                }
                degatEnnemie = ennemiCible.atk - (this.lancerDe() + (0.3 * this.player.def))
                if (degatEnnemie <= 0)
                    degatEnnemie = 1;
                await this.infoCombat("L'ennemie vous inflige " + Math.round(degatEnnemie) + "PV de dommage. PV restant : " + Math.round(this.player.pv - degatEnnemie) + '/' + Math.round(this.player.pvMax))
                this.degat(degatEnnemie)
            }
            if(this.player.pv>0){
                this.levelUp(((ennemiCible.atk+pvMaxEnnemie)/2) * (this.lancerDe()/2) * (this.player.level * 0.2 + 1)/1.5);
                this.player.ecu = this.player.ecu + (((ennemiCible.atk+pvMaxEnnemie)/2)-this.player.level);
                this.degatAtk=0;
                this.ennemieCurrent="";
            }
        },

        //Entrer le nombre de choix et un tableau comportant les nom des choix ["choix 1", "choix2", ...]. 4 choix max
        //Entrer la résolution des choix sous forme : [{name : **** ; nb : ** },{},{},...] Par défaut pas mettre nb. mettre name : "" pour passer
        //Choix possible de resolv : heal : remonte au max les pv et pe. degat nb: baisse les pv
        //Entrer un tableau de tableau de text comportant le script qui va s'ajouter à celui par défaut : [["text1","text2"],["text1Choix2","text2Choix2"],[...],...]
        // !! MEME NOMBRE DE TAB DANS TEXT
        async choixNb(nbChoix, tab, resolv, text){
            this.choixDoes=[{name : "", nb : 1}, {name : "", nb : 1}, {name : "", nb : 1}, {name : "", nb : 1}]
            this.choixName=[]
            this.choixText=[]
            for(let i=0; i<nbChoix; i++ ){
                this.choixName[i]=tab[i];
                this.choixDoes[i].name=resolv[i].name;
                if(resolv[i].nb !=undefined){
                    this.choixDoes[i].nb = resolv[i].nb;
                }

            }
            this.choixText=text;
            this.choixNbr=nbChoix;
        },

        async choixDone(resolv, nb, text){
            if(resolv=='degat'){
                this.degat(nb);
            }
            if(resolv=='heal'){
                this.heal()
            }
            if(resolv=='levelUp'){
                this.levelUp(nb)
            }
            if(resolv=='combat'){
                this.combat(nb)
            }
            this.gameTexts.splice(this.textIndex+1,0,...text);
            this.choixNbr=0;
            this.next();

        },
        async infoCombat(text){
            await Swal.fire({
                title: "Combat",
                text: text,
                icon: "info"
            });
        },

        async combatCoupSpecial() {
            if (this.player.class == 'Guerrier') {
                const result = await Swal.fire({
                    title: "Que voulez faire ?",
                    text: "Attaque : 1PM, Attaque spécial : 4PM",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Tranche",
                    cancelButtonText: "Coup fatal"
                });

                if (result.isConfirmed && this.player.pm >= 1) {
                    this.degatAtk = this.player.atk - this.lancerDe();
                    this.player.pm = this.player.pm - 1;
                } else {
                    if (this.player.pm >= 4) {
                        this.degatAtk = this.player.atk + this.lancerDe();
                        this.player.pm = this.player.pm - 4;
                    } else if(this.player.pm <= 0){
                        Swal.fire({
                            title: 'Vous êtes trop fatigué',
                            text: 'Votre attaque est égale à votre niveau',
                            icon: 'warning',
                        });
                        this.degatAtk = this.player.level;
                    }
                    else{
                    this.degatAtk = this.player.atk - this.lancerDe();
                    this.player.pm = this.player.pm - 1;
                    }
                }
            } else if (this.player.class == 'Mage') {
                const result = await Swal.fire({
                    title: "Que voulez faire ?",
                    text: "Attaque : 1PM, Attaque spécial : 6PM",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Attaque magique",
                    cancelButtonText: "Rayon noir"
                });

                if (result.isConfirmed && this.player.pm >= 1) {
                    this.degatAtk = this.player.atk - (this.lancerDe() * 2);
                    if (this.degatAtk <= 1) {
                        this.degatAtk = this.player.level;
                    }
                    this.player.pm = this.player.pm - 1;
                } else {
                    if (this.player.pm >= 6) {
                        this.degatAtk = this.player.atk + (this.lancerDe() * 1.5);
                        this.player.pm = this.player.pm - 6;
                    } else if(this.player.pm <= 0){
                        Swal.fire({
                            title: 'Vous êtes trop fatigué',
                            text: 'Votre attaque est égale à votre niveau',
                            icon: 'warning',
                        });
                        this.degatAtk = this.player.level;
                    }
                    else{
                        this.degatAtk = this.player.atk - (this.lancerDe() * 2);
                    if (this.degatAtk <= 1) {
                        this.degatAtk = this.player.level;
                    }
                    this.player.pm = this.player.pm - 1;
                    }
                }

            }
            if (this.player.class == 'Voleur') {
                const result = await Swal.fire({
                    title: "Que voulez faire ?",
                    text: "Attaque : 1PM, Attaque spécial : 16PM",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Coup de poignard",
                    cancelButtonText: "Assassinat"
                });

                if (result.isConfirmed && this.player.pm >= 1) {
                    this.degatAtk = Math.round((this.player.atk /(this.lancerDe()/2)));
                    this.player.pm = this.player.pm - 1;
                } else {
                    if (this.player.pm >= 16) {
                        this.degatAtk = Math.round((this.player.atk * this.lancerDe()));
                        this.player.pm = this.player.pm - 16;
                    } else if(this.player.pm <= 0){
                        Swal.fire({
                            title: 'Vous êtes trop fatigué',
                            text: 'Votre attaque est égale à votre niveau',
                            icon: 'warning',
                        });
                        this.degatAtk = this.player.level;
                    }
                    else{
                    this.degatAtk = Math.round((this.player.atk /(this.lancerDe()/1.5)));
                    this.player.pm = this.player.pm - 1;
                    }
                }
            }

        },

            async boutique(){
                let myModal = new bootstrap.Modal('#boutique_game');
                myModal.show();
            },

            async combatGoblin(){
                await this.combat('goblin');
                await this.combat('goblin');
                await this.combat('goblin');
            }

        }


    }

</script>
<style>
    #pm::-webkit-progress-value {
      background-color: #3498db; }
    #pm::-moz-progress-bar {
      background-color: #3498db;
      }
    #pv::-webkit-progress-value {
      background-color: #2aa749; }
    #pv::-moz-progress-bar {
      background-color: #2aa749;
    };
    img {
    max-width: 100%;
    height: auto;
}
</style>
