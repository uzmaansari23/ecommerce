<template>
      <center>
    &nbsp;
    <div><h1>Welcome Admin</h1></div>
    &nbsp;&nbsp;&nbsp;<div></div>
<router-link to="/addProduct" style="text-decoration:none">   <v-btn  color="secondary"> Add Product</v-btn></router-link>
&nbsp;&nbsp;

   <router-link to="/manageProduct" style="text-decoration:none"><v-btn   color="error">Manage Product</v-btn></router-link>
   &nbsp;&nbsp;

   <router-link to="/" style="text-decoration:none"><v-btn   color="success">Shopping</v-btn></router-link>
   <div></div>
   &nbsp;&nbsp;&nbsp;&nbsp;
    <router-view></router-view>
    </center> 
</template>
<script>
import { authenticate } from '@/services/Authenticatelogn'
    import { useRouter } from 'vue-router';

export default{
    
        name:'AdminView',
        
        created() {
    this.user=JSON.parse(authenticate())
    const router = useRouter()
    
    if(this.user=== null){
      router.push('/')
    }
    else{
      if(this.user.role=='admin'){
      router.push('/adminView')
      }
      else{
        router.push('/')
      }
    }
    
  },
  
}

</script>
