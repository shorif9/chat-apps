  //---selector
  const $=(a)=> document.querySelector(a);
  
  
  
  //---element hide func
  const hide=(e)=>{
    return e.classList.add('d-hide');
  }
  
  //---element show func
  const show=(el)=>{
    return el.classList.remove('d-hide');
  }
  
  
  //------first loading page;;;;;
  const loadingPage=()=>{
    show($('#regLog'));
   // show($('.login'))
    hide($('#loadingP'));
  }
  
  setTimeout(loadingPage,2000);

  //----page loader 
  const hidePageLoader=()=>{
    hide($('#pageLoader'));
  }
  const showPageLoader = () => {
    show($('#pageLoader'));
  }
  
  //------local variable
  let currentUserKey = '';
  let chatKey = '';
  
  document.addEventListener('keydown', (key)=>{
      if (key.which === 13) {
        sendMassage();
      }
     // $('.msgInput').value ='';
       //   $('.chatt-box').scrollTo(0, $('.chatt-box').scrollHeight);
    })
  
  //----login register
  let login = $('#login');
  let register = $('#register');
  
  $('.RegButton').addEventListener('click',()=>{
    login.style.left='-100%';
    register.style.right='0';
  })
  $('.logButton').addEventListener('click',()=>{
    register.style.right='-100%';
    login.style.left='0%';
  })
  
  
  //---------su friend list
  $('.Sfriend_list').addEventListener('click', ()=>{
    $('.Sfriend_list i').classList.add('active');
    hide($('.userList.layer1'));
    show($('.userList.layer0'));
  })
  
  $('.homeChatList i').addEventListener('click', ()=>{
    $('.Sfriend_list i').classList.remove('active');
    show($('.userList.layer1'));
    hide($('.userList.layer0'));
  })
  
  
  

  const LoadChatMessages =(chatKey, friendPhoto)=>{
    let db = firebase.database().ref('chatMassages').child(chatKey);
    db.on('value',(chats)=>{
      let massageDisplay = '';
      chats.forEach((data)=>{
        let chat = data.val();
        let dateTime = chat.dateTime.split(',');
        
        if (chat.userId !== currentUserKey) {
          massageDisplay += `<li class="userA"> <img class="chatt_profileB profileImgImg" src="${friendPhoto}" alt="" />
            <span>
              ${chat.msg}
            </span> 
          </li>`
        }
        else {
          massageDisplay += `<li class="userB"> <img class="chatt_profileB profileImgImg" src="${firebase.auth().currentUser.photoURL}" alt="" />
            <span>
              ${chat.msg}
            </span>
          </li>`
        }
        
        /*if (chat.userId !== currentUserKey) {
          let massages = `
            <span>
              ${chat.msg}
            </span>
          `;
          let li = document.createElement('li');
          li.classList.add('userA');
          li.src = friendPhoto
          li.innerHTML = massages;
          $('.chatt-box').appendChild(li);
          $('.chatt-box').scrollTo(0, $('.chatt-box').scrollHeight);
        }
        else {
          let massages = `
            <span>
              ${chat.msg}
            </span>
          `;
          let li = document.createElement('li');
          li.classList.add('userB');
          li.src = firebase.auth().currentUser.photoURL
          li.innerHTML = massages;
          $('.chatt-box').appendChild(li);
          $('.chatt-box').scrollTo(0, $('.chatt-box').scrollHeight);
        }*/
      })
      $('.chatt-box').innerHTML = massageDisplay;
      $('.chatt-box').scrollTo(0, $('.chatt-box').scrollHeight);
    })
  }
  
  
  
  
  const loadChatList = ()=>{
    let db = firebase.database().ref('friend_List');
    $('.userList.layer1').innerHTML  = `<input  type="search"/>`;
    db.on('value', (lists)=>{
      lists.forEach((data)=>{
        let lst = data.val();
        let friendKey = '';
        if (lst.friendId === currentUserKey) {
          friendKey = lst.userId;
        }
        else if(lst.userId === currentUserKey){
          friendKey = lst.friendId;
        }
        if (friendKey !== '') {
          firebase.database().ref('users').child(friendKey).on('value',(data)=>{
            let user = data.val();
            $('.userList.layer1').innerHTML = `<li class="userItems" onclick="startChat('${data.key}','${user.name}','${user.photoURL}')">
                      <img class="userChattImg" src="${user.photoURL}" alt="" />
                      <div class="staName">
                        <h2 class="uChattName">${user.name}</h2>
                        <p class="chattText">you  ...</p>
                      </div>
                      <div class="timerAndNotification">
                        <p>just</p>
                        <p>...</p>
                      </div>
                      </li>
                      `
          })
        }
        
      })
    })
  }
  

  
  //$('.home-chatt i').addEventListener('click',
  $('.home-page .footer .Sfriend_list').addEventListener('click',()=>{
    let db = firebase.database().ref('users');
    let lst = '';
    
    db.on('value', (users)=>{
      if (users.hasChildren) {
        lst = `<input  type="search"/>`
      }
      
      users.forEach((data)=>{
        let user = data.val();
        if (user.email !== firebase.auth().currentUser.email) {
          lst +=  `<li class="userItems" onclick="startChat('${data.key}','${user.name}','${user.photoURL}')">
            <img class="userChattImg" src="${user.photoURL}" alt="" />
            <div class="staName">
              <h2 class="uChattName">${user.name}</h2>
              <p class="chattText">you  ...</p>
            </div>
            <div class="timerAndNotification">
              <p>just</p>
              <p>...</p>
            </div>
            </li>
            `
        }
      })
      $('.userList.layer0').innerHTML = lst;
    })
  });
  
  
  
  
  /* -----sendMassage------- */
    
    
    
    const sendMassage =()=>{
      let chatMassage = {
        userId : currentUserKey,
        msg : $('.msgInput').value,
        dateTime : new Date().toLocaleString()
      }
      
      firebase.database().ref('chatMassages').child(chatKey).push(chatMassage, (error)=>{
        if (error) {
          alert(error);
        } else {
          /*firebase.database().ref('fcmTokens').child(friend_id).once('value').then(function(data) {
           
           
           
           
            
            fetch('https://fcm.googleapis.com/fcm/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AIzaSyBXkd3HN8IO3Xa4AFTvqFpo5LXZQ9-Rj7s'
          },
          data: JSON.stringify({
            'to': data.val().token_id,
            'data': { 'message': chatMessage.msg.substring(0, 30) + '...', 'icon': firebase.auth().currentUser.photoURL }
          })
          
          success: function(response) {
            console.log(response);
          },
          error: function(xhr, status, error) {
            console.log(xhr.error);
          } 
        })
        .then((response)=> response.json())
        .then((json) => console.log(json));
          })*/
          $('.msgInput').value ='';
          $('.chatt-box').scrollTo(0, $('.chatt-box').scrollHeight);
        }
      })
      
    }
  /* ------sendMassage------ */
  


  
  
  ////////////////////////////////////////
  /////////////----event----//////////////
  ////////////////////////////////////////
  /* ---searching event----*/
    $('.home-search i').addEventListener('click', ()=>{
      hide($('.home-search i'));
      show($('.home-search .search'))
    })
  /* ---x---searching event---x---*/
  /* -----register event----- */
    const onRegister =()=>{
      $('#regSub').addEventListener('click', (event)=>{
        event.preventDefault();
        showPageLoader();
        firebaseAuthRegster();
      })
    }
    onRegister();
  /* -----register event----- */
  
  
  /* ----setting & proppfile---- */
    //----home page hide,,,,, setting page show
    const hP_sP =() => {
      hide($('.home-page'));
      show($('.setting-profile'));
    }
    $('.home-menu i').addEventListener('click', hP_sP);
    $('.profileImg').addEventListener('click', hP_sP);
    
    
    //-----setting page hide,,,,, home page show
    $('.setting-profile .header .back-button').addEventListener('click', ()=>{
      hide($('.setting-profile'));
      show($('.home-page'));
    })
  /* ----setting & proppfile---- */
  
  
  
  
  /* -----register---- 
    $('#register .rForm').addEventListener('submit',e =>{
      alert('register success')
       e.preventDefault();
      db.collection('users').add({
        userName : registerForm.userName.value,
        email : registerForm.email.value,
        password : registerForm.password.value
      })
      
      //hide($('.register'));
      //show($('.home-page'))
    })
   -----register---- */
  
  
  
  /* ----chat🗨️---- */
    //chatting 
    const startChat = (friendKey, friendName, friendPhoto) => {
      let friendList = {friendId:friendKey, userId:currentUserKey}
      let db = firebase.database().ref('friend_List');
      let friendId = friendKey;
      
      
      
      let flag = false;
      db.on('value', (friends)=>{
        friends.forEach((data)=>{
          let user = data.val()
          if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || ((user.friendId === friendList.userId && user.userId === friendList.friendId))) {
            flag = true;
            chatKey = data.key;
          }
        })
        
        if (flag === false) {
          chatKey = db.push(friendList, (error)=>{
            if (true) alert(error);
            else {
              hide($('.home-page'));
              show($('.chatting-card'));
            }
          }).getKey();
        }
        else{
          hide($('.home-page'));
          show($('.chatting-card'));
        }
        $('.chatt-box').innerHTML = '';
        LoadChatMessages(chatKey, friendPhoto);
      
      })
      
      //------chatt name & photo
      $('.friendName0.name').innerHTML = friendName;
      $('.userChattImg0').src = friendPhoto;
      
      
     /* db.push(friendList, (error)=>{
        if (error) {
          alert(error);
        } else {
          hide($('.home-page'));
          show($('.chatting-card'));
        }
      })
      */
      
      
    }
    
    //chatting back
    $('.chattingBack').addEventListener('click', ()=>{
      hide($('.chatting-card'));
      show($('.home-page'));
    })
    
    
  /* ----chat🗨️---- */
  
  
  
  /* -----register------ 
    const firebaseAuthRegster =()=>{
      let registerForm = $('#register .rForm');
      const name = registerForm.name.value.length == '' ? 'empty' : registerForm.name.value;                 
      const email = registerForm.email.value.length == '' ? 'empty' : registerForm.email.value; 
      const password = registerForm.password.value;
      
      const auth = firebase.auth()
      const promise = auth.createUserWithEmailAndPassword(email, password).then(val =>{
        addUserWithImage(val.user.uid,name,email, password);
      }).catch(err =>{
        hidePageLoader();
        alert(err.massage);
      })
    }
    
  -----register------ *
  
 
 
  /* -----populat friend-----
    const populatFriend = ()=>{
      $('.userList').innerHTML = `<div class="text-center">
            <span class="spinner-border text-primary mt-5" style="width:7rem;height:7rem"></span>
          </div>`;
      
      let db = firebase.database().ref('users');
      let lst = '';
      
      db.on('value', (users) => {
            if (users.hasChildren()) {
              lst = `<li class="list-group-item" style="background-color:#f8f8f8;">
                <input type="text" placeholder="Search or new chat" class="form-control form-rounded" />
              </li>`;
            }
            users.forEach(function(data) {
              var user = data.val();
              if (user.email !== firebase.auth().currentUser.email) {
                lst += `<li  onclick="startChat ('${data.key}', '${user.name}', '${user.photoURL}')">
                <div class="row"
                <div class="col-md-2">
                  <img src="${user.photoURL}" class="rounded-circle friend-pic" />
                </div>
                <div class="col-md-10" style="cursor:pointer;">
                  <div class="name">${user.name}</div>
                </div>
                </div>
                </li>`;
              }
            })
        })
      $('.userList').innerHTML = lst;
     
    }
   -----populat friend----- */
 
  
  

  /* -----authntication-------*/
    $('.googleAuthSignIn').addEventListener('click', ()=>{
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    })
    
    $('#signOut').addEventListener('click', ()=>{
      firebase.auth().signOut();
    })
    
    const onFirebaseStateChanged =()=> {
      firebase.auth().onAuthStateChanged(onStateChanged);
    }
    
    const onStateChanged =(user)=>{
      
      if (user) {
       let userProfile = {email: '',name: '', photoURL: ''};
       userProfile.email = firebase.auth().currentUser.email;
       userProfile.name = firebase.auth().currentUser.displayName;
       userProfile.photoURL = firebase.auth().currentUser.photoURL;
       
        let db = firebase.database().ref('users');
        let flag = false;
       
        db.on('value', (users)=>{
          users.forEach((data)=>{
            let user = data.val();
            if (user.email === userProfile.email) {
              currentUserKey = data.key;
              flag = true;
            }
          })
         
          
          if(flag === false){
             firebase.database().ref('users').push(userProfile, callback);
          }
          else{
            
            hide($('.login'));
            show($('#homePage'));
            
            for (let i = 0; i <= 10; i++) {
            let profileImg = document.querySelectorAll('.profileImgImg')[i];
            profileImg.src = userProfile.photoURL;
            profileImg.title = userProfile.name;
            // let profileName = document.querySelectorAll('.profileName')[i];
            // profileName.innerText = userProfile.name;
            }
          }
          const messaging = firebase.messaging();
          navigator.serviceWorker.register('../firebase/firebase-messaging-sw.js').then((registration) => {
            messaging.useServiceWorker(registration);
           
            // Request permission and get token.....
            messaging.requestPermission().then(function() {
              return messaging.getToken();
            }).then(function(token) {
              firebase.database().ref('fcmTokens').child(currentUserKey).set({ token_id: token });
            })
          });
          
          //-----user show
          loadChatList();
        })
      }
    }
    //calling auth
    
  /* -----authntication------- */
  
  
  const callback =(error)=>{
    if (error) {
      alert(error);
    }
    else{
      hide($('.login'));
      show($('#homePage'));
     
      for (let i = 0; i <= 10; i++) {
      let profileImg = document.querySelectorAll('.profileImgImg')[i];
      profileImg.src = userProfile.photoURL;
      profileImg.title = userProfile.name;
      // let profileName = document.querySelectorAll('.profileName')[i];
      // profileName.innerText = userProfile.name;
      }
    }
  }
  onFirebaseStateChanged();
  




  //----Audio record
  
  
  //----Emoji
  
  
  //----send image
  
  
  //----Firebase ver
  
  
  
