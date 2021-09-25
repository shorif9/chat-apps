/*  //---selector
  const $=(a)=> document.querySelector(a);
  
  
  //---element hide func
  const hide=(e)=>{
    return e.classList.add('d-hide');
  }
  
  //---element show func
  const show=(el)=>{
    return el.classList.remove('d-hide');
  }
 */ 


const inputTransition = ()=>{
  
}
/*
$('.in-id').addEventListener('mouseover', ()=>{
  alert('its over')
})

$('.in-id').addEventListener('mouseout', ()=>{
  alert('its out')
})
*/

// Password Type Change Template
let state = false;
const ptctToggle =(ptc, ptct)=>{
  if(state){
    ptc.setAttribute('type', 'password');
    ptct.innerHTML ='remove_red_eye';
    state = false;
  }
  else{
    ptc.setAttribute('type', 'text');
    ptct.innerHTML ='visibility_off';
    state = true;
  }
}



$('.rInputPasswordType').addEventListener('click', ()=>{
  ptctToggle($('.rInputPassword'),$('.rInputPasswordType'))
})
$('.lInputPasswordType').addEventListener('click', ()=>{
  ptctToggle($('.lInputPassword'), $('.lInputPasswordType'))
})
