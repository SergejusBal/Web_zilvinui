const url_index = 'http://78.63.244.37:8080'; 
    
  window.addEventListener('message', function(event) {
    
    if (event.data.type === "scrollSize") { 
        document.getElementById('contentFrame').style.height = event.data.content.height + 'px';
    } else {
        console.log('Unknown message type:', event.data.type); 
    }
});




    /* Top meniu bar controller */
    function changeIframeSrc(newSrc) {
        document.getElementById('contentFrame').src = newSrc;
    }

    document.getElementById('userProfile').addEventListener('click', function() {
        changeIframeSrc('./html/userProfile.html'); 
    });

    document.getElementById('homeLink').addEventListener('click', function() {
        changeIframeSrc('./html/homePage.html'); 
    });

    document.getElementById('aboutUsLink').addEventListener('click', function() {
        changeIframeSrc('./html/aboutus.html');
    });

    document.getElementById('contactLink').addEventListener('click', function() {
        changeIframeSrc('./html/contact.html'); 
    });
    document.getElementById('UserInterface').addEventListener('click', function() {
        changeIframeSrc('./html/userCarSubmitPage.html'); 
    });

    document.getElementById('loginLink').addEventListener('click', function() { 
        if(document.getElementById('loginLink').innerHTML == "Login"){           
            changeIframeSrc('./html/loginPage.html');
        }  
        else{
            document.getElementById('loginLink').innerHTML == "Sign Out";
            deleteCookie("LogInCookies");
            deleteCookie("UserID");            
            document.getElementById('loginLink').innerHTML = "Login";            
            document.getElementById("userInterfaceItem").style.display ="none"; 
            document.getElementById("UserInterface").innerHTML="Cars";
            document.getElementById("userProfile").style.display ="block";
            changeIframeSrc('./html/loginPage.html');                 
        }

    });

    document.getElementById('contactLink').addEventListener('click', function() {
        changeIframeSrc('./html/contact.html'); 
    });

    ///////////////Auto login //////////////////////////////

    

    function loginProcedure() {
        document.getElementById("loginLink").innerHTML = "Sign Out";
        document.getElementById("contentFrame").src  = "./html/homePage.html";
        document.getElementById("userInterfaceItem").style.display ="block";
        document.getElementById("UserInterface").innerHTML="Add Cars";
        document.getElementById("userProfile").style.display ="block";
    }


    async function autorize(){
        const jwttoken =  getCookie("LogInCookies");
    
        let response = await fetch(url_index+"/user/autoLogin", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'CookieJwt': jwttoken,
            },            
        });
        
               

        return response.json();    
        
        
        
    }

    
    document.addEventListener('DOMContentLoaded',  async function() {    
         const authorized =  await autorize();   
         if(authorized){   
             loginProcedure();
         } 
        const iframe = document.getElementById('contentFrame');

        if (iframe) {
            window.addEventListener('scroll', () => {
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                    const message = {
                        type: "scrollEnd"
                    };
                    console.log("IndexHome", "sendDone");
                    iframe.contentWindow.postMessage(message, '*');
                }
            });
        } else {
            console.error("Iframe element not found");
        }
    });

 ////////////////////////////// i can set diferenct sorce base on url  example http://127.0.0.1:5500/index.html?page=/html/carPage.html
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    
    window.onload = function() {
        const page = getQueryParam('page');
        if (page) {
            document.getElementById('contentFrame').src = page;
        } else {
            document.getElementById('contentFrame').src = './html/homePage.html'; 
        }
    };    



  //////////////////////////////////////////////////////////// detect Scroll down  ///////////////////////////////////////
    
  