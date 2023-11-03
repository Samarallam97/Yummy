let name=document.getElementById("name")
let phone=document.getElementById("phone")
let password=document.getElementById("password")
let mail=document.getElementById("mail")
let age=document.getElementById("age")
let repassword=document.getElementById("repassword")
let slideIcon=document.querySelector(".slide")
///////////////////////////////////////////////////// displaying & hiding pages
function displaying(pageIndex) {
  let pages=[".defaultContent",".searhPage",".categoriesContent",".areaPage",".ingredientsPage",
  ".contactPage",".detailsPage",".categoryMeals",".areaMeals",".ingredientMeals"];

  for(let i=0;i<pages.length;i++){
    $(pages[i]).css("display","none")
  }
$(pages[pageIndex]).css("display","block")
$(".sideBar").animate({"left":"-270px"},500)
slideIcon.classList.replace("bi-x-lg","bi-justify")
}


//////////////////////////////////////////  toggel icon
$(".slide").click(function (event) { 


  if($(".sideBar").css("left")=="0px"){
      $(".sideBar").animate({"left":"-270px"},500)
      event.target.classList.replace("bi-x-lg","bi-justify")
      $(".nav a").slideUp(500)
     

  }

  else{
      $(".sideBar").animate({"left":"0px"},500)
      event.target.classList.replace("bi-justify","bi-x-lg")
      $(".nav a").slideDown(800)

  }  

  
})


///////////////////////////////////////////  displaying details using meal id

