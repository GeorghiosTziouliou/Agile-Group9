document.getElementById("tags").addEventListener("click", function() {
    console.log("clicked");
    let tag = event.target;
    if (!tag.matches("#filter")){
        return;
    }
    console.log(tag.textContent);
    const filterwith = tag.textContent;
    console.log(filterwith);
    //send to server for it to get the data from the database
    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            tags:filterwith
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
  });
  