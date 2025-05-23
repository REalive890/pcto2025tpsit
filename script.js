window.onload = async function() {

    const response= await fetch('router.php?action=showImmages');
    const res=await response.json()
    
    console.log(res);
    //caricaGiochi();
}