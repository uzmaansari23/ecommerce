<template>
  <v-container fluid>
    <center>
      <div class="search-bar" style="width:500px; background-color: #8bcca9; ">
    <input type="text" style="color: white;" v-model="searchQuery" @input="search" placeholder="Search...">
  </div>
</center>
    Products
    <v-row>
      
      <v-col cols="12" md="3" v-for="product in filteredProducts" :key="product.id">
        <v-card
        class="m-4 pa-4"
    :loading="loading"
    height="500"
  max-width="400"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      cover
      height="250"
      :src="product.images[0]"
      
    ></v-img>

    <v-card-item>
      <v-card-title>{{ product.name }}</v-card-title>

  
    </v-card-item>

    <v-card-text>
   

      <div class="my-4 text-subtitle-1">
        Rs. {{product.price}}
      </div>

      <div>{{ product.description.split(" ").slice(0,15).join(" ") }}....</div>
    </v-card-text>
   <center> <v-btn color="orange" @click="viewProduct(product.id)">
  View Product
</v-btn>
</center>
 
  </v-card>
      </v-col>
    

   
    </v-row>

  
  </v-container>
</template>


<!-- <template>
  <div   >
    <v-row>
      <v-col  md="3">
    <div v-for="product in products" :key="product.id">
         <v-sheet   >
        <v-card
  class="ma-2 pa-2"
    :loading="loading"
    
  width="374"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      cover
      height="250"
      :src="product.images[0]"
    ></v-img>

    <v-card-item>
      <v-card-title>{{ product.name }}</v-card-title>

  
    </v-card-item>

    <v-card-text>
   

      <div class="my-4 text-subtitle-1">
        Rs. {{product.price}}
      </div>

      <div>{{ product.description }}</div>
    </v-card-text>

 
  </v-card>
      </v-sheet>
   
      
    </div>
  </v-col> 
    </v-row>

    
  </div>
</template> -->

<!-- <template>
  <div  >
  <div  class="flex-row ">
  <v-card
  class="ma-2 pa-2"
    :loading="loading"
    
    max-width="374"
  >
    <template v-slot:loader="{ isActive }">
      <v-progress-linear
        :active="isActive"
        color="deep-purple"
        height="4"
        indeterminate
      ></v-progress-linear>
    </template>

    <v-img
      cover
      height="250"
      :src="product.images[0]"
    ></v-img>

    <v-card-item>
      <v-card-title>{{ product.name }}</v-card-title>

  
    </v-card-item>

    <v-card-text>
   

      <div class="my-4 text-subtitle-1">
        Rs. {{product.price}}
      </div>

      <div>{{ product.description }}</div>
    </v-card-text>

 
  </v-card>
</div>
</div>
</template> -->

<!-- <template>
    <div>
      <h1>Products</h1>
      <ul>
        <li v-for="product in products" :key="product.id">
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <p>Price: ${{ product.price }}</p>
          <ul>
            <li v-for="(image, index) in product.images" :key="index">
              
              <img :src="image"  :style="{ width: '200px', height: '200px' }"  alt="Product image">
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template> -->
  
  <script>
  
import { useRouter } from 'vue-router'

  export default {
    name:"ViewProduct",
    data() {
      return {
        products: [],
        images2:[],
        searchQuery: "",
      
      };
    },
    mounted() {
      this.loadProducts();
    },
 
    setup(){
      const router = useRouter()
       function viewProduct(id){
        router.push("/mainProduct/"+id)
        }
  
      return{
        viewProduct,
    
      }
    },
    computed: {
    filteredProducts() {
      
      return this.products.filter( (product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
      );}},
    methods: {
      async loadProducts() {
        try {
          const response = await fetch('http://localhost:5000/product/products');
          console.log(response)
          const products = await response.json();
    
          for (let i = 0; i < products.length; i++) {
      
         console.log(products[i])
         
        if(products[i].images.length>0){
            const url = this.getImageUrl(products[i].images[0])
            
            this.images2.push(url)
            

      
          
          products[i].images=this.images2
          this.images2=[]
        }
        else{
          products[i].images ="https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"
        }
}

this.products = products;
        } catch (err) {
          console.error(err);
         
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
      search() {
      // Perform search action
    }
    }
  }
  </script>
  

  <style>
.search-bar {
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 10px;
}

.search-bar input[type="text"] {
  border: none;
  width: 100%;
  font-size: 16px;
  padding: 5px;
  outline: none;
}
</style>