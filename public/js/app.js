
let likeBtn = document.querySelectorAll('.like-btn');

async function like(id){
    try{
        let response = await axios({
            method: 'post',
            url: `/products/${id}/like`,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
    }
    catch(error){
        window.location.replace('./login');
    }
}

for(let btn of likeBtn){
    btn.addEventListener('click', () => {
        let id = btn.getAttribute('product-id');
        like(id);
        btn.children[0].classList.toggle('fa-solid');
        btn.children[0].classList.toggle('fa-regular');
    })
}