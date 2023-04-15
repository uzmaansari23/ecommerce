<template>
  <v-app >
    <v-main>
      <NavBar/>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script >
import { useRouter } from 'vue-router';
 
  import UploadImage from './components/UploadImage.vue';
  import ViewProduct from './components/ViewProduct.vue';
  import { authenticate } from '@/services/Authenticatelogn'

import NavBar from './components/NavBar.vue';

  export default{
    name: "App",
    created() {
      this.user=JSON.parse(authenticate())
      this.router = useRouter();
      console.log(this.user)
    
      if(this.user=== null){
    
    this.router.push('/')
  }
    },
    components: {
        UploadImage,
        ViewProduct,
        NavBar
     
    } ,
    data(){
      return{
        user:null,
      }
    }
  
}
  
</script>
