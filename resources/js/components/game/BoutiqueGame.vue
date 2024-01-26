<template>
    <div id="boutique_game" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <h1>Boutique</h1>
                    <a>{{ player.name }} Ecu : {{ player.ecu }}</a>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prix</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Potion de PV</td>
                                <td>10 écus</td>
                                <td><button @click="addPotionPV">Acheter</button></td>
                            </tr>
                            <tr>
                                <td>Potion de PM</td>
                                <td>7 écus</td>
                                <td><button @click="addPotionPM">Acheter</button></td>
                            </tr>
                            <tr v-for="row in armure" :key="row.id">
                                <td>{{ row.desc }}</td>
                                <td>{{ row.price }} écus</td>
                                <td><button @click="addArmure(row.type, row.nb, row.price, row.for, row.desc)">Acheter</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2';
    export default{
        props:{
            player:{}
        },
        data(){
            return{
                buff:{
                    type:"",
                    nb:0,
                    price:0,
                },
                //type en maniscule
                armure:[{type:'def', nb:6, price:25, desc:'Armure de guerrier débutant +6def', for:'Guerrier'},
                        {type:'atk', nb:4, price:25, desc:'Tunique de mage débutant +4atk', for:'Mage'},
                        {type:'pv', nb:6, price:25, desc:'Tenue de voleur débutant +4pv', for:'Voleur'},
                        {type:'def', nb:25, price:75, desc:'Armure de guerrier confirmé +25def', for:'Guerrier'},
                        {type:'atk', nb:20, price:75, desc:'Tunique de mage confirmé +20atk', for:'Mage'},
                        {type:'pv', nb:22, price:75, desc:'Tenue de voleur confirmé +22pv', for:'Voleur'},
                    ]

            }
        },

        methods:{
            addPotionPM(){
                if(this.player.ecu>=7){
                    this.player.items.potionPM++;
                    this.player.ecu=this.player.ecu-7

                }
                else{
                    Swal.fire({
                        icon:'error',
                        text:"Vous n'avez pas assez d'argent",
                        title:"Désolé"

                    })
                }

            },
            addPotionPV(){
                if(this.player.ecu>=10){
                    this.player.items.potionPV++;
                    this.player.ecu=this.player.ecu-10

                }
                else{
                    Swal.fire({
                        icon:'error',
                        text:"Vous n'avez pas assez d'argent",
                        title:"Désolé"

                    })
                }
            },
            addArmure(type, nb, price, pClass, desc){
                if(this.player.ecu>=price){
                    if(this.player.class==pClass){
                        if(this.player.armure!=""){
                            Swal.fire({
                                title: "Vous avez déjà une armure",
                                text: "Vous ne récupèrerez que la moitié du prix auquel vous l'avez acheté",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Je veux changer d'amure",
                                cancelButtonText: "Je veux garder l'ancienne"
                                }).then((result) => {

                                if (result.isConfirmed) {
                                    if(this.buff.type=='def'){
                                        this.player.def=this.player.def-this.buff.nb;
                                    }
                                    if(this.buff.type=='atk'){
                                        this.player.atk=this.player.atk-this.buff.nb;
                                    }
                                    if(this.buff.type=='pv'){
                                        this.player.pvMax=this.player.pvMax-this.buff.nb;
                                        this.player.pv=this.player.pv-this.buff.nb;
                                    }
                                    this.buff.nb=nb;
                                    this.player.ecu=this.player.ecu+this.buff.price
                                    Swal.fire({
                                    title: "Armure changé",
                                    text: "Vous avez récupéré "+this.buff.price+"écus lors de votre achat",
                                    icon: "success"
                                    });
                                }
                                else{
                                    this.player.ecu=this.player.ecu+price
                                    if(type=='def'){
                                        this.player.def=this.player.def-nb;
                                    }
                                    if(type=='atk'){
                                        this.player.atk=this.player.atk-nb
                                    }
                                    if(type=='pv'){
                                        this.player.pvMax=this.player.pvMax-nb;
                                        this.player.pv=this.player.pv-nb;
                                    }
                                }
                                });

                        }
                        if(type=='def'){
                            this.player.def=this.player.def+nb;
                        }
                        if(type=='atk'){
                            this.player.atk=this.player.atk+nb
                        }
                        if(type=='pv'){
                            this.player.pvMax=this.player.pvMax+nb;
                            this.player.pv=this.player.pv+nb;
                        }
                        this.player.ecu=this.player.ecu-price
                        this.armurePort=true;
                        this.buff.type=type;
                        if(this.player.armure=="")
                            this.buff.nb=nb;
                        this.buff.price=(price/2);
                        this.player.armure=desc;
                    }
                    else{
                        Swal.fire({
                        icon:'error',
                        text:"Vous n'avez pas la bonne classe",
                        title:"Désolé"
                        });
                    }

                }
                else{
                    Swal.fire({
                        icon:'error',
                        text:"Vous n'avez pas assez d'argent",
                        title:"Désolé"

                    });
                }
            }

        }
    }

</script>
<style>
#boutique_game{
    color:black
}
</style>
