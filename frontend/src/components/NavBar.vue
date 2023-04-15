<template>
    <v-card  class="mx-auto" color="grey-lighten-3" style="border-radius: 0;">
      <v-layout>
        <v-app-bar
          color="teal-darken-4"
          image="https://picsum.photos/1920/1080?random"
        >
          <template v-slot:image>
            <v-img
              gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
            ></v-img>
          </template>
  
          <template v-slot:prepend>
           
          </template>
          <v-btn @click="home"
          >
          <v-app-bar-title color="white" >Ecommerce </v-app-bar-title></v-btn>
  
          <v-spacer></v-spacer>
         
          <div :style="{display:loginDisplay}">
          <v-btn @click="login">
            Login
          </v-btn>
  
          <v-btn  @click="signup">
            Signup
          </v-btn>
          </div>

          <div :style="{display:logoutDisplay}">

       <v-btn @click="gotoCart">     <v-icon size="24" >mdi-cart</v-icon> CART</v-btn>
       <v-btn @click="purchasedHistory">Purchased History</v-btn>
          <v-btn @click="logout">
            Logout
          </v-btn>
  
          
          </div>
  
        </v-app-bar>
  
        <v-main>
         
        </v-main>
      </v-layout>
    </v-card>
  </template>


<script>
import  { useRouter } from 'vue-router'
import { authenticate } from '@/services/Authenticatelogn'

import { removeToken } from '@/services/TokenServices'


export default{
    name:"NavBar",
    data(){
        return{
           loginDisplay:'block',
           logoutDisplay:'none',
           user:null
        }
    },
    created() {
    this.user=JSON.parse(authenticate())
    
    
    if(this.user!= null){
        this.loginDisplay='none'
        this.logoutDisplay='block'
      
    }
    
    
  },
    setup(){
          const router = useRouter()
          const user=JSON.parse(authenticate())
         function gotoCart(){
          router.push('/cartinfo')
         }
         function purchasedHistory(){
          router.push('/purchasedHistory')
         }
           function home(){
            if(user!=null){
              if(user.role=='admin'){
                router.push('/adminView')
              }
              if(user.role=='user'){
                router.push('/')
              }
            }
            else{
            router.push('/')
            }
           }

          function login(){
            router.push('/login')
          }

          function signup(){
            router.push('/signup')
          }

          function logout(){
            removeToken()
            router.push('/')
            location.reload('/')
        }
          return{
           
            login,
            signup,
            logout,
            home,
            gotoCart,
            purchasedHistory
         
         
          }

        },
    
}
</script>
