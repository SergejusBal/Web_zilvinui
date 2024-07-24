const url_carPage= "http://78.63.244.37:8080";

var id;

document.addEventListener('DOMContentLoaded', async function() {

    const urlParams = new URLSearchParams(parent.location.search);
    id = urlParams.get('id');

    let response = await fetch(url_carPage + "/car?id="+id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        },               
    })

    if (response.status == 401){
        console.log("LogIn Status:","unauthorized")
    }
    else if (response.status == 500 ) {
        throw new Error('Failed to fetch ticket data');
    }  

    var car =  await response.json();   
    
    
    document.getElementById('title').textContent = car.title;
    document.getElementById('make').textContent = car.make;
    document.getElementById('model').textContent = car.model;
    document.getElementById('year').textContent = car.year;
    document.getElementById('mileage').textContent = car.millage;
    document.getElementById('price').textContent = car.price;
    document.getElementById('description').textContent = car.description;
    document.getElementById('photo').src = convertBase64ToImage(car.image); 

    if (getCookie("UserID") != car.userEntityEmail){
        document.getElementById("deleteBtn").style.display = "none";
        document.getElementById("editBtn").style.display = "none";
    }

});


document.getElementById("deleteBtn").addEventListener("click", async function(event) {

    const jwttoken =  getCookie("LogInCookies");

    let response = await fetch(url_carPage + "/car/delete/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  "Bearer " + jwttoken,
        },               
    })

    if(response.status == 200){
        parent.window.open("../index.html");      
    }
    else{

    }

});

document.getElementById("editBtn").addEventListener("click", async function(event) {

    parent.document.getElementById('contentFrame').src = "./html/userCarSubmitPage.html";

})





async function createdata(){

    const file = document.getElementById('photo').files[0];
    let convertedImage = await createBase64FromImage(file);   

    let data ={
        userEntityEmail: 1,
        title: document.getElementById('title').value,
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        year: document.getElementById('year').value,
        millage: document.getElementById('mileage').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        fuelType:"1",
        image: convertedImage,
    }

    return data;

}






document.getElementById("editBtn").addEventListener("click", async function(event) {

    let check= checkIfDataIsCorrect();
    if(check != "ok"){
        document.getElementById('errorMessage').innerText = check;
        return;
    }
    document.getElementById('errorMessage').innerText = "";

    data = await createdata();   
    console.log('Returned Byte Array:', data.image);

    let response = await fetch('http://78.63.244.37:8080/car/new', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({
        userEntityEmail: data.userEntityEmail,
        make: data.make,
        model: data.model,
        year: data.year + "-01-01",
        millage: data.millage,
        price: data.price,
        description: data.descriptione,
        fuelType: data.fuelType,       
        image: data.convertedImage,
        })       
    })

    if (response.status == 401){
        console.log("Status:","unauthorized")

    }
    else if (response.status == 500) {
        throw new Error('Failed to fetch ticket data');
    }  
    else if (response.status == 200){
        document.getElementById('errorMessage').innerText = "Car updated successfully";
    } 
    

});

document.getElementById("deleteBtn").addEventListener("click", async function(event) {
    
});



function checkIfDataIsCorrect(){

    let price = parseInt(document.getElementById('price').value);
    let mileage = document.getElementById('mileage').value;
    let year =  parseInt(document.getElementById('year').value);
    
    if (document.getElementById('title').value.length > 45)       
        return "Title is to long";
    
    else if (document.getElementById('make').value.length  > 45)
        return "Make is to long";
    
    else if (document.getElementById('model').value.length  > 45)
        return "Model is to long";
    

    else if (document.getElementById('description').value.length  > 500)
        return "Description is to long";
    
    else if(!document.getElementById('photo').files[0])
        return "File must be selected";
    
    else if (isNaN(price))
        return "Invalid price format";
        
    else if (price < 0)
        return "Price must be possitive";
       
    else if (isNaN(mileage))
        return "Invalid mileage format";
        
    else if (mileage < 0)
        return "Mileage must be possitive";
    
    else if(isNaN(year))
        return "Please select year";

    return "ok";
}