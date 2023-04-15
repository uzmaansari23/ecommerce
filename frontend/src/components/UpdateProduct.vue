<template>
    <v-row>
        <v-col>
            &nbsp;
           
    <v-card
    class="mx-auto"
    max-width="344"
    variant="outlined"
    elevation="16"
  >
  <v-sheet width="300" class="mx-auto">
  <center> <h1>Update Product</h1></center> 
    <v-form fast-fail @submit.prevent="submitForm">
      <v-text-field
        v-model="product.name"
        label="Product name"
        :rules="productNameRules"
      ></v-text-field>

      <v-textarea

        v-model="product.description"
        label="Product Description"
        :rules="productDescriptionRules"
        rows="5"
         max-height="200"
      ></v-textarea>
      <v-text-field
      type="number"
        v-model="product.quantity"
        label="Product Qunatity"
        :rules="productNameRules"
      ></v-text-field>
      <v-text-field
      type="number"
        v-model="product.price"
        label="Product Price"
        :rules="productPriceRules"
      ></v-text-field>
      

      <v-btn color="blue-grey" type="submit" block class="mt-2" >Submit</v-btn>
      &nbsp;    </v-form>
  </v-sheet>
  </v-card>
        </v-col>
        <v-col>
          &nbsp;       
    <v-card
    class="mx-auto"
    max-width="600"
    variant="outlined"
    elevation="16"
  > <v-sheet max-width="550" class="mx-auto">
            <v-form>
              <center> <h1>Upload Images</h1></center> 
            <v-file-input
      id="images"
    v-model="files"
    accept="image/*"
    label="Choose images"
    multiple
    @change="handleFileUpload"
  ></v-file-input>
<div v-for="product in products" :key="product.id">
 
  <v-row>
   
  <div v-for="(image, index) in product.images" :key="index">
   
    <v-col cols="6">
    <div>
  <img  :src="image" :alt="'Image ' + (index + 1)" width="200">
</div>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<v-row style="width:200%">
<center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<v-btn color="error" icon @click="deleteImage(product.images_id[index],index)">
    <v-icon>mdi-delete</v-icon>
   
  </v-btn>
</center>
</v-row>
</v-col>

</div>

</v-row>
</div>
            </v-form>
            &nbsp;
          </v-sheet>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
     import axios from 'axios';
     import { authenticate } from '@/services/Authenticatelogn'
import { useRouter ,useRoute} from 'vue-router'
export default{
    data() {
      return {
        product: {
          productId:'',
        name: "",
        description: "",
        price: "",
        quantity:'',
      },
        products: [],
        images: [],
        images2:[],
        user:null,
        files:''
      }
    },
    mounted() {
        this.user = JSON.parse(authenticate())
        const route = useRoute()
        const id = route.params.id
        this.loadProducts(id);
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
console.log(this,products[0])
this.product.productId=this.products[0].id
this.product.name = this.products[0].name
this.product.description = this.products[0].description
this.product.quantity = this.products[0].quantity
this.product.price = this.products[0].price
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

      deleteImage(id,index){
        console.log(id)
        const data={
                id:id
            }
            axios.post('http://localhost:5000/product/deleteImage',data)
            .then(response=>{
                console.log(response)
                this.products[0].images = this.products[0].images.filter((val,idx)=> idx!= index)
                this.products[0].images_id = this.products[0].images_id.filter((val,idx)=>idx!= index);
                
            })
            .catch(error=>{
                console.log(error)
            })
           
      },
      handleFileUpload(event) {
      const files = event.target.files;
      console.log(files)
      for (let i = 0; i < files.length; i++) {
        
        this.images.push(files[i]);
        console.log(this.images)
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          this.images2.push(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    async submitForm() {
      const formData = new FormData();
      for (let i = 0; i < this.images.length; i++) {
        formData.append("images[]", this.images[i]);
      }
      formData.append("product", JSON.stringify(this.product));
      const response = await fetch("http://localhost:5000/product/update-product", {
        method: "POST",
        body: formData,
      });
      
    },




    }
}
</script>
