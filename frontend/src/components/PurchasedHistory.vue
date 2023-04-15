<template>
    <center>
        &nbsp;&nbsp;
    <h1>My Purchased History</h1>
  <div style="width: 80%;">
    <v-table
    fixed-header
    height="300px"
    
  >

    <thead>
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left" v-if="role=='admin'">
          Email
        </th>
        <th class="text-left">
          Quantity
        </th>
        <th class="text-left">
          Amount
        </th>
        <th class="text-left">
          Address
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in purchasedHistory"
        :key="item.name"
      >
        <td>{{ item.name }}</td>
        <td v-if="role=='admin'">{{ item.email }}</td>
        <td>{{ item.quantity_purchased }}</td>
        <td>{{ item.price_paid }}</td>
        <td>{{ item.address }}</td>
      </tr>
    </tbody>
  </v-table>
</div>
</center>
</template>

<script>

import { authenticate } from '@/services/Authenticatelogn'
import axios from 'axios';
import { useRouter } from 'vue-router'


export default{
    data(){
      
        return{
          
            purchasedHistory:['jjjj'],
            user:null,
            email:'',
            role:''
            
        }
    },
  
    mounted(){
        this.user=JSON.parse(authenticate())
        
        const router = useRouter()
        if(this.user){

       this.purchased(this.user.email,this.user.role); 
        this.role = this.user.role
       
        }else{
            router.push('/')
        }
      },




    methods:{
   
       purchased(email,role){
            console.log(email)
            const data ={
                email:email,
                role:role
            }
            axios.post('http://localhost:5000/product/saleinfo',data)
  .then(response => {

    this.purchasedHistory=response.data
    
  })
  .catch(error => {
    console.error(error);
  });
        },
    }
}
</script>