async function mealFullDetails(mealId) {
  
  let fetchResponse=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
  let fetchResponseJson= await fetchResponse.json()
  let meal=fetchResponseJson.meals[0]
  mealFullDetailsDisplay(meal)
  $(".details .loader").fadeOut(2000,function () 
  { $(".details .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })
}

function mealFullDetailsDisplay(meal) {
  

  let ingredients=[]

  for(let i=0; i<20;i++){
    if(meal[`strMeasure${i}`] !=0 &&meal[`strMeasure${i}`] !=undefined){
      ingredients.push(meal[`strMeasure${i}`] +" " +meal[`strIngredient${i}`])
      
    }
  }

  $(".detailsPage .row").html(`

  <div class="col-12 col-md-4 ">
  <img class="mealImg rounded-3" src=${meal.strMealThumb} alt="meal">
   <h3 class="mealName mt-2">${meal.strMeal}</h3>
   </div>

<div class="col">
   <div>
      <h1>Instructions:</h1>
      <p class="mealDescription">${meal.strInstructions}</p>
      <h2 class="mealArea">Area : ${meal.strArea}</h2>
      <h2 class="meal">Category : ${meal.strCategory}</h2>
      <h2 >Recipes:</h2>

      <div class="mealRecipes">
       
      </div>
      <h2 class="mt-5">Tags:</h2>
      <button class="btn bg-danger-subtle my-3">${meal.strTags}</button>
      <br>
      <a href="${meal.strSource}" class="btn btn-danger">Source</a>
      <a href="${meal.strYoutube}" class="btn btn-success ms-2">Youtube</a>


      
   </div>
</div>`)

for(let i=0;i<ingredients.length;i++){
  $(".mealRecipes").append(`<span>${ingredients[i]}</span>`)
    }
}



///////////////////////////////////////////// fething random meals (default page)

async function fetchMeals(apiLink,place) {
  let fetchResponse=await fetch(apiLink)
  let fetchResponseJson= await fetchResponse.json()
  displayMeals(fetchResponseJson.meals,place)

  $(".default .loader").fadeOut(2000,function () 
  { $(".default .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })
}
// // ////////////////////////////////////////// displaying meals

function displayMeals(mealsArr,place) {
  let box=``
  for(let i=0;i<mealsArr.length;i++){

box+=`
 <div class="col cursor-pointer">
 <div id="meal${i}" data-id="${mealsArr[i].idMeal}" onclick="mealFullDetails(${mealsArr[i].idMeal}),displaying(6)">
    <div class="imgContainer position-relative rounded-3 overflow-hidden">
        <img id="mealImg" src=${mealsArr[i].strMealThumb} alt="">
        <div class="layer" id="mealName">
           <div>${mealsArr[i].strMeal}</div>
        </div> 
        </div>
    </div>
 </div>`
 
  }

  $(place).html(box)  

}

// /////////////////////////////////////// default page
fetchMeals("https://www.themealdb.com/api/json/v1/1/search.php?s=",".defaultContent .row")
// ////////////////////////////////////// search page
$("#nameSearch").on("input", function (event) { 
  let searchedName=event.target.value;
  $(".searchPageContent .row").html('')
  fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchedName}`
,".searchPageContent .row")

});

// /////////////////////////////////////////
$("#firstLetterSearch").on("input", function (event) { 
  $(".searchPageContent .row").html('')
  let searchedLetter=event.target.value;
  
  fetchMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchedLetter}`
,".searchPageContent .row")

});

// ////////////////////////// categories page

async function fetchCategories() {
  
  let fetchResponse=await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
  let fetchResponseJson= await fetchResponse.json()
  displayCategories(fetchResponseJson.categories)

  $(".category .loader").fadeOut(2000,function () 
  { $(".category .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })

}


function displayCategories(mealsArr) {

  let box=``
  for(let i=0;i<mealsArr.length;i++){
box+=`
 <div class="col" onclick="displaying(7),filterByCategory('${mealsArr[i].strCategory}','.categoryMeals .row')">
    <div class="imgContainer position-relative rounded-3 overflow-hidden">
        <img id="mealImg" src=${mealsArr[i].strCategoryThumb} alt="">
        <div class="layer justify-content-center flex-column text-center" id="mealName">
           <div>${mealsArr[i].strCategory}</div>
           <p>${mealsArr[i].strCategoryDescription.split(" ").slice(0,13).join(" ")}...</p>
        
        </div> 
    </div>
 </div>`
 
  }

  $(".categoriesContent .row").html(box)
  
}

fetchCategories()


// ///////////////////////////////////////////////////
async function filterByCategory(category,place) {
  let fetchResponse=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
  let fetchResponseJson= await fetchResponse.json()
  displayMeals(fetchResponseJson.meals.slice(0,20),place)
  $(".categoryFilter .loader").fadeOut(2000,function () 
  { $(".categoryFilter .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })

}



// // /////////////////////////////////////////////////////////  area page 

async function fetchArea(apiLink,place) {
  let fetchResponse=await fetch(apiLink)
  let fetchResponseJson= await fetchResponse.json()
  displayArea(fetchResponseJson.meals,place)

  $(".area .loader").fadeOut(2000,function () 
  { $(".area .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })
}


function displayArea(areasArr,place) {
  let box=``
  for (let i = 0; i <20; i++) {
    if(areasArr[i].strArea =="Unknown"){
       continue
    }
    box+=`
     <div class="col text-white display-1 text-center" onclick="displaying(8),filterByArea('${areasArr[i].strArea}','.areaMeals .row')">
       <i class="bi bi-house-check-fill"></i>
       <h1>${areasArr[i].strArea}</h1>
     </div>` 
  }
  $(place).html(box)
}

fetchArea("https://www.themealdb.com/api/json/v1/1/list.php?a=list",".areaPage .row")

// /////////////////////////////////////////////////
async function filterByArea(area,place) {
  let fetchResponse=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
  let fetchResponseJson= await fetchResponse.json()
  displayMeals(fetchResponseJson.meals,place)
  $(".areaFilter .loader").fadeOut(2000,function () 
  { $(".areaFilter .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })

}

// // //////////////////////////////////////////////////////// ingredients page
async function fetchIngredients(place){
  let fetchResponse=await fetch("https://www.themealdb.com/api/json/v1/1/list.php?i=list")
  let fetchResponseJson= await fetchResponse.json()
  displayIngredients(fetchResponseJson.meals)
  $(".ingredient .loader").fadeOut(2000,function () 
  { $(".ingredient .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })
}

function displayIngredients(ingredientsArr) {
  let box=``
  for(let i=0;i<20;i++){
  box+=`
  <div class="col text-white text-center" onclick="displaying(9),filterByingredient('${ingredientsArr[i].strIngredient}','.ingredientMeals .row')">
    <i class="bi bi-cart-dash-fill display-1"></i>
    <h3>${ingredientsArr[i].strIngredient}</h3>
    <p>${ingredientsArr[i].strDescription.split(" ").slice(0,12).join(" ")}...</p>
 </div>`
  }
  $(".ingredientsPage .row").html(box)
}

fetchIngredients()

// //////////////////////////////////////////////////////////
async function filterByingredient(ingredient,place) {
  let fetchResponse=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
  let fetchResponseJson= await fetchResponse.json()
  displayMeals(fetchResponseJson.meals,place)
  $(".ingredientFilter .loader").fadeOut(2000,function () 
  { $(".ingredientFilter .loading").fadeOut(2000,
    function () { $("body , html").css({"overflow":"auto"}) })  
  })
}



// // // // //////////////////////////////////////////////////////////// contact page 


$("#submit").click(function (event) { 
  Validation(name,nameRegex)
  Validation(phone,phoneRegex)
  Validation(password,passwordRegex)
  Validation(mail,mailRegex) 
  ageValidation()
  repasswordValidation()

  if(
    Validation(password,passwordRegex)
    && Validation(name,nameRegex) 
    &&  Validation(phone,phoneRegex)
    && Validation(mail,mailRegex) 
    &&ageValidation()
    &&repasswordValidation()){}
    else{
      event.preventDefault()
    }

})


let nameRegex=/^\S+$/
let phoneRegex=/^\d{11}$/
let passwordRegex=/^\w{8,}$/
let mailRegex=/^\w+@\w+.\w+$/i

 function Validation(input,regex) {
  let inputRegex=regex;
  if(inputRegex.test(input.value)==false){
    input.classList.add("is-invalid")
    return false
  }
  else{
    input.classList.remove("is-invalid")
    return true
  }
 }

name.oninput=function () { 
  Validation(name,nameRegex)
};

phone.oninput=function () { 
    Validation(phone,phoneRegex)
};
  
password.oninput=function () { 
      Validation(password,passwordRegex)
      
};

mail.oninput=function () { 
  Validation(mail,mailRegex)
};

///////////////////////////////////

function ageValidation() {
  if(age.value>=6 && age.value<=100){
    age.classList.remove("is-invalid")
    return true
  }
  else{
    age.classList.add("is-invalid")
    return false
  }
}
  
age.oninput=ageValidation

/////////////////////////////////

function repasswordValidation() {
  if(password.value==repassword.value){
    repassword.classList.remove("is-invalid")
    return true
  }
  else{
    repassword.classList.add("is-invalid")
    return false
  }
  
}

repassword.oninput=repasswordValidation





// ///////////////////////
// // mealFullDetails(52980)
// // filterByCategory("Seafood",".categoryMeals .row")
// // filterByArea("Canadian",".areaMeals .row")
// // filterByingredient("Beef",".ingredientMeals .row")
