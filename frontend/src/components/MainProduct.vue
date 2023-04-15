<template>

  &nbsp;

    <v-row v-for="product in products" :key="product.id">
    <v-col md="4" >
      
      <v-carousel   
      style="margin-left: 50px;"
    cycle
    
    hide-delimiter-background
    show-arrows="hover">
      <v-carousel-item v-for="(item, i) in product.images" :key="i"  cover>
        
        <v-img :src="item" alt="Image Not Found" height="100%"></v-img>
      </v-carousel-item>
    </v-carousel>
</v-col>
<v-col md="6" style="margin-top: 150px;">
  <div style="margin-left: 50px;">
    <v-row>
      <v-col>
  <b><v-card-title>{{ product.name }}</v-card-title></b>
</v-col>
<v-col>
  Price: <br>{{ product.price }} Rupees
</v-col>
</v-row>

    <v-btn  style="margin-left:150px" color="blue" @click="addtoCart(product.id,this.user)">
  Add to Cart
</v-btn>



<v-card-text>
  Description:<br>
     {{ product.description }}
     
      
    </v-card-text>
</div>
</v-col>
</v-row>

  </template>
  
  <script>
     import axios from 'axios';
     import { authenticate } from '@/services/Authenticatelogn'
import { useRouter ,useRoute} from 'vue-router'
  export default {
    data() {
      return {
      
        products: [],
        images2:[],
        user:null
      }
    },
   
    mounted() {
        this.user = JSON.parse(authenticate())
        const route = useRoute()
        const id = route.params.id
        this.loadProducts(id);
    },
    setup(){
     const router = useRouter()
     function routeTo(){
      router.push('/')
     }
     return{
      routeTo
     }
  },
    methods: {
      async loadProducts(id) {
        try {
          const response = await fetch('http://localhost:5000/product/mainproduct/'+id);
          
          const products = await response.json();
    
          for (let i = 0; i < products.length; i++) {
   
          for(let j = 0;j<products[i].images.length; j++){
        
            const url = this.getImageUrl(products[i].images[j])
            
            this.images2.push(url)
            

          }
          
          products[i].images=this.images2
          this.images2=[]
}

this.products = products;

if(this.products.length==0){
  alert("No Product with such id")
  this.routeTo()
}
        } catch (err) {
          console.error(err);
          alert('Error while loading products');
        }
      },
      getImageUrl(image) {
        
        const base64 = window.btoa(
        new Uint8Array(image.data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
       
        return `data:${image.contentType};base64,${base64}`;
      },


      addtoCart(id,user){
        console.log(user)
        if(user==null){
          alert('Login to Proceed')
        }else{
        const url="http://localhost:5000/product/addToCart"
              const data={
              product_id:this.products[0].id,
              email:user.email,
              quantity:1,
              amount:this.products[0].price
              }
              axios.post(url, data)
  .then(response => {

   console.log(response)
   alert(response.data)
   
  })
  .catch(error => {
    console.error(error);
  });
      }
    }
    }
  }
  </script>
  