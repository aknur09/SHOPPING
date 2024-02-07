const trending=document.querySelector('.TRENDING')

const categories=document.querySelector('.categories')

const heroBlock=document.querySelector('.hero-block')

// const cartCount=document.getElementById('cartCount')

const cart=document.querySelector('#cart')

const main=document.querySelector('main')

const _baseurl='https://fakestoreapi.com/products/'


async function getProducts (){
    const res= await fetch(_baseurl)
    const data= await res.json()
      console.log(data);
     showProducts(data.slice(0,5))
     showCategories(data)
     showOneCard(data)
}

function showProducts(arr) {
    trending.innerHTML=''
    for (const product of arr) {
      trending.innerHTML+=`
      <div onclick='getItemBuld (${product.id})' class="card d-flex" style="width: 18 rem ">
      <img src="${product.image} " alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.category}</p>
       <h6>${product.price}$</h6>
      </div>
    </div>
  
  
       ` 

     
  }    
}



function showCategories(arr){
  let newCategories=[]

  const categoriesFilter=arr.filter(el=>{
      // console.log(el);
      if(el.category && !newCategories.includes(el.category)){
          newCategories.push(el.category)
      }
  })

  console.log(newCategories);

  categories.innerHTML=''
  for (const name of newCategories) {
      categories.innerHTML+=`<li>${name}</li>`
  }
}


getProducts ()


async function getItemById(id){
  const res=await fetch(_baseurl+id)
  const data= await res.json()
  console.log(data);
  showOneCard(data)

}

function showOneCard(obj) {
    trending.innerHTML=''

    main.innerHTML=''

    heroBlock.innerHTML=''

    heroBlock.innerHTML+=`

    <div class="card d-flex" style="width: 50%; ">
    <img src="${obj.image} " alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${obj.title}</h5>
      <p class="card-text">${obj.descriction}</p>
      <h4>${obj.price}$</h4>
      <a href="#" onclick='addItemToCart(${obj.id})' class="btn btn-primary">Добавить в корзину</a>
    </div>
  </div>
     ` 
}



let arrCart=[]

async function addItemToCard(id) {
    const isItemInCart = arrCart.some(item => item.id === id);

    if (!isItemInCart) {
        const res = await fetch(_baseurl + id);
        const data = await res.json();
      
        console.log(data);

        let newData={...data, count:1}
        arrCart.push(data);
        const cartData = JSON.stringify(arrCart);
        localStorage.setItem('cart', cartData);
        cartCount.innerHTML = arrCart.length
        getItemFromCart()

    } else {
        // console.log('Бул продукт мурунтан эле кошулган');
        const res = await fetch(_baseurl + id);
        const data = await res.json();
        console.log(data);

        let newData={...data, count:1}
        const findItem=arrCart.findIndex(el=>el.id==newData.id)
        console.log(findItem);
        const before=arrCart.slice(0,findItem)
        const after=arrCart.slice(findItem+1)
        console.log(before, 'before');
        console.log(after,'after');
        let updItem={...newData, }
        arrCart=[...before, updItem, ...after]
    }
}

function getItemFromCart(){
    const data=JSON.parse(localStorage.getItem('cart'))
    console.log(data, 'localStorage');
    arrCart=data

}
if(arrCart!==null) {
  getItemFromCart()
  cartCount.innerHTML = arrCart.length;
}



cart.onclick=()=>{
  trending.innerHTML=''
  main.innerHTML=''
  heroBlock.innerHTML=''
  showCart(arrCart)

}

function showCart(arr){
  heroBlock.innerHTML=''

  for (const item of arr) {
    heroBlock.innerHTML+= `
    <div class='d-flex justify-content-between'>
  <img  src='${item.image}'style='max=width:30% ' />
  <div>
  <h2>${item.title}</h2>
  <h5>${item.category}</h5>
  </div>
  <h1>${item.price} </h1>
  <div>
  <button class='plus'>+</button>
  <span>${item.count}</span>
  <button class='minus'>-</button>
  </div>
  <button class='delete'>x</button>
    </div>`
  }
}
  
//   const totalBlock=document.createElement('h4')
//   heroBlock.appendChild(totalBlock)
//   const totalSumma=arr.reduce((total, el)=>el+price+total,0)
//   totalBlock.innerHTML=`Total price: ${totalSumma} $`
// }


const totalBlock=document.createElement('h4')
heroBlock.appendChild(totalBlock)
const totalSumma=arr.reduce((total, el)=>el.price*el.count+total, 0)
totalBlock.innerHTML=`Total price: ${totalSumma} $`

const plus=document.querySelectorAll('.plus')
const minus=document.querySelectorAll('.minus')
const deleteBtn=document.querySelectorAll('.delete')

plus.forEach((btn, i) =>{
  btn.addEventListener('click',()=>{
    arr[i].count++
    showCart(arr)
  })
})

minus.forEach((btn, i)=>{
  btn.addEventListener('click',()=>{
    if (arr[i].count > 0){
      arr[i].count--
      showCart(arr)
    }
  })
})

deleteBtn.forEach((btn, i)=>{
  btn.addEventListener('click',()=>{
    arr.splice(i)
    showCart(arr)
  })
})
