$(document).ready(function(){
    $.get("www.themealdb.com/api/json/v1/1/random.php")
        .done(function (data){
        console.log(data);
    })
});

