<template>

  &nbsp;
    <v-card
    class="mx-auto"
    max-width="344"
    variant="outlined"
    elevation="16"
  >
  <v-sheet width="300" class="mx-auto">
  <center> <h1>Add New Product</h1></center> 
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
        :rules="productQuantityRules"
      ></v-text-field>
      <v-text-field
      type="number"
        v-model="product.price"
        label="Product Price"
        :rules="productPriceRules"
      ></v-text-field>
      <v-file-input
      id="images"
    v-model="files"
    accept="image/*"
    label="Choose images"
    multiple
    @change="handleFileUpload"
  ></v-file-input>

      <v-btn color="blue-grey" type="submit" block class="mt-2" >Submit</v-btn>
      &nbsp;    </v-form>
  </v-sheet>
  </v-card>

</template>


<!-- <template>



  <form @submit.prevent="submitForm">
    <div>
      <label for="name">Name</label>
      <input id="name" type="text" v-model="product.name" required>
    </div>
    <div>
      <label for="description">Description</label>
      <textarea id="description" v-model="product.description" required></textarea>
    </div>
    <div>
      <label for="price">Price</label>
      <input id="price" type="number" v-model="product.price" required>

    </div>
    <div>
      <label for="quantity">Qunatity</label>
      <input id="quantity" type="number" v-model="product.quantity" required>

    </div>
    <div>
      <label for="images">Images</label>
      <input id="images" type="file" multiple @change="handleFileUpload">
      <img v-for="(image, index) in images2" :key="index" :src="image" :alt="'Image ' + (index + 1)">
    </div>
    <button type="submit">Submit</button>
  </form>
</template> -->

<script>

import { authenticate } from '@/services/Authenticatelogn'
    import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      product: {
        name: "",
        description: "",
        price: "",
        quantity:'',
      },
      images: [],
      images2: [],
      files:''
    };
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
  created() {
    this.user=JSON.parse(authenticate())
    const router = useRouter()
    
    if(this.user=== null){
      router.push('/')
    }
    else{
      if(this.user.role=='admin'){
      router.push('/addProduct')
      }
      else{
        router.push('/')
      }
    }
    
  },
  methods: {
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
      const response = await fetch("http://localhost:5000/product/submit-product", {
        method: "POST",
        body: formData,
      });
      alert("product added")
      this.routeTo()

    },
  },
};
</script>
