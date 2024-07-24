const url_home= "http://78.63.244.37:8080";
var  filterparams;
var loaded = 0;


window.addEventListener('message', async function(event) {
    
    
    if (event.data.type === "filterValues") { 
        filterparams = event.data.content.data;     
        loaded = 0; 
        document.getElementById('gridContainer').innerHTML = "";
        let list = await getFilteredCars(loaded,10, filterparams);
        createitems(list.carPost);
        
    } else {
        console.log('Unknown message type:', event.data.type); 
    }

});


function createitems(list){

    const gridContainer = document.getElementById('gridContainer');

    list.forEach(item => {        
        const newItem = document.createElement('div');
        newItem.className = 'item';

        const newTitle = document.createElement('h3');
        newTitle.textContent  = item.title; 
        newTitle.style.fontWeight = 'bold';

        const newImage = document.createElement('img');
        newImage.src = convertBase64ToImage(item.image);
        newImage.style.width = "150px";
        newImage.style.height = "150px";        

        const price = document.createElement('p');
        price.textContent = "Price: " + item.price; 
        price.style.fontWeight = 'bold'; 
        price.style.backgroundColor = 'green'; 
        price.style.color = 'white'; 
        price.style.padding = '10px'; 
        price.style.borderRadius = '5px';
        price.style.width = '150px';
        price.style.textAlign = 'center'; 
        

        const moreInfoButton = document.createElement('a');
        moreInfoButton.textContent = 'More Info';
        moreInfoButton.className = 'itemButton '; 

        let id = item.id;
        moreInfoButton.onclick = () => {
        window.open(`/index.html?page=/html/carPage.html&id=${id}`, '_blank'); 
    };        

        newItem.appendChild(newTitle);
        newItem.appendChild(newImage);
        newItem.appendChild(price);
        newItem.appendChild(moreInfoButton);
        gridContainer.appendChild(newItem);
        loaded++;
    });


    sendHeight();
}

document.addEventListener('DOMContentLoaded', async function(event){
    const list = await getNewCars(loaded,10);
    console.log("List",list);
    createitems(list.carPost);

} );


window.addEventListener('message', async function(event) {
    if (event.data.type === 'scrollEnd') {
        if(filterparams == null){
                 var list = await getNewCars(loaded,1);                 
                 createitems(list.carPost);
            }        
        else{
            let list = await getFilteredCars(loaded,5, filterparams);
            createitems(list.carPost);
            
        }
    } 

});

async function getNewCars(offset,limit){
    
    let response = await fetch(url_home + "/sort/all?page="+ offset + "&size=" + limit, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        },
                      
    })
    
    if (response.status == 200){
        console.log("Status:","ok");
    }
    else{
    console.log("Status:","not ok")
    } 


    return await response.json();      
    
}

async function getFilteredCars(offset,limit,filterparams){

    var year;

    if(filterparams.year == 1900) year = "";
    else year = filterparams.year + "-01-01"
    
    let response = await fetch(url_home + "/sort/all?page="+ offset + "&size=" + limit, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',            
        },
        body:JSON.stringify({ 
          make:filterparams.make,
          model:filterparams.model,
          minPrice:filterparams.minPrice,
          maxPrice:filterparams.maxPrice,
          millage:filterparams.mileage,
          year:year
          })    

    })
    
    if (response.status == 200){
        return await response.json();     
    }
    else{
    return [];
    } 


     
    
}

