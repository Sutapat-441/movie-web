let selectedSeat = [];

document.querySelectorAll('.seat-btn').forEach(btn=>{
    btn.addEventListener('click',evt=>{
        if(btn.classList.contains('unavailable')){
            return;
        } else if(btn.classList.contains('btn-warning')){
            btn.classList.remove('btn-warning'); 
            btn.classList.add('btn-success');
            selectedSeat.push(btn.id);
            console.log(selectedSeat);
        } else{
            btn.classList.add('btn-warning'); 
            btn.classList.remove('btn-success');
            let index = selectedSeat.indexOf(btn.id);
            if(index > -1){
                selectedSeat.splice(index,1);
            }
            console.log(selectedSeat);
        }
    })
})

let confirmBTN = document.querySelector('#confirm-btn');
confirmBTN.addEventListener('click',evt=>{
    evt.preventDefault();
    if(selectedSeat.length < 1) return;
    let params = new URLSearchParams();
    for(let seat of selectedSeat){
        params.append('selectedseat', seat);
    }
    fetch(confirmBTN.pathname, {
        method: 'POST',
        body: params
    }).then(res => {
        if (res.redirected) {
            window.location.href = res.url;
        }else {
            res.json().then(result => {
                console.log(err);
            });
        }
    });
})