let timeDisplay = document.querySelector('#select-display-date');
let conSchedule = document.querySelector('#schedule-movies');

timeDisplay.addEventListener('change', function(){
    conSchedule.innerHTML = '';
    let valueTime = new FormData();
    valueTime.append('date', timeDisplay.value);
    let data = new URLSearchParams(valueTime);
    fetch(window.location.href + '/schedule',{
        method:'POST',
        body:data
    }).then(res =>{
        res.text().then(result=>{
            let xml = new DOMParser().parseFromString(result, 'text/html');
            conSchedule.innerHTML = xml.body.innerHTML; 
        });
    });
});

let btnLike = document.querySelector('.btn-like');
btnLike.addEventListener('click',evt=>{
    if(btn.classList.contains('btn-outline-light')){
        btn.classList.remove('btn-outline-light'); 
        btn.classList.add('btn-danger');
    } else{
        btn.classList.remove('btn-danger'); 
        btn.classList.add('btn-outline-light');
    }
})