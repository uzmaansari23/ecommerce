import { createRouter, createWebHistory } from 'vue-router';
import ViewProduct from './components/ViewProduct'
import UploadImage from './components/UploadImage'
import MainProduct from './components/MainProduct'
import CartInfo from './components/CartInfo'
import LoginPage from './components/LoginPage'
import SignupPage from "./components/SignupPage"
import AdminView from './components/AdminView'
import ManageProduct from './components/ManageProduct'
import UpdateProduct from './components/UpdateProduct'
import PurchasedHistory from './components/PurchasedHistory'

const routes =[
    {path:"/"  ,component: ViewProduct },
    {path:"/addProduct", component:UploadImage},
    {path:'/mainProduct/:id', component:MainProduct},
    {path:'/cartinfo', component:CartInfo},
    {path:'/login', component:LoginPage},
    {path:"/signup",component:SignupPage},
    {path:'/adminView', component:AdminView},
    {path:'/manageProduct',component:ManageProduct},
    {path:'/updateProduct/:id', component:UpdateProduct},
    {path:'/purchasedHistory',component:PurchasedHistory}
]




const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;